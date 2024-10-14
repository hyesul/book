import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Autoplay 모듈을 swiper/modules에서 import
import "swiper/swiper-bundle.css";
import "./ImageSlider.scss"; // 스타일 임포트

// 슬라이드에 사용할 이미지 및 비디오 목록
import video1 from "../assets/video1.mp4"; // 비디오 파일 경로
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";


const images = [video1, image2, image3, image4, image5];

const ImageSlider = () => {
    const swiperRef = useRef(null); // Swiper 인스턴스를 참조하기 위한 ref
    const videoRef = useRef(null); // 비디오 요소 참조를 위한 ref

    // 이전 슬라이드로 이동
    const handlePrev = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    // 다음 슬라이드로 이동
    const handleNext = () => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    };

    // 슬라이드 변경 시 동영상 멈추기
    const handleSlideChange = (swiper) => {
        if (videoRef.current) {
            // 현재 슬라이드 인덱스 확인
            if (swiper.activeIndex === 0) {
                videoRef.current.play(); // 첫 번째 슬라이드에서는 재생
            } else {
                videoRef.current.pause(); // 그 외 슬라이드에서는 정지
            }
        }
    };

    return (
        <div className="slider-container">
            <Swiper
                ref={swiperRef}
                modules={[Autoplay]} // Autoplay 모듈 추가
                spaceBetween={0}
                slidesPerView={1}
                loop={true} // 무한 루프 활성화
                autoplay={{
                    delay: 3500, // 3.5초마다 슬라이드 전환
                    disableOnInteraction: false, // 사용자가 상호작용해도 자동 슬라이드 유지
                }}
                onSlideChange={handleSlideChange} // 슬라이드 변경 이벤트 핸들러 추가
            >
                {images.map((src, index) => (
                    <SwiperSlide key={index}>
                        {index === 0 ? ( // 첫 번째 슬라이드에 비디오 사용
                            <video
                                ref={videoRef} // 비디오 참조 추가
                                src={src}
                                controls
                                autoPlay
                                loop
                                muted
                                className="video-slide"
                                onMouseEnter={() => {
                                    swiperRef.current.swiper.autoplay.stop(); // hover 시 자동 슬라이드 중지
                                }}
                                onMouseLeave={() => {
                                    swiperRef.current.swiper.autoplay.start(); // hover 종료 시 자동 슬라이드 재시작
                                }}
                            />
                        ) : (
                            <img src={src} alt={`Slide ${index + 1}`} className="slide-image" />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* 좌우 화살표 추가 */}
            <div className="slider-arrow left" onClick={handlePrev}>
                &#10094; {/* 왼쪽 화살표 */}
            </div>
            <div className="slider-arrow right" onClick={handleNext}>
                &#10095; {/* 오른쪽 화살표 */}
            </div>
        </div>
    );
};

export default ImageSlider;
