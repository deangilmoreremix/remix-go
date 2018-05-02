import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <Container fluid className="editor-wrapper">
          <Row className="toolbar" style={{background: '#00ff00'}}>
            <Col style={{textAlign: 'middle'}}>.col</Col>
          </Row>
          <Row className="canvas" style={{background: '#0000ff'}}>
            <Col xs="2">.col</Col>
            <Col style={{background: '#ff0000'}}>.col</Col>
            <Col xs="2">.col</Col>
          </Row>
        </Container>
      </Fragment>);
  }
}
