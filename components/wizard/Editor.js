import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import EditorStageChanger from "./editor/EditorStageChanger";
import EditorStageManager from "../../lib/editor/editorStageManager";

@inject('store')
@observer
export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toolbarEnabled: true,
      stageManager: new EditorStageManager(),
    };
  }

  render() {
    const { toolbarEnabled, stageManager } = this.state;
    return (
      <Fragment>
        <Container fluid className="editor-wrapper">
          <Row className={`toolbar ${!toolbarEnabled && 'hidden'}`}>
            <Col>

            </Col>
          </Row>
          <Row className="canvas">
            <Col className="col-2 paddingless">
              <EditorStageChanger
                className="stage-wrapper"
                stage={stageManager.stage}
                onChange={(stage) => { stageManager.stage = stage; }}
              />
            </Col>
            <Col style={{background: '#ffffff'}}>.col</Col>
            <Col xs="2">.col</Col>
          </Row>
        </Container>
      </Fragment>);
  }
}
