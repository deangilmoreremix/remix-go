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

  render() {
    const { store: { whiteLabelManager, common: { prefixes }, currentUser = {} } } = this.props;
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
                    Hi,
                    {' '}
                    <b>{currentUser.fullName}</b>
                    <img className="userpic" src={currentUser.avatar} />
                  </DropdownToggle>
                  <DropdownMenu>
                    {currentUser && currentUser.features
                      && ((currentUser.features.editor && currentUser.features.editor.state === 'enabled')
                        || (currentUser.features.staticEditingMode
                          && currentUser.features.staticEditingMode.state === 'enabled'))
                      && (
                        <DropdownItem>
                          <a target="_blank" href={`//${prefixes.projects}.${whiteLabelManager.domain}/en-US/strategy-course`}>
                            Strategy Courses
                          </a>
                        </DropdownItem>
                      )}
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
