import React from 'react';
import { observer } from 'mobx-react';
import { Input } from 'reactstrap';
import { ChromePicker } from 'react-color';
import ReactTooltip from 'react-tooltip';

import PopcornEditor from '../editor.popcorn';
import PositionSelector from '../../../../components/common/PositionSelector';

@observer
export default class TextEditor extends PopcornEditor {

  state = {
    showFontColorPicker: false,
    showBackgroundColorPicker: false,
    bold: false,
    italics: false,
  };

  render() {
    const { element } = this.props;
    return (
      <div className="popcorn-editor text-editor">
        <ReactTooltip
          effect="solid"
        />
        <Input
          className="font-input"
          type="select"
          value={element.fontFamily}
          onChange={({ target: { value } }) => this.updateElement('fontFamily', value)}
          data-tip="Font family"
        >
          {this.fonts.map((font, idx) => <option key={idx}>{font}</option>)}
        </Input>
        {(!element.fontDecorations || !element.fontDecorations.responsive) &&
        <Input
          className="font-size-input"
          type="number"
          value={element.fontSize}
          onChange={({ target: { value } }) => this.updateElement('fontSize', value)}
          data-tip="Font size"
        />
        }
        <div>
          <div className="color-picker-button-container">
            <button
              className="color-picker-button"
              style={{ color: element.fontColor }}
              onClick={() => this.setState({
                showFontColorPicker: !this.state.showFontColorPicker,
              })}
              data-tip="Font color"
            >
              Txt
            </button>
          </div>
          { this.state.showFontColorPicker ?
            <div className="color-picker">
              <div
                className="color-picker-inner"
                onClick={() => this.setState({ showFontColorPicker: false })}
              />
              <ChromePicker
                color={this.parseRgba(element.fontColor)}
                onChangeComplete={color =>
                  this.updateElement(
                    'fontColor', `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                  )}
              />
            </div> : null }
        </div>
        <div>
          <div className="color-picker-button-container">
            <button
              className="color-picker-button"
              style={{ color: element.background ? element.backgroundColor : 'inherit' }}
              onClick={() => this.setState({
                showBackgroundColorPicker: !this.state.showBackgroundColorPicker,
              })}
              data-tip="Background color"
            >
              Bkg
            </button>
          </div>
          { this.state.showBackgroundColorPicker ?
            <div className="color-picker">
              <div
                className="color-picker-inner"
                onClick={() => this.setState({ showBackgroundColorPicker: false })}
              />
              <ChromePicker
                color={this.parseRgba(element.backgroundColor)}
                onChangeComplete={color =>
                  this.updateMultiple({
                    background: true,
                    backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                  })}
              />
            </div> : null }
        </div>
        <div
          onClick={() => {
            this.updateElement('fontDecorations', {
              bold: element.fontDecorations.bold ? !element.fontDecorations.bold : true,
            });
          }}
          className={`decoration-toggle bold ${element.fontDecorations.bold ? 'active' : ''}`}
          data-tip="Bold"
        >
          B
        </div>
        <div
          onClick={() => {
            this.updateElement('fontDecorations', {
              italics: element.fontDecorations.italics ? !element.fontDecorations.italics : true,
            });
          }}
          className={`decoration-toggle italic ${(element.fontDecorations && element.fontDecorations.italics) ? 'active' : ''}`}
          data-tip="Italic"
        >
          I
        </div>
        <img
          className={`icon alignment-icon ${(element.alignment === 'left') ? 'active' : ''}`}
          src="/static/images/editor/elements/text/left_aligned.svg"
          alt="Align by left"
          onClick={() => this.updateElement('alignment', 'left')}
          data-tip="Align left"
        />
        <img
          className={`icon alignment-icon ${(element.alignment === 'center') ? 'active' : ''}`}
          src="/static/images/editor/elements/text/center_aligned.svg"
          alt="Align by center"
          onClick={() => this.updateElement('alignment', 'center')}
          data-tip="Align center"
        />
        <img
          className={`icon alignment-icon ${(element.alignment === 'right') ? 'active' : ''}`}
          src="/static/images/editor/elements/text/right_aligned.svg"
          alt="Align by right"
          onClick={() => this.updateElement('alignment', 'right')}
          data-tip="Align right"
        />
        <div className="separator" />
        <PositionSelector
          className="text-position-selection"
          position={{ horizontal: element.alignment, vertical: element.position }}
          onPositionChanged={position =>
            this.updateMultiple({ alignment: position.horizontal, position: position.vertical })}
          data-tip="Element position"
        />
        <div className="separator" />
        <div className="separator" />
        <img
          className="icon"
          src="/static/images/editor/elements/new/clear.svg"
          alt="Remove Element"
          onClick={() => this.removeElement()}
          data-tip="Remove text element"
        />
      </div>
    );
  }
}

PopcornEditor.editors.text = TextEditor;
