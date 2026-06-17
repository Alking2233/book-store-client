import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaSync, FaThLarge, FaSearch } from "react-icons/fa";

import { getAllCategories } from "../../../store/categoriesSlice";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import Category from "../../../components/Category/Category";

import "./CategoriesPage.css";

function CategoriesPage() {
    const dispatch = useDispatch();
    const { data, isLoading, error } = useSelector((state) => state.categories);
    
    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);
    
    // ===== Skeleton Loader =====
    const renderSkeletons = () => {
        return Array(6).fill(0).map((_, index) => (
            <div key={index} className="cp-skeleton">
                <div className="cp-skeleton-image"></div>
                <div className="cp-skeleton-content">
                    <div className="cp-skeleton-line cp-skeleton-line--title"></div>
                    <div className="cp-skeleton-line cp-skeleton-line--desc"></div>
                    <div className="cp-skeleton-line cp-skeleton-line--badge"></div>
                </div>
            </div>
        ));
    };
    
    // ===== Loading State =====
    if (isLoading) {
        return (
            <main className="categories-page">
                <div className="categories-page-container">
                    <SectionTitle
                        title="استكشف التصنيفات"
                        subtitle="تصفح مكتبتنا حسب اهتماماتك المختلفة"
                    />
                    <div className="categories-page-grid">{renderSkeletons()}</div>
                </div>
            </main>
        );
    }
    
    // ===== Error State =====
    if (error) {
        return (
            <main className="categories-page">
                <div className="categories-page-container">
                    <SectionTitle
                        title="استكشف التصنيفات"
                        subtitle="تصفح مكتبتنا حسب اهتماماتك المختلفة"
                    />
                    <div className="categories-page-state categories-page-state--error">
                        <div className="categories-page-state-icon">
                            <FaSync />
                        </div>
                        <h3 className="categories-page-state-title">عذراً، حدث خطأ</h3>
                        <p className="categories-page-state-message">{error}</p>
                        <button
                            className="categories-page-state-btn"
                            onClick={() => dispatch(getAllCategories())}
                        >
                            <FaSync /> إعادة المحاولة
                        </button>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Empty State =====
    if (!data || data.length === 0) {
        return (
            <main className="categories-page">
                <div className="categories-page-container">
                    <SectionTitle
                        title="استكشف التصنيفات"
                        subtitle="تصفح مكتبتنا حسب اهتماماتك المختلفة"
                    />
                    <div className="categories-page-state categories-page-state--empty">
                        <div className="categories-page-state-icon">
                            <FaThLarge />
                        </div>
                        <h3 className="categories-page-state-title">لا توجد تصنيفات</h3>
                        <p className="categories-page-state-message">
                            نعمل على إضافة التصنيفات قريباً، عُد لاحقاً!
                        </p>
                    </div>
                </div>
            </main>
        );
    }
    
    // ===== Main Render =====
    return (
        <main className="categories-page">
            <div className="categories-page-container">
                <SectionTitle
                    title="استكشف التصنيفات"
                    subtitle="تصفح مكتبتنا حسب اهتماماتك المختلفة"
                    badge={`${data.length} تصنيف`}
                />
                
                <div className="categories-page-grid">
                    {data.map((category, index) => (
                        <Category
                            key={category.id || category.documentId}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

export default CategoriesPage;