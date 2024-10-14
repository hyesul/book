import React, { createContext, useState, useEffect, useReducer, useContext } from 'react';
import axios from 'axios';

// Context 생성
export const BookContext = createContext();

// Reducer 함수 (책 목록 관리)
const bookListReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return {
                ...state,
                books: [...state.books, ...action.payload], // 기존 books에 새로운 데이터를 추가
                loading: false,
                error: null,
            };
        case 'FETCH_ERROR':
            return { ...state, books: [], loading: false, error: action.payload };
        case 'SEARCH_SUCCESS':
            return { ...state, searchResults: action.payload, loading: false, error: null };
        default:
            return state;
    }
};

// 초기 상태
const initialState = {
    books: [],
    searchResults: [],
    loading: true,
    error: null,
};

// 책 데이터를 불러오는 API 호출 함수
const fetchBooks = async (query, startIndex = 0) => {
    const API_KEY = 'AIzaSyCt6zr1h3Pxcpy4jpm7Mv2q7OzKePzGeS4';
    const url = query
        ? `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=20&key=${API_KEY}`
        : `https://www.googleapis.com/books/v1/volumes?q=books&orderBy=relevance&startIndex=${startIndex}&maxResults=20&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data.items || [];
    } catch (error) {
        console.error("Failed to fetch books:", error.response ? error.response.data : error.message);
        throw new Error("Failed to fetch books");
    }
};

// 책 상세 정보를 불러오는 함수 추가
const fetchBookDetail = async (bookId) => {
    const API_KEY = 'AIzaSyCt6zr1h3Pxcpy4jpm7Mv2q7OzKePzGeS4';
    const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data || null;
    } catch (error) {
        console.error("Failed to fetch book detail:", error.response ? error.response.data : error.message);
        throw new Error("Failed to fetch book detail");
    }
};

export const BookProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookListReducer, initialState);
    const [reviews, setReviews] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(0); // 페이지 상태 추가
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 확인
    const [loadingMore, setLoadingMore] = useState(false); // 추가 데이터를 불러오는 중인지 확인

    // 책 목록 API 호출 및 상태 업데이트
    const loadMoreBooks = async () => {
        if (loadingMore || !hasMore) return; // 로딩 중이거나 더 불러올 데이터가 없으면 종료
        setLoadingMore(true);

        try {
            const booksData = await fetchBooks('', page * 20); // 페이지 수에 따라 데이터 로드
            if (booksData.length === 0) {
                setHasMore(false); // 더 이상 불러올 데이터가 없으면 hasMore 설정
            } else {
                dispatch({ type: 'FETCH_SUCCESS', payload: booksData });
                setPage((prevPage) => prevPage + 1); // 페이지 증가
            }
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        loadMoreBooks(); // 컴포넌트가 마운트될 때 처음 데이터 로드
    }, []);

    // 스크롤 감지
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        ) {
            loadMoreBooks(); // 스크롤이 페이지 하단에 도달하면 추가 데이터 로드
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 스크롤 이벤트 제거
    }, [hasMore, loadingMore]);

    // 검색 결과 API 호출 함수
    const searchBooks = async (query) => {
        try {
            const searchData = await fetchBooks(query);
            dispatch({ type: 'SEARCH_SUCCESS', payload: searchData });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    // 책 상세 정보 불러오기
    const getBookDetail = async (bookId) => {
        try {
            const bookDetail = await fetchBookDetail(bookId);
            return bookDetail;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // LocalStorage에서 리뷰 및 즐겨찾기 불러오기
    useEffect(() => {
        const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setReviews(storedReviews);
        setFavorites(storedFavorites);
    }, []);

    // 특정 책에 대한 리뷰 반환
    const getBookReviews = (bookId) => {
        return reviews.filter((review) => review.bookId === bookId);
    };

    // 리뷰 추가
    const addReview = (newReview) => {
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    };

    // 리뷰 삭제
    const deleteReview = (id) => {
        const updatedReviews = reviews.filter((review) => review.id !== id);
        setReviews(updatedReviews);
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    };

    // 리뷰 수정
    const editReview = (id, updatedTitle, updatedContent, updatedRating) => { // 별점도 함께 수정
        const updatedReviews = reviews.map((review) =>
            review.id === id
                ? { ...review, title: updatedTitle, content: updatedContent, rating: updatedRating }
                : review
        );
        setReviews(updatedReviews);
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    };

    // 즐겨찾기 추가
    const addFavorite = (bookId) => {
        if (!favorites.some(favorite => favorite === bookId)) {
            const updatedFavorites = [...favorites, bookId];
            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        }
    };

    // 즐겨찾기 삭제
    const removeFavorite = (bookId) => {
        const updatedFavorites = favorites.filter((favoriteId) => favoriteId !== bookId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <BookContext.Provider
            value={{
                books: state.books,
                searchResults: state.searchResults,
                loading: state.loading,
                error: state.error,
                reviews,
                addReview,
                deleteReview,
                editReview,
                favorites,
                addFavorite,
                removeFavorite,
                getBookReviews,
                searchBooks,
                getBookDetail,
                loadMoreBooks, // 무한 스크롤을 위한 추가 함수
                hasMore, // 추가 데이터 여부
                loadingMore, // 추가 데이터 로딩 상태
            }}
        >
            {children}
        </BookContext.Provider>
    );
};

// Custom Hook
export const useBookContext = () => useContext(BookContext);
