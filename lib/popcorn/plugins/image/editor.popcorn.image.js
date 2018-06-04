import React from 'react';
import { observer } from 'mobx-react';
import {
  PopupboxManager,
} from 'react-popupbox';
import { ChromePicker } from 'react-color';

import ImageUpload from '../../../../components/common/ImageUpload';
import PopcornEditor from '../editor.popcorn';

@observer
export default class ImageEditor extends PopcornEditor {
  state = {
    showColorPicker: false,
  };

  render() {
    const { element } = this.props;
    return (
      <div className="popcorn-editor image-editor">
        <img
          className="icon"
          src="/static/images/editor/elements/image/square.svg"
          alt="Square Background"
          onClick={() => this.updateElement('cornerRadius', 0)}
        />
        <img
          className="icon"
          src="/static/images/editor/elements/image/no_background.svg"
          alt="No Background"
          onClick={() => this.updateElement('background', false)}
        />
        <img
          className="icon"
          src="/static/images/editor/elements/image/circle.svg"
          alt="Circle Background"
          onClick={() => this.updateElement('cornerRadius', 50)}
        />
        <div className="separator" />
        <div className="zoomer">
          <img
            className="icon zoom-out"
            src="/static/images/editor/elements/image/zoom_out.svg"
            alt="Zoom Out"
            onClick={() => this.updateMultiple({
              innerWidth: Math.max(element.innerWidth - 5, 50),
              innerHeight: Math.max(element.innerWidth - 5, 50),
              innerTop: (100 - Math.max(element.innerWidth - 5, 50)) / 2,
              innerLeft: (100 - Math.max(element.innerWidth - 5, 50)) / 2,
            })}
          />
          <input
            className="slider"
            type="range"
            min={50}
            max={200}
            step={1}
            value={element.innerWidth}
            onChange={({ target: { value } }) => this.updateMultiple({
              innerWidth: +value,
              innerHeight: +value,
              innerTop: (100 - value) / 2,
              innerLeft: (100 - value) / 2,
            })}
          />
          <img
            className="icon zoom-in"
            src="/static/images/editor/elements/image/zoom_in.svg"
            alt="Zoom In"
            onClick={() => this.updateMultiple({
              innerWidth: Math.min(element.innerWidth + 5, 200),
              innerHeight: Math.min(element.innerWidth + 5, 200),
              innerTop: (100 - Math.min(element.innerWidth + 5, 200)) / 2,
              innerLeft: (100 - Math.min(element.innerWidth + 5, 200)) / 2,
            })}
          />
        </div>
        <div className="separator" />
        <div>
          <div className="color-picker-button-container">
            <img
              className="color-picker-inner icon"
              src="/static/images/editor/elements/image/background.svg"
              alt="Background Color"
              onClick={() => this.setState({
                showColorPicker: !this.state.showColorPicker,
              })}
            />
          </div>
          { this.state.showColorPicker ?
            <div className="color-picker">
              <div
                className="color-picker-inner"
                onClick={() => this.setState({ showColorPicker: false })}
              />
              <ChromePicker
                color={this.parseRgba(element.backgroundColor)}
                onChangeComplete={color => this.updateMultiple({
                  background: true,
                  backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                })}
              />
            </div> : null }
        </div>
        <div className="separator" />
        <img
          className="icon"
          src="/static/images/editor/elements/image/upload.svg"
          alt="Upload Image"
          onClick={() => {
            PopupboxManager.open({
              content: (<ImageUpload onFileUploaded={(url) => {
                this.updateElement('src', url);
                PopupboxManager.close();
              }}
              />),
              config: {
                titleBar: {
                  enable: true,
                  text: 'Upload a new image',
                },
                fadeIn: true,
                fadeInSpeed: 100,
              },
            });
          }}
        />
        <div className="separator" />
        <div className="separator" />
        <img
          className="icon"
          src="/static/images/editor/elements/image/clear.svg"
          alt="Remove Image"
          onClick={() => this.updateElement('src', '')}
        />
      </div>
    );
  }
}

PopcornEditor.editors.image = ImageEditor;
