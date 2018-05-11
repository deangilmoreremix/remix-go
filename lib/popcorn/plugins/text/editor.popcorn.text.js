import React from 'react';
import { observer } from 'mobx-react';

import PopcornEditor from '../editor.popcorn';

@observer
export default class TextEditor extends PopcornEditor {
  render() {
    return 'Popcorn Text Editor';
  }
}

PopcornEditor.editors.text = TextEditor;
