import { createContext, useEffect, useState, useContext, useCallback } from "react";

export const ThemeContext = createContext(null);

// ===== الثوابت =====
const THEME_STORAGE_KEY = "theme";
const VALID_THEMES = ["light", "dark"];

// ===== دوال مساعدة =====
const getSystemTheme = () => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light";
};

const getStoredTheme = () => {
    if (typeof window === "undefined") return null;
    
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        return VALID_THEMES.includes(saved) ? saved : null;
    } catch {
        return null;
    }
};

const getInitialTheme = () => {
    return getStoredTheme() || getSystemTheme();
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);
    const [isSystemTheme, setIsSystemTheme] = useState(() => !getStoredTheme());
    
    // ===== تطبيق الـ Theme على HTML =====
    useEffect(() => {
        const html = document.documentElement;
        
        // تطبيق الـ Theme
        html.setAttribute("data-bs-theme", theme);
        
        // تعيين dir و lang مرة واحدة فقط (إذا لم يتم تعيينهما)
        if (html.getAttribute("dir") !== "rtl") {
            html.setAttribute("dir", "rtl");
        }
        if (html.getAttribute("lang") !== "ar") {
            html.setAttribute("lang", "ar");
        }
        
        // حفظ في localStorage (فقط إذا لم يكن system theme)
        try {
            if (!isSystemTheme) {
                localStorage.setItem(THEME_STORAGE_KEY, theme);
            }
        } catch (error) {
            console.warn("⚠️ لا يمكن حفظ الـ Theme في localStorage:", error);
        }
    }, [theme, isSystemTheme]);
    
    // ===== الاستماع لتغييرات تفضيل النظام =====
    useEffect(() => {
        if (!isSystemTheme) return; // فقط إذا كان المستخدم يتبع النظام
        
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const handleSystemChange = (e) => {
            setThemeState(e.matches ? "dark" : "light");
        };
        
        // دعم الـ browsers الحديثة والقديمة
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleSystemChange);
            return () => mediaQuery.removeEventListener("change", handleSystemChange);
        } else {
            // Fallback للمتصفحات القديمة (Safari < 14)
            mediaQuery.addListener(handleSystemChange);
            return () => mediaQuery.removeListener(handleSystemChange);
        }
    }, [isSystemTheme]);
    
    // ===== التزامن بين عدة Tabs =====
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === THEME_STORAGE_KEY) {
                if (e.newValue && VALID_THEMES.includes(e.newValue)) {
                    setThemeState(e.newValue);
                    setIsSystemTheme(false);
                } else if (e.newValue === null) {
                    // المستخدم مسح الإعداد → نعود للنظام
                    setIsSystemTheme(true);
                    setThemeState(getSystemTheme());
                }
            }
        };
        
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);
    
    // ===== تبديل بين Light و Dark =====
    const toggleTheme = useCallback(() => {
        setIsSystemTheme(false);
        setThemeState((prev) => (prev === "light" ? "dark" : "light"));
    }, []);
    
    // ===== تعيين Theme محدد =====
    const setTheme = useCallback((newTheme) => {
        if (!VALID_THEMES.includes(newTheme)) {
            console.warn(`⚠️ Theme غير صالح: "${newTheme}". المسموح: ${VALID_THEMES.join(", ")}`);
            return;
        }
        setIsSystemTheme(false);
        setThemeState(newTheme);
    }, []);
    
    // ===== العودة لإعدادات النظام =====
    const useSystemTheme = useCallback(() => {
        try {
            localStorage.removeItem(THEME_STORAGE_KEY);
        } catch {
            // تجاهل الخطأ
        }
        setIsSystemTheme(true);
        setThemeState(getSystemTheme());
    }, []);
    
    // ===== القيمة المُمررة =====
    const value = {
        theme,                  // "light" | "dark"
        isLight: theme === "light",
        isDark: theme === "dark",
        isSystemTheme,          // هل يتبع النظام؟
        toggleTheme,            // تبديل سريع
        setTheme,               // تعيين محدد
        useSystemTheme,         // العودة للنظام
    };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// ===== Custom Hook آمن =====
export const useTheme = () => {
    const context = useContext(ThemeContext);
    
    if (!context) {
        throw new Error(
            "❌ useTheme يجب أن يُستخدم داخل ThemeProvider. " +
            "تأكد من تغليف التطبيق بـ <ThemeProvider>"
        );
    }
    
    return context;
};