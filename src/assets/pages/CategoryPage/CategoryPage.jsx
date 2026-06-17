﻿import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaSync,
    FaBookOpen,
    FaHome,
    FaThLarge,
    FaArrowRight,
    FaFire,
    FaClock,
    FaStar,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import { getAllBooks } from "../../../store/BooksSlice";
import { getAllCategories } from "../../../store/categoriesSlice";
import Book from "../../../components/Book/Book";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

import "./CategoryPage.css";

function CategoryPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { data: books, isLoading: booksLoading, error: booksError } = 
        useSelector((state) => state.books);
    const { data: categories, isLoading: categoriesLoading } = 
        useSelector((state) => state.categories);
    
    const [activeFilter, setActiveFilter] = useState("all");
    
    // ===== جلب البيانات =====
    useEffect(() => {
        dispatch(getAllBooks({ page: 1, pageSize: 100 }));
        dispatch(getAllCategories());
        // الرجوع لأعلى الصفحة عند تغيير التصنيف
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [dispatch, id]);
    
    // ===== الحصول على بيانات التصنيف الحالي =====
    const currentCategory = useMemo(() => {
        if (!categories || categories.length === 0) return null;
        
        return categories.find((cat) => {
            const catData = cat?.attributes || cat;
            const catId = catData?.documentId || catData?.id;
            return catId === id || catId?.toString() === id?.toString();
        });
    }, [categories, id]);
    
    const categoryData = currentCategory?.attributes || currentCategory;
    const categoryName = categoryData?.name || categoryData?.Title || "التصنيف";
    const categoryDescription = categoryData?.description || "";
    
    // ===== فلترة الكتب حسب التصنيف =====
    const categoryBooks = useMemo(() => {
        if (!books || !Array.isArray(books)) return [];
        
        return books.filter((book) => {
            const bookData = book?.attributes || book;
            
            const categoryIds = 
                bookData.categories?.data ||
                bookData.categories ||
                bookData.category_ids ||
                [];
            
            const categoriesArray = Array.isArray(categoryIds) 
                ? categoryIds 
                : [categoryIds];
            
            return categoriesArray.some((cat) => {
                const catId = cat?.documentId || cat?.id || cat;
                return (
                    catId === id || 
                    catId?.toString() === id?.toString()
                );
            });
        });
    }, [books, id]);
    
    // ===== الفلترة حسب النوع =====
    const filteredBooks = useMemo(() => {
        if (!categoryBooks) return [];
        
        const filtered = [...categoryBooks];
        
        switch (activeFilter) {
            case "newest":
                return filtered.reverse();
            
            case "topRated":
                return filtered.sort((a, b) => {
                    const ratingA = (a.attributes || a)?.rating || 4.5;
                    const ratingB = (b.attributes || b)?.rating || 4.5;
                    return ratingB - ratingA;
                });
            
            case "bestseller":
                return filtered.sort((a, b) => {
                    const salesA = (a.attributes || a)?.sales || 0;
                    const salesB = (b.attributes || b)?.sales || 0;
                    return salesB - salesA;
                });
            
            default:
                return filtered;
        }
    }, [categoryBooks, activeFilter]);
    
    const isLoading = booksLoading || categoriesLoading;
    
    // ===== الفلاتر =====
    const filters = [
        { id: "all", label: "الكل", icon: HiSparkles },
        { id: "newest", label: "الأحدث", icon: FaClock },
        { id: "bestseller", label: "الأكثر مبيعاً", icon: FaFire },
        { id: "topRated", label: "الأعلى تقييماً", icon: FaStar },
    ];
    
    // ===== Skeleton =====
    const renderSkeletons = () => {
        return Array(8).fill(0).map((_, index) => (
            <div key={index} className="catp-skeleton">
                <div className="catp-skeleton-cover"></div>
                <div className="catp-skeleton-info">
                    <div className="catp-skeleton-line catp-skeleton-line--tag"></div>
                    <div className="catp-skeleton-line catp-skeleton-line--title"></div>
                    <div className="catp-skeleton-line catp-skeleton-line--author"></div>
                    <div className="catp-skeleton-line catp-skeleton-line--rating"></div>
                    <div className="catp-skeleton-footer">
                        <div className="catp-skeleton-line catp-skeleton-line--price"></div>
                        <div className="catp-skeleton-btn"></div>
                    </div>
                </div>
            </div>
        ));
    };
    
    // ===== Breadcrumb =====
    const Breadcrumb = () => (
        <nav className="catp-breadcrumb" aria-label="مسار التنقل">
            <Link to="/" className="catp-breadcrumb-item">
                <FaHome />
                <span>الرئيسية</span>
            </Link>
            <FaArrowRight className="catp-breadcrumb-separator" />
            <Link to="/categories" className="catp-breadcrumb-item">
                <FaThLarge />
                <span>التصنيفات</span>
            </Link>
            <FaArrowRight className="catp-breadcrumb-separator" />
            <span className="catp-breadcrumb-item catp-breadcrumb-current">
                {categoryName}
            </span>
        </nav>
    );
    
    // ===== Loading State =====
    if (isLoading) {
        return (
            <main className="category-page">
                <div className="category-page-container">
                    <Breadcrumb />
                    <SectionTitle
                        title="جاري التحميل..."
                        subtitle="يتم جلب كتب التصنيف"
                    />
                    <div className="category-page-grid">{renderSkeletons()}</div>
                </div>
            </main>
        );
    }
    
    // ===== Error State =====
    if (booksError) {
        return (
            <main className="category-page">
                <div class="category-page-container">
                    <Breadcrumb />
                    <SectionTitle title="حدث خطأ" />
                    <div className="category-page-state category-page-state--error">
                        <div className="category-page-state-icon">
                            <FaSync />
                        </div>
                        <h3 className="category-page-state-title">عذراً، حدث خطأ</h3>
                        <p className="category-page-state-message">{booksError}</p>
                        <button
                            className="category-page-state-btn"
                            onClick={() => {
                                dispatch(getAllBooks({ page: 1, pageSize: 100 }));
                                dispatch(getAllCategories());
                            }}
                        >
                            <FaSync /> إعادة المحاولة
                        </button>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Empty State (لا توجد كتب في التصنيف) =====
    if (categoryBooks.length === 0) {
        return (
            <main className="category-page">
                <div className="category-page-container">
                    <Breadcrumb />
                    
                    <div className="category-page-header">
                        <SectionTitle
                            title={categoryName}
                            subtitle={categoryDescription || "لا توجد كتب في هذا التصنيف حالياً"}
                        />
                    </div>
                    
                    <div className="category-page-state category-page-state--empty">
                        <div className="category-page-state-icon">
                            <FaBookOpen />
                        </div>
                        <h3 className="category-page-state-title">
                            لا توجد كتب في هذا التصنيف
                        </h3>
                        <p className="category-page-state-message">
                            لم نتمكن من العثور على كتب مرتبطة بهذا التصنيف حالياً.
                            <br />
                            تصفّح باقي التصنيفات أو شاهد كل الكتب!
                        </p>
                        <div className="category-page-state-actions">
                            <Link to="/books" className="category-page-state-btn">
                                <FaBookOpen />
                                عرض جميع الكتب
                            </Link>
                            <Link 
                                to="/categories" 
                                className="category-page-state-btn category-page-state-btn--outline"
                            >
                                <FaThLarge />
                                تصفح التصنيفات
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Main Render =====
    return (
        <main className="category-page">
            <div className="category-page-container">
                {/* Breadcrumb */}
                <Breadcrumb />
                
                {/* Header */}
                <div className="category-page-header">
                    <SectionTitle
                        title={categoryName}
                        subtitle={
                            categoryDescription || 
                            `استكشف ${categoryBooks.length} كتاب في هذا التصنيف`
                        }
                        badge={`${categoryBooks.length} كتاب`}
                    />
                </div>
                
                {/* الفلاتر */}
                {categoryBooks.length > 1 && (
                    <div className="category-page-filters">
                        <div className="category-page-filters-tabs">
                            {filters.map((filter) => {
                                const Icon = filter.icon;
                                return (
                                    <button
                                        key={filter.id}
                                        className={`category-page-filter-tab ${
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
                    </div>
                )}
                
                {/* شبكة الكتب */}
                <div className="category-page-grid">
                    {filteredBooks.map((book) => (
                        <Book key={book.id || book.documentId} book={book} />
                    ))}
                </div>
            </div>
        </main>
    );
}

export default CategoryPage;