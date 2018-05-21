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

  state = {
    modified: false,
    prompt: 'Leave with unsaved change?',
  };

  componentDidUpdate() {
    this.promptUnsavedChange(this.state);
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
  }

  promptUnsavedChange(state) {
    const { modified, prompt } = state;
    if (modified) {
      window.onbeforeunload = (() => confirm(prompt));
    }
  }
  
  onComponentChanged() {
    this.setState({ modified: true });
  }

  render() {
    const { className, store: { activeProject, editorStateManager: { stage } } } = this.props;
    return (
      <div className={className}>
        {(() => {
          switch (stage) {
            case EditorStateManager.STAGE_TYPES.VIDEO_CUSTOMISE:
              return (
                <div className="scrollable full-height">
                  <VideoSelectionWorkspace onVideoSelected={(video) => {
                    activeProject.video = video;
                  }}
                  />
                </div>
              );
            case EditorStateManager.STAGE_TYPES.AUDIO_CUSTOMISE:
              return (
                <div className="scrollable full-height">
                  <AudioSelectionWorkspace />
                </div>
              );
            case EditorStateManager.STAGE_TYPES.CAPTION_CUSTOMISE:
              return <ConstructionWorkspace className="full-height full-width" onComponentChanged={() => { this.onComponentChanged(); }} />;
            default:
              return null;
          }
        })()}
      </div>);
  }
}
