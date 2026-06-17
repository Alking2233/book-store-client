import { Link, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaSearch,
    FaBookOpen,
    FaArrowRight,
    FaExclamationTriangle,
} from "react-icons/fa";

import "./NotFound.css";

function NotFound() {
    const navigate = useNavigate();
    
    return (
        <main className="not-found-page">
            <div className="nf-container">
                {/* Animated 404 */}
                <div className="nf-content">
                    <div className="nf-icon">
                        <FaExclamationTriangle />
                    </div>
                    
                    <h1 className="nf-code">404</h1>
                    
                    <h2 className="nf-title">عذراً، الصفحة غير موجودة</h2>
                    
                    <p className="nf-message">
                        الصفحة التي تبحث عنها قد تكون محذوفة أو مؤقتاً غير متاحة
                        <br />
                        أو ربما لم تكن موجودة من الأساس!
                    </p>
                    
                    {/* الاقتراحات */}
                    <div className="nf-suggestions">
                        <h3 className="nf-suggestions-title">
                            <FaSearch />
                            ماذا يمكنك أن تفعل؟
                        </h3>
                        
                        <ul className="nf-suggestions-list">
                            <li>تأكّد من صحة الرابط</li>
                            <li>ارجع للصفحة السابقة</li>
                            <li>ابحث عن ما تريد</li>
                            <li>تصفّح الصفحات الرئيسية</li>
                        </ul>
                    </div>
                    
                    {/* Actions */}
                    <div className="nf-actions">
                        <Link to="/" className="nf-btn nf-btn--primary">
                            <FaHome />
                            <span>العودة للرئيسية</span>
                        </Link>
                        
                        <button
                            onClick={() => navigate(-1)}
                            className="nf-btn nf-btn--outline"
                        >
                            <FaArrowRight />
                            <span>الرجوع للخلف</span>
                        </button>
                        
                        <Link to="/books" className="nf-btn nf-btn--outline">
                            <FaBookOpen />
                            <span>تصفح الكتب</span>
                        </Link>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="nf-quick-links">
                        <span className="nf-quick-label">روابط سريعة:</span>
                        <div className="nf-quick-list">
                            <Link to="/categories">التصنيفات</Link>
                            <Link to="/blogs">المقالات</Link>
                            <Link to="/aboutus">من نحن</Link>
                            <Link to="/contact">اتصل بنا</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default NotFound;