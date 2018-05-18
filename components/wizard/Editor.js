import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';

import WorkspaceContainer from './editor/WorkspaceContainer';
import EditorStageChanger from './editor/EditorStageChanger';
import ActionsPane from './editor/ActionsPane';

@inject('api')
@inject('store')
@observer
export default class Editor extends Component {
  render() {
    const {
      api,
      store: {
        activeProject,
        editorStateManager,
        editorStateManager: {
          toolbar,
        },
      },
    } = this.props;
    return (
      <Fragment>
        <Container fluid className="editor-wrapper">
          <Row className={`toolbar ${!toolbar && 'hidden'}`}>
            {toolbar}
          </Row>
          <Row className="canvas full-height">
            <Col className="col-2 paddingless editor-pane">
              <EditorStageChanger
                className="stage-wrapper"
                stage={editorStateManager.stage}
                onChange={(stage) => {
                  editorStateManager.stage = stage;
                  editorStateManager.toolbar = null;
                }}
              />
            </Col>
            <Col className="workspace">
              <WorkspaceContainer stateManager={editorStateManager} className="full-height" />
            </Col>
            <Col className="col-2 paddingless editor-pane">
              <ActionsPane className="actions-pane">
                <button className="go-button action-button">Preview</button>
                <button
                  className="go-button action-button"
                  onClick={async () => {
                    await api.publish(await api.save(activeProject));
                    Router.push('/publish');
                  }}
                >Publish & Share
                </button>
              </ActionsPane>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
