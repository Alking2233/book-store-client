import { useState, useEffect, useRef } from 'react';

/**
 * Hook لعمل Counter Animation
 * 
 * @param {number} end - الرقم النهائي
 * @param {number} duration - مدة الانيميشن بالميلي ثانية (افتراضي: 2000)
 * @param {number} start - الرقم الابتدائي (افتراضي: 0)
 * @param {boolean} startOnView - يبدأ عند ظهور العنصر فقط (افتراضي: true)
 * @returns {object} { count, ref }
 */
export const useCountUp = (end, duration = 2000, start = 0, startOnView = true) => {
    const [count, setCount] = useState(start);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!startOnView) {
            startAnimation();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true);
                        startAnimation();
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [end, duration, hasStarted]);

    const startAnimation = () => {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuart) - يبدأ سريع وينتهي بطيء
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            
            const currentCount = start + (end - start) * easedProgress;
            setCount(currentCount);
            
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setCount(end); // التأكد من الوصول للرقم النهائي بدقة
            }
        };
        
        frameRef.current = requestAnimationFrame(animate);
    };

    return { count, ref };
};

/**
 * دالة لتنسيق الأرقام (إضافة K, M, +)
 */
export const formatNumber = (num, suffix = '') => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M${suffix}`;
    } else if (num >= 1000) {
        return `${Math.floor(num / 1000)}K${suffix}`;
    }
    return `${num.toFixed(num % 1 === 0 ? 0 : 1)}${suffix}`;
};