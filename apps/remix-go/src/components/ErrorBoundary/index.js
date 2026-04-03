import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function logError(error, errorInfo) {
  // Log to console in development
  console.error('Error caught by boundary:', error, errorInfo);
  
  // Send to monitoring service if available
  if (window.monitoring) {
    window.monitoring.trackError(error, {
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }
  
  // Send to analytics if available
  if (window.analytics) {
    window.analytics.track('Error Boundary Triggered', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary" role="alert">
      <div className="error-content">
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </p>
        
        <div className="error-actions">
          <button 
            onClick={resetErrorBoundary}
            className="retry-button"
            type="button"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="reload-button"
            type="button"
          >
            Reload Page
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Error Details (Development Only)</summary>
            <pre className="error-stack">{error.stack}</pre>
          </details>
        )}
      </div>

      <style jsx>{`
        .error-boundary {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          padding: 2rem;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          margin: 2rem;
        }

        .error-content {
          text-align: center;
          max-width: 500px;
        }

        .error-title {
          color: #dc3545;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #6c757d;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .retry-button, .reload-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .retry-button {
          background-color: #007bff;
          color: white;
        }

        .retry-button:hover {
          background-color: #0056b3;
        }

        .reload-button {
          background-color: #6c757d;
          color: white;
        }

        .reload-button:hover {
          background-color: #545b62;
        }

        .error-details {
          text-align: left;
          margin-top: 2rem;
        }

        .error-stack {
          background-color: #f1f3f4;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.8rem;
          overflow-x: auto;
          white-space: pre-wrap;
          color: #dc3545;
        }
      `}</style>
    </div>
  );
}

function ErrorBoundary({ children, fallback: Fallback, onError }) {
  const handleError = (error, errorInfo) => {
    logError(error, errorInfo);
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback || ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Clear any cached error state
        window.location.hash = '';
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
