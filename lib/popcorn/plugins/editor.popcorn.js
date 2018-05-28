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

  fonts = [
    'Fjalla One',
    'Gentium Book Basic',
    'Source Sans Pro',
    'Poppins',
    'Squada One',
    'Lato',
    'Questrial',
    'Sintony',
    'Lora',
    'Roboto',
    'Khula',
    'Yanone Kaffeesatz',
    'Syncopate',
    'Economica',
    'Vollkorn',
    'Rajdhani',
    'Merriweather',
    'Ek Mukta',
    'Merriweather Sans',
    'Istok Web',
    'Metrophobic',
    'Montserrat',
    'Gravitas One',
    'PT Sans',
    'Open Sans',
    'Oswald',
    'Palanquin',
    'Bangers',
    'Fredoka One',
    'Covered By Your Grace',
    'Coda',
    'Bowlby One SC',
    'Titan One',
    'Bevan',
    'Teko',
    'Tienne',
    'Alfa Slab One',
    'Martel Sans',
    'Raleway',
    'Fredericka the Great',
    'Cabin Sketch',
    'Special Elite',
    'Anton',
    'Zeyada',
    'La Belle Aurore',
    'Homemade Apple',
    'Crete Round',
    'Palanquin Dark',
    'Dawning of a New Day',
    'Give You Glory',
    'Indie Flower',
    'Just Me Again Down Here',
    'Over the Rainbow',
    'Permanent Marker',
    'Reenie Beanie',
    'Rock Salt',
    'Waiting for the Sunrise',
    'Walter Turncoat',
    'Vast Shadow',
    'Lily Script One',
    'Cookie',
  ];

  componentDidMount() {
    if (process.browser) {
      console.log('call to update layout');
      window.dispatchEvent(new Event('layoutUpdated'));
    }
  }

  updateElement(key, value) {
    const { onElementUpdate } = this.props;
    onElementUpdate({ [key]: value });
  }
  updateMultiple(options) {
    const { onElementUpdate } = this.props;
    onElementUpdate(options);
  }
}
