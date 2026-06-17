import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft, FaUsers, FaSync } from "react-icons/fa";

import SectionTitle from "../SectionTitle/SectionTitle";
import Author from "../Author/Author";
import { getAllAuthors } from "../../store/AuthorSlice";

import "./Authors.css";

function Authors({ showAll = false, maxItems = 5 }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { data, isLoading, error } = useSelector((state) => state.authors);
    
    useEffect(() => {
        dispatch(getAllAuthors());
    }, [dispatch]);
    
    // ===== تحديد عدد المؤلفين للعرض =====
    const isAuthorsPage = location.pathname === "/authors";
    const displayedAuthors = (showAll || isAuthorsPage)
        ? data
        : data?.slice(0, maxItems);
    
    const hasMoreAuthors = !showAll && !isAuthorsPage && data?.length > maxItems;
    
    // ===== Skeleton Loader =====
    const renderSkeletons = () => {
        return Array(maxItems).fill(0).map((_, index) => (
            <div key={index} className="author-skeleton">
                <div className="author-skeleton-image"></div>
                <div className="author-skeleton-content">
                    <div className="author-skeleton-line author-skeleton-line--name"></div>
                    <div className="author-skeleton-line author-skeleton-line--desc"></div>
                    <div className="author-skeleton-line author-skeleton-line--desc"></div>
                    <div className="author-skeleton-social">
                        <div className="author-skeleton-icon"></div>
                        <div className="author-skeleton-icon"></div>
                        <div className="author-skeleton-icon"></div>
                        <div className="author-skeleton-icon"></div>
                    </div>
                </div>
            </div>
        ));
    };
    
    // ===== Loading State =====
    if (isLoading) {
        return (
            <div className="authors-container">
                <SectionTitle
                    title="أهم المؤلفين"
                    subtitle="تعرّف على نخبة من المؤلفين المميزين"
                />
                <div className="authors-grid">{renderSkeletons()}</div>
            </div>
        );
    }
    
    // ===== Error State =====
    if (error) {
        return (
            <div className="authors-container">
                <SectionTitle
                    title="أهم المؤلفين"
                    subtitle="تعرّف على نخبة من المؤلفين المميزين"
                />
                <div className="authors-state authors-state--error">
                    <div className="authors-state-icon">
                        <FaSync />
                    </div>
                    <h3 className="authors-state-title">عذراً، حدث خطأ</h3>
                    <p className="authors-state-message">{error}</p>
                    <button
                        className="authors-state-btn"
                        onClick={() => dispatch(getAllAuthors())}
                    >
                        <FaSync /> إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }
    
    // ===== Empty State =====
    if (!data || data.length === 0) {
        return (
            <div className="authors-container">
                <SectionTitle
                    title="أهم المؤلفين"
                    subtitle="تعرّف على نخبة من المؤلفين المميزين"
                />
                <div className="authors-state authors-state--empty">
                    <div className="authors-state-icon">
                        <FaUsers />
                    </div>
                    <h3 className="authors-state-title">لا يوجد مؤلفون حالياً</h3>
                    <p className="authors-state-message">
                        نعمل على إضافة المؤلفين قريباً، عُد لاحقاً!
                    </p>
                </div>
            </div>
        );
    }
    
    // ===== Main Render =====
    return (
        <div className="authors-container">
            <SectionTitle
                title="أهم المؤلفين"
                subtitle="تعرّف على نخبة من المؤلفين المميزين الذين أثروا المكتبة العربية"
                badge={`${data.length} مؤلف`}
            />
            
            <div className="authors-grid">
                {displayedAuthors?.map((author) => (
                    <Author
                        author={author}
                        key={author.id || author.documentId}
                    />
                ))}
            </div>
            
            {/* زر عرض الكل */}
            {hasMoreAuthors && (
                <div className="authors-view-all">
                    <button
                        className="authors-view-all-btn"
                        onClick={() => navigate("/authors")}
                    >
                        <span>عرض جميع المؤلفين</span>
                        <span className="authors-view-all-count">
                            ({data.length - maxItems}+ آخر)
                        </span>
                        <FaArrowLeft />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Authors;