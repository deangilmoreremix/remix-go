import React, { Component, Fragment } from 'react';
import { Progress } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import Project from '../../../../lib/editor/Project';
import PropTypes from '../../../../lib/PropTypes';
import InfiniteLoading from '../../../common/InfiniteLoading';

import FacebookCampaignStager from './campaign-stagers/FacebookCampaignStager';
import FacebookSocialProvider from '../../../../lib/social-providers/FacebookSocialProvider';
import LinkedinCampaignStager from './campaign-stagers/LinkedinCampaignStager';
import LInkedinSocialProvider from '../../../../lib/social-providers/LinkedinSocialProvider';

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

  static socialSources = [{
    key: 'facebook',
    title: 'Facebook',
    image: 'fb-logo',
    loader: (props) => {
      const { facebookConductor, project } = props;
      return new FacebookCampaignStager(
        new FacebookSocialProvider({ conductor: facebookConductor }),
        project,
      );
    },
  }, {
    key: 'linkedin',
    title: 'LinkedIn',
    image: 'li-logo',
    loader: (props) => {
      const { project } = props;
      return new LinkedinCampaignStager(
        new LInkedinSocialProvider(),
        project,
      );
    },
  }];

  state = {
    isLoading: false,
  };

  sharePost = async () => {
    const { api, store, onCampaignFinished } = this.props;
    const { stager } = this.state;

    try {
      store.activeProject = await stager.sharePost(api);
      onCampaignFinished();
    } catch (error) {
      return alert(error.message || 'Unable to post');
    }
  };

  selectSocialSource = (key) => {
    const selectedSource = this.constructor.socialSources.find(item => item.key === key);
    this.setState({ stager: selectedSource.loader(this.props) });
  };

  handleBackButtonClick = async () => {
    const { stager, isLoading } = this.state;
    if (isLoading) {
      return;
    }
    this.setState({ isLoading: true });
    await stager.prevStage();
    this.setState({ isLoading: false });
  };

  handleNextButtonClick = async () => {
    const { stager } = this.state;
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
  };

  render() {
    const { className, project } = this.props;
    const { stager, isLoading } = this.state;

    return (
      <Fragment>
        <div className={`social-campaign ${className}`}>
          <div className={`loading-screen workspace ${!isLoading ? 'hidden' : ''}`}>
            <InfiniteLoading />
          </div>
          <div className={`workspace ${isLoading ? 'hidden' : ''}`}>
            {!stager &&
            <div>
              <ul>
                {this.constructor.socialSources.map(({ key, title }) => (
                  <li key={key} onClick={() => this.selectSocialSource(key)}>
                    {title}
                  </li>
                ))}
              </ul>
            </div>}
            {stager &&
            <Progress
              className="embed-progress"
              value={stager.currentStage.completionPercentage}
            />}
            {stager &&
            <stager.currentStage.element
              variables={stager.variables}
              project={project}
            />}
          </div>
          {stager &&
          <div className="controls">
            <button
              className={`go-button back ${stager.currentStage.key === stager.stages[0].key ? 'hidden' : ''}`}
              onClick={this.handleBackButtonClick}
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
              onClick={this.handleNextButtonClick}
            >
              <i
                className={`${stager.currentStage.key === stager.stages[stager.stages.length - 1].key ?
                  'fa fa-facebook-official' :
                  'hidden'}`}
              />
              {stager.currentStage.key === stager.stages[stager.stages.length - 1].key ? 'Share' : 'Next'}
            </button>
          </div>}
        </div>
      </Fragment>
    );
  }
}
