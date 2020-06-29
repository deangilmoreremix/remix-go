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
      return Router.push('/logout');
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
                    Hi {currentUser.fullName}
                  </DropdownToggle>
                  <DropdownMenu >
                    <DropdownItem>
                      <a target="_blank" href={`//${prefixes.projects}.${whiteLabelManager.domain}/me`}>
                        {whiteLabelManager.domain === 'videoremix.io' ? 'Projects and Courses' : 'Projects'}
                      </a>
                    </DropdownItem>
                    {currentUser && currentUser.features
                    && (currentUser.features.editor.state === 'enabled'
                      || currentUser.staticEditingMode.state === 'enabled')
                      && (<DropdownItem>
                      <a target="_blank" href={`//${prefixes.editor}.${whiteLabelManager.domain}/`}>
                        Advanced Personalized Editor
                      </a>
                    </DropdownItem>)}
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
