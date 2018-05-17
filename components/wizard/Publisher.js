import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';

import ActionsPane from './editor/ActionsPane';
import EmbeddedPlayback from '../common/EmbeddedPlayback';

@inject('store')
@observer
export default class Publisher extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      store: {
        activeProject,
        editorStateManager,
      },
    } = this.props;
    return (
      <Fragment>
        <Container fluid className="editor-wrapper">
          <Row className="canvas full-height">
            <Col className="workspace">
              <EmbeddedPlayback url={activeProject.url} title={activeProject.name} width="100%" height="100%" />
            </Col>
            <Col className="col-2 paddingless editor-pane">
              <ActionsPane className="actions-pane">
                <button className="go-button action-button">Email Campaign</button>
                <button className="go-button action-button">Facebook</button>
              </ActionsPane>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
