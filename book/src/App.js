import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mypage from "./components/Mypage";
import SearchResults from "./components/SearchResults";
import { BookProvider } from './Context/BookContext'; // 통합된 BookProvider 사용

const App = () => {
  return (
    <Router>
      <BookProvider> {/* 통합된 Provider */}
        <Header /> {/* Header도 Provider 내부로 이동 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:bookId" element={<BookDetail />} /> {/* bookId로 변경 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </BookProvider>
    </Router>
  );
};

export default App;
