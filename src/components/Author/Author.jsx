import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaTelegram,
    FaUserAlt,
    FaBookOpen,
} from "react-icons/fa";

import "./Author.css";

const API_URL = "http://localhost:1337";

function Author({ author }) {
    const [imageError, setImageError] = useState(false);
    
    // ===== استخراج البيانات بأمان =====
    const authorData = author?.attributes || author;
    
    const authorId = authorData?.documentId || authorData?.id;
    const name = authorData?.Name || authorData?.name || "مؤلف غير معروف";
    const description = authorData?.Description || authorData?.description || "";
    const booksCount = authorData?.books?.data?.length || authorData?.booksCount || 0;
    
    // ===== رابط الصورة =====
    const imageUrl = useMemo(() => {
        const url = 
            authorData?.image?.data?.attributes?.url ||
            authorData?.image?.url;
        
        if (!url) return null;
        return url.startsWith("http") ? url : `${API_URL}${url}`;
    }, [authorData]);
    
    // ===== روابط التواصل (فقط الموجودة) =====
    const socialLinks = useMemo(() => {
        const links = [];
        
        if (authorData?.whatsapp) {
            links.push({
                name: "واتساب",
                url: authorData.whatsapp,
                icon: FaWhatsapp,
                className: "social-whatsapp",
            });
        }
        if (authorData?.facebook) {
            links.push({
                name: "فيسبوك",
                url: authorData.facebook,
                icon: FaFacebook,
                className: "social-facebook",
            });
        }
        if (authorData?.instagram) {
            links.push({
                name: "إنستغرام",
                url: authorData.instagram,
                icon: FaInstagram,
                className: "social-instagram",
            });
        }
        if (authorData?.telegram) {
            links.push({
                name: "تيليجرام",
                url: authorData.telegram,
                icon: FaTelegram,
                className: "social-telegram",
            });
        }
        
        return links;
    }, [authorData]);
    
    // ===== اقتطاع الوصف =====
    const shortDescription = description.length > 110
        ? `${description.substring(0, 110)}...`
        : description;
    
    if (!authorData) return null;
    
    return (
        <article className="author-card">
            {/* ===== صورة المؤلف ===== */}
            <Link 
                to={authorId ? `/author/${authorId}` : "#"}
                className="author-image-wrapper"
                aria-label={`عرض كتب ${name}`}
            >
                {imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="author-image"
                        loading="lazy"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="author-image-placeholder">
                        <FaUserAlt />
                    </div>
                )}
                
                {/* عداد الكتب (إن وُجد) */}
                {booksCount > 0 && (
                    <span className="author-books-badge">
                        <FaBookOpen />
                        <span>{booksCount} كتاب</span>
                    </span>
                )}
            </Link>
            
            {/* ===== معلومات المؤلف ===== */}
            <div className="author-info">
                <h3 className="author-name">
                    <Link to={authorId ? `/author/${authorId}` : "#"}>
                        {name}
                    </Link>
                </h3>
                
                {description && (
                    <p className="author-description">
                        {shortDescription}
                    </p>
                )}
                
                {/* روابط التواصل */}
                {socialLinks.length > 0 && (
                    <div className="author-social">
                        {socialLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`author-social-link ${link.className}`}
                                    aria-label={`${name} على ${link.name}`}
                                    title={link.name}
                                >
                                    <Icon />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </article>
    );
}

export default Author;