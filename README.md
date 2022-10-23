## 기술 스택
1. 작업관리 : jira
2. 형상관리 : gitlab
3. 메신저 : mattermost
4. 개발환경 
    1. 데이터베이스 : mysql 8.0
    2. 프론트엔드 :
        1. react-native : 0.70.0
        2. typescript : 4.8.3
    3. 백엔드 : 
        1. java : openjdk 11.0.16
        2. gradle : 7.5
        3. Spring : 5.3.6
        4. SpringBoot : 2.4.5
        5. python : 3.10.7
        6. fastapi : 0.85
    4. 서버 : AWS EC2
        1. Tool : MobaXterm
        2. OS : ubuntu 20.04
        3. Docker : 20.10.17
    5. IDE : 
        1. intelliJ : 2022.2.1Ultimate
        2. vscode : 1.71
  
## EC2설정

### docker 설치
```
#설치 고려사항 확인 64bit, 리눅스 커널정보(3.10 이상)
uname -a

#설치 가능한 리스트 업데이트
sudo apt-get update

sudo apt-get install -y \
apt-transport-https \
curl \
ca-certificates \
software-properties-common

#docker의 공식 GPG(GNU Privacy Guard) key를 추가
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

#추가된 키 + 도커에서 배포한 키확인
sudo apt-key fingerprint
sudo apt-key fingerprint 0EBFCD88

#debian 계열의 docker repository 추가 후 apt update 수행
sudo add-apt-repository \
"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt-get update
#docker CE 버전 설치
sudo apt-get install docker-ce

#sudo 없이 도커 사용
sudo usermod -aG docker zeff
sudo systemctl enable docker
sudo systemctl restart docker
sudo reboot
```

### Mysql 설치
```
#mysql 실행
docker run --name mysqldb -p 3336:3306 -e \
MYSQL_ROOT_PASSWORD=ghdtjrdls7777 -d mysql:latest
```

## 배포

### Dockerfile
```
#spring
FROM openjdk:11-jdk
COPY ./build/libs/datego-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
EXPOSE 8181


#fastapi
FROM python:latest
WORKDIR /app/
COPY ./main.py /app/
COPY ./requirements.txt /app/
COPY ./models.py /app/
COPY ./recommend.py /app/
RUN pip install -r requirements.txt
RUN pip install surprise
RUN pip install sklearn
CMD uvicorn --host=0.0.0.0 --port 8000 main:app
```

### 배포
```
#각각의 디렉토리에서
#build
./gradlew clean build

#spring 배포
docker build -t backend:0.1 .
docker stop backend
docker run --rm --name backend -d -p 8080:8080 backend:0.1

#fastapi 배포
docker build -t fastapi:0.1 .
docker stop fastapi
docker run --rm --name fastapi -d -p 8000:8000 fastapi:0.1

ubuntu@ip-172-26-5-114:/jenkins/workspace/deploy-test/fastapi$ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED        STATUS        PORTS                                                  NAMES
a9d8ddf64928   backend:0.1              "java -jar app.jar"      10 hours ago   Up 10 hours   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 8181/tcp    backend
a43a83d11dfd   fastapi:0.1              "/bin/sh -c 'uvicorn…"   17 hours ago   Up 17 hours   0.0.0.0:8000->8000/tcp, :::8000->8000/tcp              fastapi
f84f8e48e435   jenkins/jenkins:latest   "/usr/bin/tini -- /u…"   42 hours ago   Up 42 hours   50000/tcp, 0.0.0.0:8085->8080/tcp, :::8085->8080/tcp   jenkins
619653a3b702   mysql:latest             "docker-entrypoint.s…"   2 weeks ago    Up 2 weeks    33060/tcp, 0.0.0.0:3336->3306/tcp, :::3336->3306/tcp   mysqldb

```

## 시연 시나리오

### 메인페이지
<img src="https://user-images.githubusercontent.com/66546079/197417350-acc908a6-0100-4aee-993a-2122ed2ec2de.jpg" width="200" height="400"/>

### 동 선택
<img src="https://user-images.githubusercontent.com/66546079/197417349-365b8cf8-d183-4751-a86b-b6adc45ecaac.jpg" width="200" height="400"/>

### 카테고리 선택
<img src="https://user-images.githubusercontent.com/66546079/197417343-801262be-e66f-49d9-a30b-7714a2b5f7ff.jpg" width="200" height="400"/>
<img src="https://user-images.githubusercontent.com/66546079/197417354-517651d7-270a-4ffe-87c7-289ae31bcf80.jpg" width="200" height="400"/>


### 코스 선택, 변경, 상세보기
<img src="https://user-images.githubusercontent.com/66546079/197417345-10666409-89d4-4834-99a8-038007b5aa18.jpg" width="200" height="400"/>
<img src="https://user-images.githubusercontent.com/66546079/197417357-90c39786-687c-46ee-9a07-a08faa8e4be5.jpg" width="200" height="400"/>
<img src="https://user-images.githubusercontent.com/66546079/197417360-ee4be312-00f0-4c09-a9df-5d16e7ce1ec2.jpg" width="200" height="400"/>


### 코스 시작
<img src="https://user-images.githubusercontent.com/66546079/197417348-3af946cb-5c2a-4e9e-a1b2-cdcb1f271a34.jpg" width="200" height="400"/>


### ar 미션
<img src="https://user-images.githubusercontent.com/66546079/197417351-a9415d69-5e09-42e0-af6b-2ad20f571d39.jpg" width="200" height="400"/>
<img src="https://user-images.githubusercontent.com/66546079/197417352-7361902f-d0e7-4a74-9ab0-d99b71e21a86.jpg" width="200" height="400"/>
<img src="https://user-images.githubusercontent.com/66546079/197417346-1da1db51-8c31-4ff8-b264-6a1f0d2237f1.jpg" width="200" height="400"/>


### 코스 종료
<img src="https://user-images.githubusercontent.com/66546079/197417347-b94887f3-1b03-4a83-b24e-ce9bcece0b8d.jpg" width="200" height="400"/>


### 리뷰 작성
<img src="https://user-images.githubusercontent.com/66546079/197417356-5a0d14a2-5e41-46aa-a226-2736829a2709.jpg" width="200" height="400"/>

### 끝
<img src="https://user-images.githubusercontent.com/66546079/197417362-79fc6394-1ef8-4f67-9771-f17e1228e13a.jpg" width="200" height="400"/>
