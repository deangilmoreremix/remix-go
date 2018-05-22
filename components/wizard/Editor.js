import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import WorkspaceContainer from './editor/WorkspaceContainer';
import EditorStageChanger from './editor/EditorStageChanger';
import ActionsPane from './editor/ActionsPane';
import Personalizer from './editor/workspaces/construction/Personalizer';
import PopcornEditor from '../../lib/popcorn/plugins/editor.popcorn';

const insertAtCaret = (element, offset, text) => {
  const front = (element.innerText).substring(0, offset);
  const back = (element.innerText).substring(offset, element.innerText.length);
  element.innerText = front + text + back;
};

@inject('api')
@inject('store')
@observer
export default class Editor extends Component {
  
  resetAlert() {
    window.onbeforeunload = null;
  }

  componentWillUnmount() {
    this.resetAlert();
  }

  render() {
    const {
      api,
      store: {
        activeProject,
        activeProject: {
          activeElement,
        },
        editorStateManager,
      },
    } = this.props;
    /* eslint-disable no-underscore-dangle */
    const ToolbarEditor = activeElement && PopcornEditor.editors[activeElement._natives.type];

    const promptUnsavedChanges = () => {
      return () => confirm('Leave with unsaved change?');
    };

    const onProjectUpdated = () => {
      const { modified } = activeProject;
      if (modified) {
        window.onbeforeunload = promptUnsavedChanges();
      }
    };

    return (
      <Fragment>
        <PopupboxContainer />
        <Container fluid className="editor-wrapper">
          <Row className={`toolbar ${!activeElement && 'hidden'}`}>
            {activeElement ? <ToolbarEditor
              element={activeElement}
              onElementUpdate={(updatedProps) => {
                /* eslint-disable no-underscore-dangle */
                activeElement._natives._update.call(this, activeElement, updatedProps);
                activeProject.update(activeElement, updatedProps);
              }}
            /> : null}
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
              <WorkspaceContainer stateManager={editorStateManager} className="full-height" onProjectUpdated={() => onProjectUpdated()} />
            </Col>
            <Col className="col-2 paddingless editor-pane">
              <ActionsPane className="actions-pane">
                <button className="go-button action-button">Preview</button>
                <button
                  className="go-button action-button"
                  onClick={async () => {
                    activeProject.resetStatus();
                    this.resetAlert();
                    await api.publish(await api.save(activeProject));
                    Router.push('/publish');
                  }}
                >Publish & Share
                </button>
                <button
                  className={`addon-button ${!activeElement && 'inactive'}`}
                  onClick={() => {
                    PopupboxManager.open({
                      content: <Personalizer
                        className="personalizer"
                        onTokenChosen={(token) => {
                          PopupboxManager.close();
                          const { _contentContainer: target, caretOffset: offset } = activeElement;
                          insertAtCaret(target, offset, token);

                          const event = new Event('input');
                          target.dispatchEvent(event);

                          const updatedProps = {};
                          updatedProps.text = target.innerText;
                          activeElement._natives._update.call(this, activeElement, updatedProps);
                          activeProject.update(activeElement, updatedProps);
                      }}
                      />,
                      config: {
                        titleBar: {
                          enable: true,
                          text: 'Personalizer',
                        },
                        fadeIn: true,
                        fadeInSpeed: 200,
                      },
                    });
                  }}
                >
                  <img className="icon" src="../../static/images/editor/personalizer.svg" alt="" />
                  <span>Personalizer</span>
                </button>
                <button className="addon-button">
                  <img className="icon" src="../../static/images/editor/cta.svg" alt="" />
                  <span>Call to Action</span>
                </button>
              </ActionsPane>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
