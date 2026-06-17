import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    FaSync,
    FaBookOpen,
    FaChevronRight,
    FaChevronLeft,
    FaFire,
    FaClock,
    FaStar,
    FaTh,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import { getAllBooks } from "../../../store/BooksSlice";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import Book from "../../../components/Book/Book";

import "./BooksPage.css";

const PAGE_SIZE = 8;

function BooksPage() {
    const dispatch = useDispatch();
    const { data, isLoading, error, meta } = useSelector((state) => state.books);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState("all");
    
    // ===== رقم الصفحة الحالية =====
    const currentPage = Number(searchParams.get("page")) || 1;
    
    // ===== جلب البيانات عند تغيير الصفحة =====
    useEffect(() => {
        dispatch(getAllBooks({ page: currentPage, pageSize: PAGE_SIZE }));
    }, [dispatch, currentPage]);
    
    // ===== تغيير الصفحة =====
    const goToPage = (pageNumber) => {
        setSearchParams({ page: pageNumber });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
    // ===== فلترة الكتب =====
    const filteredBooks = useMemo(() => {
        if (!data) return [];
        
        const books = [...data];
        
        switch (activeFilter) {
            case "newest":
                return books.reverse();
            
            case "topRated":
                return books.sort((a, b) => {
                    const ratingA = (a.attributes || a)?.rating || 4.5;
                    const ratingB = (b.attributes || b)?.rating || 4.5;
                    return ratingB - ratingA;
                });
            
            case "bestseller":
                return books.sort((a, b) => {
                    const salesA = (a.attributes || a)?.sales || 0;
                    const salesB = (b.attributes || b)?.sales || 0;
                    return salesB - salesA;
                });
            
            default:
                return books;
        }
    }, [data, activeFilter]);
    
    const totalPages = meta?.pagination?.pageCount || 1;
    const totalBooks = meta?.pagination?.total || 0;
    
    // ===== الفلاتر المتاحة =====
    const filters = [
        { id: "all", label: "الكل", icon: HiSparkles },
        { id: "newest", label: "الأحدث", icon: FaClock },
        { id: "bestseller", label: "الأكثر مبيعاً", icon: FaFire },
        { id: "topRated", label: "الأعلى تقييماً", icon: FaStar },
    ];
    
    // ===== Skeleton =====
    const renderSkeletons = () => {
        return Array(PAGE_SIZE).fill(0).map((_, index) => (
            <div key={index} className="bp-skeleton">
                <div className="bp-skeleton-cover"></div>
                <div className="bp-skeleton-info">
                    <div className="bp-skeleton-line bp-skeleton-line--tag"></div>
                    <div className="bp-skeleton-line bp-skeleton-line--title"></div>
                    <div className="bp-skeleton-line bp-skeleton-line--author"></div>
                    <div className="bp-skeleton-line bp-skeleton-line--rating"></div>
                    <div className="bp-skeleton-footer">
                        <div className="bp-skeleton-line bp-skeleton-line--price"></div>
                        <div className="bp-skeleton-btn"></div>
                    </div>
                </div>
            </div>
        ));
    };
    
    // ===== Loading State =====
    if (isLoading) {
        return (
            <main className="books-page">
                <div className="books-page-container">
                    <SectionTitle
                        title="مكتبتنا الكاملة"
                        subtitle="استكشف مجموعة واسعة من الكتب في مختلف المجالات"
                    />
                    <div className="books-page-grid">{renderSkeletons()}</div>
                </div>
            </main>
        );
    }
    
    // ===== Error State =====
    if (error) {
        return (
            <main className="books-page">
                <div className="books-page-container">
                    <SectionTitle
                        title="مكتبتنا الكاملة"
                        subtitle="استكشف مجموعة واسعة من الكتب في مختلف المجالات"
                    />
                    <div className="books-page-state books-page-state--error">
                        <div className="books-page-state-icon">
                            <FaSync />
                        </div>
                        <h3 className="books-page-state-title">عذراً، حدث خطأ</h3>
                        <p className="books-page-state-message">{error}</p>
                        <button
                            className="books-page-state-btn"
                            onClick={() =>
                                dispatch(getAllBooks({ page: currentPage, pageSize: PAGE_SIZE }))
                            }
                        >
                            <FaSync /> إعادة المحاولة
                        </button>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Empty State =====
    if (!data || data.length === 0) {
        return (
            <main className="books-page">
                <div className="books-page-container">
                    <SectionTitle
                        title="مكتبتنا الكاملة"
                        subtitle="استكشف مجموعة واسعة من الكتب في مختلف المجالات"
                    />
                    <div className="books-page-state books-page-state--empty">
                        <div className="books-page-state-icon">
                            <FaBookOpen />
                        </div>
                        <h3 className="books-page-state-title">لا توجد كتب حالياً</h3>
                        <p className="books-page-state-message">
                            نعمل على إضافة المزيد من الكتب، عُد قريباً!
                        </p>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Main Render =====
    return (
        <main className="books-page">
            <div className="books-page-container">
                {/* Header */}
                <SectionTitle
                    title="مكتبتنا الكاملة"
                    subtitle="استكشف مجموعة واسعة من الكتب في مختلف المجالات"
                    badge={`${totalBooks} كتاب`}
                />
                
                {/* الفلاتر */}
                <div className="books-page-filters">
                    <div className="books-page-filters-tabs">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            return (
                                <button
                                    key={filter.id}
                                    className={`books-page-filter-tab ${
                                        activeFilter === filter.id ? "active" : ""
                                    }`}
                                    onClick={() => setActiveFilter(filter.id)}
                                >
                                    <Icon />
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="books-page-count">
                        <FaTh />
                        <span>عرض {filteredBooks.length} كتاب</span>
                    </div>
                </div>
                
                {/* شبكة الكتب */}
                <div className="books-page-grid">
                    {filteredBooks.map((book) => (
                        <Book key={book.id || book.documentId} book={book} />
                    ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="bp-pagination" aria-label="ترقيم الصفحات">
                        <ul className="bp-pagination-list">
                            {/* زر السابق */}
                            <li>
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="bp-pagination-btn bp-pagination-arrow"
                                    aria-label="الصفحة السابقة"
                                >
                                    <FaChevronRight />
                                </button>
                            </li>
                            
                            {/* أرقام الصفحات */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                const shouldShow =
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 &&
                                        pageNumber <= currentPage + 1);
                                
                                if (!shouldShow) {
                                    if (pageNumber === 2 && currentPage > 3) {
                                        return (
                                            <li key="dots-start" className="bp-pagination-dots">
                                                ⋯
                                            </li>
                                        );
                                    }
                                    if (
                                        pageNumber === totalPages - 1 &&
                                        currentPage < totalPages - 2
                                    ) {
                                        return (
                                            <li key="dots-end" className="bp-pagination-dots">
                                                ⋯
                                            </li>
                                        );
                                    }
                                    return null;
                                }
                                
                                return (
                                    <li key={pageNumber}>
                                        <button
                                            onClick={() => goToPage(pageNumber)}
                                            className={`bp-pagination-btn ${
                                                currentPage === pageNumber ? "active" : ""
                                            }`}
                                            aria-current={
                                                currentPage === pageNumber ? "page" : undefined
                                            }
                                        >
                                            {pageNumber}
                                        </button>
                                    </li>
                                );
                            })}
                            
                            {/* زر التالي */}
                            <li>
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="bp-pagination-btn bp-pagination-arrow"
                                    aria-label="الصفحة التالية"
                                >
                                    <FaChevronLeft />
                                </button>
                            </li>
                        </ul>
                        
                        <p className="bp-pagination-info">
                            صفحة <strong>{currentPage}</strong> من{" "}
                            <strong>{totalPages}</strong>
                        </p>
                    </nav>
                )}
            </div>
        </main>
    );
}

export default BooksPage;