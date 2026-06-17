import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaPaperPlane,
    FaUser,
    FaCommentDots,
    FaHome,
    FaPhoneAlt,
    FaArrowRight,
    FaCheckCircle,
    FaExclamationCircle,
    FaWhatsapp,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaTelegram,
    FaLinkedin,
} from "react-icons/fa";

import "./Contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    
    // ===== معلومات التواصل =====
    const contactInfo = [
        {
            icon: FaMapMarkerAlt,
            title: "العنوان",
            details: ["شارع الملك فهد", "الرياض، المملكة العربية السعودية"],
            color: "primary",
        },
        {
            icon: FaPhone,
            title: "الهاتف",
            details: ["+966 12 345 6789", "+966 98 765 4321"],
            color: "secondary",
            link: "tel:+966123456789",
        },
        {
            icon: FaEnvelope,
            title: "البريد الإلكتروني",
            details: ["info@shorouk-knowledge.com", "support@shorouk-knowledge.com"],
            color: "accent",
            link: "mailto:info@shorouk-knowledge.com",
        },
        {
            icon: FaClock,
            title: "ساعات العمل",
            details: ["السبت - الخميس: 9:00 - 18:00", "الجمعة: مغلق"],
            color: "sun",
        },
    ];
    
    // ===== روابط التواصل الاجتماعي =====
    const socialLinks = [
        { icon: FaWhatsapp, name: "واتساب", url: "https://wa.me/966123456789", color: "#25D366" },
        { icon: FaFacebook, name: "فيسبوك", url: "#", color: "#1877F2" },
        { icon: FaTwitter, name: "تويتر", url: "#", color: "#1DA1F2" },
        { icon: FaInstagram, name: "إنستغرام", url: "#", color: "#E1306C" },
        { icon: FaTelegram, name: "تيليجرام", url: "#", color: "#0088CC" },
        { icon: FaLinkedin, name: "لينكدإن", url: "#", color: "#0077B5" },
    ];
    
    // ===== الأسئلة الشائعة =====
    const faqs = [
        {
            question: "كم تستغرق عملية الشحن؟",
            answer: "يستغرق الشحن من 2-5 أيام عمل داخل المملكة، و7-14 يوم للدول الأخرى.",
        },
        {
            question: "هل يمكنني إرجاع الكتاب؟",
            answer: "نعم، يمكنك إرجاع الكتاب خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون بحالة جيدة.",
        },
        {
            question: "كيف يمكنني تتبع طلبي؟",
            answer: "بعد إتمام الطلب، ستصلك رسالة بريدية تحتوي على رقم التتبع ورابط لمتابعة طلبك.",
        },
        {
            question: "هل تقبلون الدفع عند الاستلام؟",
            answer: "نعم، نقبل الدفع عند الاستلام داخل المملكة العربية السعودية فقط.",
        },
    ];
    
    // ===== Validation =====
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "الاسم مطلوب";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
        }
        
        if (!formData.subject.trim()) {
            newErrors.subject = "الموضوع مطلوب";
        } else if (formData.subject.trim().length < 5) {
            newErrors.subject = "الموضوع يجب أن يكون 5 أحرف على الأقل";
        }
        
        if (!formData.message.trim()) {
            newErrors.message = "الرسالة مطلوبة";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "الرسالة يجب أن تكون 10 أحرف على الأقل";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // ===== Handlers =====
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        // مسح الخطأ عند الكتابة
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            // محاكاة إرسال (يمكن استبدالها بـ API حقيقي لاحقاً)
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            // TODO: استبدل هذا بإرسال للـ API:
            // await api.post("contact-messages", { data: formData });
            
            setSubmitStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (err) {
            setSubmitStatus("error");
            setTimeout(() => setSubmitStatus(null), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <main className="contact-page">
            <div className="ct-container">
                {/* ===== Breadcrumb ===== */}
                <nav className="ct-breadcrumb" aria-label="مسار التنقل">
                    <Link to="/" className="ct-breadcrumb-item">
                        <FaHome />
                        <span>الرئيسية</span>
                    </Link>
                    <FaArrowRight className="ct-breadcrumb-separator" />
                    <span className="ct-breadcrumb-item ct-breadcrumb-current">
                        <FaPhoneAlt />
                        <span>اتصل بنا</span>
                    </span>
                </nav>
                
                {/* ===== Hero ===== */}
                <section className="ct-hero">
                    <div className="ct-hero-decoration"></div>
                    
                    <div className="ct-hero-icon">
                        <FaPaperPlane />
                    </div>
                    
                    <h1 className="ct-hero-title">تواصل معنا</h1>
                    
                    <p className="ct-hero-description">
                        نحن هنا للإجابة على جميع استفساراتك. لا تتردد في التواصل معنا في أي وقت،
                        وسنرد عليك في أقرب فرصة ممكنة.
                    </p>
                </section>
                
                {/* ===== معلومات التواصل ===== */}
                <section className="ct-info-grid">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        const content = (
                            <>
                                <div className={`ct-info-icon ct-info-icon--${info.color}`}>
                                    <Icon />
                                </div>
                                <h3 className="ct-info-title">{info.title}</h3>
                                <div className="ct-info-details">
                                    {info.details.map((detail, i) => (
                                        <p key={i}>{detail}</p>
                                    ))}
                                </div>
                            </>
                        );
                        
                        return info.link ? (
                            <a
                                key={index}
                                href={info.link}
                                className="ct-info-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {content}
                            </a>
                        ) : (
                            <div
                                key={index}
                                className="ct-info-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {content}
                            </div>
                        );
                    })}
                </section>
                
                {/* ===== Main Grid: Form + Map ===== */}
                <section className="ct-main">
                    {/* النموذج */}
                    <div className="ct-form-section">
                        <div className="ct-form-header">
                            <h2 className="ct-form-title">
                                <FaCommentDots />
                                أرسل لنا رسالة
                            </h2>
                            <p className="ct-form-subtitle">
                                املأ النموذج التالي وسنتواصل معك قريباً
                            </p>
                        </div>
                        
                        <form className="ct-form" onSubmit={handleSubmit} noValidate>
                            {/* الاسم */}
                            <div className="ct-form-group">
                                <label htmlFor="name" className="ct-form-label">
                                    <FaUser /> الاسم الكامل
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`ct-form-input ${errors.name ? "has-error" : ""}`}
                                    placeholder="أدخل اسمك الكامل"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <span className="ct-form-error">
                                        <FaExclamationCircle />
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                            
                            {/* البريد الإلكتروني */}
                            <div className="ct-form-group">
                                <label htmlFor="email" className="ct-form-label">
                                    <FaEnvelope /> البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`ct-form-input ${errors.email ? "has-error" : ""}`}
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <span className="ct-form-error">
                                        <FaExclamationCircle />
                                        {errors.email}
                                    </span>
                                )}
                            </div>
                            
                            {/* الموضوع */}
                            <div className="ct-form-group">
                                <label htmlFor="subject" className="ct-form-label">
                                    <FaCommentDots /> الموضوع
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className={`ct-form-input ${errors.subject ? "has-error" : ""}`}
                                    placeholder="موضوع الرسالة"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                {errors.subject && (
                                    <span className="ct-form-error">
                                        <FaExclamationCircle />
                                        {errors.subject}
                                    </span>
                                )}
                            </div>
                            
                            {/* الرسالة */}
                            <div className="ct-form-group">
                                <label htmlFor="message" className="ct-form-label">
                                    <FaCommentDots /> الرسالة
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    className={`ct-form-textarea ${errors.message ? "has-error" : ""}`}
                                    placeholder="اكتب رسالتك هنا..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                {errors.message && (
                                    <span className="ct-form-error">
                                        <FaExclamationCircle />
                                        {errors.message}
                                    </span>
                                )}
                            </div>
                            
                            {/* رسالة النجاح/الخطأ */}
                            {submitStatus === "success" && (
                                <div className="ct-form-message ct-form-message--success">
                                    <FaCheckCircle />
                                    <span>تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</span>
                                </div>
                            )}
                            
                            {submitStatus === "error" && (
                                <div className="ct-form-message ct-form-message--error">
                                    <FaExclamationCircle />
                                    <span>عذراً، حدث خطأ. حاول مرة أخرى.</span>
                                </div>
                            )}
                            
                            {/* زر الإرسال */}
                            <button
                                type="submit"
                                className="ct-form-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="ct-spinner"></span>
                                        <span>جاري الإرسال...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        <span>إرسال الرسالة</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    
                    {/* الجانب الأيمن: Map + Social */}
                    <div className="ct-side">
                        {/* الخريطة */}
                        <div className="ct-map-card">
                            <h3 className="ct-map-title">
                                <FaMapMarkerAlt />
                                موقعنا على الخريطة
                            </h3>
                            <div className="ct-map">
                                <iframe
                                    title="موقعنا"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.218905290089!2d46.6752944!3d24.7135517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03b67e8a85c9%3A0x1234567890abcdef!2sRiyadh!5e0!3m2!1sar!2ssa!4v1234567890"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: "var(--radius-xl)" }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                        
                        {/* التواصل الاجتماعي */}
                        <div className="ct-social-card">
                            <h3 className="ct-social-title">تابعنا على</h3>
                            <p className="ct-social-subtitle">
                                ابقَ على اطلاع بآخر أخبارنا وعروضنا
                            </p>
                            <div className="ct-social-links">
                                {socialLinks.map((social, index) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ct-social-link"
                                            style={{ "--social-color": social.color }}
                                            aria-label={social.name}
                                            title={social.name}
                                        >
                                            <Icon />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* ===== الأسئلة الشائعة ===== */}
                <section className="ct-faqs">
                    <div className="ct-faqs-header">
                        <h2 className="ct-faqs-title">الأسئلة الشائعة</h2>
                        <p className="ct-faqs-subtitle">
                            إجابات على أكثر الأسئلة شيوعاً من عملائنا
                        </p>
                    </div>
                    
                    <div className="ct-faqs-grid">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="ct-faq-item"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <summary className="ct-faq-question">
                                    <span>{faq.question}</span>
                                    <span className="ct-faq-icon">+</span>
                                </summary>
                                <p className="ct-faq-answer">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Contact;