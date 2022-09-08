package com.example.datego.oauth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final MemberRepository memberRepository;
    private final MemberInfoRepository memberInfoRepository;
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);

        try {
            return process(userRequest, user);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User process(OAuth2UserRequest userRequest, OAuth2User user) {
        ProviderType providerType = ProviderType.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());

        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, user.getAttributes());

        Optional<Member> savedUser = memberRepository.findByEmail(userInfo.getEmail());
        // 동일한 이메일로 가입한 계정이 있으면
        if (savedUser.isPresent()) {
            // EMAIL로 가입된 계정이 있을시에
            if ((savedUser.get().getProviderType()).toString().equals("EMAIL")) {
                // EMAIL에서 소셜로그인 계정으로 바꿔준다.
                savedUser.get().setProviderType(providerType);
            }
            // 그 외로 먼저 가입된 계정이 있을 때 다른 걸로 로그인하라고 띄워준다.
            if (!providerType.equals(savedUser.get().getProviderType())) {
                throw new CustomException(Code.C509);
            }
        }


        // 신규 가입 계정인 경우
        else {
            Member newMember = createUser(userInfo, providerType);
            return UserPrincipal.create(newMember, user.getAttributes(), userInfo.getImageUrl());
        }

        return UserPrincipal.create(savedUser.get(), user.getAttributes(), userInfo.getImageUrl());
    }

    private Member createUser(OAuth2UserInfo userInfo, ProviderType providerType) {
        Member member = Member.builder()
                .email(userInfo.getEmail())
                .nickName(userInfo.getNickName())
                .role(Role.MEMBER)
                .pwd("12345")
                .status(Status.YES)
                .providerType(providerType)
                .build();
        memberInfoRepository.save(MemberInfo.builder()
                .member(member)
                .imageLink(userInfo.getImageUrl())
                .build());
        return member;
    }
}
