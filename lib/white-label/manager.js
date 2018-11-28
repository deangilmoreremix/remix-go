/**
 * Created by Eugene Butusov on 28/11/2018.
 */

const generateWhiteLabelCSS = (id, theme) => `
.theme-${id} .navbar-brand {
    background: url('../static/images/logo.svg') no-repeat 0;
}

.theme-${id} .getting-started .welcome * {
  color: ${theme.secondaryColor};
}

`;

class WhiteLabelManager {
  constructor(whiteLabel) {
    this.whiteLabel = whiteLabel;
  }

  get css() {
    return generateWhiteLabelCSS(this.whiteLabel._id, this.whiteLabel.go.theme);
  }
}

export default WhiteLabelManager;
