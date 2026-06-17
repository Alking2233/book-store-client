import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaUserEdit,
    FaArrowLeft,
    FaTag,
    FaClock,
} from "react-icons/fa";

import "./Blog.css";

// ============================================================================
// 🔧 الثوابت
// ============================================================================

const API_URL = "http://localhost:1337";
const DEFAULT_IMAGE = "/images/backgrounds/blog-bg.jpg"; // ✅ المسار الصحيح من public/

function Blog({ blog, variant = "default" }) {
    const [imageError, setImageError] = useState(false);
    
    // ===== استخراج البيانات بأمان =====
    const blogData = blog?.attributes || blog;
    
    const blogId = blogData?.documentId || blogData?.id;
    const title = blogData?.Title || blogData?.title || "بدون عنوان";
    const authorName = blogData?.author?.Name || blogData?.author?.name || "كاتب غير معروف";
    
    // ===== رابط الصورة =====
    const imageUrl = useMemo(() => {
        const url = 
            blogData?.image?.data?.attributes?.url ||
            blogData?.image?.url ||
            blogData?.cover?.url;
        
        if (!url) return DEFAULT_IMAGE;
        return url.startsWith("http") ? url : `${API_URL}${url}`;
    }, [blogData]);
    
    // ===== التصنيف =====
    const category = useMemo(() => {
        return (
            blogData?.category_blogs?.[0]?.name ||
            blogData?.category_blogs?.[0]?.Title ||
            blogData?.category?.name ||
            "عام"
        );
    }, [blogData]);
    
    // ===== الوصف (يدعم نص عادي و Strapi blocks) =====
    const description = useMemo(() => {
        // 1. وصف مباشر
        if (blogData?.Description) {
            return blogData.Description.length > 150
                ? blogData.Description.substring(0, 150) + "..."
                : blogData.Description;
        }
        
        if (blogData?.description) {
            return blogData.description.length > 150
                ? blogData.description.substring(0, 150) + "..."
                : blogData.description;
        }
        
        // 2. content - قد يكون array من blocks (Strapi)
        if (Array.isArray(blogData?.content)) {
            const paragraphs = blogData.content
                .filter((block) => block.type === "paragraph")
                .map((block) => 
                    block.children
                        ?.map((child) => child.text || "")
                        .join(" ")
                )
                .join(" ")
                .trim();
            
            if (paragraphs) {
                return paragraphs.length > 150
                    ? paragraphs.substring(0, 150) + "..."
                    : paragraphs;
            }
        }
        
        // 3. content كنص عادي (Markdown)
        if (typeof blogData?.content === "string") {
            const plainText = blogData.content
                .replace(/[#*_~`]/g, "")
                .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
                .replace(/\n+/g, " ")
                .trim();
            
            return plainText.length > 150
                ? plainText.substring(0, 150) + "..."
                : plainText;
        }
        
        return "لا يوجد وصف متاح لهذا المقال.";
    }, [blogData]);
    
    // ===== تنسيق التاريخ =====
    const formattedDate = useMemo(() => {
        const dateString = blogData?.publishedAt || blogData?.createdAt;
        if (!dateString) return null;
        
        try {
            return new Date(dateString).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return null;
        }
    }, [blogData]);
    
    // ===== وقت القراءة المتوقع =====
    const readingTime = useMemo(() => {
        if (blogData?.readingTime) return blogData.readingTime;
        
        // حساب تقريبي: 200 كلمة/دقيقة
        let wordCount = 0;
        
        if (typeof blogData?.content === "string") {
            wordCount = blogData.content.split(/\s+/).length;
        } else if (Array.isArray(blogData?.content)) {
            wordCount = blogData.content
                .filter((b) => b.type === "paragraph")
                .reduce((acc, block) => {
                    const text = block.children
                        ?.map((c) => c.text || "")
                        .join(" ") || "";
                    return acc + text.split(/\s+/).length;
                }, 0);
        }
        
        const minutes = Math.max(1, Math.ceil(wordCount / 200));
        return `${minutes} دقيقة قراءة`;
    }, [blogData]);
    
    if (!blogData) return null;
    
    return (
        <article className={`blog-card blog-card--${variant}`}>
            {/* ===== الصورة + التصنيف ===== */}
            <Link
                to={blogId ? `/blog/${blogId}` : "#"}
                className="blog-image-wrapper"
                aria-label={`قراءة المقال: ${title}`}
            >
                <img
                    src={imageError ? DEFAULT_IMAGE : imageUrl}
                    alt={title}
                    className="blog-image"
                    loading="lazy"
                    onError={() => setImageError(true)}
                />
                
                {/* شارة التصنيف */}
                <span className="blog-category-badge">
                    <FaTag />
                    {category}
                </span>
                
                {/* وقت القراءة */}
                <span className="blog-reading-time">
                    <FaClock />
                    {readingTime}
                </span>
            </Link>
            
            {/* ===== المحتوى ===== */}
            <div className="blog-content">
                {/* Meta */}
                <div className="blog-meta">
                    {formattedDate && (
                        <span className="blog-meta-item">
                            <FaCalendarAlt />
                            <span>{formattedDate}</span>
                        </span>
                    )}
                    
                    <span className="blog-meta-item">
                        <FaUserEdit />
                        <span>{authorName}</span>
                    </span>
                </div>
                
                {/* العنوان */}
                <h3 className="blog-title">
                    <Link to={blogId ? `/blog/${blogId}` : "#"}>
                        {title}
                    </Link>
                </h3>
                
                {/* الوصف */}
                <p className="blog-description">{description}</p>
                
                {/* زر القراءة */}
                <Link
                    to={blogId ? `/blog/${blogId}` : "#"}
                    className="blog-read-btn"
                >
                    <span>أكمل القراءة</span>
                    <FaArrowLeft />
                </Link>
            </div>
        </article>
    );
}

export default Blog;