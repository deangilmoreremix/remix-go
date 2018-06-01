import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import StageItem from './StageItem';

import MediaTypeDetector from '../../../lib/popcorn/util/mediaTypeDetector';
import StateManager from '../../../lib/editor/editorStateManager';
import PropTypes from '../../../lib/PropTypes';

const EDITOR_STAGE_VIEWS = [{
  stage: StateManager.STAGE_TYPES.VIDEO_CUSTOMISE,
  image: <img src="../../../static/images/editor/video.svg" alt="" />,
  validator: () => null,
  title: 'Video',
}, {
  stage: StateManager.STAGE_TYPES.AUDIO_CUSTOMISE,
  image: <img src="../../../static/images/editor/audio.svg" alt="" />,
  validator: (project) => {
    if (project && new MediaTypeDetector().checkUrl(project.video) !== 'HTML5') {
      return 'Audio track customisation is available only for HTML5 videos.';
    }
    return null;
  },
  title: 'Audio',
}, {
  stage: StateManager.STAGE_TYPES.CAPTION_CUSTOMISE,
  image: <img src="../../../static/images/editor/caption.svg" alt="" />,
  validator: () => null,
  title: 'Captions',
}];

@inject('store')
@observer
export default class EditorStageChanger extends Component {
  static propTypes = {
    className: PropTypes.string,
    stage: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { className, stage: currentStage, store: { activeProject }, onChange } = this.props;
    return (
      <Container className={className}>
        {EDITOR_STAGE_VIEWS.map(({ stage, image, title, validator }, idx) => (
          <StageItem
            key={idx}
            className={`stage-item ${stage === currentStage && 'active'}`}
            title={title}
            image={image}
            validationMessage={validator(activeProject)}
            onClick={() => onChange(stage)}
          />
        ))}
      </Container>);
  }
}
