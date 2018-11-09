import React from 'react';
import { observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';

import Project from '../../../../lib/editor/Project';
import PopcornEditor from '../editor.popcorn';
import PropTypes from '../../../PropTypes';

@observer
export default class NewElementBar extends PopcornEditor {
  static propTypes = {
    project: PropTypes.instanceOf(Project).isRequired,
    features: PropTypes.any, // TODO: define prop type
  };

  addElement(type, options) {
    const { project } = this.props;
    const currentCheckpointIndex = project.currentCheckpoint ?
      project.checkpoints.indexOf(project.currentCheckpoint) :
      0;
    let elementDuration = project.elements
      .find(({ type: elementType, popcornOptions }) =>
        Math.round(popcornOptions.start * 100) / 100 === project.currentCheckpoint &&
        elementType !== 'sequencer',
      );
    if (elementDuration) {
      elementDuration = elementDuration.popcornOptions.end;
    } else {
      elementDuration = project.checkpoints[currentCheckpointIndex + 1] ?
        project.checkpoints[currentCheckpointIndex] +
        ((project.checkpoints[currentCheckpointIndex + 1] -
          project.checkpoints[currentCheckpointIndex]) * 0.7) :
        project.projectData.media[0].duration;
    }
    Object.assign(options, {
      start: project.checkpoints[currentCheckpointIndex],
      end: elementDuration,
      target: 'video-container',
    });
    project.add({ type, popcornOptions: options });
  }

  render() {
    const { project, features } = this.props;
    return (
      <div className="popcorn-editor new-bar">
        <ReactTooltip
          effect="solid"
        />
        <button
          className="action-button"
          onClick={() => this.addElement('text', {
            text: 'Put your text here',
            linkUrl: 'https://videoremix.io',
            linkTarget: '_blank',
            position: 'custom',
            alignment: 'center',
            transition: 'popcorn-fade',
            rotation: 0,
            fontFamily: 'Poppins',
            fontSize: 10,
            fontColor: '#ffffff',
            shadow: false,
            shadowColor: '#444444',
            background: true,
            backgroundColor: '#EF5054',
            stroke: false,
            strokeColor: '#000000',
            fontDecorations: {
              bold: false,
              italics: false,
              responsive: true,
            },
            left: 20,
            top: 20,
            width: 40,
            height: 40,
            zindex: 1000,
          })}
          data-tip="Add new text element"
        >
          <img
            className="icon"
            src="/static/images/editor/elements/new/new_text.svg"
            alt=""
          />
        </button>
        <button
          className="action-button"
          onClick={() => this.addElement('image', {
            src: 'https://go.videoremix.io/static/images/logo.svg',
            linkSrc: 'http://videoremix.io',
            width: 33,
            height: 33,
            top: 35,
            left: 35,
            innerTop: 0,
            innerLeft: 0,
            innerWidth: 100,
            innerHeight: 100,
            title: 'Image',
            transition: 'popcorn-fade',
            rotation: 0,
            zindex: 1000,
          })}
          data-tip="Add new image element"
        >
          <img
            className="icon"
            src="/static/images/editor/elements/new/new_image.svg"
            alt=""
          />
        </button>
        <button
          className="action-button"
          onClick={() => this.addElement('personalizedImage', {
            src: '{{IMAGE}}',
            width: 33,
            height: 33,
            top: 35,
            left: 35,
            innerTop: 0,
            innerLeft: 0,
            innerWidth: 100,
            innerHeight: 100,
            title: '',
            transition: 'popcorn-fade',
            rotation: 0,
            zindex: 1000,
          })}
          data-tip="Add new personalized image element"
        >
          <img
            className="icon"
            src="/static/images/editor/elements/new/new_personalized.svg"
            alt=""
          />
        </button>
        <div className="separator" />
        <div className="separator" />
        <button
          className="action-button"
          onClick={() => {
            project.stopOnCta = !project.stopOnCta;
          }}
          data-tip={`Pause at the end of the video option is ${project.stopOnCta ? 'enabled' : 'disabled'}`}
        >
          <img
            className={`icon ${project.stopOnCta ? '' : 'inactive'}`}
            src={`/static/images/editor/elements/common/pause_on_cta-${project.stopOnCta ? 'enabled' : 'disabled'}.svg`}
            alt="Pause at the end of the video"
          />
        </button>
        <button
          className="action-button"
          onClick={() => {
            project.loop = !project.loop;
          }}
          data-tip={`Loop this video option is ${project.loop ? 'enabled' : 'disabled'}`}
        >
          <img
            className="icon"
            src={`/static/images/editor/elements/common/loop-${project.loop ? 'enabled' : 'disabled'}.svg`}
            alt="Loop video"
          />
        </button>
        {features.linked &&
        features.linked.state === 'enabled' &&
        <button
          className="action-button"
          onClick={() => {
            if (project.allowedSocials.indexOf('facebook') !== -1) {
              project.allowedSocials.splice(project.allowedSocials.indexOf('facebook'), 1);
            } else {
              project.allowedSocials.push('facebook');
            }
          }}
          data-tip={`Allow Facebook option is ${project.allowedSocials.indexOf('facebook') !== -1 ? 'enabled' : 'disabled'}`}
        >
          <img
            className="icon"
            src={`/static/images/editor/elements/common/use_facebook-${project.allowedSocials.indexOf('facebook') !== -1 ? 'enabled' : 'disabled'}.svg`}
            alt="Allow Facebook"
          />
        </button>
        }
        {features.linked &&
        features.linked.state === 'enabled' &&
        <button
          className="action-button"
          onClick={() => {
            if (project.allowedSocials.indexOf('linkedin') !== -1) {
              project.allowedSocials.splice(project.allowedSocials.indexOf('linkedin'), 1);
            } else {
              project.allowedSocials.push('linkedin');
            }
          }}
          data-tip={`Allow LinkedIn option is ${project.allowedSocials.indexOf('linkedin') !== -1 ? 'enabled' : 'disabled'}`}
        >
          <img
            className="icon"
            src={`/static/images/editor/elements/common/use_linkedin-${project.allowedSocials.indexOf('linkedin') !== -1 ? 'enabled' : 'disabled'}.svg`}
            alt="Allow LinkedIn"
          />
        </button>
        }
      </div>
    );
  }
}
