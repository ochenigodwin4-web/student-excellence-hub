import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Student Excellence Hub 🎓</h1>
          <p className="hero-subtitle">Your Complete Platform for Academic Excellence & Social Development</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started Free</Link>
            <Link to="/resources" className="btn-secondary">Explore Courses</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Student Excellence Hub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Comprehensive Learning</h3>
            <p>Access thousands of curated study materials, tutorials, and learning guides designed to boost academic performance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Social Skills Development</h3>
            <p>Develop essential communication, leadership, and teamwork abilities through interactive programs and workshops.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement with detailed analytics, performance reports, and achievement badges.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Vibrant Community</h3>
            <p>Connect with peers, share experiences, collaborate on projects, and support each other's growth.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Goal Setting Tools</h3>
            <p>Set, track, and achieve your academic and personal goals with our intelligent goal management system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Gamification & Rewards</h3>
            <p>Earn points, unlock badges, and climb the leaderboard as you progress through your learning journey.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat">
          <h2>10,000+</h2>
          <p>Active Students</p>
        </div>
        <div className="stat">
          <h2>500+</h2>
          <p>Expert Courses</p>
        </div>
        <div className="stat">
          <h2>95%</h2>
          <p>Success Rate</p>
        </div>
        <div className="stat">
          <h2>24/7</h2>
          <p>Support Team</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Your Learning Journey?</h2>
        <p>Join thousands of students who are already improving their academic excellence and social skills.</p>
        <Link to="/register" className="btn-primary btn-large">Start Your Free Trial Today</Link>
      </section>
    </div>
  );
};

export default Home;
