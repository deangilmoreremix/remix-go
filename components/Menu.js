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
    const {store: {currentUser = {}} } = this.props;
    return (
      <Container>
        <Navbar color="faded" light expand="md">
          <Link href="/" passHref>
            <NavbarBrand>
            </NavbarBrand>
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle nav caret>
                  <img className="userpic" src={currentUser.avatar} />
                  {currentUser.fullName}
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem>
                    <Link href="/account">
                      <a>Settings</a>
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link href="/logout">
                      <a>Log Out</a>
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
    );
  }
}
