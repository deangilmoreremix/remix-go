import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function BrandHeader({ showBackButton = true, onBackClick }) {
  const { theme } = useTheme();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Default behavior: navigate back to main app
      window.location.href = '/';
    }
  };

  return (
    <header
      className="brand-header"
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.light,
        borderBottom: `2px solid ${theme.colors.accent}`
      }}
    >
      <div className="header-content">
        {showBackButton && (
          <button
            className="back-button"
            onClick={handleBackClick}
            aria-label="Back to main app"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: theme.colors.light,
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span className="back-text">Back to {theme.name}</span>
          </button>
        )}

        <div className="brand-info">
          <img
            src={theme.logo}
            alt={`${theme.name} logo`}
            className="brand-logo"
            style={{ height: '32px', width: 'auto' }}
          />
          <div className="brand-details">
            <h1
              className="brand-name"
              style={{
                fontFamily: theme.typography?.fontFamily,
                margin: 0,
                fontSize: '20px',
                fontWeight: '600'
              }}
            >
              {theme.name} Video Editor
            </h1>
            <p
              className="brand-tagline"
              style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                opacity: 0.9
              }}
            >
              Powered by Remix Go
            </p>
          </div>
        </div>

        <div className="header-actions">
          {/* Additional header actions can go here */}
        </div>
      </div>

      <style jsx>{`
        .brand-header {
          padding: 16px 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .back-text {
          font-size: 14px;
        }

        .brand-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          justify-content: center;
        }

        .brand-logo {
          border-radius: 4px;
        }

        .brand-details {
          text-align: left;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 12px;
          }

          .brand-info {
            flex-direction: column;
            gap: 8px;
          }

          .back-text {
            display: none;
          }

          .brand-details {
            text-align: center;
          }
        }
      `}</style>
    </header>
  );
}