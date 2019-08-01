import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { ChromePicker } from 'react-color';
import SVGInline from 'react-svg-inline';
import ReactTooltip from 'react-tooltip';
import { Element, scrollSpy, animateScroll } from 'react-scroll'

import PopcornEditor from '../editor.popcorn';
import PositionSelector from '../../../../components/common/PositionSelector';
import GoogleFontsLoader from '../../../../components/wizard/editor/GoogleFontsLoader';

import SVGTrash from '../../../../static/images/editor/elements/new/clear.svg';
import SVGTextLeftAligned from '../../../../static/images/editor/elements/text/left_aligned.svg';
import SVGTextCenterAligned from '../../../../static/images/editor/elements/text/center_aligned.svg';
import SVGTextRightAligned from '../../../../static/images/editor/elements/text/right_aligned.svg';
import SVGScaleToFit from '../../../../static/images/editor/elements/text/scale_to_fit.svg';

const EDGE_PADDING = 3;
const PHONE_REGEX = /^(\+[0-9\s]*-?)?(\([0-9\s]*\))?[0-9-.\s]*$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateValueArray = (regexp, value) => {
  let isValid = true;
  value.split(',').map(item => item.trim()).forEach((item) => {
    if (!regexp.test(item)) {
      isValid = false;
    }
  });
  return isValid;
};

@observer
export default class TextEditor extends PopcornEditor {
  constructor(props) {
    super(props);
    this.selectItemRef = React.createRef();

    const { element: { callNotifyAddress = '' } } = props;
    this.state = {
      showFontColorPicker: false,
      showBackgroundColorPicker: false,
      dropdownFontOpen: false,
      callNotifyAddress,
      isSelected: '',
      position: {
        horizontal: '',
        vertical: '',
      },
    };
  }

  toggleDropdownFont = () => {
    const el = this.selectItemRef.current;
    console.log(el)
    if (el) {
      animateScroll.scrollTo(el.offsetTop);
      el.style.color = 'tomato';
    }
    this.setState(prevState => ({
      dropdownFontOpen: !prevState.dropdownFontOpen,
    }));
  };

  @computed
  get fontInputSize() {
    const { element: { fontFamily } } = this.props;

    if ((fontFamily === 'Palanquin') || (fontFamily === 'Palanquin Dark')
      || (fontFamily === 'Homemade Apple') || (fontFamily === 'Rock Salt')) {
      return '0.7rem';
    }
    return '1rem';
  }

  evaluatePosition() {
    const { element } = this.props;
    let horizontal = 'custom';
    let vertical = 'custom';

    // evaluate vertical
    if (element.top === EDGE_PADDING) {
      vertical = 'top';
    } else if (element.top === (100 - (element.height + EDGE_PADDING))) {
      vertical = 'bottom';
    } else if (element.top === (100 - (element.height + (EDGE_PADDING * 2))) / 2.0) {
      vertical = 'middle';
    }

    // evaluate horizontal
    if (element.left === EDGE_PADDING) {
      horizontal = 'left';
    } else if (element.left === (100 - (element.width + EDGE_PADDING))) {
      horizontal = 'right';
    } else if (element.left === (100 - (element.width + (EDGE_PADDING * 2))) / 2.0) {
      horizontal = 'center';
    }

    return { horizontal, vertical };
  }

