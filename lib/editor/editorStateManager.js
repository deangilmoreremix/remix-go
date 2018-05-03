import { observable } from 'mobx';

class EditorStateManager {
  static STAGE_TYPES = {
    VIDEO_CUSTOMISE: 'VIDEO_CUSTOMISE',
    AUDIO_CUSTOMISE: 'AUDIO_CUSTOMISE',
    CAPTION_CUSTOMISE: 'CAPTION_CUSTOMISE',
  };

  @observable
  stage = EditorStateManager.STAGE_TYPES.VIDEO_CUSTOMISE;
}

export default EditorStateManager;
