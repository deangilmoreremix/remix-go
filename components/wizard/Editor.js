import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import WorkspaceContainer from './editor/WorkspaceContainer';
import EditorStageChanger from './editor/EditorStageChanger';
import EditorStateManager from '../../lib/editor/editorStateManager';
import ActionsPane from "./editor/ActionsPane";

@inject('store')
@observer
export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toolbarEnabled: true,
      stateManager: new EditorStateManager(),
    };
  }

  render() {
    const { toolbarEnabled, stateManager } = this.state;
    return (
      <Fragment>
        <Container fluid className="editor-wrapper">
          <Row className={`toolbar ${!toolbarEnabled && 'hidden'}`}>
            <Col />
          </Row>
          <Row className="canvas full-height">
            <Col className="col-2 paddingless editor-pane">
              <EditorStageChanger
                className="stage-wrapper"
                stage={stateManager.stage}
                onChange={(stage) => { stateManager.stage = stage; }}
              />
            </Col>
            <Col className="workspace">
              <WorkspaceContainer stateManager={stateManager} className="full-height" />
            </Col>
            <Col className="col-2 paddingless editor-pane">
              <ActionsPane className="actions-pane" />
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
