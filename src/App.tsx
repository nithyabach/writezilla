import React from 'react';
import './App.css';
import GoogleAuth from './components/auth/GoogleAuth';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">WRITEZILLA</h1>
          <nav className="navigation">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
          <GoogleAuth />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {isAuthenticated ? (
          <div className="dashboard-section">
            <h2 className="dashboard-title">Welcome back, {user?.name}!</h2>
            <p className="dashboard-subtitle">Ready to create something amazing?</p>
            <div className="dashboard-actions">
              <button className="dashboard-btn primary">Create New Story</button>
              <button className="dashboard-btn secondary">View My Stories</button>
            </div>
            <div className="quick-stats">
              <div className="stat-card">
                <h3>0</h3>
                <p>Stories</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Words Written</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Days Active</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="hello-world-section">
            <h2 className="hello-title">Hello World!</h2>
            <p className="hello-subtitle">Welcome to Writezilla</p>
            <p className="hello-description">
              Your creative writing companion for stories, novels, and inspiration.
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary">Get Started</button>
              <button className="cta-button secondary">Learn More</button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Writezilla. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 