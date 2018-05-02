import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import StageItem from './StageItem';

import StageManager from '../../../lib/editor/editorStageManager';
import PropTypes from '../../../lib/PropTypes';

const EDITOR_STAGE_VIEWS = [{
  stage: StageManager.STAGE_TYPES.VIDEO_CUSTOMISE,
  image: <img src="../../../static/images/editor/video.png" alt="" />,
  title: 'Video',
}, {
  stage: StageManager.STAGE_TYPES.AUDIO_CUSTOMISE,
  image: <img src="../../../static/images/editor/audio.png" alt="" />,
  title: 'Audio',
}, {
  stage: StageManager.STAGE_TYPES.CAPTION_CUSTOMISE,
  image: <img src="../../../static/images/editor/caption.png" alt="" />,
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
