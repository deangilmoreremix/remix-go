import React, { Component, Fragment } from 'react';
import Router from 'next/router';
import { observer, inject } from 'mobx-react';
import Templates from './templates/Templates';

@inject('api')
@inject('store')
@observer
export default class GettingStarted extends Component {
  static WIZARD_TYPES = {
    FROM_TEMPLATE: 'template',
    GENERATOR: 'generator',
    VIDEO_UPLOAD: 'upload',
  };

  state = {
    wizardType: null,
  };

  componentDidMount() {
    let wizardType = GettingStarted.WIZARD_TYPES.FROM_TEMPLATE;
    if (process.browser) {
      wizardType = Router.query.wizard;
    }
    this.setState({ wizardType });
  }

  getWizard(wizardType) {
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.GENERATOR:
        return 'Template generator is coming soon';
      case GettingStarted.WIZARD_TYPES.VIDEO_UPLOAD:
        return 'Video upload is coming soon';
      default:
        return <Templates onTemplateSelected={template => this.handleWizardSelection(template)} />;
    }
  }

  handleWizardSelection(data) {
    const { wizardType } = this.state;
    const { store } = this.props;
    switch (wizardType) {
      case GettingStarted.WIZARD_TYPES.FROM_TEMPLATE:
        store.activeProject = data;
        Router.push({ pathname: '/edit' });
        break;
      default:
        break;
    }
  }

  render() {
    const { wizardType } = this.state;
    return (
      <Fragment>
        {this.getWizard(wizardType)}
      </Fragment>
    );
  }
}
