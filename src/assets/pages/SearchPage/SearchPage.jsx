import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaSync,
    FaBookOpen,
    FaTimesCircle,
    FaHome,
    FaArrowRight,
    FaFilter,
} from "react-icons/fa";

import { getAllBooks } from "../../../store/BooksSlice";
import Book from "../../../components/Book/Book";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";

import "./SearchPage.css";

const SUGGESTIONS = ["رواية", "تنمية", "تاريخ", "أدب", "فلسفة", "علم", "دين"];

function SearchPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const query = searchParams.get("q")?.trim() || "";
    const queryLower = query.toLowerCase();
    
    const { data, isLoading, error } = useSelector((state) => state.books);
    const [localQuery, setLocalQuery] = useState(query);
    
    // ===== جلب البيانات =====
    useEffect(() => {
        if (!data || data.length === 0) {
            dispatch(getAllBooks({ page: 1, pageSize: 100 }));
        }
    }, [dispatch, data]);
    
    // ===== تحديث الـ input عند تغيير URL =====
    useEffect(() => {
        setLocalQuery(query);
    }, [query]);
    
    // ===== فلترة الكتب =====
    const filteredBooks = useMemo(() => {
        if (!queryLower || !data || !Array.isArray(data)) return [];
        
        return data.filter((book) => {
            const bookData = book?.attributes || book;
            
            const title = (bookData?.Title || bookData?.title || "").toLowerCase();
            const author = (bookData?.author || "").toLowerCase();
            const publisher = (bookData?.publisher || "").toLowerCase();
            const description = (bookData?.shortDescription || bookData?.Description || "").toLowerCase();
            
            return (
                title.includes(queryLower) ||
                author.includes(queryLower) ||
                publisher.includes(queryLower) ||
                description.includes(queryLower)
            );
        });
    }, [data, queryLower]);
    
    // ===== Handlers =====
    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = localQuery.trim();
        if (trimmed) {
            setSearchParams({ q: trimmed });
        }
    };
    
    const handleSuggestion = (suggestion) => {
        setLocalQuery(suggestion);
        setSearchParams({ q: suggestion });
    };
    
    // ===== Breadcrumb =====
    const Breadcrumb = () => (
        <nav className="sp-breadcrumb" aria-label="مسار التنقل">
            <Link to="/" className="sp-breadcrumb-item">
                <FaHome />
                <span>الرئيسية</span>
            </Link>
            <FaArrowRight className="sp-breadcrumb-separator" />
            <span className="sp-breadcrumb-item sp-breadcrumb-current">
                <FaSearch />
                <span>نتائج البحث</span>
            </span>
        </nav>
    );
    
    // ===== Skeleton =====
    const renderSkeletons = () => {
        return Array(8).fill(0).map((_, index) => (
            <div key={index} className="sp-skeleton">
                <div className="sp-skeleton-cover"></div>
                <div className="sp-skeleton-info">
                    <div className="sp-skeleton-line sp-skeleton-line--title"></div>
                    <div className="sp-skeleton-line sp-skeleton-line--author"></div>
                    <div className="sp-skeleton-line sp-skeleton-line--price"></div>
                </div>
            </div>
        ));
    };
    
    return (
        <main className="search-page">
            <div className="sp-container">
                {/* Breadcrumb */}
                <Breadcrumb />
                
                {/* Search Header */}
                <div className="sp-search-header">
                    <div className="sp-search-icon">
                        <FaSearch />
                    </div>
                    
                    <h1 className="sp-search-title">
                        {query ? `نتائج البحث عن "${query}"` : "البحث في المكتبة"}
                    </h1>
                    
                    {query && (
                        <p className="sp-search-subtitle">
                            {isLoading
                                ? "جاري البحث..."
                                : `تم العثور على ${filteredBooks.length} نتيجة`}
                        </p>
                    )}
                </div>
                
                {/* Search Form */}
                <form className="sp-search-form" onSubmit={handleSubmit}>
                    <div className="sp-search-input-wrapper">
                        <FaSearch className="sp-search-input-icon" />
                        <input
                            type="search"
                            className="sp-search-input"
                            placeholder="ابحث عن كتاب، مؤلف، ناشر..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            autoFocus
                        />
                        {localQuery && (
                            <button
                                type="button"
                                className="sp-search-clear"
                                onClick={() => {
                                    setLocalQuery("");
                                    setSearchParams({});
                                }}
                                aria-label="مسح"
                            >
                                <FaTimesCircle />
                            </button>
                        )}
                    </div>
                    
                    <button type="submit" className="sp-search-submit">
                        <FaSearch />
                        <span>بحث</span>
                    </button>
                </form>
                
                {/* الاقتراحات */}
                {!query && (
                    <div className="sp-suggestions">
                        <span className="sp-suggestions-label">
                            <FaFilter /> اقتراحات للبحث:
                        </span>
                        <div className="sp-suggestions-list">
                            {SUGGESTIONS.map((sug) => (
                                <button
                                    key={sug}
                                    className="sp-suggestion-chip"
                                    onClick={() => handleSuggestion(sug)}
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* النتائج */}
                {query && (
                    <>
                        {/* Loading */}
                        {isLoading && (
                            <div className="sp-grid">{renderSkeletons()}</div>
                        )}
                        
                        {/* Error */}
                        {error && !isLoading && (
                            <div className="sp-state sp-state--error">
                                <div className="sp-state-icon">
                                    <FaSync />
                                </div>
                                <h3 className="sp-state-title">عذراً، حدث خطأ</h3>
                                <p className="sp-state-message">{error}</p>
                                <button
                                    className="sp-state-btn"
                                    onClick={() => dispatch(getAllBooks())}
                                >
                                    <FaSync /> إعادة المحاولة
                                </button>
                            </div>
                        )}
                        
                        {/* Empty - لا توجد نتائج */}
                        {!isLoading && !error && filteredBooks.length === 0 && (
                            <div className="sp-state sp-state--empty">
                                <div className="sp-state-icon">
                                    <FaSearch />
                                </div>
                                <h3 className="sp-state-title">
                                    لا توجد نتائج مطابقة
                                </h3>
                                <p className="sp-state-message">
                                    لم نجد أي كتاب يطابق "<strong>{query}</strong>"
                                </p>
                                
                                <div className="sp-state-suggestions">
                                    <p>جرّب البحث عن:</p>
                                    <div className="sp-suggestions-list">
                                        {SUGGESTIONS.slice(0, 5).map((sug) => (
                                            <button
                                                key={sug}
                                                className="sp-suggestion-chip"
                                                onClick={() => handleSuggestion(sug)}
                                            >
                                                {sug}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="sp-state-actions">
                                    <Link to="/books" className="sp-state-btn">
                                        <FaBookOpen /> تصفّح كل الكتب
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        {/* Results */}
                        {!isLoading && !error && filteredBooks.length > 0 && (
                            <div className="sp-grid">
                                {filteredBooks.map((book) => (
                                    <Book
                                        key={book.id || book.documentId}
                                        book={book}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default SearchPage;