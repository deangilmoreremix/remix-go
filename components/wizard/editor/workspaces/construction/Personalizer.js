import React, { Component } from 'react';
import SVGInline from 'react-svg-inline';

import PropTypes from '../../../../../lib/PropTypes';

import SVGItemDot from '../../../../../static/images/editor/personalizer/red_circle.svg';

export default class Personalizer extends Component {
  static propTypes = {
    className: PropTypes.string,
    onTokenChosen: PropTypes.func.isRequired,
  };

  static TOKENS = [
    'FIRSTNAME',
    'LASTNAME',
    'EMAIL',
    'GEOCOUNTRY',
    'GEOCITY',
    'GEOSTATE',
    'NAME',
    'GENDER',
    'CUSTOM',
  ];

  static TOKEN_MODE = {
    PLAIN: 'PLAIN',
    FALLBACK: 'FALLBACK',
    UPPERCASE: 'UPPERCASE',
  };

  constructor(props) {
    super(props);
    this.state = {
      currentToken: Personalizer.TOKENS[0],
      tokenMode: Personalizer.TOKEN_MODE.PLAIN,
      fallbackValue: '',
      customTokenValue: 'CUSTOM',
    };
  }

  onTokenChange = (token) => {
    this.setState({
      currentToken: token,
      tokenMode: Personalizer.TOKEN_MODE.PLAIN,
      fallbackValue: '',
      customTokenValue: 'CUSTOM',
    });
  };

  buildToken = () => {
    const { currentToken, tokenMode, fallbackValue, customTokenValue } = this.state;
    const actualToken = currentToken !== 'CUSTOM' ? currentToken : customTokenValue;
    switch (tokenMode) {
      case Personalizer.TOKEN_MODE.FALLBACK:
        return `{{d ${actualToken} "${fallbackValue.replace(/'/g, '\\"')}"}}`;
      case Personalizer.TOKEN_MODE.UPPERCASE:
        return `{{up ${actualToken}}}`;
      case Personalizer.TOKEN_MODE.PLAIN:
        return `{{${actualToken}}}`;
      default:
        return '';
    }
  };

  render() {
    const { className, onTokenChosen } = this.props;
    const { currentToken, tokenMode, fallbackValue, customTokenValue } = this.state;
    return (
      <div className={className} style={{ width: '600px', height: '300px' }}>
        <ul className="token-list">
          {Personalizer.TOKENS.map((token, idx) => (
            <li key={idx} onClick={() => this.onTokenChange(token)}>
              <span className={`token-list-item ${token === currentToken ? 'selected' : ''}`}>
                <SVGInline className="icon item-dot-icon" classSuffix="" svg={SVGItemDot} />
                {token}
              </span>
            </li>
          ))}
        </ul>
        <div className="separator vertical" />
        <div className="setup-area">
          <span>{
            currentToken !== 'CUSTOM' ?
              <span>{currentToken}</span> :
              <input
                type="text"
                value={customTokenValue}
                onChange={event => this.setState({ customTokenValue: event.target.value })}
              />
          }
          </span>
          <div className="separator horizontal" />
          <ul className="configuration-list">
            <li>
              <span
                className={`configuration-list-item ${tokenMode === Personalizer.TOKEN_MODE.PLAIN ? 'selected' : ''}`}
                onClick={() => this.setState({ tokenMode: Personalizer.TOKEN_MODE.PLAIN })}
              >
                <SVGInline className="icon item-dot-icon" classSuffix="" svg={SVGItemDot} />
                plain
              </span>
            </li>
            <li>
              <span
                className={`configuration-list-item ${tokenMode === Personalizer.TOKEN_MODE.FALLBACK ? 'selected' : ''}`}
                onClick={() => this.setState({ tokenMode: Personalizer.TOKEN_MODE.FALLBACK })}
              >
                <SVGInline className="icon item-dot-icon" classSuffix="" svg={SVGItemDot} />
                Fallback value:
                <input
                  type="text"
                  className="fallback-input"
                  disabled={tokenMode !== Personalizer.TOKEN_MODE.FALLBACK}
                  value={fallbackValue}
                  onChange={event => this.setState({ fallbackValue: event.target.value })}
                />
              </span>
            </li>
            <li>
              <span
                className={`configuration-list-item ${tokenMode === Personalizer.TOKEN_MODE.UPPERCASE ? 'selected' : ''}`}
                onClick={() => this.setState({ tokenMode: Personalizer.TOKEN_MODE.UPPERCASE })}
              >
                <SVGInline className="icon item-dot-icon" classSuffix="" svg={SVGItemDot} />
                UPPERCASE
              </span>
            </li>
          </ul>
          <button
            className="go-button confirm-button"
            onClick={() => {
              onTokenChosen(this.buildToken());
            }}
          >Add
          </button>
        </div>
      </div>
    );
  }
}
