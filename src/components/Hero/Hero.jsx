import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaArrowLeft,
  FaBookOpen,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import { FaStar as HiSparkles } from "react-icons/fa";
import { getAllHeroSliders } from "../../store/HeroSlider/heroSliderSlice";
import { getAllBooks } from "../../store/BooksSlice";
import AnimatedCounter from "../AnimatedCounter/AnimatedCounter";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./Hero.css";

function Hero() {
  const dispatch = useDispatch();

  const { data: sliders, isLoading: slidersLoading } = useSelector(
    (state) => state.heroSliders
  );

  const { data: allBooks, isLoading: booksLoading } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    dispatch(getAllHeroSliders());
    dispatch(getAllBooks({ page: 1, pageSize: 4 }));
  }, [dispatch]);

  const featuredBooks = allBooks?.slice(0, 4) || [];

  if (slidersLoading || booksLoading) {
    return (
      <section className="hero-section">
        <div className="hero-loading">
          <div className="loading-spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      {/* زخارف خلفية */}
      <div className="hero-decoration hero-decoration--1"></div>
      <div className="hero-decoration hero-decoration--2"></div>
      <div className="hero-decoration hero-decoration--3"></div>

      <div className="hero-container">
        {/* ===== المحتوى الرئيسي ===== */}
        <div className="hero-grid">
          {/* ===== القسم الأيمن: المحتوى ===== */}
          <div className="hero-content">
            {/* شارة جديد */}
            <div className="hero-badge">
              <HiSparkles className="hero-badge-icon" />
              <span>أحدث المجموعات لعام 2026</span>
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="hero-title">
              اكتشف عالم
              <span className="hero-title-highlight"> الكتب </span>
              بين يديك
            </h1>

            {/* الوصف */}
            <p className="hero-description">
              آلاف الكتب العربية والمترجمة في مختلف المجالات. من الأدب والروايات
              إلى التطوير الذاتي والكتب العلمية، رحلتك المعرفية تبدأ من هنا.
            </p>

            {/* أزرار الإجراء */}
            <div className="hero-actions">
              <Link to="/books" className="hero-btn hero-btn--primary">
                <FaShoppingCart />
                <span>تسوق الآن</span>
              </Link>
              <Link to="/categories" className="hero-btn hero-btn--secondary">
                <span>تصفح التصنيفات</span>
                <FaArrowLeft />
              </Link>
            </div>

            {/* إحصائيات مع تأثير العد */}
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-icon">
                  <FaBookOpen />
                </div>
                <div className="hero-stat-info">
                  <span className="hero-stat-number">
                    <AnimatedCounter end={50000} suffix="+" duration={2500} />
                  </span>
                  <span className="hero-stat-label">كتاب</span>
                </div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <div className="hero-stat-icon">
                  <FaUsers />
                </div>
                <div className="hero-stat-info">
                  <span className="hero-stat-number">
                    <AnimatedCounter end={10000} suffix="+" duration={2500} />
                  </span>
                  <span className="hero-stat-label">قارئ</span>
                </div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <div className="hero-stat-icon">
                  <FaStar />
                </div>
                <div className="hero-stat-info">
                  <span className="hero-stat-number">
                    <AnimatedCounter
                      end={4.9}
                      useK={false}
                      decimals={1}
                      duration={2000}
                    />
                  </span>
                  <span className="hero-stat-label">تقييم</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== القسم الأيسر: Slider ===== */}
          <div className="hero-slider-wrapper">
            {sliders && sliders.length > 0 ? (
              <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                loop={sliders.length >= 2}
                speed={1000}
                className="hero-swiper"
              >
                {sliders.map((slide) => {
                  const bgUrl = slide.BackgroundImage?.url
                    ? `http://localhost:1337${slide.BackgroundImage.url}`
                    : "/default-hero.jpg";

                  return (
                    <SwiperSlide key={slide.id || slide.documentId}>
                      <div
                        className="hero-slide"
                        style={{ backgroundImage: `url(${bgUrl})` }}
                      >
                        <div className="hero-slide-overlay"></div>
                        <div className="hero-slide-content">
                          <h3 className="hero-slide-title">{slide.Title}</h3>
                          <p className="hero-slide-description">
                            {slide.Subtitle}
                          </p>
                          {slide.ButtonText && slide.ButtonLink && (
                            <Link
                              to={slide.ButtonLink}
                              className="hero-slide-cta"
                            >
                              {slide.ButtonText}
                              <FaArrowLeft />
                            </Link>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div className="hero-slider-placeholder">
                <FaBookOpen className="placeholder-icon" />
                <p>قريباً... محتوى مميز</p>
              </div>
            )}
          </div>
        </div>

        {/* ===== كتب مميزة (4 كتب فقط) ===== */}
        {featuredBooks.length > 0 && (
          <div className="hero-featured">
            <div className="hero-featured-header">
              <HiSparkles className="hero-featured-icon" />
              <h2 className="hero-featured-title">كتب مميزة هذا الأسبوع</h2>
              <Link to="/books" className="hero-featured-link">
                عرض الكل
                <FaArrowLeft />
              </Link>
            </div>
            <div className="hero-featured-grid">
              {featuredBooks.map((book) => {
                const bookData = book?.attributes || book;
                const coverUrl = bookData?.image?.url
                  ? `http://localhost:1337${bookData.image.url}`
                  : "/default-book.jpg";

                return (
                  <Link
                    key={bookData.id || bookData.documentId}
                    to={`/book/${bookData.documentId || bookData.id}`}
                    className="hero-featured-card"
                  >
                    <div className="hero-featured-cover">
                      <img
                        src={coverUrl}
                        alt={bookData.Title || "غلاف الكتاب"}
                        loading="lazy"
                      />
                      <div className="hero-featured-badge">
                        {bookData.price || 0} $
                      </div>
                    </div>
                    <div className="hero-featured-info">
                      <h4 className="hero-featured-name">{bookData.Title}</h4>
                      <p className="hero-featured-author">{bookData.author}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
