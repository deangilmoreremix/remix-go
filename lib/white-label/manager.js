/**
 * Created by Eugene Butusov on 28/11/2018.
 */

import Chroma from 'chroma-js';
import generateStyledCSS from './style-generators/styled-css-generator';
import generateSVGStyles from './style-generators/styled-svg-generator';

class WhiteLabelManager {
  constructor(whiteLabel) {
    this.whiteLabel = whiteLabel;
  }

  get css() {
    const { _id, theme: { accent2Color: sourceColor }, go: { brandLogo } } = this.whiteLabel;
    const baseColor = Chroma(sourceColor);
    const theme = {
      primaryColor: baseColor.css(),
      stageSelectColor: baseColor.darken(0.33).css(),
      phaseHighlightColor: baseColor.desaturate(1.5).brighten(0.8).css(),
    };
    return `${generateStyledCSS(_id, brandLogo, theme)}${generateSVGStyles(_id, theme)}`;
  }
}

export default WhiteLabelManager;
