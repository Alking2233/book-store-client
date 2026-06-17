import { useState, useEffect } from "react";
import {
    FaTelegramPlane,
    FaGift,
    FaBook,
    FaBell,
    FaCrown,
    FaExclamationCircle,
    FaCheckCircle,
    FaEnvelope,
    FaShieldAlt,
} from "react-icons/fa";

import api from "../../data/api";
import "./NewsLetter.css";

// ===== دالة التحقق من البريد =====
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// ===== دالة الحصول على رسالة الخطأ =====
const getErrorMessage = (email) => {
    if (!email) return "";
    if (email.length < 5) return "البريد الإلكتروني قصير جداً";
    if (email.length > 100) return "البريد الإلكتروني طويل جداً";
    if (!email.includes("@")) return "البريد يجب أن يحتوي على @";
    if (!validateEmail(email)) return "صيغة البريد الإلكتروني غير صحيحة";
    return "";
};

function NewsLetter() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
    
    // ===== التحقق من اشتراك سابق =====
    useEffect(() => {
        const subscribed = localStorage.getItem("newsletter_subscribed");
        if (subscribed === "true") {
            setIsAlreadySubscribed(true);
        }
    }, []);
    
    // ===== المميزات (4 مميزات بأيقونات مختلفة) =====
    const features = [
        {
            icon: <FaGift />,
            text: "عروض حصرية",
            description: "خصومات خاصة للمشتركين",
        },
        {
            icon: <FaBook />,
            text: "أحدث الإصدارات",
            description: "كن أول من يعرف",
        },
        {
            icon: <FaBell />,
            text: "إشعارات فورية",
            description: "أخبار دور النشر",
        },
        {
            icon: <FaCrown />,
            text: "محتوى مميز",
            description: "مقالات حصرية للمشتركين",
        },
    ];
    
    // ===== Handlers =====
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        if (errorMessage) setErrorMessage("");
        if (isSuccess) {
            setIsSuccess(false);
            setMessage("");
        }
        
        if (isTouched && value) {
            const error = getErrorMessage(value);
            setErrorMessage(error);
        }
    };
    
    const handleBlur = () => {
        setIsTouched(true);
        const error = getErrorMessage(email);
        setErrorMessage(error);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsTouched(true);
        
        if (isLoading || isSuccess) return; // منع double submission
        
        const error = getErrorMessage(email);
        if (error) {
            setErrorMessage(error);
            return;
        }
        
        setIsLoading(true);
        setMessage("");
        setErrorMessage("");
        
        try {
            await api.post("newsletters", {
                data: { Email: email },
            });
            
            setMessage("تم اشتراكك بنجاح! شكراً لانضمامك إلينا 🎉");
            setIsSuccess(true);
            setEmail("");
            setIsTouched(false);
            setErrorMessage("");
            
            // حفظ في localStorage
            localStorage.setItem("newsletter_subscribed", "true");
            localStorage.setItem("newsletter_email", email);
            
            setTimeout(() => {
                setIsSuccess(false);
                setMessage("");
                setIsAlreadySubscribed(true);
            }, 5000);
        } catch (err) {
            console.error("خطأ في الاشتراك:", err);
            
            if (err.response?.status === 400) {
                const errorMsg = err.response?.data?.error?.message;
                if (errorMsg?.toLowerCase().includes("unique")) {
                    setErrorMessage("هذا البريد الإلكتروني مسجل لدينا مسبقاً");
                } else {
                    setErrorMessage(errorMsg || "بيانات غير صحيحة");
                }
            } else if (err.response?.status === 403) {
                setErrorMessage("غير مصرح بالاشتراك حالياً");
            } else if (err.response?.status === 429) {
                setErrorMessage("محاولات كثيرة، يرجى الانتظار قليلاً");
            } else if (!err.response) {
                setErrorMessage("لا يمكن الاتصال بالخادم، تحقق من الإنترنت");
            } else {
                setErrorMessage("حدث خطأ غير متوقع، حاول مرة أخرى");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // ===== حالة مشترك مسبقاً =====
    if (isAlreadySubscribed) {
        return (
            <section className="nl-section">
                <div className="nl-container">
                    <div className="nl-already-subscribed">
                        <div className="nl-success-icon-wrapper">
                            <FaCheckCircle />
                        </div>
                        <h2 className="nl-success-title">
                            أنت مشترك بالفعل! 🎉
                        </h2>
                        <p className="nl-success-text">
                            شكراً لانضمامك. ستصلك أحدث الأخبار والعروض على بريدك الإلكتروني.
                        </p>
                        <button
                            className="nl-unsubscribe-btn"
                            onClick={() => {
                                localStorage.removeItem("newsletter_subscribed");
                                localStorage.removeItem("newsletter_email");
                                setIsAlreadySubscribed(false);
                            }}
                        >
                            اشتراك ببريد آخر
                        </button>
                    </div>
                </div>
            </section>
        );
    }
    
    return (
        <section className="nl-section">
            <div className="nl-container">
                
                {/* ===== الجزء الأيمن: المميزات ===== */}
                <div className="nl-features">
                    <div className="nl-features-header">
                        <h3 className="nl-features-title">
                            لماذا تشترك معنا؟
                        </h3>
                        <p className="nl-features-subtitle">
                            مميزات حصرية لمشتركي نشرتنا البريدية
                        </p>
                    </div>
                    
                    <div className="nl-features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="nl-feature-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="nl-feature-icon">
                                    {feature.icon}
                                </div>
                                <div className="nl-feature-info">
                                    <span className="nl-feature-text">
                                        {feature.text}
                                    </span>
                                    <span className="nl-feature-desc">
                                        {feature.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* ===== الجزء الأيسر: نموذج الاشتراك ===== */}
                <div className="nl-content">
                    {/* زخارف */}
                    <div className="nl-decoration nl-decoration--1"></div>
                    <div className="nl-decoration nl-decoration--2"></div>
                    
                    <div className="nl-content-inner">
                        <div className="nl-header">
                            <div className="nl-icon-wrapper">
                                <FaTelegramPlane />
                            </div>
                            
                            <h2 className="nl-title">
                                اشترك في نشرتنا البريدية
                            </h2>
                            
                            <p className="nl-description">
                                احصل على آخر أخبار الكتب والعروض الحصرية مباشرة في بريدك
                            </p>
                        </div>
                        
                        <form
                            className="nl-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div
                                className={`nl-input-wrapper ${
                                    errorMessage ? "has-error" : ""
                                } ${isSuccess ? "has-success" : ""}`}
                            >
                                {isSuccess ? (
                                    <FaCheckCircle className="nl-input-icon nl-icon-success" />
                                ) : errorMessage ? (
                                    <FaExclamationCircle className="nl-input-icon nl-icon-error" />
                                ) : (
                                    <FaEnvelope className="nl-input-icon" />
                                )}
                                
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleBlur}
                                    placeholder="example@email.com"
                                    className={`nl-input ${
                                        errorMessage ? "is-error" : ""
                                    } ${isSuccess ? "is-success" : ""}`}
                                    disabled={isLoading || isSuccess}
                                    autoComplete="email"
                                    aria-label="البريد الإلكتروني"
                                    aria-invalid={errorMessage ? "true" : "false"}
                                />
                            </div>
                            
                            {/* رسالة الخطأ */}
                            {errorMessage && (
                                <p className="nl-error-message">
                                    <FaExclamationCircle />
                                    {errorMessage}
                                </p>
                            )}
                            
                            <button
                                className={`nl-submit-btn ${
                                    isLoading ? "is-loading" : ""
                                } ${isSuccess ? "is-success" : ""}`}
                                type="submit"
                                disabled={isLoading || isSuccess || !!errorMessage}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="nl-spinner"></span>
                                        <span>جاري الاشتراك...</span>
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <FaCheckCircle />
                                        <span>تم الاشتراك بنجاح</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTelegramPlane />
                                        <span>اشترك الآن</span>
                                    </>
                                )}
                            </button>
                            
                            {/* رسالة النجاح */}
                            {message && isSuccess && (
                                <p className="nl-success-message">
                                    {message}
                                </p>
                            )}
                        </form>
                        
                        <p className="nl-privacy">
                            <FaShieldAlt />
                            نحترم خصوصيتك ولن نشارك بياناتك مع أي طرف ثالث
                        </p>
                    </div>
                </div>
                
            </div>
        </section>
    );
}

export default NewsLetter;