import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import StageItem from './StageItem';

import MediaTypeDetector from '../../../lib/popcorn/util/mediaTypeDetector';
import StateManager from '../../../lib/editor/editorStateManager';
import PropTypes from '../../../lib/PropTypes';

const EDITOR_STAGE_VIEWS = [{
  stage: StateManager.STAGE_TYPES.VIDEO_CUSTOMISE,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/video.svg" alt="" />,
  validator: () => null,
  title: 'Video',
}, {
  stage: StateManager.STAGE_TYPES.AUDIO_CUSTOMISE,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/audio.svg" alt="" />,
  validator: (project) => {
    if (project && ['HTML5', 'Adaptive'].indexOf(new MediaTypeDetector().checkUrl(project.video)) === -1) {
      return 'Audio track customisation is available only for HTML5 videos.';
    }
    return null;
  },
  title: 'Audio',
}, {
  stage: StateManager.STAGE_TYPES.CAPTION_CUSTOMISE,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/caption.svg" alt="" />,
  validator: () => null,
  title: 'Captions',
  
}, {
  stage: StateManager.STAGE_TYPES.PERSONALIZER,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/personalizer.svg" alt="" />,
  validator: () => null,
  title: 'Persoalizer',
},
{
  stage: StateManager.STAGE_TYPES.CALL_TO_ACTION,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/cta.svg" alt="" />,
  validator: () => null,
  title: 'Call To Actions',
},
{
  stage: StateManager.STAGE_TYPES.NICHE_SCRIPT_CUSTOMISE,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/nichescript.svg" alt="" />,
  validator: () => null,
  title: 'Niche Scripts',
},
{
  stage: StateManager.STAGE_TYPES.END_SCREENS_CUSTOMISE,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/endScreen.svg" alt="" />,
  validator: () => null,
  title: 'End Screens',
},
{
  stage: StateManager.STAGE_TYPES.IMAGE_LT_CUSTOMISE,
  image: <img src="https://cdn.vidcloud.io/resources/go/static/images/editor/imageLTPreset.svg" alt="" />,
  validator: () => null,
  title: 'Image LT',
}
];

@inject('store')
@observer
export default class EditorStageChanger extends Component {
  static propTypes = {
    className: PropTypes.string,
    stage: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      editprStage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      editprStage: nextProps.stage
    })
    if (nextProps.stage == 'PERSONALIZER_CUSTOMISE' || nextProps.stage == 'NICHE_SCRIPT_CUSTOMISE' || nextProps.stage == 'END_SCREENS_CUSTOMISE' || nextProps.stage == 'IMAGE_LT_CUSTOMISE' || nextProps.stage == 'CALL_TO_ACTION') {
      this.setState({
        editprStage: 'CAPTION_CUSTOMISE'
      })
    }
  }

  render() {
    const { className, stage: currentStage, store: { activeProject }, onChange } = this.props;
    return (
      <Container className={className}>
        {EDITOR_STAGE_VIEWS.map(({ stage, image, title, validator }, idx) => (
          <StageItem
            key={idx}
            className={`stage-item ${stage === this.state.editprStage && 'active'}`}
            title={title}
            image={image}
            validationMessage={validator(activeProject)}
            onClick={() => onChange(stage)}
          />
        ))}
      </Container>);
  }
}
