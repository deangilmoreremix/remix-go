import React from 'react';
import { Input } from 'reactstrap';

import { observer } from 'mobx-react';

import PopcornEditor from '../editor.popcorn';

@observer
export default class TextEditor extends PopcornEditor {
  render() {
    const { element } = this.props;
    return (
      <div className="popcorn-editor text-editor">
        <img className="icon" src="/static/images/editor/elements/text/t_plus.svg" alt="" />
        <Input
          className="font-input"
          type="select"
          value={element.fontFamily}
          onChange={({ target: { value } }) => this.updateElement('fontFamily', value)}
        >
          {this.fonts.map((font, idx) => <option key={idx}>{font}</option>)}
        </Input>
        <Input className="number-input" type="number" />
      </div>
    );
  }
}

PopcornEditor.editors.text = TextEditor;
