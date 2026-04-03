export function isResolutionWrong(recommendedResolution, imageMeta = {}) {
  if (!recommendedResolution) return false;
  return recommendedResolution.width !== imageMeta.width ||
    recommendedResolution.height !== imageMeta.height;
}

export function getRecommendedResolution(aspectRatio = '16:9') {
  const resolutions = {
    '16:9': { width: 1920, height: 1080 },
    '9:16': { width: 1080, height: 1920 },
    '4:3': { width: 1440, height: 1080 },
    '1:1': { width: 1080, height: 1080 },
    '21:9': { width: 2560, height: 1080 },
  };
  return resolutions[aspectRatio] || resolutions['16:9'];
}

export function calculateCropDimensions(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;

  let cropWidth, cropHeight;
  if (sourceAspect > targetAspect) {
    cropHeight = sourceHeight;
    cropWidth = sourceHeight * targetAspect;
  } else {
    cropWidth = sourceWidth;
    cropHeight = sourceWidth / targetAspect;
  }

  return {
    cropWidth: Math.round(cropWidth),
    cropHeight: Math.round(cropHeight),
    offsetX: Math.round((sourceWidth - cropWidth) / 2),
    offsetY: Math.round((sourceHeight - cropHeight) / 2),
  };
}

export default {
  isResolutionWrong,
  getRecommendedResolution,
  calculateCropDimensions,
};
