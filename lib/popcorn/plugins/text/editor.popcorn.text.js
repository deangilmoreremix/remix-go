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
        {(!element.fontDecorations || !element.fontDecorations.responsive) &&
        <Input
          className="font-size-input"
          type="number"
          value={element.fontSize}
          onChange={({ target: { value } }) => this.updateElement('fontSize', value)}
        />
        }
        <div
          className="decoration-toggle bold"
          onClick={() =>
            this.updateElement('fontDecorations', {
              bold: element.fontDecorations ? !element.fontDecorations.bold : true,
            })}
        >
          B
        </div>
        <div
          className="decoration-toggle italic"
          onClick={() =>
            this.updateElement('fontDecorations', {
              italics: element.fontDecorations ? !element.fontDecorations.italics : true,
            })}
        >
          I
        </div>
        <img
          className="icon alignment-icon"
          src="/static/images/editor/elements/text/left_aligned.svg"
          alt="Align by left"
          onClick={() => this.updateElement('alignment', 'left')}
        />
        <img
          className="icon alignment-icon"
          src="/static/images/editor/elements/text/center_aligned.svg"
          alt="Align by center"
          onClick={() => this.updateElement('alignment', 'center')}
        />
        <img
          className="icon alignment-icon"
          src="/static/images/editor/elements/text/right_aligned.svg"
          alt="Align by right"
          onClick={() => this.updateElement('alignment', 'right')}
        />
      </div>
    );
  }
}

PopcornEditor.editors.text = TextEditor;
