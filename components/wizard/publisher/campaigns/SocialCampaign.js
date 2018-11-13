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
    onTitleUpdated: PropTypes.func,
    facebookConductor: PropTypes.node.isRequired,
  };

  static socialSources = [{
    key: 'facebook',
    title: 'Facebook',
    image: '/static/images/publisher/social-campaign/facebook-logo.svg',
    loader: (props) => {
      const { facebookConductor, project, api } = props;
      return new FacebookCampaignStager(
        new FacebookSocialProvider({
          conductor: facebookConductor,
          appId: '1728968890675795', // TODO: extract to env or any other vars
        }),
        project,
        api,
      );
    },
  }, {
    key: 'linkedin',
    title: 'LinkedIn',
    image: '/static/images/publisher/social-campaign/linkedin-logo.png',
    loader: (props) => {
      const { project, api } = props;
      return new LinkedinCampaignStager(
        new LInkedinSocialProvider({
          clientId: '77dc93kxh13kfc', // TODO: extract to env or any other vars
        }),
        project,
        api,
      );
    },
  }];

  constructor(props) {
    super(props);

    const { project } = this.props;
    this.activeSocialSources = this.constructor.socialSources
      .filter(item => project.allowedSocials.indexOf(item.key) !== -1);
    if (this.activeSocialSources.length === 1) {
      this.state = {
        isLoading: false,
        stager: this.activeSocialSources[0].loader(this.props),
      };
    }
  }

  state = {
    isLoading: false,
    stager: null,
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
    const { onTitleUpdated } = this.props;
    const selectedSource = this.activeSocialSources.find(item => item.key === key);
    this.setState({ stager: selectedSource.loader(this.props) });
    onTitleUpdated(`${selectedSource.title} Social Campaign`);
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
      alert('This video has been posted with Social Campaign successfully.');
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
            <div className="social-source-container">
              <span>Please select social network you want to continue with</span>
              <ul className="social-source-list">
                {this.activeSocialSources.map(({ key, title, image }) => (
                  <li
                    className="social-source-list-item"
                    key={key}
                    onClick={() => this.selectSocialSource(key)}
                  >
                    <img src={image} alt={title} />
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
                `go-button ${`next ${stager.currentStage.actionButtonClassName || ''}`} ${
                  stager.canBypassStage(stager.currentStage) ?
                  '' :
                  'inactive'}`
              }
              onClick={this.handleNextButtonClick}
            >
              <i
                className={stager.currentStage.actionButtonIconClassName || 'hidden'}
              />
              {stager.currentStage.actionButtonCaption || 'Next'}
            </button>
          </div>}
        </div>
      </Fragment>
    );
  }
}
