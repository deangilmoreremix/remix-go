import React, { Component } from 'react';
import { observer } from 'mobx-react';

import PropTypes from '../../../lib/PropTypes';
import EditorStateManager from '../../../lib/editor/editorStateManager';
import VideoSelectionWorkspace from './workspaces/VideoSelectionWorkspace';
import AudioSelectionWorkspace from './workspaces/AudioSelectionWorkspace';
import CaptionSelectionWorkspace from './workspaces/CaptionSelectionWorkspace';

@observer
export default class EditorStageChanger extends Component {
  static propTypes = {
    className: PropTypes.string,
    stateManager: PropTypes.instanceOf(EditorStateManager).isRequired,
  };

  render() {
    const { className, stateManager: { stage } } = this.props;
    return (
      <div className={className}>
        {(() => {
          switch (stage) {
            case EditorStateManager.STAGE_TYPES.VIDEO_CUSTOMISE:
              return <VideoSelectionWorkspace />;
            case EditorStateManager.STAGE_TYPES.AUDIO_CUSTOMISE:
              return <AudioSelectionWorkspace />;
            case EditorStateManager.STAGE_TYPES.CAPTION_CUSTOMISE:
              return <CaptionSelectionWorkspace />;
            default:
              return null;
          }
        })()}
      </div>);
  }
}
