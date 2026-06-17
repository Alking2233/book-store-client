import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaBookOpen,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaWhatsapp,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaTelegram,
    FaLinkedin,
    FaYoutube,
    FaPaperPlane,
    FaCcVisa,
    FaCcMastercard,
    FaCcPaypal,
    FaApplePay,
    FaShieldAlt,
    FaTruck,
    FaUndo,
    FaHeadset,
    FaHeart,
    FaArrowUp,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState(null);
    const [isSubscribing, setIsSubscribing] = useState(false);
    
    // ===== Quick Links =====
    const quickLinks = [
        { name: "الرئيسية", path: "/" },
        { name: "التصنيفات", path: "/categories" },
        { name: "كافة الكتب", path: "/books" },
        { name: "المدونة", path: "/blogs" },
        { name: "من نحن", path: "/aboutus" },
        { name: "اتصل بنا", path: "/contact" },
    ];
    
    // ===== Customer Service =====
    const customerService = [
        { name: "سياسة الشحن", path: "#" },
        { name: "سياسة الإرجاع", path: "#" },
        { name: "الأسئلة الشائعة", path: "/contact" },
        { name: "طرق الدفع", path: "#" },
        { name: "تتبع الطلب", path: "#" },
        { name: "شروط الاستخدام", path: "#" },
    ];
    
    // ===== Categories =====
    const popularCategories = [
        { name: "الأدب العربي", path: "#" },
        { name: "التنمية الذاتية", path: "#" },
        { name: "كتب التاريخ", path: "#" },
        { name: "الفلسفة", path: "#" },
        { name: "كتب الأطفال", path: "#" },
        { name: "الروايات", path: "#" },
    ];
    
    // ===== Social Links =====
    const socialLinks = [
        { icon: FaWhatsapp, url: "https://wa.me/966123456789", name: "واتساب", color: "#25D366" },
        { icon: FaFacebook, url: "#", name: "فيسبوك", color: "#1877F2" },
        { icon: FaTwitter, url: "#", name: "تويتر", color: "#1DA1F2" },
        { icon: FaInstagram, url: "#", name: "إنستغرام", color: "#E1306C" },
        { icon: FaTelegram, url: "#", name: "تيليجرام", color: "#0088CC" },
        { icon: FaLinkedin, url: "#", name: "لينكدإن", color: "#0077B5" },
        { icon: FaYoutube, url: "#", name: "يوتيوب", color: "#FF0000" },
    ];
    
    // ===== Features =====
    const features = [
        {
            icon: FaTruck,
            title: "شحن سريع",
            description: "توصيل خلال 2-5 أيام",
        },
        {
            icon: FaUndo,
            title: "إرجاع مجاني",
            description: "خلال 14 يوماً",
        },
        {
            icon: FaShieldAlt,
            title: "دفع آمن",
            description: "حماية كاملة لبياناتك",
        },
        {
            icon: FaHeadset,
            title: "دعم 24/7",
            description: "نحن دائماً معك",
        },
    ];
    
    // ===== Handlers =====
    const handleSubscribe = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) return;
        
        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSubscribeStatus("error");
            setTimeout(() => setSubscribeStatus(null), 3000);
            return;
        }
        
        setIsSubscribing(true);
        
        try {
            // محاكاة الاشتراك (يمكن استبدالها بـ API حقيقي)
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            // TODO: استبدل بـ API:
            // await api.post("newsletters", { data: { Email: email } });
            
            setSubscribeStatus("success");
            setEmail("");
            setTimeout(() => setSubscribeStatus(null), 3000);
        } catch {
            setSubscribeStatus("error");
            setTimeout(() => setSubscribeStatus(null), 3000);
        } finally {
            setIsSubscribing(false);
        }
    };
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
    return (
        <footer className="footer">
            {/* ===== Features Bar ===== */}
            <div className="footer-features">
                <div className="footer-container">
                    <div className="footer-features-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="footer-feature">
                                    <div className="footer-feature-icon">
                                        <Icon />
                                    </div>
                                    <div className="footer-feature-info">
                                        <h4 className="footer-feature-title">
                                            {feature.title}
                                        </h4>
                                        <p className="footer-feature-desc">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* ===== Main Footer ===== */}
            <div className="footer-main">
                <div className="footer-container">
                    <div className="footer-grid">
                        {/* ===== العمود الأول: عن المتجر ===== */}
                        <div className="footer-col footer-col--brand">
                            <Link to="/" className="footer-brand">
                                <div className="footer-brand-icon">
                                    <FaBookOpen />
                                </div>
                                <span className="footer-brand-text">
                                    شروق المعرفة
                                </span>
                            </Link>
                            
                            <p className="footer-description">
                                مكتبتك الإلكترونية المفضلة في العالم العربي. نقدم
                                أفضل الكتب من مختلف المجالات بأسعار مناسبة وجودة عالية.
                            </p>
                            
                            {/* Social Links */}
                            <div className="footer-social">
                                {socialLinks.map((social, index) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="footer-social-link"
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
                        
                        {/* ===== العمود الثاني: روابط سريعة ===== */}
                        <div className="footer-col">
                            <h3 className="footer-title">روابط سريعة</h3>
                            <ul className="footer-links">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className="footer-link">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* ===== العمود الثالث: خدمة العملاء ===== */}
                        <div className="footer-col">
                            <h3 className="footer-title">خدمة العملاء</h3>
                            <ul className="footer-links">
                                {customerService.map((link, index) => (
                                    <li key={index}>
                                        <Link to={link.path} className="footer-link">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* ===== العمود الرابع: التواصل + النشرة ===== */}
                        <div className="footer-col">
                            <h3 className="footer-title">تواصل معنا</h3>
                            
                            {/* Contact Info */}
                            <ul className="footer-contact">
                                <li className="footer-contact-item">
                                    <FaMapMarkerAlt className="footer-contact-icon" />
                                    <span>الرياض، المملكة العربية السعودية</span>
                                </li>
                                <li className="footer-contact-item">
                                    <FaPhone className="footer-contact-icon" />
                                    <a href="tel:+966123456789">+966 12 345 6789</a>
                                </li>
                                <li className="footer-contact-item">
                                    <FaEnvelope className="footer-contact-icon" />
                                    <a href="mailto:info@shorouk.com">info@shorouk.com</a>
                                </li>
                                <li className="footer-contact-item">
                                    <FaClock className="footer-contact-icon" />
                                    <span>السبت - الخميس: 9:00 - 18:00</span>
                                </li>
                            </ul>
                            
                            {/* Newsletter */}
                            <div className="footer-newsletter">
                                <h4 className="footer-newsletter-title">
                                    <FaPaperPlane />
                                    اشترك بنشرتنا
                                </h4>
                                <p className="footer-newsletter-desc">
                                    احصل على آخر العروض والكتب الجديدة
                                </p>
                                
                                <form
                                    className="footer-newsletter-form"
                                    onSubmit={handleSubscribe}
                                >
                                    <div className="footer-newsletter-input-wrapper">
                                        <FaEnvelope className="footer-newsletter-icon" />
                                        <input
                                            type="email"
                                            placeholder="بريدك الإلكتروني"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="footer-newsletter-input"
                                            disabled={isSubscribing}
                                            required
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        className="footer-newsletter-btn"
                                        disabled={isSubscribing}
                                    >
                                        {isSubscribing ? (
                                            <span className="footer-spinner"></span>
                                        ) : (
                                            <FaPaperPlane />
                                        )}
                                    </button>
                                </form>
                                
                                {/* Subscribe Status */}
                                {subscribeStatus === "success" && (
                                    <p className="footer-newsletter-msg footer-newsletter-msg--success">
                                        <FaCheckCircle />
                                        تم الاشتراك بنجاح! 🎉
                                    </p>
                                )}
                                
                                {subscribeStatus === "error" && (
                                    <p className="footer-newsletter-msg footer-newsletter-msg--error">
                                        <FaExclamationCircle />
                                        صيغة البريد غير صحيحة
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ===== Popular Categories Bar ===== */}
            <div className="footer-categories-bar">
                <div className="footer-container">
                    <div className="footer-categories">
                        <span className="footer-categories-label">
                            <FaBookOpen />
                            تصنيفات شائعة:
                        </span>
                        <div className="footer-categories-list">
                            {popularCategories.map((cat, index) => (
                                <Link
                                    key={index}
                                    to={cat.path}
                                    className="footer-category-chip"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ===== Bottom Bar ===== */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="footer-bottom-content">
                        {/* Copyright */}
                        <div className="footer-copyright">
                            <p>
                                &copy; {currentYear} <strong>شروق المعرفة</strong>. جميع الحقوق محفوظة.
                            </p>
                            <p className="footer-made-with">
                                صُنع بـ <FaHeart className="footer-heart" /> في الوطن العربي
                            </p>
                        </div>
                        
                        {/* Payment Methods */}
                        <div className="footer-payments">
                            <span className="footer-payments-label">طرق الدفع:</span>
                            <div className="footer-payments-icons">
                                <FaCcVisa title="Visa" />
                                <FaCcMastercard title="Mastercard" />
                                <FaCcPaypal title="PayPal" />
                                <FaApplePay title="Apple Pay" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ===== Scroll to Top Button ===== */}
            <button
                className="footer-scroll-top"
                onClick={scrollToTop}
                aria-label="العودة للأعلى"
                title="العودة للأعلى"
            >
                <FaArrowUp />
            </button>
        </footer>
    );
}

export default Footer;