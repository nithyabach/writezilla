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
            <a href="#stories">Stories</a>
            <a href="#graphics">Graphics</a>
            <a href="#notes">Notes</a>
            <a href="#playlists">Playlists</a>
          </nav>
          <div className="user-profile">
            <div className="profile-icon">👤</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2 className="welcome-title">WHAT WILL YOU CREATE TODAY?</h2>
          <div className="action-buttons">
            <button className="action-button">Stories and Novels</button>
            <button className="action-button">Maps</button>
            <button className="action-button">Moodboards</button>
            <button className="action-button">Playlists</button>
          </div>
          <div className="search-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="AI enhanced search" 
                className="search-input"
              />
            </div>
          </div>
        </section>

        {/* Stories Section */}
        <section className="content-section">
          <h3 className="section-title">WRITING:</h3>
          <div className="card-grid">
            <div className="story-card">
              <div className="card-image story-1"></div>
              <h4 className="card-title">The Tom & Jerry Tale</h4>
            </div>
            <div className="story-card">
              <div className="card-image story-2"></div>
              <h4 className="card-title">Adventures of a Foodie</h4>
            </div>
            <div className="story-card">
              <div className="card-image story-3"></div>
              <h4 className="card-title">Ruby</h4>
            </div>
          </div>
        </section>

        {/* Maps Section */}
        <section className="content-section">
          <h3 className="section-title">MAPS:</h3>
          <div className="card-grid">
            <div className="story-card">
              <div className="card-image map-1"></div>
              <h4 className="card-title">Great Lake of Amerthyst</h4>
            </div>
            <div className="story-card">
              <div className="card-image map-2"></div>
              <h4 className="card-title">Road to the Neverwaters</h4>
            </div>
            <div className="story-card">
              <div className="card-image map-3"></div>
              <h4 className="card-title">Pixie Hollow's Winterland</h4>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 