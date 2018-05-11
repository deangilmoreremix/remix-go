import React from 'react';
import { observer } from 'mobx-react';

import PopcornEditor from '../editor.popcorn';

@observer
export default class ImageEditor extends PopcornEditor {
  render() {
    return 'Popcorn Image Editor';
  }
}

PopcornEditor.editors.image = ImageEditor;
