import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUser,
    FaShoppingBag,
    FaHeart,
    FaCog,
    FaSignOutAlt,
    FaEdit,
    FaSave,
    FaTimes,
    FaHome,
    FaArrowRight,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaExclamationCircle,
    FaBookOpen,
    FaShoppingCart,
    FaTrash,
    FaEye,
    FaLock,
    FaBell,
    FaMoon,
    FaSun,
    FaGlobe,
    FaCamera,
    FaTruck,
    FaClock,
    FaTimesCircle,
    FaInfoCircle,
} from "react-icons/fa";

import { useTheme } from "../../../context/ThemeContext";
import "./Account.css";

function Account() {
    const navigate = useNavigate();
    const { theme, toggleTheme, isDark } = useTheme();
    
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [wishlistItems, setWishlistItems] = useState([]);
    
    // ===== بيانات المستخدم (من localStorage) =====
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        joinDate: "",
        avatar: "",
    });
    
    const [editForm, setEditForm] = useState({});
    const [errors, setErrors] = useState({});
    
    // ===== الإعدادات =====
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        newsletter: true,
        language: "ar",
    });
    
    // ===== تحميل البيانات =====
    useEffect(() => {
        loadUserData();
        loadWishlist();
        loadSettings();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    
    const loadUserData = () => {
        try {
            const saved = JSON.parse(localStorage.getItem("user_profile") || "null");
            if (saved) {
                setUserData(saved);
                setEditForm(saved);
            } else {
                // بيانات افتراضية
                const defaultData = {
                    name: "زائر كريم",
                    email: "guest@example.com",
                    phone: "",
                    address: "",
                    city: "الرياض",
                    joinDate: new Date().toISOString(),
                    avatar: "",
                };
                setUserData(defaultData);
                setEditForm(defaultData);
            }
        } catch {
            // تجاهل
        }
    };
    
    const loadWishlist = () => {
        try {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setWishlistItems(wishlist);
        } catch {
            setWishlistItems([]);
        }
    };
    
    const loadSettings = () => {
        try {
            const saved = JSON.parse(localStorage.getItem("user_settings") || "null");
            if (saved) setSettings(saved);
        } catch {
            // تجاهل
        }
    };
    
    // ===== التعديل =====
    const handleEdit = () => {
        setEditForm(userData);
        setIsEditing(true);
        setErrors({});
    };
    
    const handleCancelEdit = () => {
        setEditForm(userData);
        setIsEditing(false);
        setErrors({});
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!editForm.name?.trim()) {
            newErrors.name = "الاسم مطلوب";
        }
        
        if (!editForm.email?.trim()) {
            newErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
            newErrors.email = "صيغة البريد غير صحيحة";
        }
        
        if (editForm.phone && !/^[+]?[\d\s-]{8,15}$/.test(editForm.phone)) {
            newErrors.phone = "رقم الهاتف غير صحيح";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSave = () => {
        if (!validateForm()) return;
        
        const updated = {
            ...editForm,
            joinDate: userData.joinDate || new Date().toISOString(),
        };
        
        setUserData(updated);
        localStorage.setItem("user_profile", JSON.stringify(updated));
        setIsEditing(false);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 3000);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };
    
    // ===== الإعدادات =====
    const handleSettingChange = (key, value) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        localStorage.setItem("user_settings", JSON.stringify(updated));
    };
    
    // ===== المفضلة =====
    const removeFromWishlist = (id) => {
        const updated = wishlistItems.filter((item) => item !== id);
        setWishlistItems(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };
    
    // ===== تسجيل الخروج =====
    const handleLogout = () => {
        if (window.confirm("هل أنت متأكد من تسجيل الخروج؟\nسيتم مسح بياناتك المحلية.")) {
            localStorage.removeItem("user_profile");
            localStorage.removeItem("user_settings");
            navigate("/");
        }
    };
    
    // ===== الطلبات (محاكاة) =====
    const orders = [
        {
            id: "ORD-2024-001",
            date: "2024-11-15",
            status: "delivered",
            total: 285,
            items: 3,
        },
        {
            id: "ORD-2024-002",
            date: "2024-11-20",
            status: "shipping",
            total: 150,
            items: 2,
        },
        {
            id: "ORD-2024-003",
            date: "2024-11-25",
            status: "pending",
            total: 95,
            items: 1,
        },
    ];
    
    const getStatusInfo = (status) => {
        switch (status) {
            case "delivered":
                return { 
                    label: "تم التوصيل", 
                    icon: FaCheckCircle, 
                    color: "success",
                };
            case "shipping":
                return { 
                    label: "قيد الشحن", 
                    icon: FaTruck, 
                    color: "info",
                };
            case "pending":
                return { 
                    label: "قيد المعالجة", 
                    icon: FaClock, 
                    color: "warning",
                };
            case "cancelled":
                return { 
                    label: "ملغي", 
                    icon: FaTimesCircle, 
                    color: "error",
                };
            default:
                return { 
                    label: status, 
                    icon: FaInfoCircle, 
                    color: "muted",
                };
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return "—";
        }
    };
    
    // ===== Tabs =====
    const tabs = [
        { id: "profile", label: "الملف الشخصي", icon: FaUser },
        { id: "orders", label: "طلباتي", icon: FaShoppingBag, badge: orders.length },
        { id: "wishlist", label: "المفضلة", icon: FaHeart, badge: wishlistItems.length },
        { id: "settings", label: "الإعدادات", icon: FaCog },
    ];
    
    return (
        <main className="account-page">
            <div className="acc-container">
                {/* Breadcrumb */}
                <nav className="acc-breadcrumb" aria-label="مسار التنقل">
                    <Link to="/" className="acc-breadcrumb-item">
                        <FaHome />
                        <span>الرئيسية</span>
                    </Link>
                    <FaArrowRight className="acc-breadcrumb-separator" />
                    <span className="acc-breadcrumb-item acc-breadcrumb-current">
                        <FaUser />
                        <span>حسابي</span>
                    </span>
                </nav>
                
                {/* Main Grid */}
                <div className="acc-main">
                    {/* ===== Sidebar ===== */}
                    <aside className="acc-sidebar">
                        {/* User Card */}
                        <div className="acc-user-card">
                            <div className="acc-avatar">
                                {userData.avatar ? (
                                    <img src={userData.avatar} alt={userData.name} />
                                ) : (
                                    <span>{userData.name?.charAt(0) || "U"}</span>
                                )}
                                <button className="acc-avatar-edit" aria-label="تغيير الصورة">
                                    <FaCamera />
                                </button>
                            </div>
                            
                            <h3 className="acc-user-name">{userData.name}</h3>
                            <p className="acc-user-email">{userData.email}</p>
                            
                            {userData.joinDate && (
                                <p class="acc-user-joined">
                                    <FaCalendarAlt />
                                    عضو منذ {formatDate(userData.joinDate)}
                                </p>
                            )}
                        </div>
                        
                        {/* Tabs */}
                        <nav className="acc-tabs">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        className={`acc-tab ${activeTab === tab.id ? "active" : ""}`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <Icon />
                                        <span>{tab.label}</span>
                                        {tab.badge !== undefined && tab.badge > 0 && (
                                            <span className="acc-tab-badge">{tab.badge}</span>
                                        )}
                                    </button>
                                );
                            })}
                            
                            <button
                                className="acc-tab acc-tab--logout"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt />
                                <span>تسجيل الخروج</span>
                            </button>
                        </nav>
                    </aside>
                    
                    {/* ===== Content ===== */}
                    <div className="acc-content">
                        {/* ===== Profile Tab ===== */}
                        {activeTab === "profile" && (
                            <div className="acc-tab-content">
                                <div className="acc-tab-header">
                                    <div>
                                        <h2 className="acc-tab-title">
                                            <FaUser />
                                            الملف الشخصي
                                        </h2>
                                        <p className="acc-tab-subtitle">
                                            إدارة معلوماتك الشخصية
                                        </p>
                                    </div>
                                    
                                    {!isEditing ? (
                                        <button
                                            className="acc-btn acc-btn--primary"
                                            onClick={handleEdit}
                                        >
                                            <FaEdit />
                                            تعديل
                                        </button>
                                    ) : (
                                        <div className="acc-actions-group">
                                            <button
                                                className="acc-btn acc-btn--outline"
                                                onClick={handleCancelEdit}
                                            >
                                                <FaTimes />
                                                إلغاء
                                            </button>
                                            <button
                                                className="acc-btn acc-btn--primary"
                                                onClick={handleSave}
                                            >
                                                <FaSave />
                                                حفظ
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Save Message */}
                                {saveStatus === "success" && (
                                    <div className="acc-message acc-message--success">
                                        <FaCheckCircle />
                                        <span>تم حفظ التغييرات بنجاح! 🎉</span>
                                    </div>
                                )}
                                
                                {/* Profile Form */}
                                <div className="acc-form">
                                    {/* Name */}
                                    <div className="acc-form-group">
                                        <label className="acc-form-label">
                                            <FaUser />
                                            الاسم الكامل
                                        </label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className={`acc-form-input ${errors.name ? "has-error" : ""}`}
                                                    value={editForm.name || ""}
                                                    onChange={handleInputChange}
                                                    placeholder="أدخل اسمك الكامل"
                                                />
                                                {errors.name && (
                                                    <span className="acc-form-error">
                                                        <FaExclamationCircle />
                                                        {errors.name}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <div className="acc-form-value">{userData.name || "—"}</div>
                                        )}
                                    </div>
                                    
                                    {/* Email */}
                                    <div className="acc-form-group">
                                        <label className="acc-form-label">
                                            <FaEnvelope />
                                            البريد الإلكتروني
                                        </label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={`acc-form-input ${errors.email ? "has-error" : ""}`}
                                                    value={editForm.email || ""}
                                                    onChange={handleInputChange}
                                                    placeholder="example@email.com"
                                                />
                                                {errors.email && (
                                                    <span className="acc-form-error">
                                                        <FaExclamationCircle />
                                                        {errors.email}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <div className="acc-form-value">{userData.email || "—"}</div>
                                        )}
                                    </div>
                                    
                                    {/* Phone */}
                                    <div className="acc-form-group">
                                        <label className="acc-form-label">
                                            <FaPhone />
                                            رقم الهاتف
                                        </label>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={`acc-form-input ${errors.phone ? "has-error" : ""}`}
                                                    value={editForm.phone || ""}
                                                    onChange={handleInputChange}
                                                    placeholder="+966 12 345 6789"
                                                />
                                                {errors.phone && (
                                                    <span className="acc-form-error">
                                                        <FaExclamationCircle />
                                                        {errors.phone}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <div className="acc-form-value">
                                                {userData.phone || "لم يتم الإضافة"}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* City */}
                                    <div className="acc-form-group">
                                        <label className="acc-form-label">
                                            <FaMapMarkerAlt />
                                            المدينة
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="city"
                                                className="acc-form-input"
                                                value={editForm.city || ""}
                                                onChange={handleInputChange}
                                                placeholder="الرياض"
                                            />
                                        ) : (
                                            <div className="acc-form-value">{userData.city || "—"}</div>
                                        )}
                                    </div>
                                    
                                    {/* Address - Full Width */}
                                    <div className="acc-form-group acc-form-group--full">
                                        <label className="acc-form-label">
                                            <FaMapMarkerAlt />
                                            العنوان التفصيلي
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                name="address"
                                                className="acc-form-textarea"
                                                value={editForm.address || ""}
                                                onChange={handleInputChange}
                                                placeholder="الحي، الشارع، رقم المبنى..."
                                                rows="3"
                                            />
                                        ) : (
                                            <div className="acc-form-value">
                                                {userData.address || "لم يتم الإضافة"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* ===== Orders Tab ===== */}
                        {activeTab === "orders" && (
                            <div className="acc-tab-content">
                                <div className="acc-tab-header">
                                    <div>
                                        <h2 className="acc-tab-title">
                                            <FaShoppingBag />
                                            طلباتي
                                        </h2>
                                        <p className="acc-tab-subtitle">
                                            تتبع جميع طلباتك
                                        </p>
                                    </div>
                                </div>
                                
                                {orders.length === 0 ? (
                                    <div className="acc-empty">
                                        <div className="acc-empty-icon">
                                            <FaShoppingBag />
                                        </div>
                                        <h3>لا توجد طلبات بعد</h3>
                                        <p>ابدأ التسوق واطلب أول كتاب لك!</p>
                                        <Link to="/books" className="acc-btn acc-btn--primary">
                                            <FaBookOpen />
                                            تصفّح الكتب
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="acc-orders">
                                        {orders.map((order) => {
                                            const statusInfo = getStatusInfo(order.status);
                                            const StatusIcon = statusInfo.icon;
                                            
                                            return (
                                                <div key={order.id} className="acc-order-card">
                                                    <div className="acc-order-header">
                                                        <div>
                                                            <h4 className="acc-order-id">
                                                                #{order.id}
                                                            </h4>
                                                            <p className="acc-order-date">
                                                                <FaCalendarAlt />
                                                                {formatDate(order.date)}
                                                            </p>
                                                        </div>
                                                        
                                                        <span className={`acc-order-status acc-order-status--${statusInfo.color}`}>
                                                            <StatusIcon />
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="acc-order-body">
                                                        <div className="acc-order-info">
                                                            <span className="acc-order-info-label">عدد الكتب</span>
                                                            <strong>{order.items} كتاب</strong>
                                                        </div>
                                                        
                                                        <div className="acc-order-info">
                                                            <span className="acc-order-info-label">الإجمالي</span>
                                                            <strong className="acc-order-total">
                                                                {order.total} ريال
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="acc-order-footer">
                                                        <button className="acc-order-btn">
                                                            <FaEye />
                                                            عرض التفاصيل
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* ===== Wishlist Tab ===== */}
                        {activeTab === "wishlist" && (
                            <div className="acc-tab-content">
                                <div className="acc-tab-header">
                                    <div>
                                        <h2 className="acc-tab-title">
                                            <FaHeart />
                                            قائمة المفضلة
                                        </h2>
                                        <p className="acc-tab-subtitle">
                                            الكتب التي أضفتها للمفضلة
                                        </p>
                                    </div>
                                </div>
                                
                                {wishlistItems.length === 0 ? (
                                    <div className="acc-empty">
                                        <div className="acc-empty-icon">
                                            <FaHeart />
                                        </div>
                                        <h3>قائمة المفضلة فارغة</h3>
                                        <p>أضف كتبك المفضلة من خلال زر القلب على البطاقات</p>
                                        <Link to="/books" className="acc-btn acc-btn--primary">
                                            <FaBookOpen />
                                            تصفّح الكتب
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="acc-wishlist">
                                        <p className="acc-wishlist-info">
                                            لديك <strong>{wishlistItems.length}</strong> كتاب في قائمة المفضلة
                                        </p>
                                        
                                        <div className="acc-wishlist-grid">
                                            {wishlistItems.map((id) => (
                                                <div key={id} className="acc-wishlist-item">
                                                    <div className="acc-wishlist-item-info">
                                                        <FaHeart className="acc-wishlist-heart" />
                                                        <span>كتاب رقم: {id}</span>
                                                    </div>
                                                    
                                                    <div className="acc-wishlist-actions">
                                                        <Link
                                                            to={`/book/${id}`}
                                                            className="acc-wishlist-btn"
                                                        >
                                                            <FaEye />
                                                            عرض
                                                        </Link>
                                                        <button
                                                            className="acc-wishlist-remove"
                                                            onClick={() => removeFromWishlist(id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* ===== Settings Tab ===== */}
                        {activeTab === "settings" && (
                            <div className="acc-tab-content">
                                <div className="acc-tab-header">
                                    <div>
                                        <h2 className="acc-tab-title">
                                            <FaCog />
                                            الإعدادات
                                        </h2>
                                        <p className="acc-tab-subtitle">
                                            تخصيص تجربتك في الموقع
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="acc-settings">
                                    {/* Theme */}
                                    <div className="acc-setting-card">
                                        <div className="acc-setting-info">
                                            <div className="acc-setting-icon">
                                                {isDark ? <FaMoon /> : <FaSun />}
                                            </div>
                                            <div>
                                                <h4>المظهر</h4>
                                                <p>اختر بين الوضع النهاري والليلي</p>
                                            </div>
                                        </div>
                                        
                                        <button
                                            className="acc-theme-toggle"
                                            onClick={toggleTheme}
                                        >
                                            {isDark ? (
                                                <>
                                                    <FaSun />
                                                    الوضع النهاري
                                                </>
                                            ) : (
                                                <>
                                                    <FaMoon />
                                                    الوضع الليلي
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Email Notifications */}
                                    <div className="acc-setting-card">
                                        <div className="acc-setting-info">
                                            <div className="acc-setting-icon">
                                                <FaEnvelope />
                                            </div>
                                            <div>
                                                <h4>إشعارات البريد الإلكتروني</h4>
                                                <p>تلقي إشعارات عن طلباتك والعروض</p>
                                            </div>
                                        </div>
                                        
                                        <label className="acc-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.emailNotifications}
                                                onChange={(e) =>
                                                    handleSettingChange("emailNotifications", e.target.checked)
                                                }
                                            />
                                            <span className="acc-switch-slider"></span>
                                        </label>
                                    </div>
                                    
                                    {/* SMS Notifications */}
                                    <div className="acc-setting-card">
                                        <div className="acc-setting-info">
                                            <div className="acc-setting-icon">
                                                <FaBell />
                                            </div>
                                            <div>
                                                <h4>إشعارات الرسائل النصية</h4>
                                                <p>تلقي رسائل SMS عند تحديث الطلبات</p>
                                            </div>
                                        </div>
                                        
                                        <label className="acc-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.smsNotifications}
                                                onChange={(e) =>
                                                    handleSettingChange("smsNotifications", e.target.checked)
                                                }
                                            />
                                            <span className="acc-switch-slider"></span>
                                        </label>
                                    </div>
                                    
                                    {/* Newsletter */}
                                    <div className="acc-setting-card">
                                        <div className="acc-setting-info">
                                            <div className="acc-setting-icon">
                                                <FaBookOpen />
                                            </div>
                                            <div>
                                                <h4>النشرة البريدية</h4>
                                                <p>تلقي آخر الأخبار والكتب الجديدة</p>
                                            </div>
                                        </div>
                                        
                                        <label className="acc-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.newsletter}
                                                onChange={(e) =>
                                                    handleSettingChange("newsletter", e.target.checked)
                                                }
                                            />
                                            <span className="acc-switch-slider"></span>
                                        </label>
                                    </div>
                                    
                                    {/* Language */}
                                    <div className="acc-setting-card">
                                        <div className="acc-setting-info">
                                            <div className="acc-setting-icon">
                                                <FaGlobe />
                                            </div>
                                            <div>
                                                <h4>اللغة</h4>
                                                <p>اللغة المفضلة للموقع</p>
                                            </div>
                                        </div>
                                        
                                        <select
                                            className="acc-select"
                                            value={settings.language}
                                            onChange={(e) =>
                                                handleSettingChange("language", e.target.value)
                                            }
                                        >
                                            <option value="ar">العربية</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                    
                                    {/* Privacy & Security */}
                                    <div className="acc-setting-card acc-setting-card--danger">
                                        <div className="acc-setting-info">
                                            <div className="acc-setting-icon acc-setting-icon--danger">
                                                <FaLock />
                                            </div>
                                            <div>
                                                <h4>الخصوصية والأمان</h4>
                                                <p>تغيير كلمة المرور وإعدادات الأمان</p>
                                            </div>
                                        </div>
                                        
                                        <button className="acc-btn acc-btn--outline">
                                            تغيير كلمة المرور
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Account;