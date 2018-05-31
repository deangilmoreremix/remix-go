import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import PropTypes from '../../../lib/PropTypes';
import EditorStateManager from '../../../lib/editor/editorStateManager';
import VideoSelectionWorkspace from './workspaces/VideoSelectionWorkspace';
import AudioSelectionWorkspace from './workspaces/AudioSelectionWorkspace';
import ConstructionWorkspace from './workspaces/ConstructionWorkspace';

@inject('store')
@observer
export default class EditorStageChanger extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const {
      className,
      store: {
        activeProject,
        editorStateManager,
        editorStateManager: {
          stage,
        },
      },
    } = this.props;
    return (
      <div className={className}>
        {(() => {
          switch (stage) {
            case EditorStateManager.STAGE_TYPES.VIDEO_CUSTOMISE:
              return (
                <div className="scrollable full-height">
                  <VideoSelectionWorkspace onVideoSelected={async (video) => {
                    await activeProject.updateVideo(video);
                    activeProject.version = Math.random();
                    editorStateManager.stage = EditorStateManager.STAGE_TYPES.CAPTION_CUSTOMISE;
                  }}
                  />
                </div>
              );
            case EditorStateManager.STAGE_TYPES.AUDIO_CUSTOMISE:
              return (
                <div className="scrollable full-height">
                  <AudioSelectionWorkspace onAudioSelected={async (audio) => {
                    await activeProject.updateAudio(audio);
                    activeProject.version = Math.random();
                    editorStateManager.stage = EditorStateManager.STAGE_TYPES.CAPTION_CUSTOMISE;
                  }}
                  />
                </div>
              );
            case EditorStateManager.STAGE_TYPES.CAPTION_CUSTOMISE:
              return <ConstructionWorkspace className="full-height full-width" />;
            default:
              return null;
          }
        })()}
      </div>);
  }
}
