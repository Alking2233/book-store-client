import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

/**
 * مكون التقييم التفاعلي بالنجوم
 * 
 * @param {number} initialRating - التقييم الأولي (افتراضي: 0)
 * @param {number} averageRating - متوسط التقييم العام
 * @param {number} totalReviews - عدد المراجعات
 * @param {boolean} interactive - هل يمكن التفاعل؟ (افتراضي: true)
 * @param {string} size - حجم النجوم: 'sm' | 'md' | 'lg'
 * @param {function} onRate - دالة تُستدعى عند التقييم
 * @param {string} bookId - معرّف الكتاب (للحفظ في localStorage)
 */
function StarRating({ 
    initialRating = 0,
    averageRating = 4.5,
    totalReviews = 0,
    interactive = true,
    size = 'sm',
    onRate,
    bookId
}) {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [isRated, setIsRated] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [sparkles, setSparkles] = useState([]);

    // استرجاع التقييم المحفوظ من localStorage
    useEffect(() => {
        if (bookId) {
            const savedRating = localStorage.getItem(`rating_${bookId}`);
            if (savedRating) {
                setRating(parseInt(savedRating));
                setIsRated(true);
            }
        }
    }, [bookId]);

    const handleClick = (e, value) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!interactive) return;

        setRating(value);
        setIsRated(true);
        
        // حفظ في localStorage
        if (bookId) {
            localStorage.setItem(`rating_${bookId}`, value.toString());
        }

        // إنشاء تأثير التلألؤ
        createSparkles(e);

        // إظهار رسالة شكر
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 2000);

        // استدعاء callback
        if (onRate) onRate(value);
    };

    const handleMouseEnter = (e, value) => {
        e.stopPropagation();
        if (interactive) setHoverRating(value);
    };

    const handleMouseLeave = (e) => {
        e.stopPropagation();
        if (interactive) setHoverRating(0);
    };

    // إنشاء جزيئات التلألؤ
    const createSparkles = (e) => {
        const newSparkles = [];
        for (let i = 0; i < 8; i++) {
            newSparkles.push({
                id: Date.now() + i,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                delay: Math.random() * 0.3,
            });
        }
        setSparkles(newSparkles);
        setTimeout(() => setSparkles([]), 1000);
    };

    const displayRating = hoverRating || rating;

    return (
        <div 
            className={`star-rating star-rating--${size} ${interactive ? 'interactive' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* النجوم */}
            <div className="star-rating-stars">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        className={`star-rating-btn ${value <= displayRating ? 'filled' : 'empty'} ${isRated ? 'rated' : ''}`}
                        onClick={(e) => handleClick(e, value)}
                        onMouseEnter={(e) => handleMouseEnter(e, value)}
                        onMouseLeave={handleMouseLeave}
                        disabled={!interactive}
                        aria-label={`قيّم ${value} من 5`}
                        title={`${value} نجوم`}
                    >
                        <FaStar />
                        
                        {/* تأثير التلألؤ عند النقر */}
                        {isRated && value <= rating && sparkles.length > 0 && (
                            <span className="sparkles-container">
                                {sparkles.map((sparkle) => (
                                    <span
                                        key={sparkle.id}
                                        className="sparkle"
                                        style={{
                                            '--x': `${sparkle.x}px`,
                                            '--y': `${sparkle.y}px`,
                                            '--delay': `${sparkle.delay}s`,
                                        }}
                                    />
                                ))}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* معلومات التقييم */}
            <div className="star-rating-info">
                {isRated ? (
                    <span className="star-rating-user">
                        تقييمك: <strong>{rating}</strong>
                    </span>
                ) : (
                    <>
                        <span className="star-rating-value">
                            {averageRating.toFixed(1)}
                        </span>
                        {totalReviews > 0 && (
                            <span className="star-rating-count">
                                ({totalReviews})
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* رسالة شكر بعد التقييم */}
            {showThankYou && (
                <div className="star-rating-thanks">
                    <span>✨ شكراً لك! ✨</span>
                </div>
            )}
        </div>
    );
}

export default StarRating;