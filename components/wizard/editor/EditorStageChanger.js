import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import StageItem from './StageItem';

import StateManager from '../../../lib/editor/editorStateManager';
import PropTypes from '../../../lib/PropTypes';

const EDITOR_STAGE_VIEWS = [{
  stage: StateManager.STAGE_TYPES.VIDEO_CUSTOMISE,
  image: <img src="../../../static/images/editor/video.svg" alt="" />,
  title: 'Video',
}, {
  stage: StateManager.STAGE_TYPES.AUDIO_CUSTOMISE,
  image: <img src="../../../static/images/editor/audio.svg" alt="" />,
  title: 'Audio',
}, {
  stage: StateManager.STAGE_TYPES.CAPTION_CUSTOMISE,
  image: <img src="../../../static/images/editor/caption.svg" alt="" />,
  title: 'Captions',
}];

@observer
export default class EditorStageChanger extends Component {
  static propTypes = {
    className: PropTypes.string,
    stage: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { className, stage: currentStage, onChange } = this.props;
    return (
      <Container className={className}>
        {EDITOR_STAGE_VIEWS.map(({ stage, image, title }, idx) => (
          <StageItem
            key={idx}
            className={`stage-item ${stage === currentStage && 'active'}`}
            title={title}
            image={image}
            onClick={() => onChange(stage)}
          />
        ))}
      </Container>);
  }
}
