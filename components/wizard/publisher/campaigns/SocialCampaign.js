import React, { Component, Fragment } from 'react';
import { Progress } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import InfiniteLoading from '../../../common/InfiniteLoading';

import FacebookCampaignStager from './campaign-stagers/FacebookCampaignStager';
import FacebookSocialProvider from '../../../../lib/social-providers/FacebookSocialProvider';

@inject('api')
@inject('store')
@observer
export default class SocialCampaign extends Component {
  static propTypes = {
    className: PropTypes.string,
    project: PropTypes.instanceOf(Project).isRequired,
    onCampaignFinished: PropTypes.func,
    facebookConductor: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    const { facebookConductor, project } = this.props;
    this.stager = new FacebookCampaignStager(
      new FacebookSocialProvider({ conductor: facebookConductor }),
      project,
    );
  }

  state = {
    isLoading: false,
  };

  async sharePost() {
    const { api, store, onCampaignFinished } = this.props;
    try {
      store.activeProject = await this.stager.sharePost(api);
      onCampaignFinished();
    } catch (error) {
      return alert(error.message || 'Unable to post');
    }
  }

  render() {
    const { stager } = this;
    const { className, project } = this.props;
    const { isLoading } = this.state;

    return (
      <Fragment>
        <div className={`social-campaign ${className}`}>
          <div className={`loading-screen workspace ${!isLoading ? 'hidden' : ''}`}>
            <InfiniteLoading />
          </div>
          <div className={`workspace ${isLoading ? 'hidden' : ''}`}>
            <Progress
              className="embed-progress"
              value={stager.currentStage.completionPercentage}
            />
            <stager.currentStage.element
              variables={stager.variables}
              project={project}
            />
          </div>
          <div className="controls">
            <button
              className={`go-button back ${stager.currentStage.key === stager.stages[0].key ? 'hidden' : ''}`}
              onClick={async () => {
                if (isLoading) {
                  return;
                }
                this.setState({ isLoading: true });
                await stager.prevStage();
                this.setState({ isLoading: false });
              }}
            >
              Back
            </button>
            <button
              className={
                `go-button ${stager.currentStage.key === stager.stages[stager.stages.length - 1].key ?
                  'next fb-login' :
                  'next'} ${stager.canBypassStage(stager.currentStage) ?
                  '' :
                  'inactive'}`
              }
              onClick={async () => {
                if (!stager.canBypassStage(stager.currentStage)) {
                  return;
                }
                this.setState({ isLoading: true });
                if (stager.currentStage.key ===
                  stager.stages[stager.stages.length - 1].key) {
                  await this.sharePost();
                } else {
                  await stager.nextStage();
                }
                this.setState({ isLoading: false });
              }}
            >
              <i
                className={`${stager.currentStage.key === stager.stages[stager.stages.length - 1].key ?
                  'fa fa-facebook-official' :
                  'hidden'}`}
              />
              {stager.currentStage.key === stager.stages[stager.stages.length - 1].key ? 'Share' : 'Next'}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
