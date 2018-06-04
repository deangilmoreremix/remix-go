import React from 'react';

import { observer } from 'mobx-react';

import Project from '../../../../lib/editor/Project';
import PopcornEditor from '../editor.popcorn';
import PropTypes from '../../../PropTypes';

@observer
export default class NewElementBar extends PopcornEditor {
  static propTypes = {
    project: PropTypes.instanceOf(Project).isRequired,
  };

  addElement(options) {
    const { project } = this.props;
    project.
  }

  render() {
    return (
      <div className="popcorn-editor new-bar">
        <img
          className="icon"
          src="/static/images/editor/elements/new/new_text.svg"
          alt=""
        />
        <img
          className="icon"
          src="/static/images/editor/elements/new/new_image.svg"
          alt=""
        />
        <img
          className="icon"
          src="/static/images/editor/elements/new/new_personalized.svg"
          alt=""
        />
      </div>
    );
  }
}
