import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Rating from 'react-rating-stars-component'; // 별점 컴포넌트 추가
import { BookContext } from '../Context/BookContext'; // Context 임포트
import "./BookDetail.scss";

const BookDetail = () => {
  const { bookId } = useParams();
  const { books, getBookDetail, reviews, addReview, deleteReview, editReview, favorites, addFavorite, removeFavorite } = useContext(BookContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewTitle, setReviewTitle] = useState(''); // 리뷰 제목 상태
  const [reviewContent, setReviewContent] = useState(''); // 리뷰 내용 상태
  const [inputPassword, setInputPassword] = useState(''); // 비밀번호 상태
  const [editReviewId, setEditReviewId] = useState(null); // 수정할 리뷰 ID 상태
  const [rating, setRating] = useState(0); // 별점 상태 추가

  const reviewFormRef = useRef(null);

  // 책 상세 정보 가져오기
  const fetchBookDetail = async () => {
    const foundBook = books.find(b => b.id === bookId);
    if (foundBook) {
      setBook(foundBook);
      setLoading(false);
    } else {
      try {
        const bookDetail = await getBookDetail(bookId); // API로부터 책 정보 가져오기
        setBook(bookDetail);
      } catch (error) {
        setError('책 정보를 찾을 수 없습니다.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (books.length > 0 && bookId) {
      fetchBookDetail();
    }
  }, [books, bookId]);

  // 즐겨찾기 추가/삭제
  const handleFavoriteToggle = () => {
    if (favorites.includes(bookId)) {
      removeFavorite(bookId);
    } else {
      addFavorite(bookId);
    }
  };

  // 리뷰 제출
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewTitle.trim() && reviewContent.trim() && inputPassword.trim() && rating > 0) { // 별점 조건 추가
      if (editReviewId) {
        // 수정할 경우 비밀번호 확인
        const review = reviews.find(review => review.id === editReviewId);
        if (review && review.password === inputPassword) {
          editReview(editReviewId, reviewTitle, reviewContent, rating); // 수정 시 별점 반영
        } else {
          alert('비밀번호가 일치하지 않습니다.');
          return;
        }
      } else {
        // 새 리뷰 추가
        addReview({ id: Date.now(), bookId, title: reviewTitle, content: reviewContent, password: inputPassword, rating }); // ID는 타임스탬프 사용, 별점 추가
      }
      // 입력 필드 초기화
      setReviewTitle('');
      setReviewContent('');
      setInputPassword('');
      setRating(0); // 별점 초기화
      setEditReviewId(null); // 수정 상태 초기화
    }
  };

  // 리뷰 삭제
  const handleReviewDelete = (id, inputPassword) => {
    const review = reviews.find(review => review.id === id);
    if (review && review.password === inputPassword) {
      deleteReview(id);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  // 리뷰 수정 준비
  const handleReviewEdit = (review) => {
    setReviewTitle(review.title);
    setReviewContent(review.content);
    setInputPassword(''); // 수정 시 비밀번호 초기화
    setRating(review.rating); // 수정 시 기존 별점 설정
    setEditReviewId(review.id); // 수정할 리뷰 ID 설정

    reviewFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (loading) {
    return <p>로딩 중입니다...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!book) {
    return <p>책 정보를 찾을 수 없습니다.</p>;
  }

  // 구매 가능 링크
  const purchaseLink = book.saleInfo?.buyLink;

  return (
    <div className="book-detail">
      <h1>{book.volumeInfo.title}</h1>
      <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
      <h3>저자: {book.volumeInfo.authors?.join(', ')}</h3>
      <p>출판일: {book.volumeInfo.publishedDate}</p>
      <p>출판사: {book.volumeInfo.publisher}</p>
      <p dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }} />

      {purchaseLink && (
        <div>
          <h4>구매 가능 사이트</h4>
          <button
            onClick={() => window.open(purchaseLink, '_blank')}
            className="purchase-button"
          >
            구매하기
          </button>
        </div>
      )}

      <button
        onClick={handleFavoriteToggle}
        className="favorite-button"
      >
        {favorites.includes(bookId) ? '즐겨찾기에서 제거' : '즐겨찾기 추가'}
      </button>

      <form onSubmit={handleReviewSubmit} ref={reviewFormRef}>
        <h2>{editReviewId ? '리뷰 수정하기' : '리뷰 추가하기'}</h2>
        <input
          type="text"
          value={reviewTitle}
          onChange={(e) => setReviewTitle(e.target.value)}
          placeholder="리뷰 제목"
          required
        />
        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="리뷰 내용을 입력하세요"
          required
        />
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="비밀번호 (최대 8자리)"
          maxLength="8"
          required
        />
        {/* 별점 입력 */}
        <Rating
          count={5}
          size={24}
          value={rating}
          onChange={(newRating) => setRating(newRating)} // 별점 업데이트
        />
        <button type="submit">{editReviewId ? '수정 제출' : '리뷰 제출'}</button>
      </form>

      <h2>리뷰 목록</h2>
      <ul>
        {reviews.filter(review => review.bookId === bookId).length > 0 ? (
          reviews.filter(review => review.bookId === bookId).map((review) => (
            <li key={review.id}>
              <h3>{review.title}</h3>
              <p>{review.content}</p>
              {/* 별점 표시 */}
              <Rating
                count={5}
                size={20}
                value={review.rating}
                edit={false} // 읽기 전용 별점
              />
              <button onClick={() => handleReviewEdit(review)}>수정</button>
              <button onClick={() => {
                const password = prompt('비밀번호를 입력하세요');
                if (password) {
                  handleReviewDelete(review.id, password);
                }
              }}>삭제</button>
            </li>
          ))
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default BookDetail;
