import { createContext, useState, useContext, useEffect, useCallback } from "react";

export const QuickViewContext = createContext(null);

export const QuickViewProvider = ({ children }) => {
    // ===== الحالات الأساسية =====
    const [selectedBook, setSelectedBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // ===== استنتاج حالة الفتح =====
    const isOpen = selectedBook !== null;
    
    // ===== فتح العرض السريع =====
    const openQuickView = useCallback((book) => {
        if (!book) {
            console.warn("⚠️ openQuickView: لم يتم تمرير كتاب");
            return;
        }
        setSelectedBook(book);
    }, []);
    
    // ===== إغلاق العرض السريع =====
    const closeQuickView = useCallback(() => {
        setSelectedBook(null);
        setIsLoading(false);
    }, []);
    
    // ===== تحديث الكتاب الحالي (للتنقل بين الكتب داخل Modal) =====
    const updateQuickView = useCallback((book) => {
        if (!book) return;
        setIsLoading(true);
        // محاكاة تأخير صغير لتأثير التحميل
        setTimeout(() => {
            setSelectedBook(book);
            setIsLoading(false);
        }, 200);
    }, []);
    
    // ===== منع Scroll الصفحة عند فتح Modal =====
    useEffect(() => {
        if (isOpen) {
            // حفظ موضع التمرير الحالي
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            return () => {
                // استعادة موضع التمرير عند الإغلاق
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);
    
    // ===== إغلاق Modal عند الضغط على Escape =====
    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeQuickView();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeQuickView]);
    
    // ===== القيمة المُمررة للسياق =====
    const value = {
        selectedBook,
        isOpen,
        isLoading,
        openQuickView,
        closeQuickView,
        updateQuickView,
    };
    
    return (
        <QuickViewContext.Provider value={value}>
            {children}
        </QuickViewContext.Provider>
    );
};

// ✅ Custom Hook آمن للاستخدام
export const useQuickView = () => {
    const context = useContext(QuickViewContext);
    
    if (!context) {
        throw new Error(
            "❌ useQuickView يجب أن يُستخدم داخل QuickViewProvider. " +
            "تأكد من تغليف التطبيق بـ <QuickViewProvider>"
        );
    }
    
    return context;
};