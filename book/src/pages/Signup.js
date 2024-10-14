import React from 'react';
import './Signup.scss';

const Signup = () => {
    return (
        <div className="signup-container">
            <h2>회원가입</h2>
            <div className="signup-buttons">
                <button className="kakao">카카오 계정으로 가입하기</button>
                <button className="naver">네이버 계정으로 가입하기</button>
                <button className="google">Google 계정으로 가입하기</button>
                <button className="apple">Apple 계정으로 가입하기</button>
                <button className="email">이메일 계정으로 가입하기</button>
            </div>
            <p className="already-member">이미 회원이신가요?</p>
        </div>
    );
};

export default Signup;
