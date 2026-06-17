import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/global/Navbar/Navbar";
import Footer from "./components/global/Footer/Footer";
import QuickViewModal from "./components/QuickView/QuickViewModal";

// Pages
import Home from "./assets/pages/HomePage/Home";
import CategoriesPage from "./assets/pages/CategoriesPage/CategoriesPage";
import BooksPage from "./assets/pages/BooksPage/BooksPage";
import AboutUs from "./assets/pages/AboutUs/AboutUs";
import Contact from "./assets/pages/Contact/Contact";
import BookDetails from "./assets/pages/BookDetails/BookDetails";
import CategoryPage from "./assets/pages/CategoryPage/CategoryPage";
import SearchPage from "./assets/pages/SearchPage/SearchPage";
import BlogDetails from "./assets/pages/BlogDetails/BlogDetails";
import Blogs from "./components/Blogs/Blogs";
import Cart from "./assets/pages/Cart/Cart";              // ← 🆕 أضف
import Account from "./assets/pages/Account/Account";      // ← 🆕 أضف
import NotFound from "./assets/pages/NotFound/NotFound";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <QuickViewModal />
            
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/books" element={<BooksPage />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/book/:id" element={<BookDetails />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blog/:documentId" element={<BlogDetails />} />
                    <Route path="/cart" element={<Cart />} />              {/* ← 🆕 */}
                    <Route path="/account" element={<Account />} />        {/* ← 🆕 */}
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            
            <Footer />
        </BrowserRouter>
    );
}

export default App;