import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../components/Header';

// Mock postMessage
const mockPostMessage = vi.fn();
global.window.parent = { postMessage: mockPostMessage };

describe('Header Component', () => {
  beforeEach(() => {
    // Reset mocks
    mockPostMessage.mockClear();
    localStorage.clear();

    // Mock URL params
    delete global.window.location;
    global.window.location = {
      search: '?primary=%23007bff&secondary=%236c757d&brand=Higgsfield&logo=%2Flogo.png&domain=default&theme=light'
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders with default theme', () => {
    render(Header());

    expect(screen.getByText('Remix Go')).toBeInTheDocument();
    expect(screen.getByText('Back to Higgsfield')).toBeInTheDocument();
  });

  test('applies theme from URL params', () => {
    render(Header());

    const header = document.querySelector('header');
    expect(header).toHaveStyle({ backgroundColor: '#007bff' });
  });

  test('handles back button click', () => {
    // Mock window.location.href
    const mockHref = vi.fn();
    delete global.window.location.href;
    global.window.location.href = '';
    Object.defineProperty(global.window.location, 'href', {
      set: mockHref,
    });

    render(Header());

    const backButton = screen.getByText('Back to Higgsfield');
    fireEvent.click(backButton);

    expect(mockHref).toHaveBeenCalledWith('/');
  });

  test('requests theme from parent on mount', () => {
    render(Header());

    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'REMIX_GO_THEME_REQUEST'
    }, '*');
  });

  test('updates theme when receiving theme message', async () => {
    render(Header());

    const themeData = {
      colors: { primary: '#ff0000', secondary: '#00ff00' },
      name: 'Test Brand',
      logo: '/test-logo.png'
    };

    // Simulate receiving theme from parent
    global.window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'HIGGSFIELD_THEME_UPDATE',
        theme: themeData
      }
    }));

    await waitFor(() => {
      const header = document.querySelector('header');
      expect(header).toHaveStyle({ backgroundColor: '#ff0000' });
    });

    expect(screen.getByText('Back to Test Brand')).toBeInTheDocument();
  });

  test('navigates between sections', () => {
    render(Header());

    const homeLink = screen.getByText('Home');
    const editorLink = screen.getByText('Editor');
    const landingLink = screen.getByText('Landing Pages');
    const publisherLink = screen.getByText('Publish');

    expect(homeLink).toHaveAttribute('href', '#getting-started');
    expect(editorLink).toHaveAttribute('href', '#editor');
    expect(landingLink).toHaveAttribute('href', '#landing-page');
    expect(publisherLink).toHaveAttribute('href', '#publisher');
  });

  test('stores theme in localStorage', async () => {
    render(Header());

    const themeData = {
      colors: { primary: '#123456' },
      name: 'Stored Brand'
    };

    global.window.dispatchEvent(new MessageEvent('message', {
      data: {
        type: 'HIGGSFIELD_THEME_UPDATE',
        theme: themeData
      }
    }));

    await waitFor(() => {
      expect(localStorage.getItem('higgsfield-theme')).toBe(JSON.stringify(themeData));
    });
  });

  test('loads theme from localStorage on mount', () => {
    const storedTheme = {
      colors: { primary: '#abcdef' },
      name: 'Loaded Brand'
    };
    localStorage.setItem('higgsfield-theme', JSON.stringify(storedTheme));

    render(Header());

    const header = document.querySelector('header');
    expect(header).toHaveStyle({ backgroundColor: '#abcdef' });
  });

  test('handles missing theme gracefully', () => {
    // Remove URL params
    global.window.location.search = '';

    // Remove localStorage
    localStorage.clear();

    render(Header());

    const header = document.querySelector('header');
    expect(header).toHaveStyle({ backgroundColor: '#007bff' }); // Default color
  });
});