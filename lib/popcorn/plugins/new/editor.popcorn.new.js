import React from 'react';
import { observer } from 'mobx-react';
import { FormGroup, Input, Label } from 'reactstrap';
import ReactTooltip from 'react-tooltip';

import Project from '../../../../lib/editor/Project';
import PopcornEditor from '../editor.popcorn';
import PropTypes from '../../../PropTypes';

@observer
export default class NewElementBar extends PopcornEditor {
  static propTypes = {
    project: PropTypes.instanceOf(Project).isRequired,
  };

  addElement(type, options) {
    const { project } = this.props;
    const currentCheckpointIndex = project.currentCheckpoint ?
      project.checkpoints.indexOf(project.currentCheckpoint) :
      0;
    let elementDuration = project.elements
      .find(element => element.popcornOptions.start === project.currentCheckpoint);
    if (!elementDuration) {
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
    const { project } = this.props;
    return (
      <div className="popcorn-editor new-bar">
        <ReactTooltip
          effect="solid"
        />
        <img
          className="icon"
          src="/static/images/editor/elements/new/new_text.svg"
          alt=""
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
        />
        <img
          className="icon"
          src="/static/images/editor/elements/new/new_image.svg"
          alt=""
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
        />
        <img
          className="icon"
          src="/static/images/editor/elements/new/new_personalized.svg"
          alt=""
          onClick={() => this.addElement('personalizedImage', {
            src: '{{IMAGE}}',
            linkSrc: 'https://videoremix.io',
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
        />
        <div className="separator" />
        <div className="row-group">
          <FormGroup className="cta-pause" check>
            <Label className="cta-pause-label" check>
              <Input
                className="cta-pause-input"
                type="checkbox"
                checked={project.stopOnCta}
                onChange={({ target: { checked } }) => { project.stopOnCta = checked; }}
              />
              {' '}
              Pause at the end of the video
            </Label>
          </FormGroup>
        </div>
      </div>
    );
  }
}
