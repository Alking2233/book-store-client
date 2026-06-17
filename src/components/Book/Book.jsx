import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    FaEye,
    FaShoppingCart,
    FaHeart,
    FaRegHeart,
    FaCheck,
} from "react-icons/fa";

import { useQuickView } from "../../context/QuickViewContext";
import StarRating from "../StarRating/StarRating";
import "./Book.css";

function Book({ book }) {
    // ===== استخراج البيانات (يدعم Strapi v4 و v5) =====
    const bookData = book?.attributes || book;
    
    // ===== Context =====
    const { openQuickView } = useQuickView();
    
    // ===== Local State =====
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    
    // ===== معرّف الكتاب =====
    const bookId = bookData?.documentId || bookData?.id;
    
    // ===== استرجاع حالة المفضلة من localStorage =====
    useEffect(() => {
        if (bookId) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setIsWishlisted(wishlist.includes(bookId));
        }
    }, [bookId]);
    
    // ===== معالجة رابط صورة الغلاف =====
    const imageUrl = useMemo(() => {
        // Strapi v4 - مع populate
        if (bookData?.image?.data?.attributes?.url) {
            return `http://localhost:1337${bookData.image.data.attributes.url}`;
        }
        // Strapi v5 - flat structure
        if (bookData?.image?.url) {
            return `http://localhost:1337${bookData.image.url}`;
        }
        // Fallback محلي (يجب وضع صورة في public/)
        return "/default-book.jpg";
    }, [bookData]);
    
    // ===== استخراج التصنيفات =====
    const categories = useMemo(() => {
        return (
            bookData?.categories?.data ||
            bookData?.categories ||
            bookData?.category_ids ||
            []
        );
    }, [bookData]);
    
    // ===== حساب الخصم =====
    const hasDiscount = bookData?.oldPrice && bookData.oldPrice > bookData.price;
    const discountPercent = hasDiscount
        ? Math.round(
            ((bookData.oldPrice - bookData.price) / bookData.oldPrice) * 100
        )
        : 0;
    
    // ===== التقييم وعدد المراجعات (ثابتة - لا تتغير عند re-render) =====
    const rating = bookData?.rating || 4.5;
    const reviewsCount = useMemo(() => {
        // يستخدم القيمة من API أو رقم ثابت مبني على ID (وليس Math.random)
        return bookData?.reviewsCount || (bookId ? (parseInt(bookId.toString().slice(-2), 16) % 200) + 50 : 100);
    }, [bookData?.reviewsCount, bookId]);
    
    // ===== حالة التوفر =====
    const stock = bookData?.stock ?? bookData?.quantity ?? 10;
    const isOutOfStock = stock === 0;
    const isLowStock = stock > 0 && stock < 5;
    
    // ===== فتح العرض السريع =====
    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(book);
    };
    
    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!bookId) return;
        
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let newWishlist;
        
        if (isWishlisted) {
            newWishlist = wishlist.filter(id => id !== bookId);
        } else {
            newWishlist = [...wishlist, bookId];
        }
        
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        
        // ===== 🆕 إرسال event لتحديث Navbar =====
        window.dispatchEvent(new Event('wishlistUpdated'));
        
        setIsWishlisted(!isWishlisted);
    };
    
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isOutOfStock) return;
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === bookId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: bookId,
                title: bookData.Title,
                price: bookData.price,
                image: imageUrl,
                quantity: 1,
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // ===== 🆕 إرسال event لتحديث Navbar =====
        window.dispatchEvent(new Event('cartUpdated'));
        
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };
    
    // ===== منع انتشار الحدث (للروابط الداخلية) =====
    const handleActionClick = (e) => {
        e.stopPropagation();
    };
    
    // ===== Guard Clause =====
    if (!bookData) return null;
    
    return (
        <article className={`book-card ${isOutOfStock ? 'book-card--out-of-stock' : ''}`}>
            {/* ===== Badges العلوية ===== */}
            <div className="book-badges">
                {hasDiscount && (
                    <span className="book-badge book-badge--discount">
                        -{discountPercent}%
                    </span>
                )}
                {bookData.isNew && (
                    <span className="book-badge book-badge--new">جديد</span>
                )}
                {bookData.isBestseller && (
                    <span className="book-badge book-badge--bestseller">
                        الأكثر مبيعاً
                    </span>
                )}
                {isOutOfStock && (
                    <span className="book-badge book-badge--out-of-stock">
                        نفذت الكمية
                    </span>
                )}
                {isLowStock && !isOutOfStock && (
                    <span className="book-badge book-badge--low-stock">
                        كمية محدودة
                    </span>
                )}
            </div>
            
            {/* ===== أزرار التفاعل العائمة ===== */}
            <div className="book-actions">
                <button
                    className={`book-action-btn book-action-btn--wishlist ${
                        isWishlisted ? "active" : ""
                    }`}
                    onClick={handleWishlist}
                    aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                    {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
                
                <button
                    className="book-action-btn book-action-btn--quickview"
                    onClick={handleQuickView}
                    aria-label="عرض سريع"
                    title="عرض سريع"
                >
                    <FaEye />
                </button>
            </div>
            
            {/* ===== صورة الغلاف ===== */}
            <Link
                to={`/book/${bookId}`}
                className="book-cover-link"
                aria-label={`عرض تفاصيل: ${bookData.Title}`}
            >
                <div className="book-cover-wrapper">
                    {!imageLoaded && !imageError && (
                        <div className="book-cover-skeleton"></div>
                    )}
                    
                    <img
                        src={imageError ? "/default-book.jpg" : imageUrl}
                        alt={bookData.Title || "غلاف الكتاب"}
                        className={`book-cover ${imageLoaded ? "loaded" : ""}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => {
                            setImageError(true);
                            setImageLoaded(true);
                        }}
                    />
                    
                    {/* Overlay عند الـ Hover */}
                    <div className="book-cover-overlay">
                        <span className="book-cover-overlay-text">
                            <FaEye /> عرض التفاصيل
                        </span>
                    </div>
                </div>
            </Link>
            
            {/* ===== معلومات الكتاب ===== */}
            <div className="book-info">
                {/* التصنيفات */}
                {categories.length > 0 && (
                    <div className="book-categories">
                        {categories.slice(0, 1).map((cat, index) => {
                            const catData = cat?.attributes || cat;
                            const catId = catData?.documentId || catData?.id;
                            const catName = catData?.name || catData?.Title || "تصنيف";
                            
                            return (
                                <Link
                                    key={catId || index}
                                    to={`/category/${catId}`}
                                    className="book-category-tag"
                                    onClick={handleActionClick}
                                >
                                    {catName}
                                </Link>
                            );
                        })}
                    </div>
                )}
                
                {/* العنوان */}
                <Link
                    to={`/book/${bookId}`}
                    className="book-title-link"
                >
                    <h3 className="book-title">{bookData.Title}</h3>
                </Link>
                
                {/* المؤلف */}
                <p className="book-author">
                    <span className="book-author-label">تأليف:</span>
                    {bookData.author || "مؤلف غير معروف"}
                </p>
                
                {/* التقييم التفاعلي */}
                <div className="book-rating-wrapper">
                    <StarRating
                        averageRating={rating}
                        totalReviews={reviewsCount}
                        bookId={bookId}
                        size="sm"
                        interactive={true}
                        onRate={(value) => {
                            // TODO: إرسال التقييم للـ API
                            console.info(`📊 تقييم: ${bookData.Title} = ${value}/5`);
                        }}
                    />
                </div>
                
                {/* السعر والإجراءات */}
                <div className="book-footer">
                    <div className="book-price-block">
                        <span className="book-price-current">
                            ${bookData.price || 0}
                        </span>
                        {hasDiscount && (
                            <span className="book-price-old">
                                ${bookData.oldPrice}
                            </span>
                        )}
                    </div>
                    
                    <button
                        className={`book-cart-btn ${addedToCart ? 'book-cart-btn--added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        aria-label={isOutOfStock ? "نفذت الكمية" : "إضافة إلى السلة"}
                    >
                        {addedToCart ? (
                            <>
                                <FaCheck />
                                <span>تمت الإضافة</span>
                            </>
                        ) : (
                            <>
                                <FaShoppingCart />
                                <span>{isOutOfStock ? 'غير متوفر' : 'أضف للسلة'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default Book;