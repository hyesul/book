import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useBookContext } from '../Context/BookContext'; // BookContext에서 데이터 가져오기
import './SearchResults.scss'; // 스타일 파일 임포트

const SearchResults = () => {
    const location = useLocation();
    const { searchResults, loading, error, searchBooks } = useBookContext(); // 검색 결과, 로딩 상태, 에러 가져오기

    // URL 쿼리 파라미터에서 검색어 추출
    const query = new URLSearchParams(location.search).get('q') || '';

    // 검색어로 API 호출
    useEffect(() => {
        if (query) {
            searchBooks(query); // BookContext에서 검색 함수 호출
        }
    }, [query, searchBooks]);

    return (
        <div className="search-results">
            <h2>검색 결과</h2>
            {loading && <p>로딩 중...</p>}
            {error && <p>에러 발생: {error}</p>}
            {searchResults.length === 0 && !loading && <p>검색 결과가 없습니다.</p>}
            <ul className="book-list">
                {searchResults.map(book => (
                    <li className="book-item" key={book.id}>
                        <Link to={`/book/${book.id}`}>
                            <h3>{book.volumeInfo.title}</h3>
                            {book.volumeInfo.imageLinks && (
                                <img
                                    src={book.volumeInfo.imageLinks.thumbnail}
                                    alt={book.volumeInfo.title}
                                />
                            )}
                        </Link>
                        <p>{book.volumeInfo.description || '설명이 없습니다.'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;
