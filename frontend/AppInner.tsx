import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Button, TouchableOpacity, Text, View} from 'react-native';
import Home from './src/pages/Home';
import Gallery from './src/pages/Gallery';
import Preference from './src/pages/Preference';
import Course from './src/pages/Course';
import ChangeSpot from './src/pages/ChangeSpot';
import DetailSpot from './src/pages/DetailSpot';
import CourseIng from './src/pages/CourseIng';
import SignIn from './src/pages/SignIn';
import SelectDong from './src/pages/SelectDong';
import Ar1 from './src/pages/Ar1';
import Ar2 from './src/pages/Ar2';
import Ar3 from './src/pages/Ar3';
import Review from './src/pages/Review';
import FinishCourse from './src/pages/FinishCourse';
import FinalReview from './src/pages/FinalReview';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import axios from 'axios';
import {
  login,
  getProfile as getKakaoProfile,
  logout,
} from '@react-native-seoul/kakao-login';
// import DragAble from './src/pages/DragAble';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {containsKey, getData, removeData, storeData} from './AsyncService';
import userSlice from './src/slices/user';
import {useAppDispatch} from './src/store';

export type LoggedInParamList = {
  Home: undefined;
  Users: undefined;
  Gallery: undefined;
  Preference: undefined;
  Course: undefined;
  ChangeSpot: undefined;
  DetailSpot: undefined;
  CourseIng: undefined;
  SignIn: undefined;
  SelectDong: undefined;
  Ar1: undefined;
  Ar2: undefined;
  Ar3: undefined;
  Review: undefined;
  FinishCourse: undefined;
  FinalReview: undefined;
};

// export type RootStackParamList = {
//   SignIn: undefined;
// };

type HomeScreenProps = NativeStackScreenProps<ParamListBase>;

const Stack = createNativeStackNavigator();

function AppInner() {
  // const dispatch = useAppDispatch();

  async function check() {
    const hasToken = await containsKey('master');
    if (hasToken) {
      const myToken = await getData('master');
      const myemail = await getData('email');
      const myid = await getData('id');
      dispatch(
        userSlice.actions.setUser({
          email: myemail,
          code: 200,
          accessToken: myToken,
          domain: 'KAKAO',
          id: myid,
        }),
      );
    } else {
      console.log('??????');
    }
  }
  React.useEffect(() => {
    console.log('???????????????.');
    check();
  });
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );
  const dispatch = useAppDispatch();

  async function kakaoLogout() {
    console.log('?????????????????????');
    const response = await axios.post(
      'http://j7a104.p.ssafy.io:8080/users/logout',
      {
        headers: {accessToken: accessToken},
      },
    );
    await logout();
    console.log(response);
    dispatch(
      userSlice.actions.deleteUser({
        email: '',
        accessToken: '',
        code: 0,
        id: 0,
      }),
    );
    const hasPersons = await containsKey('master');
    if (hasPersons) {
      console.log('?????? ???????????? ?????????');
      await removeData('master');
      await removeData('email');
      await removeData('id');
    }
  }

  return isLoggedIn ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerRight: ({}) => (
            <TouchableOpacity onPress={() => kakaoLogout()}>
              <Text style={{fontSize: 15, color: 'white'}}>????????????</Text>
            </TouchableOpacity>
          ),
          title: 'DATE GO',
          headerStyle: {
            backgroundColor: '#FFA856',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={Gallery}
        options={{title: 'Gallery'}}
      />
      <Stack.Screen
        name="Preference"
        component={Preference}
        options={{
          title: '?????? ??????',
          headerStyle: {
            backgroundColor: '#FFA856',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          },
        }}
      />
      <Stack.Screen
        name="SelectDong"
        component={SelectDong}
        options={{
          title: '???????????? ?????? ??????????????????',
          headerStyle: {
            backgroundColor: '#FFA856',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 20,
          },
        }}
      />
      <Stack.Screen
        name="Course"
        component={Course}
        options={{title: 'Course', headerShown: false}}
      />

      <Stack.Screen
        name="ChangeSpot"
        component={ChangeSpot}
        options={{title: 'ChangeSpot', headerShown: false}}
      />
      <Stack.Screen
        name="DetailSpot"
        component={DetailSpot}
        options={{title: 'DetailSpot', headerShown: false}}
      />
      <Stack.Screen
        name="CourseIng"
        component={CourseIng}
        options={{title: 'CourseIng', headerShown: false}}
      />
      <Stack.Screen
        name="Ar1"
        component={Ar1}
        options={{title: '???????????? ?????? ??????!!'}}
      />
      <Stack.Screen
        name="Ar2"
        component={Ar2}
        options={{title: '????????? ????????????!!'}}
      />
      <Stack.Screen
        name="Ar3"
        component={Ar3}
        options={{title: '???????????? ????????????!!'}}
      />
      <Stack.Screen
        name="Review"
        component={Review}
        options={{title: 'Review'}}
      />
      <Stack.Screen
        name="FinishCourse"
        component={FinishCourse}
        options={{title: 'FinishCourse'}}
      />
      <Stack.Screen
        name="FinalReview"
        component={FinalReview}
        options={{title: 'FinalReview', headerShown: false}}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: 'SignIn', headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
