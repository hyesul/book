import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색어 제출 핸들러
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // 검색 후 검색창 초기화
    }
  };

  // Enter 키로 검색
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="header">
      <div className="logo">
        {/* 로고에 Home 페이지로 이동하는 링크 추가 */}
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>Review Books</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul>
          {/* 검색 기능 */}
          <li className="search-bar">
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
            />
            <button type="button" onClick={handleSearch}>
              검색
            </button>
          </li>
          {/* 로그인/회원가입/마이페이지 */}
          <li>
            <Link to="/login">로그인</Link>
          </li>
          <li>
            <Link to="/signup">회원가입</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
