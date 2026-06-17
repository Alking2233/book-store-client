import React from "react";
import Categories from "../../../components/Categories/Categories";
import Books from "../../../components/Books/Books";
import Hero from "../../../components/Hero/Hero";
import Authors from "../../../components/Authors/Authors";
import Blogs from "../../../components/Blogs/Blogs";
import NewsLetter from "../../../components/NewsLetter/NewsLetter";
import "./Home.css";

function Home() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="home-section home-hero-section">
                <Hero />
            </section>
            
            {/* Categories Section */}
            <section className="home-section home-categories-section">
                <Categories />
            </section>
            
            {/* Books Section */}
            <section className="home-section home-books-section">
                <Books />
            </section>
            
            {/* Authors Section */}
            <section className="home-section home-authors-section">
                <Authors />
            </section>
            
            {/* Blogs Section */}
            <section className="home-section home-blogs-section">
                <Blogs />
            </section>
            
            {/* Newsletter Section */}
            <section className="home-section home-newsletter-section">
                <NewsLetter />
            </section>
        </div>
    );
}

export default Home;