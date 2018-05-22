import React, { Component, Fragment } from 'react';
import { Container, Col, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import ActionsPane from './editor/ActionsPane';
import EmbeddedPlayback from '../common/EmbeddedPlayback';
import EmbedDataContainer from './publisher/EmbedDataContainer';
import ProjectNameChanger from './publisher/ProjectNameChanger';
import EmailCampaign from './publisher/campaigns/EmailCampaign';

@inject('api')
@inject('store')
@observer
export default class Publisher extends Component {
  onTitleUpdate = async (title) => {
    const { api, store: { activeProject } } = this.props;
    activeProject.name = title;
    await api.save(activeProject);
  };

  render() {
    const {
      store: {
        activeProject,
      },
    } = this.props;
    return (
      <Fragment>
        <PopupboxContainer />
        <Container fluid className="editor-wrapper">
          <Row className="canvas full-height">
            <Col className="workspace">
              <div className="publish-overview">
                <ProjectNameChanger
                  className="overview-item title-edit"
                  title={activeProject.make.title}
                  onChange={title => this.onTitleUpdate(title)}
                />
                <EmbeddedPlayback
                  className="overview-item"
                  url={activeProject.make.url}
                  title={activeProject.make.title}
                  width="50%"
                  height="50%"
                />
                <label className="overview-item">URL</label>
                <input className="overview-item" type="text" value={activeProject.make.url} readOnly />
                <label className="overview-item">Embed</label>
                <EmbedDataContainer className="overview-item embed-item" url={activeProject.make.url} />
              </div>
            </Col>
            <Col className="col-2 paddingless editor-pane">
              <ActionsPane className="actions-pane">
                <button
                  className="go-button action-button"
                  onClick={() => {
                    PopupboxManager.open({
                      content: <EmailCampaign
                        className="campaign"
                        project={activeProject}
                        onCampaignFinished={() => PopupboxManager.close()}
                      />,
                      config: {
                        titleBar: {
                          enable: true,
                          text: 'Email Campaign',
                        },
                        fadeIn: true,
                        fadeInSpeed: 200,
                      },
                    });
                  }}
                >Email Campaign
                </button>
                <button className="go-button action-button">Facebook</button>
              </ActionsPane>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
