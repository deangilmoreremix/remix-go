import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import Router from 'next/router';

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class Menu extends React.Component {
  static propTypes = {
    body: PropTypes.node,
  };

  static defaultProp = {
    body: null,
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  logoutHandler(e) {
    e.preventDefault();
    if (!e.shiftKey) {
      if (window.HelpCrunch) {
        window.HelpCrunch('logout');
      }
      return Router.push('/logout');
    }
  }

  navigateToRemixGo(e) {
    e.preventDefault();

    // Prepare theme data for Remix Go
    const themeData = this.getThemeData();

    // Navigate to Remix Go
    Router.push('/apps/remix-go/');

    // Send theme data after navigation
    setTimeout(() => {
      this.sendThemeToRemixGo(themeData);
    }, 1000); // Wait for Remix Go to load
  }

  getThemeData() {
    const { store: { whiteLabelManager } } = this.props;

    return {
      colors: {
        primary: whiteLabelManager.primaryColor || '#007bff',
        secondary: whiteLabelManager.secondaryColor || '#6c757d',
        accent: whiteLabelManager.accentColor || '#007bff',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
      },
      typography: {
        fontFamily: whiteLabelManager.fontFamily || '"Inter", system-ui, sans-serif',
        fontSize: {
          base: '16px',
          lg: '18px',
          xl: '20px',
        },
      },
      logo: whiteLabelManager.logo || '/default-logo.png',
      name: whiteLabelManager.name || 'Higgsfield',
      domain: whiteLabelManager.domain || 'default',
      theme: whiteLabelManager.theme || 'light',
    };
  }

  sendThemeToRemixGo(themeData) {
    // Try to find Remix Go iframe or send via URL params
    const remixGoFrame = document.querySelector('iframe[src*="/apps/remix-go/"]');

    if (remixGoFrame && remixGoFrame.contentWindow) {
      // Send via postMessage
      remixGoFrame.contentWindow.postMessage({
        type: 'HIGGSFIELD_THEME_UPDATE',
        theme: themeData
      }, '*');
    } else {
      // Fallback: store in localStorage for Remix Go to pick up
      localStorage.setItem('higgsfield-theme', JSON.stringify(themeData));

      // Also set URL params for direct navigation
      const url = new URL(window.location.href);
      url.searchParams.set('primary', themeData.colors.primary);
      url.searchParams.set('secondary', themeData.colors.secondary);
      url.searchParams.set('brand', themeData.name);
      url.searchParams.set('logo', themeData.logo);
      url.searchParams.set('domain', themeData.domain);
      url.searchParams.set('theme', themeData.theme);
      url.searchParams.set('fontFamily', themeData.typography.fontFamily);

      // Update URL without navigation
      window.history.replaceState({}, '', url.toString());
    }
  }

  render() {
    const { store: { whiteLabelManager, common: { prefixes }, currentUser = { } } } = this.props;
    return (
      <Container>
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/" />
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <div className="group-bordered">
                  <DropdownToggle nav caret>
                    <img className="userpic" src={currentUser.avatar} />
                    Hi
                    {' '}
                    {currentUser.fullName}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>
                      <a target="_blank" href={`//${prefixes.projects}.${whiteLabelManager.domain}/me`}>
                        {whiteLabelManager.domain === 'videoremix.io' ? 'Projects and Courses' : 'Projects'}
                      </a>
                    </DropdownItem>
                    {currentUser && currentUser.features
                    && ((currentUser.features.editor && currentUser.features.editor.state === 'enabled')
                      || (currentUser.features.staticEditingMode
                        && currentUser.features.staticEditingMode.state === 'enabled'))
                      && (
                      <DropdownItem>
                        <a target="_blank" href={`//${prefixes.editor}.${whiteLabelManager.domain}/`}>
                        Advanced Personalized Editor
                        </a>
                      </DropdownItem>
                       )}
                     <DropdownItem>
                       <a href="/apps/remix-go/" onClick={(e) => this.navigateToRemixGo(e)}>
                         Video Editor (Remix Go)
                       </a>
                     </DropdownItem>
                     <DropdownItem>
                       <a target="_blank" href="/account">
                         Settings
                       </a>
                     </DropdownItem>
                    <DropdownItem>
                      <a
                        onClick={e => this.logoutHandler(e)}
                        onContextMenu={e => e.preventDefault()}
                      >
                        Log Out
                      </a>
                    </DropdownItem>
                  </DropdownMenu>
                </div>

              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
    );
  }
}
