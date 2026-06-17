import { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { navLinks } from '../../../data/links';
import { ThemeContext } from '../../../context/ThemeContext';
import logoImg from "../../../assets/images/logo.png";

// React Icons
import { 
    FaSearch, 
    FaShoppingCart, 
    FaHeart, 
    FaUser,
    FaMoon,
    FaSun,
    FaBars,
    FaTimes
} from 'react-icons/fa';

import "./navbarStyle.css";

function Navbar() {
    const [query, setQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // ===== 🆕 State للعدّادات =====
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    
    // ===== 🆕 قراءة Cart و Wishlist من localStorage =====
    useEffect(() => {
        const updateCounts = () => {
            try {
                // Cart count
                const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                const totalCart = cart.reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                );
                setCartCount(totalCart);
                
                // Wishlist count
                const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
                setWishlistCount(wishlist.length);
            } catch {
                setCartCount(0);
                setWishlistCount(0);
            }
        };
        
        // قراءة أولية
        updateCounts();
        
        // الاستماع لتغييرات localStorage (من tabs أخرى)
        window.addEventListener("storage", updateCounts);
        
        // الاستماع لحدث مخصص (من نفس التبويب)
        window.addEventListener("cartUpdated", updateCounts);
        window.addEventListener("wishlistUpdated", updateCounts);
        
        return () => {
            window.removeEventListener("storage", updateCounts);
            window.removeEventListener("cartUpdated", updateCounts);
            window.removeEventListener("wishlistUpdated", updateCounts);
        };
    }, []);
    
    // Search with Debounce
    useEffect(() => {
        const timeOut = setTimeout(() => {
            const clearQuery = query.trim();
            if (clearQuery) {
                navigate(`/search?q=${clearQuery}`);
                setIsMobileMenuOpen(false);
            }
        }, 800);
        
        return () => clearTimeout(timeOut);
    }, [query, navigate]);
    
    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    
    return (
        <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="main-navbar">
                <div className="navbar-container">
                    
                    {/* Logo */}
                    <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
                        <img src={logoImg} alt="مكتبتي" className="navbar-logo" />
                        <span className="brand-text">مكتبتي</span>
                    </Link>
                    
                    {/* Search Bar (Desktop) */}
                    <form 
                        className="search-form-desktop" 
                        role="search" 
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="search-wrapper">
                            <FaSearch className="search-icon" />
                            <input 
                                type="search" 
                                className="search-input"
                                placeholder="ابحث عن كتاب، مؤلف، تصنيف..." 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="بحث"
                            />
                            {query && (
                                <button 
                                    type="button"
                                    className="search-clear"
                                    onClick={() => setQuery("")}
                                    aria-label="مسح البحث"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </form>
                    
                    {/* Nav Links (Desktop) */}
                    <ul className="nav-links-desktop">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <li key={link.id}>
                                    <NavLink 
                                        to={link.link}
                                        className={({ isActive }) => 
                                            `nav-link ${isActive ? 'active' : ''}`
                                        }
                                        end={link.link === '/'}
                                    >
                                        {Icon && <Icon className="nav-link-icon" />}
                                        <span>{link.title}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                    
                    {/* Action Icons */}
                    <div className="navbar-actions">
                        {/* Theme Toggle */}
                        <button 
                            className="action-btn theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`تبديل إلى الوضع ${theme === "light" ? "الليلي" : "النهاري"}`}
                            title={theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}
                        >
                            {theme === "light" ? <FaMoon /> : <FaSun />}
                        </button>
                        
                        {/* Wishlist */}
                        <Link to="/account" className="action-btn" aria-label="المفضلة" title="المفضلة">
                            <FaHeart />
                            {wishlistCount > 0 && (
                                <span className="badge-count">{wishlistCount}</span>
                            )}
                        </Link>
                        
                        {/* Cart */}
                        <Link to="/cart" className="action-btn" aria-label="السلة" title="السلة">
                            <FaShoppingCart />
                            {cartCount > 0 && (
                                <span className="badge-count">{cartCount}</span>
                            )}
                        </Link>
                        
                        {/* User Account */}
                        <Link to="/account" className="action-btn" aria-label="حسابي" title="حسابي">
                            <FaUser />
                        </Link>
                        
                        {/* Mobile Menu Toggle */}
                        <button 
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="فتح القائمة"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </nav>
            
            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <form 
                    className="search-form-mobile" 
                    role="search"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input 
                            type="search" 
                            className="search-input"
                            placeholder="ابحث..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </form>
                
                <ul className="nav-links-mobile">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <li key={link.id}>
                                <NavLink 
                                    to={link.link}
                                    className={({ isActive }) => 
                                        `nav-link-mobile ${isActive ? 'active' : ''}`
                                    }
                                    end={link.link === '/'}
                                    onClick={closeMobileMenu}
                                >
                                    {Icon && <Icon className="nav-link-icon" />}
                                    <span>{link.title}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            {isMobileMenuOpen && (
                <div 
                    className="mobile-menu-overlay"
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
            )}
        </header>
    );
}

export default Navbar;