import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import {
    FaCalendarAlt,
    FaUserEdit,
    FaTag,
    FaClock,
    FaHome,
    FaNewspaper,
    FaArrowRight,
    FaArrowLeft,
    FaSync,
    FaShareAlt,
    FaHeart,
    FaRegHeart,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaTelegram,
    FaTimesCircle,
} from "react-icons/fa";

import { getBlogDetails, clearBlogDetails } from "../../../store/BlogDetailsSlice";
import "./BlogDetails.css";

const API_URL = "http://localhost:1337";
const DEFAULT_HERO = "/images/backgrounds/blog-bg.jpg";

function BlogDetails() {
    const { documentId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { data: blog, isLoading, error } = useSelector((state) => state.blogDetails);
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // ===== جلب البيانات =====
    useEffect(() => {
        if (documentId) {
            dispatch(getBlogDetails(documentId));
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        
        return () => {
            dispatch(clearBlogDetails());
        };
    }, [dispatch, documentId]);
    
    // ===== استرجاع حالة الإعجاب =====
    useEffect(() => {
        if (documentId) {
            const liked = JSON.parse(localStorage.getItem("liked_blogs") || "[]");
            setIsLiked(liked.includes(documentId));
        }
    }, [documentId]);
    
    // ===== Handlers =====
    const handleLike = () => {
        if (!documentId) return;
        
        const liked = JSON.parse(localStorage.getItem("liked_blogs") || "[]");
        const newLiked = isLiked
            ? liked.filter((id) => id !== documentId)
            : [...liked, documentId];
        
        localStorage.setItem("liked_blogs", JSON.stringify(newLiked));
        setIsLiked(!isLiked);
    };
    
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog?.Title,
                    text: blog?.Description,
                    url: window.location.href,
                });
            } catch {
                // المستخدم ألغى
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("تم نسخ الرابط!");
        }
    };
    
    // ===== Breadcrumb =====
    const Breadcrumb = ({ title = "مقال" }) => (
        <nav className="bld-breadcrumb" aria-label="مسار التنقل">
            <Link to="/" className="bld-breadcrumb-item">
                <FaHome />
                <span>الرئيسية</span>
            </Link>
            <FaArrowRight className="bld-breadcrumb-separator" />
            <Link to="/blogs" className="bld-breadcrumb-item">
                <FaNewspaper />
                <span>المقالات</span>
            </Link>
            <FaArrowRight className="bld-breadcrumb-separator" />
            <span className="bld-breadcrumb-item bld-breadcrumb-current">
                {title}
            </span>
        </nav>
    );
    
    // ===== Loading State =====
    if (isLoading) {
        return (
            <main className="blog-details-page">
                <div className="bld-container">
                    <div className="bld-loading">
                        <div className="bld-spinner"></div>
                        <p>جاري تحميل المقال...</p>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Error State =====
    if (error) {
        return (
            <main className="blog-details-page">
                <div className="bld-container">
                    <Breadcrumb title="خطأ" />
                    <div className="bld-state bld-state--error">
                        <div className="bld-state-icon">
                            <FaTimesCircle />
                        </div>
                        <h2 className="bld-state-title">عذراً، حدث خطأ</h2>
                        <p className="bld-state-message">{error}</p>
                        <div className="bld-state-actions">
                            <button
                                className="bld-btn bld-btn--primary"
                                onClick={() => dispatch(getBlogDetails(documentId))}
                            >
                                <FaSync /> إعادة المحاولة
                            </button>
                            <Link to="/blogs" className="bld-btn bld-btn--outline">
                                <FaNewspaper /> العودة للمقالات
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Not Found =====
    if (!blog) {
        return (
            <main className="blog-details-page">
                <div className="bld-container">
                    <Breadcrumb title="غير موجود" />
                    <div className="bld-state bld-state--empty">
                        <div className="bld-state-icon">
                            <FaNewspaper />
                        </div>
                        <h2 className="bld-state-title">المقال غير موجود</h2>
                        <p className="bld-state-message">
                            عذراً، لم نتمكن من العثور على المقال المطلوب.
                        </p>
                        <Link to="/blogs" className="bld-btn bld-btn--primary">
                            <FaArrowRight /> العودة للمقالات
                        </Link>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== البيانات المعالجة =====
    const title = blog.Title || blog.title || "بدون عنوان";
    const description = blog.Description || blog.description || "";
    const authorName = blog.author?.Name || "كاتب غير معروف";
    const category = blog.category_blogs?.[0]?.name || "عام";
    
    const imageUrl = blog?.image?.url
        ? `${API_URL}${blog.image.url}`
        : DEFAULT_HERO;
    
    const formattedDate = blog.publishedAt || blog.createdAt
        ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";
    
    // وقت القراءة
    const wordCount = Array.isArray(blog.content)
        ? blog.content
            .filter((b) => b.type === "paragraph")
            .reduce((acc, block) => {
                const text = block.children?.map((c) => c.text || "").join(" ") || "";
                return acc + text.split(/\s+/).length;
            }, 0)
        : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // روابط التواصل
    const socialLinks = [
        { name: "واتساب", url: blog.author?.whatsapp, icon: FaWhatsapp, color: "#25D366" },
        { name: "فيسبوك", url: blog.author?.facebook, icon: FaFacebook, color: "#1877F2" },
        { name: "إنستغرام", url: blog.author?.instagram, icon: FaInstagram, color: "#E1306C" },
        { name: "تيليجرام", url: blog.author?.telegram, icon: FaTelegram, color: "#0088CC" },
    ].filter((link) => link.url);
    
    return (
        <main className="blog-details-page">
            <div className="bld-container">
                {/* Breadcrumb */}
                <Breadcrumb title={title} />
                
                {/* Hero Section */}
                <header className="bld-hero">
                    <div
                        className="bld-hero-bg"
                        style={{
                            backgroundImage: `url(${imageError ? DEFAULT_HERO : imageUrl})`,
                        }}
                    >
                        <div className="bld-hero-overlay"></div>
                    </div>
                    
                    <div className="bld-hero-content">
                        <span className="bld-hero-category">
                            <FaTag />
                            {category}
                        </span>
                        
                        <h1 className="bld-hero-title">{title}</h1>
                        
                        <div className="bld-hero-meta">
                            {formattedDate && (
                                <span className="bld-hero-meta-item">
                                    <FaCalendarAlt />
                                    {formattedDate}
                                </span>
                            )}
                            
                            <span className="bld-hero-meta-item">
                                <FaUserEdit />
                                {authorName}
                            </span>
                            
                            <span className="bld-hero-meta-item">
                                <FaClock />
                                {readingTime} دقيقة قراءة
                            </span>
                        </div>
                    </div>
                </header>
                
                {/* Main Content */}
                <div className="bld-main">
                    <article className="bld-article">
                        {/* Description (intro) */}
                        {description && (
                            <div className="bld-intro">
                                <p>{description}</p>
                            </div>
                        )}
                        
                        {/* Content */}
                        {blog.content && Array.isArray(blog.content) && blog.content.length > 0 ? (
                            <div className="bld-content">
                                <BlocksRenderer content={blog.content} />
                            </div>
                        ) : (
                            <div className="bld-no-content">
                                <FaNewspaper />
                                <p>لا يوجد محتوى تفصيلي لهذا المقال</p>
                            </div>
                        )}
                        
                        {/* Actions */}
                        <div className="bld-actions">
                            <button
                                className={`bld-action-btn ${isLiked ? "is-liked" : ""}`}
                                onClick={handleLike}
                            >
                                {isLiked ? <FaHeart /> : <FaRegHeart />}
                                <span>{isLiked ? "أعجبني" : "أعجبني"}</span>
                            </button>
                            
                            <button
                                className="bld-action-btn"
                                onClick={handleShare}
                            >
                                <FaShareAlt />
                                <span>مشاركة</span>
                            </button>
                            
                            <Link to="/blogs" className="bld-action-btn bld-action-back">
                                <FaArrowRight />
                                <span>العودة للمقالات</span>
                            </Link>
                        </div>
                    </article>
                    
                    {/* Sidebar - Author */}
                    {blog.author && (
                        <aside className="bld-sidebar">
                            <div className="bld-author-card">
                                <div className="bld-author-header">
                                    <span className="bld-author-label">عن الكاتب</span>
                                </div>
                                
                                <h3 className="bld-author-name">
                                    <FaUserEdit />
                                    {authorName}
                                </h3>
                                
                                {blog.author.Description && (
                                    <p className="bld-author-bio">
                                        {blog.author.Description.length > 150
                                            ? blog.author.Description.substring(0, 150) + "..."
                                            : blog.author.Description}
                                    </p>
                                )}
                                
                                {socialLinks.length > 0 && (
                                    <div className="bld-author-social">
                                        {socialLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <a
                                                    key={link.name}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bld-social-link"
                                                    style={{ "--social-color": link.color }}
                                                    aria-label={link.name}
                                                    title={link.name}
                                                >
                                                    <Icon />
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            
                            {/* Reading Info */}
                            <div className="bld-reading-card">
                                <h4 className="bld-reading-title">
                                    <FaClock />
                                    معلومات القراءة
                                </h4>
                                <ul className="bld-reading-list">
                                    <li>
                                        <span>وقت القراءة:</span>
                                        <strong>{readingTime} دقيقة</strong>
                                    </li>
                                    <li>
                                        <span>التصنيف:</span>
                                        <strong>{category}</strong>
                                    </li>
                                    {formattedDate && (
                                        <li>
                                            <span>تاريخ النشر:</span>
                                            <strong>{formattedDate}</strong>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </main>
    );
}

export default BlogDetails;