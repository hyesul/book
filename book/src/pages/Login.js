//로그인 성공 하...!
import React from 'react';
import './Login.scss';  // 스타일 파일

const Login = () => {
    const KAKAO_REST_API_KEY = '1e73c5db9846e011cb6689cda172c8f5';  // 카카오 REST API 키
    const REDIRECT_URI = 'http://localhost:3000/signup';  // 카카오 로그인 후 리디렉션될 URI

    const handleKakaoLogin = () => {
        const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthURL;  // 카카오 로그인 페이지로 리디렉션
    };

    return (
        <div className="login">
            <h2>로그인</h2>
            <form>
                <input type="text" placeholder="이메일" />
                <input type="password" placeholder="비밀번호" />
                <button type="submit">로그인</button>
                <button type="button" className="kakao-login" onClick={handleKakaoLogin}>
                    카카오로 로그인하기
                </button>
            </form>
        </div>
    );
};

export default Login;
