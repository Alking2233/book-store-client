import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaBookOpen,
  FaSync,
  FaFire,
  FaClock,
  FaStar,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import SectionTitle from "../SectionTitle/SectionTitle";
import Book from "../Book/Book";
import { getAllBooks } from "../../store/BooksSlice";

import "./Books.css";

function Books({ showLoadMore = true, customTitle, customSubtitle }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, error } = useSelector((state) => state.books);

  // ✅ فلتر الكتب
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllBooks());
  }, [dispatch]);

  // ✅ تحديد ما إذا كنا في صفحة /books
  const isBooksPage = location.pathname === "/books";
  const shouldShowLoadMore = showLoadMore && !isBooksPage && data?.length > 8;

  // ✅ فلترة الكتب حسب الفلتر النشط
  const filteredBooks = useMemo(() => {
    if (!data) return [];

    let filtered = [...data];

    switch (activeFilter) {
      case "newest":
        // ترتيب بالأحدث (افتراضياً البيانات تأتي مرتبة)
        filtered = filtered.reverse();
        break;
      case "topRated":
        // ترتيب بالأعلى تقييماً
        filtered = filtered.sort((a, b) => {
          const ratingA = (a.attributes || a)?.rating || 4.5;
          const ratingB = (b.attributes || b)?.rating || 4.5;
          return ratingB - ratingA;
        });
        break;
      case "bestseller":
        // الأكثر مبيعاً (افتراضياً)
        filtered = filtered.sort((a, b) => {
          const salesA = (a.attributes || a)?.sales || 0;
          const salesB = (b.attributes || b)?.sales || 0;
          return salesB - salesA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [data, activeFilter]);

  // ✅ عرض 8 كتب فقط في الصفحة الرئيسية
  const displayedBooks = isBooksPage
    ? filteredBooks
    : filteredBooks?.slice(0, 8);

  // ✅ الفلاتر المتاحة
  const filters = [
    { id: "all", label: "الكل", icon: HiSparkles },
    { id: "newest", label: "الأحدث", icon: FaClock },
    { id: "bestseller", label: "الأكثر مبيعاً", icon: FaFire },
    { id: "topRated", label: "الأعلى تقييماً", icon: FaStar },
  ];

  // ===== Skeleton Loader =====
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="book-skeleton">
          <div className="book-skeleton-cover"></div>
          <div className="book-skeleton-info">
            <div className="book-skeleton-line book-skeleton-line--tag"></div>
            <div className="book-skeleton-line book-skeleton-line--title"></div>
            <div className="book-skeleton-line book-skeleton-line--author"></div>
            <div className="book-skeleton-line book-skeleton-line--rating"></div>
            <div className="book-skeleton-footer">
              <div className="book-skeleton-line book-skeleton-line--price"></div>
              <div className="book-skeleton-btn"></div>
            </div>
          </div>
        </div>
      ));
  };

  // ===== حالة التحميل =====
  if (isLoading) {
    return (
      <div className="books-container">
        <div className="books-header">
          <SectionTitle
            badge="جديد"
            title="إصدارات الأسبوع"
            subtitle="كتب مختارة لك"
          />
        </div>
        <div className="books-grid">{renderSkeletons()}</div>
      </div>
    );
  }

  // ===== حالة الخطأ =====
  if (error) {
    return (
      <div className="books-container">
        <SectionTitle
          title={customTitle || "أحدث الكتب"}
          subtitle={customSubtitle || "اكتشف أحدث الإصدارات من مختلف المجالات"}
        />
        <div className="books-state books-state--error">
          <div className="books-state-icon">
            <FaSync />
          </div>
          <h3 className="books-state-title">عذراً، حدث خطأ</h3>
          <p className="books-state-message">{error}</p>
          <button
            className="books-state-btn"
            onClick={() => dispatch(getAllBooks())}
          >
            <FaSync /> إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // ===== حالة فارغة =====
  if (!data || data.length === 0) {
    return (
      <div className="books-container">
        <SectionTitle
          title={customTitle || "أحدث الكتب"}
          subtitle={customSubtitle || "اكتشف أحدث الإصدارات من مختلف المجالات"}
        />
        <div className="books-state books-state--empty">
          <div className="books-state-icon">
            <FaBookOpen />
          </div>
          <h3 className="books-state-title">لا توجد كتب متاحة</h3>
          <p className="books-state-message">
            نعمل حالياً على إضافة المزيد من الكتب. عُد قريباً!
          </p>
        </div>
      </div>
    );
  }

  // ===== العرض الرئيسي =====
  return (
    <div className="books-container">
      {/* Header مع العنوان */}
      <div className="books-header">
        <SectionTitle
          title={customTitle || "أحدث الكتب"}
          subtitle={customSubtitle || "اكتشف أحدث الإصدارات من مختلف المجالات"}
        />
      </div>

      {/* الفلاتر السريعة */}
      <div className="books-filters">
        <div className="books-filters-tabs">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                className={`books-filter-tab ${
                  activeFilter === filter.id ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <Icon className="books-filter-icon" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {!isBooksPage && (
          <button className="books-view-all" onClick={() => navigate("/books")}>
            <span>عرض الكل</span>
            <FaArrowLeft />
          </button>
        )}
      </div>

      {/* شبكة الكتب */}
      <div className="books-grid">
        {displayedBooks?.map((book) => (
          <Book key={book.id || book.documentId} book={book} />
        ))}
      </div>

      {/* زر تحميل المزيد */}
      {shouldShowLoadMore && (
        <div className="books-load-more">
          <button
            className="books-load-more-btn"
            onClick={() => navigate("/books")}
            aria-label="عرض جميع الكتب"
          >
            <span>عرض المزيد من الكتب</span>
            <HiSparkles className="books-load-more-icon" />
          </button>
          <p className="books-load-more-info">
            لديك <strong>{data.length - 8}+</strong> كتاب آخر للاكتشاف
          </p>
        </div>
      )}
    </div>
  );
}

export default Books;
