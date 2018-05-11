import React, { Component } from 'react';
import { observer } from 'mobx-react';

import PropTypes from '../../PropTypes';

@observer
export default class PopcornEditor extends Component {
  static propTypes = {
    element: PropTypes.any,
    onElementUpdate: PropTypes.func.isRequired,
  };

  static editors = {};

  updateElement(key, value) {
    const { element, onElementUpdate } = this.props;
    element[key] = value;
    onElementUpdate(element);
  }
}
