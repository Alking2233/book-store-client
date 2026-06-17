import { Link } from 'react-router-dom';
import { FaBook, FaArrowLeft, FaThLarge } from 'react-icons/fa';
import './Category.css';

function Category({ category, index = 0 }) {
    // استخراج البيانات
    const categoryData = category?.attributes || category;

    // معالجة رابط الصورة
    const imageUrl = categoryData?.image?.data?.attributes?.url 
        ? `http://localhost:1337${categoryData.image.data.attributes.url}`
        : categoryData?.image?.url 
            ? `http://localhost:1337${categoryData.image.url}`
            : null;

    // حساب عدد الكتب
    const booksCount = 
        categoryData?.NumOfBooks ?? 
        categoryData?.books_count ?? 
        categoryData?.books?.data?.length ?? 
        0;

    // اسم التصنيف
    const categoryName = categoryData?.name || categoryData?.Title || 'تصنيف';
    
    // رابط التصنيف
    const categoryLink = `/category/${categoryData?.documentId || categoryData?.id}`;

    // ألوان متغيرة للبطاقات (للتنويع)
    const gradients = [
        'gradient-1', 'gradient-2', 'gradient-3', 
        'gradient-4', 'gradient-5', 'gradient-6'
    ];
    const gradientClass = gradients[index % gradients.length];

    return (
        <Link 
            to={categoryLink}
            className={`category-card ${gradientClass}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* صورة التصنيف */}
            <div className="category-image-wrapper">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={categoryName} 
                        className="category-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.classList.add('no-image');
                        }}
                    />
                ) : (
                    <div className="category-image-placeholder">
                        <FaThLarge />
                    </div>
                )}
                
                {/* Overlay عند الـ Hover */}
                <div className="category-overlay">
                    <div className="category-overlay-content">
                        <span className="category-overlay-text">
                            استكشف الآن
                        </span>
                        <FaArrowLeft className="category-overlay-arrow" />
                    </div>
                </div>
            </div>
            
            {/* معلومات التصنيف */}
            <div className="category-info">
                <div className="category-info-header">
                    <h3 className="category-name">{categoryName}</h3>
                    
                    {booksCount > 0 && (
                        <span className="category-count">
                            <FaBook className="category-count-icon" />
                            <span>{booksCount}</span>
                        </span>
                    )}
                </div>
                
                {categoryData?.description && (
                    <p className="category-description">
                        {categoryData.description.length > 80 
                            ? `${categoryData.description.substring(0, 80)}...` 
                            : categoryData.description
                        }
                    </p>
                )}
                
                <div className="category-footer">
                    <span className="category-link-text">
                        تصفح التصنيف
                        <FaArrowLeft />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default Category;