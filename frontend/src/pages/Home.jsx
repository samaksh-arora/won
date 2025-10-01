import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Wayne Opportunities Network</h1>
          <p className="hero-subtitle">
            Connect, Collaborate, and Grow with Wayne State University Students
          </p>
          <p className="hero-description">
            Build your professional network, find study partners, discover research
            collaborators, and connect with peers who share your academic and career
            interests.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/search" className="btn btn-primary">
                  Search Students
                </Link>
                <Link to="/profile" className="btn btn-secondary">
                  View My Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Join WON?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Academic Networking</h3>
            <p>Find study partners and form study groups with students in your major</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Career Connections</h3>
            <p>Connect with students who have internship experience in your field</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Wayne State email verification and privacy controls you can trust</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Search</h3>
            <p>Filter by major, internships, skills, and interests to find the right connections</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