  render() {
    console.log('render component')
    const { element, features } = this.props;
    const position = this.evaluatePosition();

    return (
      <div className="popcorn-editor text-editor">
        <ReactTooltip
          effect="solid"
        />
        <GoogleFontsLoader fonts={this.fonts} />
        <Dropdown isOpen={this.state.dropdownFontOpen} toggle={this.toggleDropdownFont}>
          <DropdownToggle className="font-input form-control" caret>
            <Element>
            <span ref={this.selectItemRef} style={{ fontFamily: element.fontFamily, fontSize: this.fontInputSize }}>
              {element.fontFamily}
            </span>
            </Element>
          </DropdownToggle>
          <DropdownMenu>
            <div className="scrolled">
              {this.fonts.map(font => (
                <DropdownItem key={font} onClick={() => this.updateElement('fontFamily', font)}>
                  <Element>
                    <span style={{ fontFamily: font }}>{font}</span>
                  </Element>
                </DropdownItem>
              ))}
            </div>
          </DropdownMenu>
        </Dropdown>
        <SVGInline
          className={`icon scale-to-fit-icon ${(element.fontDecorations && element.fontDecorations.responsive) ? 'active' : ''}`}
          classSuffix=""
          svg={SVGScaleToFit}
          cleanup={['title']}
          alt="Scale text size to fit container"
          onClick={() => this.updateElement('fontDecorations', { responsive: element.fontDecorations ? !element.fontDecorations.responsive : true })}
          data-tip="Scale text size to fit container"
        />
        {(!element.fontDecorations || !element.fontDecorations.responsive)
        && (
        <Input
          className="font-size-input"
          type="number"
          value={element.fontSize}
          onChange={({ target: { value } }) => this.updateElement('fontSize', value)}
          data-tip="Font size"
        />
        )
        }
        <div className="icon-group">
          <div>
            <div className="color-picker-button-container">
              <button
                className="color-picker-button"
                style={{ color: element.fontColor }}
                onClick={() => this.setState({
                  showFontColorPicker: !this.state.showFontColorPicker,
                })}
                data-tip="Font color"
              >
                Txt
              </button>
            </div>
            { this.state.showFontColorPicker
              ? (
                <div className="color-picker">
                  <div
                    className="color-picker-inner"
                    onClick={() => this.setState({ showFontColorPicker: false })}
                  />
                  <ChromePicker
                    color={this.parseRgba(element.fontColor)}
                    onChangeComplete={color => this.updateElement(
                      'fontColor', `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                    )}
                  />
                </div>
              ) : null }
          </div>
          <div>
            <div className="color-picker-button-container">
              <button
                className="color-picker-button"
                style={{ color: element.background ? element.backgroundColor : 'inherit' }}
                onClick={() => this.setState({
                  showBackgroundColorPicker: !this.state.showBackgroundColorPicker,
                })}
                data-tip="Background color"
              >
                Bkg
              </button>
            </div>
            { this.state.showBackgroundColorPicker
              ? (
                <div className="color-picker">
                  <div
                    className="color-picker-inner"
                    onClick={() => this.setState({ showBackgroundColorPicker: false })}
                  />
                  <ChromePicker
                    color={this.parseRgba(element.backgroundColor)}
                    onChangeComplete={color => this.updateMultiple({
                      background: true,
                      backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                    })}
                  />
                </div>
              ) : null }
          </div>
        </div>
        <div
          onClick={() => {
            const fontDecorations = {
              bold: element.fontDecorations ? !element.fontDecorations.bold : true,
              italics: element.fontDecorations ? element.fontDecorations.italics : true,
            };
            this.updateElement('fontDecorations', fontDecorations);
          }
          }
          className={`decoration-toggle bold ${element.fontDecorations.bold ? 'active' : ''}`}
          data-tip="Bold"
        >
          B
        </div>
        <div
          onClick={() => {
            const fontDecorations = {
              bold: element.fontDecorations ? element.fontDecorations.bold : true,
              italics: element.fontDecorations ? !element.fontDecorations.italics : true,
            };
            this.updateElement('fontDecorations', fontDecorations);
          }
          }
          className={`decoration-toggle italic ${(element.fontDecorations && element.fontDecorations.italics) ? 'active' : ''}`}
          data-tip="Italic"
        >
          I
        </div>
        <SVGInline
          className={`icon alignment-icon  left-aligned-icon ${(element.alignment === 'left') ? 'active' : ''}`}
          classSuffix=""
          svg={SVGTextLeftAligned}
          cleanup={['title']}
          alt="Align by left"
          onClick={() => this.updateElement('alignment', 'left')}
          data-tip="Align left"
        />
        <SVGInline
          className={`icon alignment-icon  center-aligned-icon ${(element.alignment === 'center') ? 'active' : ''}`}
          classSuffix=""
          svg={SVGTextCenterAligned}
          cleanup={['title']}
          alt="Align by center"
          onClick={() => this.updateElement('alignment', 'center')}
          data-tip="Align center"
        />
        <SVGInline
          className={`icon alignment-icon  right-aligned-icon ${(element.alignment === 'right') ? 'active' : ''}`}
          classSuffix=""
          svg={SVGTextRightAligned}
          cleanup={['title']}
          alt="Align by right"
          onClick={() => this.updateElement('alignment', 'right')}
          data-tip="Align right"
        />
        <div className="separator" />
        <PositionSelector
          className="text-position-selection"
          position={position}
          onPositionChanged={(aPosition) => {
            let left = 0;
            let top = 0;

            // evaluate vertical
            switch (aPosition.vertical) {
              case 'top':
                top = EDGE_PADDING;
                break;
              case 'middle':
                top = (100 - (element.height + (EDGE_PADDING * 2))) / 2.0;
                break;
              case 'bottom':
                top = (100 - (element.height + EDGE_PADDING));
                break;
              default:
                top = 0;
                break;
            }

            // evaluate horizontal
            switch (aPosition.horizontal) {
              case 'left':
                left = EDGE_PADDING;
                break;
              case 'center':
                left = (100 - (element.width + (EDGE_PADDING * 2))) / 2.0;
                break;
              case 'right':
                left = (100 - (element.width + EDGE_PADDING));
                break;
              default:
                left = 0;
                break;
            }

            this.updateMultiple({ left, top });
            this.setState({ position: this.evaluatePosition() });
          }}
          data-tip="Element position"
        />
        {
          features.clickToPhoneCall
          && features.clickToPhoneCall.state === 'enabled'
          && (element.linkUrl && PHONE_REGEX.test(element.linkUrl))
            ? (
              <div
                className={`phone-callback-input ${!this.state.callNotifyAddress || validateValueArray(EMAIL_REGEX, this.state.callNotifyAddress) ? '' : ' errored'}`}
                data-tip="E-mail address to notify about call attempt"
              >
                <span className="fa fa-input fa-bell" />
                <Input
                  type="text"
                  value={this.state.callNotifyAddress}
                  onChange={({ target: { value } }) => {
                    this.setState({ callNotifyAddress: value });
                    if (validateValueArray(EMAIL_REGEX, value)) {
                      this.updateElement('callNotifyAddress', value);
                    }
                  }}
                />
              </div>
            )
            : null
        }
        <div className="separator" />
        <div className="separator" />
        <div className="icon-group">
          <SVGInline
            className="icon clear-icon"
            classSuffix=""
            svg={SVGTrash}
            cleanup={['title']}
            alt="Remove Element"
            onClick={() => this.removeElement()}
            data-tip="Remove text element"
          />
        </div>
      </div>
    );
  }
}

PopcornEditor.editors.text = TextEditor;
