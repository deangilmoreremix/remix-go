/**
 * Created by Eugene Butusov on 28/11/2018.
 */

import Chroma from 'chroma-js';

const generateWhiteLabelCSS = (id, brandLogo, theme) => `
.theme-${id} .navbar-brand {
    background: url('${brandLogo || '../static/images/logo.svg'}') no-repeat 0;
    background-size: contain;
}

.theme-${id} .getting-started .welcome *,
.theme-${id}.header .nav-item .label,
.theme-${id}.header .navbar-light .navbar-nav .nav-link,
.theme-${id}.header .navbar-light .navbar-nav .nav-link:hover,
.theme-${id}.header .navbar-light .navbar-nav .nav-link:focus {
  color: ${theme.primaryColor};
}
.theme-${id}.header .group-bordered {
  border: 1px solid ${theme.primaryColor};
}

.theme-${id} .getting-started .getting-started-list .getting-started-item img .cls-3 {
  stroke: ${theme.primaryColor};
}

.theme-${id} .card .overlay .buttons-container .button-primary {
  background: ${theme.primaryColor};
  border-color: ${theme.primaryColor};
}

.theme-${id} .phase-component .phase-state-tabs .stepper .line,
.theme-${id} .phase-component .phase-state-container .stepper .line {
  border: 1px solid ${theme.primaryColor};
}

.theme-${id} .go-button {
  background: ${theme.primaryColor};
}

.theme-${id} .editor-wrapper .canvas .stage-wrapper {
  background: ${theme.primaryColor};
}

.theme-${id} .editor-wrapper .canvas .stage-wrapper .stage-item.active {
  background: ${theme.stageSelectColor};
}

.theme-${id} .go-switch .btn.active {
  background-color: ${theme.primaryColor} !important;
}

.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group .phase, .phase-component .phase-state-container .stepper .stepper-tab-group .phase {
  border: 1px solid ${theme.primaryColor};
}

.theme-${id} .publish-overview .publish-overview-inner .overview-column .overview-edit .button-primary {
  background: ${theme.primaryColor};
  border-color: ${theme.primaryColor};
}

.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group .phase-label,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group .phase-label {
  color: ${theme.primaryColor};
  border: 1px solid ${theme.primaryColor};
}

.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group.active .phase-label,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group.active .phase-label {
  background: ${theme.phaseHighlightColor};
  border: 1px solid ${theme.primaryColor};
}

.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group.active .phase-label:hover,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group.active .phase-label:hover {
  background: ${theme.primaryColor};
}

.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group .phase-label:hover,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group .phase-label:hover {
  background: ${theme.phaseHighlightColor};
}

.theme-${id} .campaign .workspace .embed-progress .progress-bar {
  background: ${theme.primaryColor};
}

.theme-${id} .video-upload .video-upload-container .upload-progress .upload-progress-bar .progress-bar {
  background: ${theme.primaryColor};
}
`;

class WhiteLabelManager {
  constructor(whiteLabel) {
    this.whiteLabel = whiteLabel;
  }

  get css() {
    const { _id, theme, go: { brandLogo } } = this.whiteLabel;
    const baseColor = Chroma(theme.accent2Color);
    return generateWhiteLabelCSS(_id, brandLogo, {
      primaryColor: baseColor.css(),
      stageSelectColor: baseColor.darken(0.33).css(),
      phaseHighlightColor: baseColor.desaturate(1.5).brighten(0.8).css(),
    });
  }
}

export default WhiteLabelManager;
