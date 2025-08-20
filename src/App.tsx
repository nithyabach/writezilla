import React from 'react';
import './App.css';

function App() {
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
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
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