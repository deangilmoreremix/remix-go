import React from 'react';
import { observer } from 'mobx-react';

import PopcornEditor from '../editor.popcorn';

@observer
export default class PersonalizedImageEditor extends PopcornEditor {
  render() {
    return 'Popcorn Personalized Image Editor';
  }
}

PopcornEditor.editors.personalizedImage = PersonalizedImageEditor;
