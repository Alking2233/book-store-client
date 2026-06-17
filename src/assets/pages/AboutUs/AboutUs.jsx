import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaBookOpen,
    FaUsers,
    FaAward,
    FaHeart,
    FaGlobe,
    FaShippingFast,
    FaCheckCircle,
    FaHandshake,
    FaLightbulb,
    FaStar,
    FaQuoteRight,
    FaArrowLeft,
    FaHome,
    FaInfoCircle,
    FaArrowRight,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import AnimatedCounter from "../../../components/AnimatedCounter/AnimatedCounter";

import "./AboutUs.css";

function AboutUs() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    
    // ===== الإحصائيات =====
    const stats = [
        {
            icon: FaBookOpen,
            number: 50000,
            suffix: "+",
            label: "كتاب متنوع",
            color: "primary",
        },
        {
            icon: FaUsers,
            number: 25000,
            suffix: "+",
            label: "قارئ سعيد",
            color: "secondary",
        },
        {
            icon: FaAward,
            number: 15,
            suffix: "+",
            label: "سنوات خبرة",
            color: "accent",
        },
        {
            icon: FaGlobe,
            number: 30,
            suffix: "+",
            label: "دولة نخدمها",
            color: "sun",
        },
    ];
    
    // ===== القيم =====
    const values = [
        {
            icon: FaLightbulb,
            title: "المعرفة للجميع",
            description: "نؤمن بأن المعرفة حق لكل إنسان، لذلك نسعى لتوفير الكتب بأسعار مناسبة.",
        },
        {
            icon: FaCheckCircle,
            title: "الجودة أولاً",
            description: "نختار كتبنا بعناية فائقة من أفضل دور النشر العربية والعالمية.",
        },
        {
            icon: FaHandshake,
            title: "الثقة والمصداقية",
            description: "علاقتنا مع عملائنا مبنية على الثقة المتبادلة والشفافية الكاملة.",
        },
        {
            icon: FaHeart,
            title: "شغف بالقراءة",
            description: "نشارك شغفكم بالقراءة ونسعى لجعل تجربتكم مع الكتب مميزة دائماً.",
        },
    ];
    
    // ===== المميزات =====
    const features = [
        {
            icon: FaShippingFast,
            title: "شحن سريع",
            description: "نوصل طلبك إلى باب منزلك خلال 2-5 أيام عمل",
        },
        {
            icon: FaBookOpen,
            title: "مجموعة ضخمة",
            description: "أكثر من 50,000 كتاب في مختلف المجالات والتخصصات",
        },
        {
            icon: FaStar,
            title: "كتب أصلية",
            description: "جميع كتبنا أصلية ومرخصة من دور النشر مباشرة",
        },
        {
            icon: FaUsers,
            title: "دعم 24/7",
            description: "فريق دعم متخصص لمساعدتك في أي وقت تحتاجه",
        },
    ];
    
    // ===== الفريق =====
    const team = [
        {
            name: "أحمد محمد",
            role: "المؤسس والمدير التنفيذي",
            description: "خبير في مجال النشر والكتب لأكثر من 15 عاماً",
        },
        {
            name: "فاطمة علي",
            role: "مديرة المحتوى",
            description: "متخصصة في اختيار وتنظيم الكتب العربية والمترجمة",
        },
        {
            name: "خالد عبدالله",
            role: "مدير العمليات",
            description: "يشرف على عمليات الشحن وخدمة العملاء",
        },
    ];
    
    return (
        <main className="about-page">
            <div className="ab-container">
                {/* ===== Breadcrumb ===== */}
                <nav className="ab-breadcrumb" aria-label="مسار التنقل">
                    <Link to="/" className="ab-breadcrumb-item">
                        <FaHome />
                        <span>الرئيسية</span>
                    </Link>
                    <FaArrowRight className="ab-breadcrumb-separator" />
                    <span className="ab-breadcrumb-item ab-breadcrumb-current">
                        <FaInfoCircle />
                        <span>من نحن</span>
                    </span>
                </nav>
                
                {/* ===== Hero Section ===== */}
                <section className="ab-hero">
                    <div className="ab-hero-decoration ab-hero-decoration--1"></div>
                    <div className="ab-hero-decoration ab-hero-decoration--2"></div>
                    
                    <div className="ab-hero-content">
                        <span className="ab-hero-badge">
                            <HiSparkles />
                            مرحباً بك في مكتبتنا
                        </span>
                        
                        <h1 className="ab-hero-title">
                            نحن <span className="ab-hero-highlight">شروق المعرفة</span>
                            <br />
                            بوابتك إلى عالم الكتب
                        </h1>
                        
                        <p className="ab-hero-description">
                            منذ عام 2010 ونحن نسعى لإثراء المكتبة العربية بأفضل الكتب
                            والإصدارات من مختلف المجالات. هدفنا أن نجعل المعرفة في متناول
                            الجميع، وأن نكون شريكك المفضل في رحلتك المعرفية.
                        </p>
                        
                        <div className="ab-hero-actions">
                            <Link to="/books" className="ab-btn ab-btn--primary">
                                <FaBookOpen />
                                تصفّح الكتب
                            </Link>
                            <Link to="/contact" className="ab-btn ab-btn--outline">
                                تواصل معنا
                                <FaArrowLeft />
                            </Link>
                        </div>
                    </div>
                </section>
                
                {/* ===== الإحصائيات ===== */}
                <section className="ab-stats">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`ab-stat ab-stat--${stat.color}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="ab-stat-icon">
                                    <Icon />
                                </div>
                                <div className="ab-stat-number">
                                    <AnimatedCounter
                                        end={stat.number}
                                        suffix={stat.suffix}
                                        duration={2500}
                                    />
                                </div>
                                <div className="ab-stat-label">{stat.label}</div>
                            </div>
                        );
                    })}
                </section>
                
                {/* ===== قصتنا ===== */}
                <section className="ab-section">
                    <SectionTitle
                        title="قصتنا"
                        subtitle="رحلة بدأت بشغف وتحولت إلى رسالة"
                        badge="من نحن"
                    />
                    
                    <div className="ab-story">
                        <div className="ab-story-content">
                            <div className="ab-story-quote">
                                <FaQuoteRight className="ab-story-quote-icon" />
                                <p>
                                    "بدأنا رحلتنا بحلم بسيط: أن نجعل المعرفة في متناول كل
                                    قارئ عربي. اليوم، بعد أكثر من 15 عاماً، أصبحنا واحدة من
                                    أكبر المكتبات الإلكترونية في الوطن العربي."
                                </p>
                            </div>
                            
                            <p className="ab-story-text">
                                تأسست <strong>شروق المعرفة</strong> عام 2010 على يد مجموعة من
                                الشغوفين بالكتب والقراءة. كانت البداية متواضعة بمكتبة صغيرة
                                في قلب المدينة، لكن الحلم كان كبيراً.
                            </p>
                            
                            <p className="ab-story-text">
                                مع مرور السنوات، توسعنا لنشمل أكثر من <strong>50,000 كتاب</strong>{" "}
                                في مختلف المجالات: الأدب، التنمية الذاتية، التاريخ، العلوم،
                                الدين، والمزيد. واليوم، نخدم آلاف القراء في أكثر من{" "}
                                <strong>30 دولة</strong> حول العالم.
                            </p>
                            
                            <p className="ab-story-text">
                                نؤمن بأن كل كتاب هو نافذة لعالم جديد، وكل قارئ هو شريك في
                                رحلتنا. لذلك نسعى دائماً لتقديم تجربة قراءة استثنائية تجمع
                                بين الجودة، التنوع، والأسعار المناسبة.
                            </p>
                        </div>
                    </div>
                </section>
                
                {/* ===== قيمنا ===== */}
                <section className="ab-section">
                    <SectionTitle
                        title="قيمنا"
                        subtitle="المبادئ التي نؤمن بها ونعمل من أجلها"
                        badge="ما يميزنا"
                    />
                    
                    <div className="ab-values-grid">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="ab-value-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="ab-value-icon">
                                        <Icon />
                                    </div>
                                    <h3 className="ab-value-title">{value.title}</h3>
                                    <p className="ab-value-description">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
                
                {/* ===== لماذا نحن ===== */}
                <section className="ab-section">
                    <SectionTitle
                        title="لماذا تختارنا؟"
                        subtitle="ما يميز شروق المعرفة عن غيرها"
                        badge="مميزاتنا"
                    />
                    
                    <div className="ab-features-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="ab-feature-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="ab-feature-icon-wrapper">
                                        <Icon className="ab-feature-icon" />
                                    </div>
                                    <h4 className="ab-feature-title">{feature.title}</h4>
                                    <p className="ab-feature-description">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
                
                {/* ===== الفريق ===== */}
                <section className="ab-section">
                    <SectionTitle
                        title="فريقنا"
                        subtitle="الأشخاص الذين يعملون بشغف لخدمتك"
                        badge="من نحن"
                    />
                    
                    <div className="ab-team-grid">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="ab-team-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="ab-team-avatar">
                                    <span>{member.name.charAt(0)}</span>
                                </div>
                                <h4 className="ab-team-name">{member.name}</h4>
                                <p className="ab-team-role">{member.role}</p>
                                <p className="ab-team-description">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* ===== رسالتنا و رؤيتنا ===== */}
                <section className="ab-section">
                    <div className="ab-mission-grid">
                        <div className="ab-mission-card ab-mission-card--mission">
                            <div className="ab-mission-icon">
                                <FaLightbulb />
                            </div>
                            <h3 className="ab-mission-title">رسالتنا</h3>
                            <p className="ab-mission-text">
                                توفير الكتب والمعرفة لكل عربي في كل مكان، بأسعار مناسبة
                                وجودة عالية، مع تجربة شراء سهلة ومميزة تجعل القراءة متعة
                                للجميع.
                            </p>
                        </div>
                        
                        <div className="ab-mission-card ab-mission-card--vision">
                            <div className="ab-mission-icon">
                                <FaStar />
                            </div>
                            <h3 className="ab-mission-title">رؤيتنا</h3>
                            <p className="ab-mission-text">
                                أن نكون المكتبة الإلكترونية الأولى في العالم العربي، ونقطة
                                التقاء كل محبي القراءة، ونساهم في بناء مجتمع قارئ ومثقف.
                            </p>
                        </div>
                    </div>
                </section>
                
                {/* ===== CTA ===== */}
                <section className="ab-cta">
                    <div className="ab-cta-content">
                        <HiSparkles className="ab-cta-icon" />
                        <h2 className="ab-cta-title">ابدأ رحلتك المعرفية الآن</h2>
                        <p className="ab-cta-description">
                            انضم إلى آلاف القراء الذين اختاروا شروق المعرفة شريكاً لهم
                        </p>
                        <div className="ab-cta-actions">
                            <Link to="/books" className="ab-btn ab-btn--white">
                                <FaBookOpen />
                                تصفّح الكتب
                            </Link>
                            <Link to="/contact" className="ab-btn ab-btn--outline-white">
                                تواصل معنا
                                <FaArrowLeft />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default AboutUs;