import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft, FaNewspaper, FaSync } from "react-icons/fa";

import SectionTitle from "../SectionTitle/SectionTitle";
import Blog from "../Blog/Blog";
import { getAllBlogs } from "../../store/blogSlice";

import "./Blogs.css";

function Blogs({ showAll = false, maxItems = 3 }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { data, isLoading, error } = useSelector((state) => state.blogs);
    
    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);
    
    // ===== تحديد الحالة =====
    const isBlogsPage = location.pathname === "/blogs";
    const displayedBlogs = (showAll || isBlogsPage)
        ? data
        : data?.slice(0, maxItems);
    
    const hasMoreBlogs = !showAll && !isBlogsPage && data?.length > maxItems;
    
    // ===== العنوان حسب الصفحة =====
    const pageTitle = isBlogsPage ? "جميع المقالات" : "أبرز المقالات";
    const pageSubtitle = isBlogsPage
        ? "اكتشف كل المقالات والمدونات المنشورة"
        : "اقرأ آخر المقالات والمدونات من خبرائنا";
    
    // ===== Skeleton Loader =====
    const renderSkeletons = () => {
        return Array(maxItems).fill(0).map((_, index) => (
            <div key={index} className="blog-skeleton">
                <div className="blog-skeleton-image"></div>
                <div className="blog-skeleton-content">
                    <div className="blog-skeleton-meta">
                        <div className="blog-skeleton-line blog-skeleton-line--meta"></div>
                        <div className="blog-skeleton-line blog-skeleton-line--meta"></div>
                    </div>
                    <div className="blog-skeleton-line blog-skeleton-line--title"></div>
                    <div className="blog-skeleton-line blog-skeleton-line--desc"></div>
                    <div className="blog-skeleton-line blog-skeleton-line--desc"></div>
                    <div className="blog-skeleton-line blog-skeleton-line--desc-short"></div>
                    <div className="blog-skeleton-btn"></div>
                </div>
            </div>
        ));
    };
    
    // ===== Loading State =====
    if (isLoading) {
        return (
            <div className="blogs-container">
                <SectionTitle title={pageTitle} subtitle={pageSubtitle} />
                <div className="blogs-grid">{renderSkeletons()}</div>
            </div>
        );
    }
    
    // ===== Error State =====
    if (error) {
        return (
            <div className="blogs-container">
                <SectionTitle title={pageTitle} subtitle={pageSubtitle} />
                <div className="blogs-state blogs-state--error">
                    <div className="blogs-state-icon">
                        <FaSync />
                    </div>
                    <h3 className="blogs-state-title">عذراً، حدث خطأ</h3>
                    <p className="blogs-state-message">{error}</p>
                    <button
                        className="blogs-state-btn"
                        onClick={() => dispatch(getAllBlogs())}
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
            <div className="blogs-container">
                <SectionTitle title={pageTitle} subtitle={pageSubtitle} />
                <div className="blogs-state blogs-state--empty">
                    <div className="blogs-state-icon">
                        <FaNewspaper />
                    </div>
                    <h3 className="blogs-state-title">لا توجد مقالات حالياً</h3>
                    <p className="blogs-state-message">
                        نعمل على نشر مقالات جديدة قريباً، عُد لاحقاً!
                    </p>
                </div>
            </div>
        );
    }
    
    // ===== Main Render =====
    return (
        <div className="blogs-container">
            <SectionTitle
                title={pageTitle}
                subtitle={pageSubtitle}
                badge={`${data.length} مقال`}
            />
            
            <div className="blogs-grid">
                {displayedBlogs?.map((blog) => (
                    <Blog
                        blog={blog}
                        key={blog.id || blog.documentId}
                    />
                ))}
            </div>
            
            {/* زر عرض الكل */}
            {hasMoreBlogs && (
                <div className="blogs-view-all">
                    <Link
                        to="/blogs"
                        className="blogs-view-all-btn"
                    >
                        <span>عرض جميع المقالات</span>
                        <span className="blogs-view-all-count">
                            ({data.length - maxItems}+ آخر)
                        </span>
                        <FaArrowLeft />
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Blogs;