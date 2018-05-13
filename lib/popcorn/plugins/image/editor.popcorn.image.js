import React from 'react';
import { observer } from 'mobx-react';
import {
  PopupboxManager,
  PopupboxContainer,
} from 'react-popupbox';

import ImageUpload from '../../../../components/common/ImageUpload';
import PopcornEditor from '../editor.popcorn';

@observer
export default class ImageEditor extends PopcornEditor {
  render() {
    const { element } = this.props;
    return (
      <div className="popcorn-editor image-editor">
        <PopupboxContainer />
        <img
          className="icon"
          src="/static/images/editor/elements/image/upload.svg"
          alt=""
          onClick={() => {
            PopupboxManager.open({
              content: (<ImageUpload />),
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
      </div>
    );
  }
}

PopcornEditor.editors.image = ImageEditor;
