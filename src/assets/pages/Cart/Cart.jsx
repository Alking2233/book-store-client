import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaBookOpen,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaTruck,
  FaTag,
  FaLock,
  FaCreditCard,
  FaMoneyBillWave,
  FaGift,
} from "react-icons/fa";

import "./Cart.css";

const SHIPPING_COST = 25;
const FREE_SHIPPING_THRESHOLD = 200;

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  // ===== تحميل السلة من localStorage =====
  useEffect(() => {
    loadCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
    } catch {
      setCartItems([]);
    }
  };

  // ===== تحديث الكمية =====
  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ===== حذف عنصر =====
  const removeItem = (id) => {
    const filtered = cartItems.filter((item) => item.id !== id);
    setCartItems(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ===== تفريغ السلة =====
  const clearCart = () => {
    if (window.confirm("هل أنت متأكد من تفريغ السلة؟")) {
      setIsClearing(true);
      setTimeout(() => {
        setCartItems([]);
        localStorage.setItem("cart", "[]");
        window.dispatchEvent(new Event("cartUpdated"));
        setAppliedCoupon(null);
        setCouponMessage(null);
        setIsClearing(false);
      }, 300);
    }
  };

  // ===== تطبيق كوبون =====
  const applyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (!code) return;

    // أكواد افتراضية (يمكن استبدالها بـ API)
    const validCoupons = {
      WELCOME10: { discount: 10, type: "percent", name: "خصم ترحيبي 10%" },
      BOOK20: { discount: 20, type: "percent", name: "خصم 20% على الكتب" },
      SAVE50: { discount: 50, type: "fixed", name: "خصم 50 ريال" },
      FREESHIP: { discount: 0, type: "free_shipping", name: "شحن مجاني" },
    };

    if (validCoupons[code]) {
      setAppliedCoupon({ code, ...validCoupons[code] });
      setCouponMessage({
        type: "success",
        text: `تم تطبيق "${validCoupons[code].name}" بنجاح! 🎉`,
      });
      setCouponCode("");
      setTimeout(() => setCouponMessage(null), 4000);
    } else {
      setCouponMessage({ type: "error", text: "كود الكوبون غير صحيح" });
      setTimeout(() => setCouponMessage(null), 3000);
    }
  };

  // ===== إزالة الكوبون =====
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage({ type: "info", text: "تم إزالة الكوبون" });
    setTimeout(() => setCouponMessage(null), 2000);
  };

  // ===== الحسابات =====
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );

  let discount = 0;
  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discount = (subtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discount = Math.min(appliedCoupon.discount, subtotal);
    } else if (appliedCoupon.type === "free_shipping") {
      shipping = 0;
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // ===== Checkout =====
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert(
      `تم إنشاء طلبك بنجاح! 🎉\nالإجمالي: ${total.toFixed(
        2
      )} ريال\n\n(هذه نسخة تجريبية - يمكن ربطها بـ Backend لاحقاً)`
    );
  };

  // ===== Empty Cart =====
  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="ct-container">
          {/* Breadcrumb */}
          <nav className="cart-breadcrumb" aria-label="مسار التنقل">
            <Link to="/" className="cart-breadcrumb-item">
              <FaHome />
              <span>الرئيسية</span>
            </Link>
            <FaArrowRight className="cart-breadcrumb-separator" />
            <span className="cart-breadcrumb-item cart-breadcrumb-current">
              <FaShoppingCart />
              <span>السلة</span>
            </span>
          </nav>

          <div className="cart-empty">
            <div className="cart-empty-icon">
              <FaShoppingCart />
            </div>
            <h2 className="cart-empty-title">سلة التسوق فارغة</h2>
            <p className="cart-empty-message">
              لم تقم بإضافة أي كتب إلى سلتك بعد.
              <br />
              ابدأ التسوق واكتشف مجموعتنا الرائعة!
            </p>
            <div className="cart-empty-actions">
              <Link to="/books" className="cart-btn cart-btn--primary">
                <FaBookOpen />
                تصفّح الكتب
              </Link>
              <Link to="/categories" className="cart-btn cart-btn--outline">
                <FaTag />
                التصنيفات
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="ct-container">
        {/* Breadcrumb */}
        <nav className="cart-breadcrumb" aria-label="مسار التنقل">
          <Link to="/" className="cart-breadcrumb-item">
            <FaHome />
            <span>الرئيسية</span>
          </Link>
          <FaArrowRight className="cart-breadcrumb-separator" />
          <span className="cart-breadcrumb-item cart-breadcrumb-current">
            <FaShoppingCart />
            <span>السلة ({itemsCount})</span>
          </span>
        </nav>

        {/* Header */}
        <div className="cart-header">
          <div>
            <h1 className="cart-title">
              <FaShoppingCart />
              سلة التسوق
            </h1>
            <p className="cart-subtitle">
              لديك <strong>{itemsCount}</strong>{" "}
              {itemsCount === 1 ? "كتاب" : "كتاب"} في السلة
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              className="cart-clear-btn"
              onClick={clearCart}
              disabled={isClearing}
            >
              <FaTrash />
              <span>تفريغ السلة</span>
            </button>
          )}
        </div>

        {/* Free Shipping Progress */}
        {amountToFreeShipping > 0 && (
          <div className="cart-shipping-banner">
            <div className="cart-shipping-banner-content">
              <FaTruck className="cart-shipping-banner-icon" />
              <p>
                أضف <strong>{amountToFreeShipping.toFixed(2)} ريال</strong> فقط
                للحصول على
                <strong> شحن مجاني</strong>! 🚚
              </p>
            </div>
            <div className="cart-shipping-progress">
              <div
                className="cart-shipping-progress-bar"
                style={{
                  width: `${Math.min(
                    100,
                    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {subtotal >= FREE_SHIPPING_THRESHOLD && (
          <div className="cart-shipping-banner cart-shipping-banner--success">
            <div className="cart-shipping-banner-content">
              <FaCheckCircle className="cart-shipping-banner-icon" />
              <p>
                <strong>تهانينا! 🎉</strong> أنت مؤهل للحصول على
                <strong> شحن مجاني</strong>
              </p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="cart-main">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h3>المنتجات</h3>
              <span className="cart-items-count">{itemsCount} عنصر</span>
            </div>

            <div className={`cart-items ${isClearing ? "is-clearing" : ""}`}>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  {/* Image */}
                  <Link to={`/book/${item.id}`} className="cart-item-image">
                    <img
                      src={item.image || "/images/defaults/default-book.jpg"}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "/images/defaults/default-book.jpg";
                      }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="cart-item-info">
                    <Link to={`/book/${item.id}`} className="cart-item-title">
                      {item.title}
                    </Link>

                    {item.author && (
                      <p className="cart-item-author">
                        <strong>المؤلف:</strong> {item.author}
                      </p>
                    )}

                    <div className="cart-item-price">
                      <span className="cart-item-price-current">
                        {item.price} ريال
                      </span>
                      {item.oldPrice && (
                        <span className="cart-item-price-old">
                          {item.oldPrice} ريال
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="cart-item-quantity">
                    <span className="cart-item-quantity-label">الكمية:</span>
                    <div className="cart-item-quantity-control">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="تقليل"
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="زيادة"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  {/* Total + Remove */}
                  <div className="cart-item-actions">
                    <div className="cart-item-total">
                      <span className="cart-item-total-label">الإجمالي</span>
                      <strong className="cart-item-total-value">
                        {(item.price * item.quantity).toFixed(2)} ريال
                      </strong>
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label="حذف"
                      title="حذف من السلة"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link to="/books" className="cart-continue">
              <FaArrowRight />
              <span>مواصلة التسوق</span>
            </Link>
          </div>

          {/* Sidebar - Summary */}
          <aside className="cart-sidebar">
            {/* Coupon */}
            <div className="cart-coupon-card">
              <h3 className="cart-coupon-title">
                <FaGift />
                هل لديك كوبون خصم؟
              </h3>

              {appliedCoupon ? (
                <div className="cart-coupon-applied">
                  <div className="cart-coupon-applied-info">
                    <FaCheckCircle />
                    <div>
                      <strong>{appliedCoupon.code}</strong>
                      <span>{appliedCoupon.name}</span>
                    </div>
                  </div>
                  <button className="cart-coupon-remove" onClick={removeCoupon}>
                    إزالة
                  </button>
                </div>
              ) : (
                <form className="cart-coupon-form" onSubmit={applyCoupon}>
                  <input
                    type="text"
                    className="cart-coupon-input"
                    placeholder="أدخل كود الكوبون"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="cart-coupon-btn"
                    disabled={!couponCode.trim()}
                  >
                    تطبيق
                  </button>
                </form>
              )}

              {couponMessage && (
                <p
                  className={`cart-coupon-msg cart-coupon-msg--${couponMessage.type}`}
                >
                  {couponMessage.type === "success" && <FaCheckCircle />}
                  {couponMessage.type === "error" && <FaExclamationCircle />}
                  {couponMessage.text}
                </p>
              )}

              <p className="cart-coupon-hint">
                💡 جرّب: <code>WELCOME10</code>, <code>SAVE50</code>,{" "}
                <code>FREESHIP</code>
              </p>
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3 className="cart-summary-title">ملخص الطلب</h3>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>المجموع الفرعي ({itemsCount} عنصر)</span>
                  <strong>{subtotal.toFixed(2)} ريال</strong>
                </div>

                {discount > 0 && (
                  <div className="cart-summary-row cart-summary-row--discount">
                    <span>الخصم</span>
                    <strong>-{discount.toFixed(2)} ريال</strong>
                  </div>
                )}

                <div className="cart-summary-row">
                  <span>الشحن</span>
                  <strong>
                    {shipping === 0 ? (
                      <span className="cart-free-shipping">مجاني 🎉</span>
                    ) : (
                      `${shipping.toFixed(2)} ريال`
                    )}
                  </strong>
                </div>

                <div className="cart-summary-divider"></div>

                <div className="cart-summary-row cart-summary-row--total">
                  <span>الإجمالي النهائي</span>
                  <strong>{total.toFixed(2)} ريال</strong>
                </div>
              </div>

              <button className="cart-checkout-btn" onClick={handleCheckout}>
                <FaLock />
                <span>إتمام الشراء</span>
                <FaArrowLeft />
              </button>

              {/* Trust Badges */}
              <div className="cart-trust">
                <div className="cart-trust-item">
                  <FaShieldAlt />
                  <span>دفع آمن 100%</span>
                </div>
                <div className="cart-trust-item">
                  <FaTruck />
                  <span>شحن سريع</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="cart-payment-methods">
                <span>طرق الدفع المتاحة:</span>
                <div className="cart-payment-icons">
                  <FaCreditCard title="بطاقة ائتمان" />
                  <FaMoneyBillWave title="نقداً عند الاستلام" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;
