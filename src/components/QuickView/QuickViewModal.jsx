import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import {
    FaTimes,
    FaShoppingCart,
    FaHeart,
    FaRegHeart,
    FaArrowLeft,
    FaCheckCircle,
    FaTimesCircle,
    FaBookOpen,
    FaInfoCircle,
    FaTag,
    FaBarcode,
    FaFileAlt,
    FaCalendarAlt,
    FaBoxes,
    FaCheck,
} from "react-icons/fa";

import { useQuickView } from "../../context/QuickViewContext";
import StarRating from "../StarRating/StarRating";
import "./QuickViewModal.css";

function QuickViewModal() {
    const { selectedBook, isOpen, closeQuickView } = useQuickView();
    
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // ===== معالجة البيانات بأمان =====
    const book = useMemo(
        () => selectedBook?.attributes || selectedBook,
        [selectedBook]
    );
    
    const bookId = book?.documentId || book?.id;
    
    // ===== استرجاع حالة المفضلة من localStorage =====
    useEffect(() => {
        if (bookId) {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setIsWishlisted(wishlist.includes(bookId));
        }
    }, [bookId]);
    
    // ===== رابط الصورة =====
    const imageUrl = useMemo(() => {
        if (book?.image?.data?.attributes?.url) {
            return `http://localhost:1337${book.image.data.attributes.url}`;
        }
        if (book?.image?.url) {
            return `http://localhost:1337${book.image.url}`;
        }
        return "/default-book.jpg";
    }, [book]);
    
    // ===== التصنيفات =====
    const categories = useMemo(() => {
        return (
            book?.categories?.data ||
            book?.categories ||
            book?.category_ids ||
            []
        );
    }, [book]);
    
    // ===== الحسابات =====
    const hasDiscount = book?.oldPrice && book.oldPrice > book.price;
    const discountPercent = hasDiscount
        ? Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100)
        : 0;
    
    const rating = book?.rating || 4.5;
    const reviewsCount = book?.reviewsCount || 0;
    
    const stock = book?.stock ?? book?.quantity ?? 10;
    const isAvailable = book?.Available !== false && stock > 0;
    const isLowStock = stock > 0 && stock < 5;
    
    // ===== تنسيق التاريخ =====
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    // ===== معاينة المحتوى =====
    const contentPreview = useMemo(() => {
        if (!book?.content || !Array.isArray(book.content)) return null;
        return book.content
            .filter((block) => block.type === "paragraph")
            .slice(0, 2);
    }, [book?.content]);
    
    // ===== Handlers =====
    const handleWishlist = () => {
        if (!bookId) return;
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const newWishlist = isWishlisted
            ? wishlist.filter((id) => id !== bookId)
            : [...wishlist, bookId];
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
        setIsWishlisted(!isWishlisted);
    };
    
    const handleAddToCart = () => {
        if (!isAvailable) return;
        
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find((item) => item.id === bookId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: bookId,
                title: book.Title,
                price: book.price,
                image: imageUrl,
                quantity: 1,
            });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };
    
    const handleContentClick = (e) => e.stopPropagation();
    
    // ===== لا تعرض شيئاً إذا لم يكن Modal مفتوحاً =====
    if (!isOpen || !book) return null;
    
    return (
        <>
            {/* ===== Backdrop ===== */}
            <div
                className="quickview-backdrop"
                onClick={closeQuickView}
                aria-hidden="true"
            />
            
            {/* ===== Modal Container ===== */}
            <div
                className="quickview-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="quickview-title"
                onClick={closeQuickView}
            >
                <div
                    className="quickview-content"
                    onClick={handleContentClick}
                >
                    {/* ===== زر الإغلاق ===== */}
                    <button
                        className="quickview-close"
                        onClick={closeQuickView}
                        aria-label="إغلاق"
                    >
                        <FaTimes />
                    </button>
                    
                    {/* ===== الـ Grid الرئيسي ===== */}
                    <div className="quickview-grid">
                        {/* =============================================
                             العمود الأيمن: الصورة والإجراءات
                             ============================================= */}
                        <div className="quickview-sidebar">
                            {/* الصورة مع Badges */}
                            <div className="quickview-image-wrapper">
                                {/* Badges علوية */}
                                <div className="quickview-badges">
                                    {hasDiscount && (
                                        <span className="quickview-badge quickview-badge--discount">
                                            خصم {discountPercent}%
                                        </span>
                                    )}
                                    {book.isNew && (
                                        <span className="quickview-badge quickview-badge--new">
                                            جديد
                                        </span>
                                    )}
                                    {book.isBestseller && (
                                        <span className="quickview-badge quickview-badge--bestseller">
                                            الأكثر مبيعاً
                                        </span>
                                    )}
                                </div>
                                
                                {/* Skeleton أثناء التحميل */}
                                {!imageLoaded && (
                                    <div className="quickview-image-skeleton"></div>
                                )}
                                
                                <img
                                    src={imageUrl}
                                    alt={book.Title || "غلاف الكتاب"}
                                    className={`quickview-image ${imageLoaded ? "loaded" : ""}`}
                                    loading="lazy"
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        e.target.src = "/default-book.jpg";
                                        setImageLoaded(true);
                                    }}
                                />
                            </div>
                            
                            {/* ===== كرت السعر ===== */}
                            <div className="quickview-price-card">
                                <div className="quickview-price-row">
                                    <div className="quickview-price-block">
                                        <span className="quickview-price-current">
                                            ${book.price || 0}
                                        </span>
                                        {hasDiscount && (
                                            <span className="quickview-price-old">
                                                ${book.oldPrice}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <span
                                        className={`quickview-availability ${
                                            isAvailable ? "available" : "unavailable"
                                        }`}
                                    >
                                        {isAvailable ? (
                                            <>
                                                <FaCheckCircle />
                                                <span>متاح للشحن</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaTimesCircle />
                                                <span>غير متاح</span>
                                            </>
                                        )}
                                    </span>
                                </div>
                                
                                {/* تنبيه الكمية المحدودة */}
                                {isLowStock && (
                                    <div className="quickview-stock-alert">
                                        <FaInfoCircle />
                                        <span>متبقي {stock} نسخ فقط - اطلب الآن!</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* ===== أزرار الإجراءات ===== */}
                            <div className="quickview-actions">
                                <button
                                    className={`quickview-btn quickview-btn--primary ${
                                        addedToCart ? "added" : ""
                                    }`}
                                    onClick={handleAddToCart}
                                    disabled={!isAvailable}
                                >
                                    {addedToCart ? (
                                        <>
                                            <FaCheck />
                                            <span>تمت الإضافة للسلة</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart />
                                            <span>إضافة للسلة</span>
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    className={`quickview-btn quickview-btn--wishlist ${
                                        isWishlisted ? "active" : ""
                                    }`}
                                    onClick={handleWishlist}
                                    aria-label={
                                        isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"
                                    }
                                >
                                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                                    <span>{isWishlisted ? "في المفضلة" : "إضافة للمفضلة"}</span>
                                </button>
                                
                                <Link
                                    to={`/book/${bookId}`}
                                    className="quickview-btn quickview-btn--details"
                                    onClick={closeQuickView}
                                >
                                    <FaBookOpen />
                                    <span>عرض التفاصيل الكاملة</span>
                                    <FaArrowLeft className="quickview-btn-arrow" />
                                </Link>
                            </div>
                        </div>
                        
                        {/* =============================================
                             العمود الأيسر: التفاصيل
                             ============================================= */}
                        <div className="quickview-details">
                            {/* ===== العنوان والمؤلف ===== */}
                            <div className="quickview-header">
                                {/* التصنيفات */}
                                {categories.length > 0 && (
                                    <div className="quickview-categories">
                                        {categories.slice(0, 3).map((cat, idx) => {
                                            const catData = cat?.attributes || cat;
                                            const catId = catData?.documentId || catData?.id;
                                            const catName =
                                                catData?.name || catData?.Title || "تصنيف";
                                            
                                            return (
                                                <Link
                                                    key={catId || idx}
                                                    to={`/category/${catId}`}
                                                    className="quickview-category-tag"
                                                    onClick={closeQuickView}
                                                >
                                                    <FaTag />
                                                    <span>{catName}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                                
                                <h2 id="quickview-title" className="quickview-title">
                                    {book.Title}
                                </h2>
                                
                                <div className="quickview-meta">
                                    {book.author && (
                                        <p className="quickview-meta-item">
                                            <span className="quickview-meta-label">تأليف:</span>
                                            <strong>{book.author}</strong>
                                        </p>
                                    )}
                                    {book.publisher && (
                                        <p className="quickview-meta-item">
                                            <span className="quickview-meta-label">الناشر:</span>
                                            <strong>{book.publisher}</strong>
                                        </p>
                                    )}
                                </div>
                                
                                {/* التقييم */}
                                <div className="quickview-rating">
                                    <StarRating
                                        averageRating={rating}
                                        totalReviews={reviewsCount}
                                        bookId={bookId}
                                        size="md"
                                        interactive={true}
                                    />
                                </div>
                            </div>
                            
                            {/* ===== نبذة عن الكتاب ===== */}
                            <div className="quickview-section">
                                <h3 className="quickview-section-title">
                                    <FaInfoCircle />
                                    <span>نبذة عن الكتاب</span>
                                </h3>
                                <p className="quickview-description">
                                    {book.shortDescription ||
                                        book.Description ||
                                        "لا يوجد وصف متاح لهذا الكتاب حالياً."}
                                </p>
                            </div>
                            
                            {/* ===== معلومات الكتاب ===== */}
                            <div className="quickview-info-grid">
                                {book.isbn && (
                                    <div className="quickview-info-item">
                                        <FaBarcode className="quickview-info-icon" />
                                        <div className="quickview-info-content">
                                            <span className="quickview-info-label">ISBN</span>
                                            <span className="quickview-info-value">{book.isbn}</span>
                                        </div>
                                    </div>
                                )}
                                
                                {book.pages && (
                                    <div className="quickview-info-item">
                                        <FaFileAlt className="quickview-info-icon" />
                                        <div className="quickview-info-content">
                                            <span className="quickview-info-label">عدد الصفحات</span>
                                            <span className="quickview-info-value">
                                                {book.pages} صفحة
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {book.publishedDate && (
                                    <div className="quickview-info-item">
                                        <FaCalendarAlt className="quickview-info-icon" />
                                        <div className="quickview-info-content">
                                            <span className="quickview-info-label">تاريخ النشر</span>
                                            <span className="quickview-info-value">
                                                {formatDate(book.publishedDate)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {stock !== undefined && (
                                    <div className="quickview-info-item">
                                        <FaBoxes className="quickview-info-icon" />
                                        <div className="quickview-info-content">
                                            <span className="quickview-info-label">المخزون</span>
                                            <span
                                                className={`quickview-info-value ${
                                                    isLowStock ? "low-stock" : ""
                                                }`}
                                            >
                                                {stock} نسخة
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* ===== معاينة المحتوى ===== */}
                            {contentPreview && contentPreview.length > 0 && (
                                <div className="quickview-section">
                                    <h3 className="quickview-section-title">
                                        <FaBookOpen />
                                        <span>من داخل الكتاب</span>
                                    </h3>
                                    <div className="quickview-content-preview">
                                        <BlocksRenderer
                                            content={contentPreview}
                                            blocks={{
                                                paragraph: ({ children }) => (
                                                    <p className="quickview-preview-paragraph">
                                                        {children}
                                                    </p>
                                                ),
                                                heading: ({ children, level }) => {
                                                    const Tag = `h${level}`;
                                                    return (
                                                        <Tag className={`quickview-preview-heading h${level}`}>
                                                            {children}
                                                        </Tag>
                                                    );
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default QuickViewModal;