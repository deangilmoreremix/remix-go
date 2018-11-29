/* eslint-disable no-underscore-dangle */
/**
 * Created by Eugene Butusov on 28/11/2018.
 */

import Chroma from 'chroma-js';
import generateStyledCSS from './style-generators/styled-css-generator';
import generateSVGStyles from './style-generators/styled-svg-generator';

class WhiteLabelManager {
  _generateCSS() {
    if (!this.shouldOverride) {
      return '';
    }
    const { _id, theme: { accent2Color: sourceColor }, go: { brandLogo } } = this._whiteLabel;
    const baseColor = Chroma(sourceColor);
    const theme = {
      primaryColor: baseColor.css(),
      stageSelectColor: baseColor.darken(0.33).css(),
      phaseHighlightColor: baseColor.desaturate(1.5).brighten(0.8).css(),
    };
    return `${generateStyledCSS(_id, brandLogo, theme)}${generateSVGStyles(_id, theme)}`;
  }

  constructor(whiteLabel, shouldOverride) {
    this._whiteLabel = whiteLabel;
    this.shouldOverride = shouldOverride;

    // build whitelabel shortcuts
    Object.assign(this, {
      key: this._whiteLabel._id,
      domain: this._whiteLabel.domain,
      serviceName: this._whiteLabel.name,
      brandName: `${this._whiteLabel.name} ${this._whiteLabel.go ? this._whiteLabel.go.alternateName : 'GO'}`,
      appName: this._whiteLabel.go ? this._whiteLabel.go.alternateName : 'GO',
      privacyPolicyLink: this._whiteLabel.privacyPolicyLink,
      tutorialsLink: this._whiteLabel.go && this._whiteLabel.go.tutorialsLink,
      css: this._generateCSS(),
    });
  }
}

export default WhiteLabelManager;
