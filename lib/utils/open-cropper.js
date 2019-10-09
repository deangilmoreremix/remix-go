import React from 'react';
import { PopupboxManager } from 'react-popupbox';

import ImageCropper from '../../components/common/ImageCropper';

export function openCrop(options) {
  const { recommendedResolution, imageMeta = {}, onFileUploaded, isNewModal } = options;
  debugger
  if (recommendedResolution && (recommendedResolution.width !== imageMeta.width
    || recommendedResolution.height !== imageMeta.height)) {
    const action = isNewModal ? 'open' : 'update';
    return PopupboxManager[action]({
      content: <ImageCropper
        className="canvas"
        imageData={imageMeta}
        resolution={recommendedResolution}
        onImageCropped={(value) => {
          onFileUploaded(value);
          PopupboxManager.close();
        }}
      />,
      config: {
        titleBar: {
          enable: true,
          text: 'Please select image area to use in project',
        },
        fadeIn: true,
        fadeInSpeed: 250,
        content: {
          className: 'image-crop-content',
        },
      },
    });
  }
  onFileUploaded(imageMeta);
}

export default {
  openCrop,
};
