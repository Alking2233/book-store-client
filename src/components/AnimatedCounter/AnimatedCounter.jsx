import { useCountUp, formatNumber } from '../../hooks/useCountUp';

/**
 * مكون عرض رقم متحرك
 * 
 * @param {number} end - الرقم النهائي
 * @param {string} suffix - علامة بعد الرقم مثل "+" أو ""
 * @param {boolean} useK - استخدام K للآلاف (افتراضي: true)
 * @param {number} duration - مدة الانيميشن
 * @param {number} decimals - عدد الأرقام بعد الفاصلة
 */
function AnimatedCounter({ 
    end, 
    suffix = '', 
    useK = true, 
    duration = 2000,
    decimals = 0 
}) {
    const { count, ref } = useCountUp(end, duration);

    const displayValue = useK 
        ? formatNumber(count, suffix)
        : `${count.toFixed(decimals)}${suffix}`;

    return (
        <span ref={ref} className="animated-counter">
            {displayValue}
        </span>
    );
}

export default AnimatedCounter;