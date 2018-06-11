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

  render() {
    const { store: { common: { prefixes }, currentUser = { } } } = this.props;
    return (
      <Container>
        <Navbar color="faded" light expand="md">
          <a href="/">
            <NavbarBrand>
            </NavbarBrand>
          </a>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <div className="language-picker">
                  <DropdownToggle nav>
                    <img className="world-image" src="../static/images/world-icon.svg" />
                    <span className="label">English (US)</span>
                  </DropdownToggle>
                </div>
                <div className="menu-button">
                  <DropdownToggle nav>
                    <img src="../static/images/menu.svg" />
                  </DropdownToggle>
                </div>
                <div className="group-bordered">
                  <DropdownToggle nav caret>
                    <img className="userpic" src={currentUser.avatar} />
                    Hi {currentUser.fullName}
                  </DropdownToggle>
                  <DropdownMenu >
                    <DropdownItem>
                      <a target="_blank" href={`//${prefixes.projects}.videoremix.io/me`}>
                        Projects and Courses
                      </a>
                    </DropdownItem>
                    <DropdownItem>
                      <a target="_blank" href="/account">
                        Settings
                      </a>
                    </DropdownItem>
                    <DropdownItem>
                      <Link href="/logout">
                        <a>Log Out</a>
                      </Link>
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
