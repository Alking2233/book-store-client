import axios from "axios";

// ============================================================================
// 🌐 إعدادات API - "شروق المعرفة"
// ============================================================================

// ===== الإعدادات الأساسية =====
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";
const API_BASE = `${API_URL}/api`;
const API_TIMEOUT = 15000; // 15 ثانية

// ===== Token Management =====
const TOKEN_KEY = "auth_token";

const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

const setToken = (token) => {
    try {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    } catch (error) {
        console.warn("⚠️ لا يمكن حفظ Token:", error);
    }
};

// ============================================================================
// 🔌 إنشاء Axios Instance
// ============================================================================

const api = axios.create({
    baseURL: API_BASE,
    timeout: API_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ============================================================================
// 📥 Request Interceptor (قبل إرسال الطلب)
// ============================================================================

api.interceptors.request.use(
    (config) => {
        // إضافة Token تلقائياً (إن وُجد)
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log في وضع التطوير فقط
        if (import.meta.env.DEV) {
            console.log(
                `🚀 [API] ${config.method?.toUpperCase()} ${config.url}`,
                config.params || config.data || ""
            );
        }
        
        return config;
    },
    (error) => {
        console.error("❌ [API Request Error]:", error);
        return Promise.reject(error);
    }
);

// ============================================================================
// 📤 Response Interceptor (بعد استلام الرد)
// ============================================================================

api.interceptors.response.use(
    (response) => {
        // Log في وضع التطوير
        if (import.meta.env.DEV) {
            console.log(
                `✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url}`,
                response.status
            );
        }
        
        return response;
    },
    (error) => {
        // معالجة الأخطاء بشكل موحّد
        if (error.response) {
            const { status, data } = error.response;
            
            const errorMessage = 
                data?.error?.message ||
                data?.message ||
                "حدث خطأ غير متوقع";
            
            switch (status) {
                case 400:
                    console.error("❌ [400] طلب غير صحيح:", errorMessage);
                    break;
                
                case 401:
                    console.error("🔒 [401] غير مصرّح:", errorMessage);
                    // مسح Token المنتهي
                    setToken(null);
                    // يمكن إضافة redirect للـ login هنا لاحقاً
                    break;
                
                case 403:
                    console.error("🚫 [403] ممنوع الوصول:", errorMessage);
                    break;
                
                case 404:
                    console.error("🔍 [404] غير موجود:", errorMessage);
                    break;
                
                case 429:
                    console.error("⏱️ [429] طلبات كثيرة:", errorMessage);
                    break;
                
                case 500:
                    console.error("💥 [500] خطأ في الخادم:", errorMessage);
                    break;
                
                default:
                    console.error(`❌ [${status}] ${errorMessage}`);
            }
        } else if (error.request) {
            // الطلب أُرسل لكن لم يصل رد
            if (error.code === "ECONNABORTED") {
                console.error("⏱️ انتهت مهلة الطلب (Timeout)");
            } else {
                console.error("🌐 لا يمكن الاتصال بالخادم");
            }
        } else {
            // خطأ في إعداد الطلب
            console.error("❌ خطأ في الطلب:", error.message);
        }
        
        return Promise.reject(error);
    }
);

// ============================================================================
// 🛠️ Helper Functions
// ============================================================================

/**
 * تحويل مسار الصورة النسبي إلى URL كامل
 * @param {string} path - مسار الصورة (/uploads/...)
 * @returns {string} URL كامل
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
};

/**
 * استخراج URL الصورة من بيانات Strapi
 * يدعم Strapi v4 (مع .data.attributes) و v5 (flat)
 */
export const extractImageUrl = (imageField) => {
    if (!imageField) return null;
    
    const url = 
        imageField?.data?.attributes?.url ||  // Strapi v4
        imageField?.url ||                    // Strapi v5
        imageField?.formats?.medium?.url ||   // مقاسات
        null;
    
    return getImageUrl(url);
};

/**
 * بناء query string لـ Strapi
 * @param {object} params - { populate, filters, sort, pagination }
 */
export const buildStrapiQuery = (params = {}) => {
    const query = new URLSearchParams();
    
    // populate
    if (params.populate) {
        if (Array.isArray(params.populate)) {
            params.populate.forEach((field, i) => {
                query.append(`populate[${i}]`, field);
            });
        } else if (params.populate === "*") {
            query.append("populate", "*");
        } else if (typeof params.populate === "string") {
            query.append("populate", params.populate);
        }
    }
    
    // pagination
    if (params.page) {
        query.append("pagination[page]", params.page);
    }
    if (params.pageSize) {
        query.append("pagination[pageSize]", params.pageSize);
    }
    
    // sort
    if (params.sort) {
        query.append("sort", params.sort);
    }
    
    // filters
    if (params.filters && typeof params.filters === "object") {
        Object.entries(params.filters).forEach(([key, value]) => {
            query.append(`filters[${key}]`, value);
        });
    }
    
    return query.toString();
};

// ============================================================================
// 🔐 دوال المصادقة (للاستخدام المستقبلي)
// ============================================================================

export const auth = {
    getToken,
    setToken,
    isAuthenticated: () => !!getToken(),
    logout: () => setToken(null),
};

// ============================================================================
// 📤 التصدير
// ============================================================================

// تصدير الـ URLs (للاستخدام في الصور وغيرها)
export const API_URLS = {
    base: API_URL,
    api: API_BASE,
};

// تصدير الـ instance الأساسي
export default api;