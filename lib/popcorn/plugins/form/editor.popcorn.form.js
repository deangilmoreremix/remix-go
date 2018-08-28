import React from 'react';
import { observer } from 'mobx-react';
import PopcornEditor from '../editor.popcorn';

@observer
export default class FormEditor extends PopcornEditor {
  render() {
    return <div></div>;
  }
}

PopcornEditor.editors.form = FormEditor;
