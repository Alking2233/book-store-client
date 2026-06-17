import { HiSparkles } from "react-icons/hi";
import "./SectionTitle.css";

/**
 * مكون عنوان القسم
 * 
 * @param {string} title - العنوان الرئيسي (مطلوب)
 * @param {string} subtitle - العنوان الفرعي (اختياري)
 * @param {string} align - المحاذاة: 'center' | 'right' | 'left'
 * @param {string} variant - النمط: 'default' | 'simple' | 'gradient' | 'with-icon'
 * @param {React.ReactNode} icon - أيقونة مخصصة (اختياري)
 * @param {React.ReactNode} action - زر أو رابط في الجانب (اختياري)
 * @param {string} badge - شارة صغيرة فوق العنوان (اختياري)
 */
function SectionTitle({ 
    title, 
    subtitle,
    align = "center",
    variant = "default",
    icon,
    action,
    badge
}) {
    return (
        <div className={`section-title-container section-title-container--${align} section-title-container--${variant}`}>
            <div className="section-title-content">
                {/* شارة علوية */}
                {badge && (
                    <span className="section-title-badge">
                        <HiSparkles className="section-title-badge-icon" />
                        {badge}
                    </span>
                )}

                {/* العنوان مع الزخارف */}
                <div className="section-title-heading">
                    {align === "center" && variant === "default" && (
                        <span className="section-title-decoration section-title-decoration--right">
                            <span className="section-title-line"></span>
                            {icon || <HiSparkles className="section-title-icon" />}
                        </span>
                    )}
                    
                    <h2 className="section-title">{title}</h2>
                    
                    {align === "center" && variant === "default" && (
                        <span className="section-title-decoration section-title-decoration--left">
                            {icon || <HiSparkles className="section-title-icon" />}
                            <span className="section-title-line"></span>
                        </span>
                    )}
                </div>

                {/* العنوان الفرعي */}
                {subtitle && (
                    <p className="section-title-subtitle">{subtitle}</p>
                )}
            </div>

            {/* زر/إجراء في الجانب (للتخطيط الأفقي) */}
            {action && align !== "center" && (
                <div className="section-title-action">
                    {action}
                </div>
            )}
        </div>
    );
}

export default SectionTitle;