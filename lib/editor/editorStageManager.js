import { observable } from 'mobx';

class EditorStageManager {
  static STAGE_TYPES = {
    VIDEO_CUSTOMISE: 'VIDEO_CUSTOMISE',
    AUDIO_CUSTOMISE: 'AUDIO_CUSTOMISE',
    CAPTION_CUSTOMISE: 'CAPTION_CUSTOMISE',
  };

  @observable
  stage = EditorStageManager.STAGE_TYPES.VIDEO_CUSTOMISE;
}

export default EditorStageManager;
