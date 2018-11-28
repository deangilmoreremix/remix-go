/**
 * Created by Eugene Butusov on 29/11/2018.
 */

export default (id, brandLogo, theme) => `
.theme-${id} .navbar-brand {
    background: url('${brandLogo || '../static/images/logo.svg'}') no-repeat 0;
    background-size: contain;
}

.theme-${id} .go-button,
.theme-${id} .card .overlay .buttons-container .button-primary,
.theme-${id} .editor-wrapper .canvas .stage-wrapper,
.theme-${id} .publish-overview .publish-overview-inner .overview-column .overview-edit .button-primary,
.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group.active .phase-label:hover,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group.active .phase-label:hover,
.theme-${id} .campaign .workspace .embed-progress .progress-bar,
.theme-${id} .video-upload .video-upload-container .upload-progress .upload-progress-bar .progress-bar {
  background: ${theme.primaryColor};
}

.theme-${id} .getting-started .welcome *,
.theme-${id}.header .nav-item .label,
.theme-${id}.header .navbar-light .navbar-nav .nav-link,
.theme-${id}.header .navbar-light .navbar-nav .nav-link:hover,
.theme-${id}.header .navbar-light .navbar-nav .nav-link:focus {
  color: ${theme.primaryColor};
}

.theme-${id} .publish-overview .publish-overview-inner .overview-column .overview-edit .button-primary,
.theme-${id} .card .overlay .buttons-container .button-primary {
  border-color: ${theme.primaryColor};
}

.theme-${id}.header .group-bordered,
.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group.active .phase-label,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group.active .phase-label,
.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group .phase-label,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group .phase-label,
.theme-${id} .phase-component .phase-state-tabs .stepper .line,
.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group .phase, .phase-component .phase-state-container .stepper .stepper-tab-group .phase,
.theme-${id} .phase-component .phase-state-container .stepper .line {
  border: 1px solid ${theme.primaryColor};
}

.theme-${id} .editor-wrapper .canvas .stage-wrapper .stage-item.active {
  background: ${theme.stageSelectColor};
}

.theme-${id} .go-switch .btn.active {
  background-color: ${theme.primaryColor} !important;
}


.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group .phase-label,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group .phase-label {
  color: ${theme.primaryColor};
}

.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group.active .phase-label,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group.active .phase-label {
  background: ${theme.phaseHighlightColor};
}

.theme-${id} .phase-component .phase-state-tabs .stepper .stepper-tab-group .phase-label:hover,
.theme-${id} .phase-component .phase-state-container .stepper .stepper-tab-group .phase-label:hover {
  background: ${theme.phaseHighlightColor};
}
`;
