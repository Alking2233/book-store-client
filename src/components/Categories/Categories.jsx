import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaArrowLeft, FaThLarge, FaSync } from 'react-icons/fa';

import SectionTitle from '../SectionTitle/SectionTitle';
import Category from '../Category/Category';
import { getAllCategories } from '../../store/categoriesSlice';

import './Categories.css';

function Categories({ showAll = false, maxItems = 6 }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const { data, isLoading, error } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    // تحديد عدد التصنيفات للعرض
    const isCategoriesPage = location.pathname === '/categories';
    const displayedCategories = (showAll || isCategoriesPage) 
        ? data 
        : data?.slice(0, maxItems);
    
    const hasMoreCategories = !showAll && !isCategoriesPage && data?.length > maxItems;

    // ===== Skeleton Loader =====
    const renderSkeletons = () => {
        return Array(maxItems).fill(0).map((_, index) => (
            <div key={index} className="category-skeleton">
                <div className="category-skeleton-image"></div>
                <div className="category-skeleton-content">
                    <div className="category-skeleton-line category-skeleton-line--title"></div>
                    <div className="category-skeleton-line category-skeleton-line--desc"></div>
                    <div className="category-skeleton-line category-skeleton-line--badge"></div>
                </div>
            </div>
        ));
    };

    // ===== Loading =====
    if (isLoading) {
        return (
            <div className="categories-container">
                <SectionTitle 
                    title="استكشف التصنيفات"
                    subtitle="تصفح كتبك المفضلة حسب اهتماماتك"
                />
                <div className="categories-grid">
                    {renderSkeletons()}
                </div>
            </div>
        );
    }

    // ===== Error =====
    if (error) {
        return (
            <div className="categories-container">
                <SectionTitle 
                    title="استكشف التصنيفات"
                    subtitle="تصفح كتبك المفضلة حسب اهتماماتك"
                />
                <div className="categories-state categories-state--error">
                    <div className="categories-state-icon">
                        <FaSync />
                    </div>
                    <h3 className="categories-state-title">عذراً، حدث خطأ</h3>
                    <p className="categories-state-message">{error}</p>
                    <button 
                        className="categories-state-btn" 
                        onClick={() => dispatch(getAllCategories())}
                    >
                        <FaSync /> إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    // ===== Empty =====
    if (!data || data.length === 0) {
        return (
            <div className="categories-container">
                <SectionTitle 
                    title="استكشف التصنيفات"
                    subtitle="تصفح كتبك المفضلة حسب اهتماماتك"
                />
                <div className="categories-state categories-state--empty">
                    <div className="categories-state-icon">
                        <FaThLarge />
                    </div>
                    <h3 className="categories-state-title">لا توجد تصنيفات</h3>
                    <p className="categories-state-message">
                        نعمل حالياً على إضافة المزيد من التصنيفات. عُد قريباً!
                    </p>
                </div>
            </div>
        );
    }

    // ===== Main Render =====
    return (
        <div className="categories-container">
            <SectionTitle 
                title="استكشف التصنيفات"
                subtitle="تصفح كتبك المفضلة حسب اهتماماتك المختلفة"
                badge={`${data.length} تصنيف`}
            />
            
            <div className="categories-grid">
                {displayedCategories?.map((category, index) => (
                    <Category 
                        key={category.id || category.documentId} 
                        category={category}
                        index={index}
                    />
                ))}
            </div>

            {/* زر عرض الكل */}
            {hasMoreCategories && (
                <div className="categories-view-all">
                    <button 
                        className="categories-view-all-btn"
                        onClick={() => navigate('/categories')}
                    >
                        <span>عرض جميع التصنيفات</span>
                        <span className="categories-view-all-count">
                            ({data.length - maxItems}+ آخر)
                        </span>
                        <FaArrowLeft />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Categories;