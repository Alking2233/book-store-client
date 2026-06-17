import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import {
  FaSync,
  FaBookOpen,
  FaHome,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaDownload,
  FaCheck,
  FaTruck,
  FaTimesCircle,
  FaUserEdit,
  FaBuilding,
  FaBarcode,
  FaFileAlt,
  FaCalendarAlt,
  FaBoxes,
  FaMinus,
  FaPlus,
  FaArrowRight,
  FaTag,
  FaSearchPlus,
} from "react-icons/fa";

import api from "../../../data/api";
import Book from "../../../components/Book/Book";
import StarRating from "../../../components/StarRating/StarRating";

import "./BookDetails.css";

const API_URL = "http://localhost:1337";
const DEFAULT_IMAGE = "/images/defaults/default-book.jpg";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageZoom, setImageZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ===== جلب بيانات الكتاب =====
  useEffect(() => {
    let mounted = true;

    const fetchBook = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await api.get(`/books/${id}?populate=*`);
        if (mounted) {
          setBook(data.data);
          setSelectedImage(0);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.error?.message ||
              "حدث خطأ أثناء تحميل بيانات الكتاب"
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBook();

    return () => {
      mounted = false;
    };
  }, [id]);

  // ===== جلب الكتب ذات الصلة =====
  useEffect(() => {
    if (!book) return;

    const fetchRelated = async () => {
      try {
        const categoryId =
          book.categories?.[0]?.documentId ||
          book.category_ids?.[0]?.documentId ||
          book.category_ids?.[0]?.id;

        if (!categoryId) {
          // إذا لم يكن هناك تصنيف، اجلب أحدث الكتب
          const res = await api.get(
            `/books?populate=*&pagination[limit]=4&filters[id][$ne]=${book.id}`
          );
          setRelatedBooks(res.data.data || []);
          return;
        }

        const res = await api.get(
          `/books?populate=*&pagination[limit]=4&filters[id][$ne]=${book.id}`
        );
        setRelatedBooks(res.data.data || []);
      } catch (err) {
        console.warn("لم نتمكن من جلب الكتب ذات الصلة");
      }
    };

    fetchRelated();
  }, [book]);

  // ===== استرجاع المفضلة =====
  useEffect(() => {
    if (book?.documentId) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setIsWishlisted(wishlist.includes(book.documentId));
    }
  }, [book]);

  // ===== البيانات المعالجة =====
  const bookData = book || {};

  const allImages = useMemo(() => {
    const images = [];

    // الصورة الرئيسية
    if (bookData.image?.url) {
      images.push({
        url: `${API_URL}${bookData.image.url}`,
        alt: bookData.Title,
      });
    }

    // معرض الصور
    if (Array.isArray(bookData.gallery)) {
      bookData.gallery.forEach((img, index) => {
        if (img.url) {
          images.push({
            url: `${API_URL}${img.url}`,
            alt: `${bookData.Title} - ${index + 1}`,
          });
        }
      });
    }

    return images;
  }, [bookData]);

  const currentImage = allImages[selectedImage] || {
    url: DEFAULT_IMAGE,
    alt: "",
  };

  // ===== Helpers =====
  const hasDiscount = bookData.oldPrice && bookData.oldPrice > bookData.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((bookData.oldPrice - bookData.price) / bookData.oldPrice) * 100
      )
    : 0;

  const stock = bookData.stock ?? bookData.quantity ?? 10;
  const isAvailable = bookData.Available ?? stock > 0;
  const isLowStock = stock > 0 && stock < 10;

  const rating = bookData.rating || 4.5;
  const reviewsCount = bookData.reviewsCount || 0;

  const formattedDate = useMemo(() => {
    if (!bookData.publishedDate) return null;
    try {
      return new Date(bookData.publishedDate).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return null;
    }
  }, [bookData.publishedDate]);

  // ===== Handlers =====
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newVal = prev + delta;
      if (newVal < 1) return 1;
      if (newVal > stock) return stock;
      return newVal;
    });
  };

  const handleAddToCart = () => {
    if (!isAvailable || !book?.documentId) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === book.documentId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: book.documentId,
        title: bookData.Title,
        author: bookData.author,
        price: bookData.price,
        image: currentImage.url,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (!book?.documentId) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const newWishlist = isWishlisted
      ? wishlist.filter((id) => id !== book.documentId)
      : [...wishlist, book.documentId];

    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: bookData.Title,
          text: bookData.shortDescription,
          url: window.location.href,
        });
      } catch {
        // المستخدم ألغى
      }
    } else {
      // نسخ الرابط للحافظة
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط!");
    }
  };

  // ===== Breadcrumb =====
  const Breadcrumb = () => (
    <nav className="bd-breadcrumb" aria-label="مسار التنقل">
      <Link to="/" className="bd-breadcrumb-item">
        <FaHome />
        <span>الرئيسية</span>
      </Link>
      <FaArrowRight className="bd-breadcrumb-separator" />
      <Link to="/books" className="bd-breadcrumb-item">
        <FaBookOpen />
        <span>الكتب</span>
      </Link>
      <FaArrowRight className="bd-breadcrumb-separator" />
      <span className="bd-breadcrumb-item bd-breadcrumb-current">
        {bookData.Title || "تفاصيل الكتاب"}
      </span>
    </nav>
  );

  // ===== Loading State =====
  if (isLoading) {
    return (
      <main className="book-details-page">
        <div className="bd-container">
          <div className="bd-loading">
            <div className="bd-spinner"></div>
            <p>جاري تحميل تفاصيل الكتاب...</p>
          </div>
        </div>
      </main>
    );
  }

  // ===== Error State =====
  if (error || !book) {
    return (
      <main className="book-details-page">
        <div className="bd-container">
          <div className="bd-state bd-state--error">
            <div className="bd-state-icon">
              <FaTimesCircle />
            </div>
            <h2 className="bd-state-title">
              {error ? "حدث خطأ" : "الكتاب غير موجود"}
            </h2>
            <p className="bd-state-message">
              {error || "لم نتمكن من العثور على الكتاب المطلوب"}
            </p>
            <div className="bd-state-actions">
              <button
                className="bd-btn bd-btn--primary"
                onClick={() => navigate(-1)}
              >
                <FaArrowRight /> العودة للخلف
              </button>
              <Link to="/books" className="bd-btn bd-btn--outline">
                <FaBookOpen /> تصفح الكتب
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="book-details-page">
      <div className="bd-container">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* المحتوى الرئيسي */}
        <div className="bd-main">
          {/* ===== قسم الصور ===== */}
          <div className="bd-images">
            {/* الصورة الرئيسية */}
            <div
              className="bd-main-image"
              onMouseEnter={() => setImageZoom(true)}
              onMouseLeave={() => setImageZoom(false)}
            >
              <img
                src={imageError ? DEFAULT_IMAGE : currentImage.url}
                alt={currentImage.alt}
                className={`bd-cover ${imageZoom ? "is-zoomed" : ""}`}
                onError={() => setImageError(true)}
              />

              <div className="bd-image-overlay">
                <FaSearchPlus />
                <span>تكبير</span>
              </div>

              {/* Badges */}
              <div className="bd-badges">
                {hasDiscount && (
                  <span className="bd-badge bd-badge--discount">
                    خصم {discountPercent}%
                  </span>
                )}
                {bookData.isNew && (
                  <span className="bd-badge bd-badge--new">جديد</span>
                )}
                {bookData.isBestseller && (
                  <span className="bd-badge bd-badge--bestseller">
                    الأكثر مبيعاً
                  </span>
                )}
              </div>

              {/* شارة التوفر */}
              <span
                className={`bd-availability ${
                  isAvailable ? "is-available" : "is-unavailable"
                }`}
              >
                {isAvailable ? (
                  <>
                    <FaTruck /> متاح للشحن
                  </>
                ) : (
                  <>
                    <FaTimesCircle /> غير متاح
                  </>
                )}
              </span>
            </div>

            {/* معرض الصور المصغرة */}
            {allImages.length > 1 && (
              <div className="bd-thumbnails">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    className={`bd-thumb ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`صورة ${index + 1}`}
                  >
                    <img src={img.url} alt={img.alt} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== قسم المعلومات ===== */}
          <div className="bd-info">
            {/* العنوان */}
            <div className="bd-header">
              <h1 className="bd-title">{bookData.Title}</h1>
              <p className="bd-author-line">
                تأليف: <strong>{bookData.author || "غير معروف"}</strong>
                {bookData.publisher && (
                  <>
                    {" • "}
                    <span>{bookData.publisher}</span>
                  </>
                )}
              </p>
            </div>

            {/* التقييم */}
            <div className="bd-rating">
              <StarRating
                averageRating={rating}
                totalReviews={reviewsCount}
                bookId={book.documentId}
                size="md"
                interactive={true}
              />
            </div>

            {/* السعر */}
            <div className="bd-price-card">
              <div className="bd-price-row">
                <span className="bd-price-current">{bookData.price || 0}</span>
                <span className="bd-price-currency">ريال</span>

                {hasDiscount && (
                  <span className="bd-price-old">{bookData.oldPrice} ريال</span>
                )}
              </div>

              {stock !== null && (
                <div className={`bd-stock ${isLowStock ? "is-low" : ""}`}>
                  <FaBoxes />
                  {stock > 0 ? `المتوفر: ${stock} نسخة` : "نفذت الكمية"}
                </div>
              )}
            </div>

            {/* الوصف */}
            {bookData.shortDescription && (
              <p className="bd-short-desc">{bookData.shortDescription}</p>
            )}

            {/* معلومات الكتاب */}
            <div className="bd-info-grid">
              {bookData.author && (
                <div className="bd-info-item">
                  <FaUserEdit className="bd-info-icon" />
                  <div>
                    <span className="bd-info-label">المؤلف</span>
                    <strong className="bd-info-value">{bookData.author}</strong>
                  </div>
                </div>
              )}

              {bookData.publisher && (
                <div className="bd-info-item">
                  <FaBuilding className="bd-info-icon" />
                  <div>
                    <span className="bd-info-label">الناشر</span>
                    <strong className="bd-info-value">
                      {bookData.publisher}
                    </strong>
                  </div>
                </div>
              )}

              {bookData.isbn && (
                <div className="bd-info-item">
                  <FaBarcode className="bd-info-icon" />
                  <div>
                    <span className="bd-info-label">ISBN</span>
                    <strong className="bd-info-value">{bookData.isbn}</strong>
                  </div>
                </div>
              )}

              {bookData.pages && (
                <div className="bd-info-item">
                  <FaFileAlt className="bd-info-icon" />
                  <div>
                    <span className="bd-info-label">الصفحات</span>
                    <strong className="bd-info-value">
                      {bookData.pages} صفحة
                    </strong>
                  </div>
                </div>
              )}

              {formattedDate && (
                <div className="bd-info-item">
                  <FaCalendarAlt className="bd-info-icon" />
                  <div>
                    <span className="bd-info-label">تاريخ النشر</span>
                    <strong className="bd-info-value">{formattedDate}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* التصنيفات */}
            {(bookData.categories?.length > 0 ||
              bookData.category_ids?.length > 0) && (
              <div className="bd-categories">
                <span className="bd-categories-label">
                  <FaTag /> التصنيفات:
                </span>
                <div className="bd-category-tags">
                  {(bookData.categories || bookData.category_ids || []).map(
                    (cat) => {
                      const catData = cat?.attributes || cat;
                      const catId = catData?.documentId || catData?.id;
                      const catName =
                        catData?.name || catData?.Title || "تصنيف";

                      return (
                        <Link
                          key={catId}
                          to={`/category/${catId}`}
                          className="bd-category-tag"
                        >
                          {catName}
                        </Link>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* الكمية */}
            {isAvailable && (
              <div className="bd-quantity">
                <span className="bd-quantity-label">الكمية:</span>
                <div className="bd-quantity-control">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    aria-label="تقليل"
                  >
                    <FaMinus />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    aria-label="زيادة"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            )}

            {/* الأزرار الرئيسية */}
            <div className="bd-actions">
              <button
                className={`bd-btn bd-btn--primary bd-btn--lg ${
                  addedToCart ? "is-added" : ""
                }`}
                onClick={handleAddToCart}
                disabled={!isAvailable}
              >
                {addedToCart ? (
                  <>
                    <FaCheck /> تمت الإضافة
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    {isAvailable ? "إضافة للسلة" : "غير متوفر"}
                  </>
                )}
              </button>

              {bookData.download?.url && (
                <a
                  href={`${API_URL}${bookData.download.url}`}
                  className="bd-btn bd-btn--outline bd-btn--lg"
                  download
                >
                  <FaDownload /> تحميل العينة
                </a>
              )}
            </div>

            {/* أزرار ثانوية */}
            <div className="bd-secondary-actions">
              <button
                className={`bd-icon-btn ${isWishlisted ? "is-active" : ""}`}
                onClick={handleWishlist}
                aria-label="المفضلة"
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                <span>{isWishlisted ? "إزالة من المفضلة" : "أضف للمفضلة"}</span>
              </button>

              <button
                className="bd-icon-btn"
                onClick={handleShare}
                aria-label="مشاركة"
              >
                <FaShareAlt />
                <span>مشاركة</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== المحتوى التفصيلي ===== */}
        {bookData.content && bookData.content.length > 0 && (
          <section className="bd-content-section">
            <div className="bd-content-header">
              <h2 className="bd-content-title">
                <FaBookOpen /> عن الكتاب
              </h2>
            </div>

            <div className="bd-content-body">
              <BlocksRenderer content={bookData.content} />
            </div>
          </section>
        )}

        {/* ===== الكتب ذات الصلة ===== */}
        {relatedBooks.length > 0 && (
          <section className="bd-related">
            <h2 className="bd-related-title">
              <FaBookOpen /> كتب قد تعجبك
            </h2>
            <div className="bd-related-grid">
              {relatedBooks.slice(0, 4).map((relBook) => (
                <Book key={relBook.id || relBook.documentId} book={relBook} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default BookDetails;
