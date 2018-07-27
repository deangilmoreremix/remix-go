// PLUGIN: text

const interact = require('interactjs');
const { extendObservable } = require('mobx');

function isSafari() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1) {
    return ua.indexOf('chrome') === -1;
  }
  return false;
}

(function (Popcorn, jQuery) {
  /**
   * text Popcorn plug-in
   * Based on popcorn.text.js by @humph
   * @param {Object} options
   *
   * Example:

   * */

  let DEFAULT_FONT_COLOR = '#000000',
    DEFAULT_SHADOW_COLOR = '#444444',
    DEFAULT_STROKE_COLOR = '#000000',
    DEFAULT_BACKGROUND_COLOR = '#888888';

  function catchCaretCharacterOffsetWithin(options, field) {
    return ({ target: element }) => {
      let caretOffset = 0;
      const doc = element.ownerDocument || element.document;
      const win = doc.defaultView || doc.parentWindow;
      let sel;
      if (typeof win.getSelection !== 'undefined') {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
          const range = win.getSelection().getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel = doc.selection) && sel.type !== 'Control') {
        const textRange = sel.createRange();
        const preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint('EndToEnd', textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      options.caretOffsets = options.caretOffsets || {};
      options._activeHandle = {
        type: field,
        target: element,
      };
      options.caretOffsets[field] = caretOffset;
    };
  }

  function newlineToBreak(string) {
    // Deal with both \r\n and \n
    return string.replace(/\r?\n/gm, '<br>');
  }

  function draggableResizable(element, textfill) {
    const dragMoveListener = (event) => {
      const { target } = event;
      const x = (
        parseFloat(target.getAttribute('data-x')) || (element.left / 100) * element._container.parentNode.offsetWidth
      ) +
        (event.deltaRect ? event.deltaRect.left : event.dx);
      const y = (
        parseFloat(target.getAttribute('data-y')) || (element.top / 100) * element._container.parentNode.offsetHeight
      ) +
        (event.deltaRect ? event.deltaRect.top : event.dy);

      const relativeTop = (
        y / element._container.parentNode.offsetHeight
      ) * 100;
      const relativeLeft = (
        x / element._container.parentNode.offsetWidth
      ) * 100;
      element.position = 'custom';
      element.top = relativeTop;
      element.left = relativeLeft;
      element._container.style.top = `${relativeTop}%`;
      element._container.style.left = `${relativeLeft}%`;
      if (event.rect) {
        const relativeHeight = (
          event.rect.height / element._container.parentNode.offsetHeight
        ) * 100;
        const relativeWidth = (
          event.rect.width / element._container.parentNode.offsetWidth
        ) * 100;
        element.width = relativeWidth;
        element._container.style.width = `${relativeWidth}%`;
        if (element.fontDecorations.responsive) {
          element.height = relativeHeight;
          element._container.style.height = `${relativeHeight}%`;
        }
      }

      if (!element.fontDecorations.responsive) {
        element._container.style.maxHeight = `${100 - element.top}%`;
      }

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
      if (['dragend', 'resizeend'].indexOf(event.type) !== -1) {
        element._context.emit('elementUpdated', {
          type: 'text',
          element,
          options: {
            top: element.top,
            left: element.left,
            width: element.width,
            height: element.height,
            position: 'custom',
          },
        });
        if (element.fontDecorations.responsive && textfill) {
          textfill();
        }
      }
    };

    interact(element._container)
      .draggable({
        onmove: dragMoveListener,
        onend: dragMoveListener,
        restrict: {
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        },
      })
      .resizable({
        // resize from all edges and corners
        edges: {
          left: true,
          right: true,
          bottom: element.fontDecorations.responsive,
          top: element.fontDecorations.responsive,
        },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },
        // minimum size
        restrictSize: {
          min: { width: 45, height: 45 },
        },
        inertia: true,
        onmove: dragMoveListener,
        onend: dragMoveListener,
      });
  }

  function buildScripts(options) {
    if (!options.scripts) {
      options.scripts = {};

      Object.keys(options._natives.manifest.options.scripts).forEach((key) => {
        options.scripts[key] = '';
      });
    } else {
      options.scripts._compiled = options.scripts._compiled || {};

      Object.keys(options._natives.manifest.options.scripts).forEach((key) => {
        /* jslint evil: true */
        const fn = new Function('options', options.scripts[key]);
        options.scripts._compiled[key] = function () {
          return fn.apply(fn, [{
            event: options,
          }]);
        };
      });
    }
  }

  Popcorn.plugin('text', {

    manifest: {
      about: {
        name: 'Popcorn text Plugin',
        version: '0.1',
        author: '@k88hudson, @mjschranz',
      },
      options: {
        text: {
          elem: 'textarea',
          label: 'Text',
          default: 'Video Editor',
        },
        linkUrl: {
          elem: 'input',
          type: 'text',
          label: 'Link URL',
        },
        linkTarget: {
          elem: 'select',
          options: ['New Tab', 'Current Tab'],
          values: ['_blank', '_parent'],
          label: 'Open Link In',
          default: '_blank',
        },
        position: {
          elem: 'select',
          options: ['Custom', 'Middle', 'Bottom', 'Top'],
          values: ['custom', 'middle', 'bottom', 'top'],
          label: 'Text Position',
          default: 'custom',
        },
        alignment: {
          elem: 'select',
          options: ['Center', 'Left', 'Right'],
          values: ['center', 'left', 'right'],
          label: 'Text Alignment',
          default: 'left',
        },
        start: {
          elem: 'input',
          type: 'text',
          label: 'In',
          group: 'advanced',
          units: 'seconds',
        },
        end: {
          elem: 'input',
          type: 'text',
          label: 'Out',
          group: 'advanced',
          units: 'seconds',
        },
        transition: {
          elem: 'select',
          options: ['None',
            'Pop',
            'Fade',
            'Fade In',
            'Fade In Up',
            'Slide Up',
            'Slide Down',
            'Swivel In (Y-axis)',
            'Swivel In (X-axis)',
            'Typing Effect',
            'Blur (White)',
            'Wobble Vertical',
            'Wobble Horizontal',
            'Wobble Diagonal',
            'Pulse (Looped)',
            'Push',
            'Bob',
            'Buzz',
            'Buzz out',
            'Stroke Pulse (Looped)',
            'Flicker',
            'Type Blink',
          ],

          values: ['popcorn-none',
            'popcorn-pop',
            'popcorn-fade',
            'popcorn-fade-in',
            'popcorn-fade-in-up',
            'popcorn-slide-up',
            'popcorn-slide-down',
            'popcorn-swivel-y',
            'popcorn-swivel-x',
            'popcorn-typing',
            'popcorn-blur-w',
            'popcorn-wobble-vertical',
            'popcorn-wobble-horizontal',
            'popcorn-wobble-diagonal',
            'popcorn-pulse',
            'popcorn-push',
            'popcorn-bob',
            'popcorn-buzz',
            'popcorn-buzz-out',
            'popcorn-stroke-pulse',
            'animate-flicker',
            'popcorn-type-blink',
          ],

          label: 'Transition',
          default: 'popcorn-fade',
        },
        rotation: {
          elem: 'input',
          type: 'number',
          label: 'Rotation',
          default: 0,
          units: 'degrees',
        },
        fontFamily: {
          elem: 'select',
          label: 'Font',
          styleClass: '',
          googleFonts: true,
          group: 'advanced',
          default: 'Open Sans',
        },
        fontSize: {
          elem: 'input',
          type: 'number',
          label: 'Font Size',
          default: 10,
          units: '%',
          group: 'advanced',
        },
        fontColor: {
          elem: 'input',
          type: 'color',
          label: 'Font color',
          default: DEFAULT_FONT_COLOR,
          group: 'advanced',
        },
        shadow: {
          elem: 'input',
          type: 'checkbox',
          label: 'Shadow',
          default: false,
          group: 'advanced',
        },
        shadowColor: {
          elem: 'input',
          type: 'color',
          label: 'Shadow colour',
          default: DEFAULT_SHADOW_COLOR,
          group: 'advanced',
        },
        background: {
          elem: 'input',
          type: 'checkbox',
          label: 'Background',
          default: false,
          group: 'advanced',
        },
        backgroundColor: {
          elem: 'input',
          type: 'color',
          label: 'Background color',
          default: DEFAULT_BACKGROUND_COLOR,
          group: 'advanced',
        },
        stroke: {
          elem: 'input',
          type: 'checkbox',
          label: 'Stroke',
          default: false,
          group: 'advanced',
        },
        strokeColor: {
          elem: 'input',
          type: 'color',
          label: 'Stroke color',
          default: DEFAULT_STROKE_COLOR,
          group: 'advanced',
        },
        fontDecorations: {
          elem: 'checkbox-group',
          labels: { bold: 'Bold', italics: 'Italics', responsive: 'Scale To Fit' },
          default: { bold: false, italics: false, responsive: false },
          group: 'advanced',
        },
        left: {
          elem: 'input',
          type: 'number',
          label: 'Left',
          units: '%',
          default: 25,
          hidden: true,
        },
        top: {
          elem: 'input',
          type: 'number',
          label: 'Top',
          units: '%',
          default: 0,
          hidden: true,
        },
        width: {
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Width',
          default: 50,
          hidden: true,
        },
        height: {
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Height',
          default: 10,
          hidden: true,
        },
        zindex: {
          hidden: true,
        },
        scripts: {
          onStart: '',
          onEnd: '',
        },
      },
    },

    _setup(options) {
      let target = Popcorn.dom.find(options.target),
        text = newlineToBreak(options.text),
        container = options._container = document.createElement('div'),
        innerContainer = document.createElement('div'),
        innerDiv = document.createElement('div'),
        innerSpan = document.createElement('span'),
        fontSheet,
        fontDecorations = options.fontDecorations || options._natives.manifest.options.fontDecorations.default,
        position = options.position || options._natives.manifest.options.position.default,
        alignment = options.alignment,
        transition = options.transition || options._natives.manifest.options.transition.default,
        link,
        linkUrl = options.linkUrl,
        linkTarget = options.linkTarget,
        shadowColor = options.shadowColor || DEFAULT_SHADOW_COLOR,
        backgroundColor = options.backgroundColor || DEFAULT_BACKGROUND_COLOR,
        strokeColor = options.strokeColor || DEFAULT_STROKE_COLOR,
        rotation = options.rotation || 0,
        context = options._context = this;

      let padding = '3',
        width = 100 - (padding * 2);

      if (!target) {
        target = this.media.parentNode;
      }

      options._target = target;
      container.style.position = 'absolute';
      container.style.transform
        = container.style['-webkit-transform']
        = container.style['-moz-transform']
        = container.style['-ms-transform']
        = `rotate(${rotation}deg)`;
      container.classList.add('popcorn-text');

      innerDiv.style.width = '100%';
      innerDiv.style.height = '100%';
      innerDiv.style.display = 'flex';
      innerDiv.style['align-items'] = 'center';

      // backwards comp
      if ('center left right'.match(position)) {
        alignment = position;
        position = 'middle';
      }

      // innerSpan inside innerDiv is to allow zindex from layers to work properly.
      // if you mess with this code, make sure to check for zindex issues.
      innerDiv.appendChild(innerSpan);
      innerContainer.appendChild(innerDiv);
      container.appendChild(innerContainer);
      target.appendChild(container);

      // Add transition class
      // There is a special case where popup has to be added to the innerSpan, not the outer container.
      options._transitionContainer = container;

      options._transitionContainer.classList.add(transition);
      options._transitionContainer.classList.add('off');

      // Handle all custom fonts/styling
      options.fontColor = options.fontColor || DEFAULT_FONT_COLOR;
      innerContainer.classList.add('text-inner-div');
      innerContainer.style.color = options.fontColor;
      innerContainer.style.fontStyle = fontDecorations.italics ? 'italic' : 'normal';
      innerContainer.style.fontWeight = fontDecorations.bold ? 'bold' : 'normal';


      function runTextfill() {
        const resizeOptions = {
          innerTag: 'span',
          maxFontPixels: -1,
          explicitWidth: container.clientWidth,
          explicitHeight: container.clientHeight,
        };

        jQuery(innerDiv).textfill(resizeOptions);
      }

      if (options.background) {
        innerContainer.style.backgroundColor = backgroundColor;
      }
      if (options.shadow) {
        innerContainer.style.textShadow = `0 1px 5px ${shadowColor}, 0 1px 10px ${shadowColor}`;
      }

      if (options.stroke) {
        if (/WebKit/.test(navigator.userAgent)) {
          innerContainer.style.webkitTextStroke = `${options.fontSize * 0.2}px ${strokeColor}`;
        } else {
          innerContainer.style.textShadow = `-${options.fontSize * 0.2}px -${options.fontSize * 0.2}px 0 ${strokeColor}, ${options.fontSize * 0.2}px -${options.fontSize * 0.2}px 0 ${strokeColor}, -${options.fontSize * 0.2}px ${options.fontSize * 0.2}px 0 ${strokeColor}, ${options.fontSize * 0.2}px ${options.fontSize * 0.2}px 0 ${strokeColor}`;
        }
      }

      fontSheet = document.createElement('link');
      fontSheet.rel = 'stylesheet';
      fontSheet.type = 'text/css';
      options.fontFamily = options.fontFamily ? options.fontFamily : options._natives.manifest.options.fontFamily.default;
      // Store reference to generated sheet for removal later, remove any existing ones
      options._fontSheet = fontSheet;

      fontSheet.onload = function () {
        innerContainer.style.fontFamily = options.fontFamily;

        if (options.fontDecorations.responsive) {
          /*
            wait for the elements to be rendered using their fonts
          */

          setTimeout(runTextfill, 30);

          if (window.systemVars) {
            let timer;
            jQuery(window).resize(() => {
              clearTimeout(timer);
              timer = setTimeout(runTextfill, 30);
            });
          }
        }
      };

      document.head.appendChild(fontSheet);

      if (options.fontDecorations.responsive) {
        runTextfill();
      } else {
        innerContainer.style.fontSize = `${options.fontSize}%`;
        innerSpan.style.width = innerSpan.style.height = '100%';
      }
      container.classList.add('text-custom');

      let flexAlignment;
      let textAlignment;
      switch (alignment) {
        case 'center':
          flexAlignment = 'center';
          textAlignment = 'center';
          break;
        case 'right':
          flexAlignment = 'flex-end';
          textAlignment = 'right';
          break;
        default:
          flexAlignment = 'flex-start';
          textAlignment = 'left';
          break;
      }

      innerDiv.style['justify-content'] = flexAlignment;
      innerDiv.classList.add(textAlignment);

      if (position === 'top') {
        container.style.left = `${padding}%`;
        container.style.width = `${width}%`;
        container.style.top = `${padding}%`;
      } else if (position === 'bottom') {
        container.style.left = `${padding}%`;
        container.style.width = `${width}%`;
        container.style.top = `${100 - padding - options.fontSize}%`;
      } else if (position === 'middle') {
        container.style.left = `${padding}%`;
        container.style.width = `${width}%`;
        container.style.top = `${50 - (options.fontSize / 2)}%`;
      } else if (position === 'custom') {
        container.style.left = `${options.left}%`;
        container.style.top = `${options.top}%`;
        if (options.width) {
          container.style.width = `${options.width}%`;
        }
        if (!options.fontDecorations.responsive) {
          container.style.maxHeight = `${100 - options.top}%`;
        }
      }
      if (options.fontDecorations.responsive) {
        if (options.height) {
          container.style.height = `${options.height}%`;
          innerContainer.style.height = '100%';
        }
        runTextfill();
      } else {
        container.style.height = 'unset';
      }
      container.style.zIndex = +options.zindex;

      if (linkUrl) {
        const linkDiv = document.createElement('div');
        const linkTextSpan = document.createElement('span');
        const linkUrlSpan = document.createElement('span');

        linkDiv.classList.add('span-container');
        linkTextSpan.classList.add('text-container');
        linkUrlSpan.classList.add('url-container');

        linkTextSpan.innerText = options.text;
        linkUrlSpan.innerText = options.linkUrl;
        linkDiv.appendChild(linkTextSpan);
        linkDiv.appendChild(linkUrlSpan);

        linkTextSpan.addEventListener('click', catchCaretCharacterOffsetWithin(options, 'text'));
        linkTextSpan.setAttribute('contenteditable', '');
        linkTextSpan.addEventListener('input', (event) => {
          options.text = event.target.outerText;
          if (options.fontDecorations.responsive) {
            runTextfill();
          }
          context.emit('elementUpdated', {
            type: 'text',
            element: options,
            options: {
              text: event.target.outerText,
            },
          });
        });
        linkUrlSpan.addEventListener('click', catchCaretCharacterOffsetWithin(options, 'linkUrl'));
        linkUrlSpan.setAttribute('contenteditable', '');
        linkUrlSpan.addEventListener('input', (event) => {
          options.linkUrl = event.target.outerText;
          context.emit('elementUpdated', {
            type: 'text',
            element: options,
            options: {
              linkUrl: event.target.outerText,
            },
          });
        });
        options._contentContainer = linkDiv;

        linkDiv.style.color = innerContainer.style.color;
        linkDiv.style.fontFamily = options.fontFamily;

        innerSpan.appendChild(linkDiv);
      } else {
        innerSpan.innerHTML = text;
        innerSpan.addEventListener('click', catchCaretCharacterOffsetWithin(options, 'text'));
        innerSpan.setAttribute('contenteditable', '');
        innerSpan.addEventListener('input', (event) => {
          options.text = event.target.outerText;
          if (options.fontDecorations.responsive) {
            runTextfill();
          }
          context.emit('elementUpdated', {
            type: 'text',
            element: options,
            options: {
              text: event.target.outerText,
            },
          });
        });

        options._contentContainer = innerSpan;
      }

      context.on('elementSelected', (event) => {
        const { element } = event;
        if (options._container) {
          options._container.classList[element === options ? 'add' : 'remove']('active');
        }
      });
      options._contentContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        context.emit('elementSelected', {
          element: options,
        });
      });

      options._contentSpan = innerSpan;

      options._container.addEventListener('click', (event) => {
        event.stopPropagation();
        event.target.querySelector('*[contenteditable=""]').focus();
        context.emit('elementSelected', {
          element: options,
        });
      });

      fontSheet.href = `https://fonts.googleapis.com/css?family=${options.fontFamily.replace(/\s/g, '+')}:400,700`;

      options.toString = function () {
        // use the default option if it doesn't exist
        return options.text || options._natives.manifest.options.text.default;
      };

      buildScripts(options);

      draggableResizable(options, runTextfill);
      extendObservable(options, {
        fontFamily: options.fontFamily,
        fontSize: options.fontSize,
        fontDecorations: options.fontDecorations,
        backgroundColor: options.backgroundColor,
        fontColor: options.fontColor,
        alignment: options.alignment,
        text: options.text,
        linkUrl: options.linkUrl,
      });
    },

    start(event, options) {
      if (!isSafari()) {
        let transitionContainer = options._transitionContainer,
          redrawBug;

        if (transitionContainer) {
          // Safari Redraw hack - #3066
          const safariHack = function () {
            transitionContainer.style.display = 'none';
            redrawBug = transitionContainer.offsetHeight;
            transitionContainer.style.display = '';
          };

          transitionContainer.classList.add('on');
          transitionContainer.classList.remove('off');

          if (['popcorn-fade', 'popcorn-slide-up', 'popcorn-slide-down'].indexOf(options.transition) === -1) {
            safariHack();
          } else {
            setTimeout(safariHack, 430);
          }
        }

        if (options.fontDecorations.responsive) {
          // perform textfill
          (function () {
            const resizeOptions = {
              innerTag: 'span',
              maxFontPixels: -1,
              explicitWidth: transitionContainer.clientWidth,
              explicitHeight: transitionContainer.clientHeight,
            };
            jQuery(transitionContainer.childNodes[0].childNodes[0]).textfill(resizeOptions);
          }());
        }

        buildScripts(options);
        if (options.scripts && options.scripts._compiled && options.scripts._compiled.onStart) {
          options.scripts._compiled.onStart();
        }
      } else {
        setTimeout(() => {
          let transitionContainer = options._transitionContainer,
            redrawBug;

          if (transitionContainer) {
            // Safari Redraw hack - #3066
            const safariHack = function () {
              transitionContainer.style.display = 'none';
              redrawBug = transitionContainer.offsetHeight;
              transitionContainer.style.display = '';
            };

            transitionContainer.classList.add('on');
            transitionContainer.classList.remove('off');

            if (['popcorn-fade', 'popcorn-slide-up', 'popcorn-slide-down'].indexOf(options.transition) === -1) {
              safariHack();
            } else {
              setTimeout(safariHack, 430);
            }
          }

          // perform textfill
          (function () {
            const resizeOptions = {
              innerTag: 'span',
              maxFontPixels: -1,
              explicitWidth: transitionContainer.clientWidth,
              explicitHeight: transitionContainer.clientHeight,
            };
            jQuery(transitionContainer.childNodes[0].childNodes[0]).textfill(resizeOptions);
          }());

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onStart) {
            options.scripts._compiled.onStart();
          }
        }, 430);
      }
      if (document.querySelector('fieldset [data-manifest-key="fontSize"]')) {
        if (options.fontDecorations.responsive) {
          document.querySelector('fieldset [data-manifest-key="fontSize"]').setAttribute('disabled', true);
        } else {
          document.querySelector('fieldset [data-manifest-key="fontSize"]').removeAttribute('disabled');
        }
      }
    },

    _update(trackEvent, options) {
      function runTextfill() {
        const resizeOptions = {
          innerTag: 'span',
          maxFontPixels: -1,
          explicitWidth: trackEvent._transitionContainer.clientWidth,
          explicitHeight: trackEvent._transitionContainer.clientHeight,
        };

        jQuery(trackEvent._transitionContainer.firstChild.firstChild).textfill(resizeOptions);
      }

      if (options.hasOwnProperty('fontFamily') && options.fontFamily !== trackEvent.fontFamily) {
        trackEvent.fontFamily = options.fontFamily;
        const fontSheet = document.createElement('link');
        fontSheet.rel = 'stylesheet';
        fontSheet.type = 'text/css';
        trackEvent.fontFamily = trackEvent.fontFamily ?
          trackEvent.fontFamily :
          trackEvent._natives.manifest.options.fontFamily.default;
        // Store reference to generated sheet for removal later, remove any existing ones
        trackEvent._fontSheet = fontSheet;

        fontSheet.onload = function () {
          trackEvent._container.firstChild.style.fontFamily = options.fontFamily;

          if (trackEvent.fontDecorations.responsive) {
            /*
              wait for the elements to be rendered using their fonts
            */

            setTimeout(runTextfill, 30);

            if (window.systemVars) {
              let timer;
              jQuery(window).resize(() => {
                clearTimeout(timer);
                timer = setTimeout(runTextfill, 30);
              });
            }
          }
        };
        document.head.appendChild(fontSheet);
        fontSheet.href = `https://fonts.googleapis.com/css?family=${options.fontFamily.replace(/\s/g, '+')}:400,700`;
      }

      if (options.hasOwnProperty('left') && options.left !== trackEvent.left) {
        trackEvent.left = options.left;
      }

      if (options.hasOwnProperty('width') && options.width !== trackEvent.width) {
        trackEvent.width = options.width;
      }

      if (options.hasOwnProperty('padding') && options.padding !== trackEvent.padding) {
        trackEvent.padding = options.padding;
      }

      if (options.hasOwnProperty('top') && options.top !== trackEvent.top) {
        trackEvent.top = options.top;
      }

      if (options.hasOwnProperty('fontSize') && options.fontSize !== trackEvent.fontSize) {
        trackEvent.fontSize = options.fontSize;
      }

      if (options.hasOwnProperty('zindex') && options.zindex !== trackEvent.zindex) {
        trackEvent.zindex = options.zindex;
      }

      if (options.hasOwnProperty('fontDecorations') && options.fontDecorations !== trackEvent.fontDecorations) {
        const fontDecorations = options.fontDecorations;
        if (fontDecorations.hasOwnProperty('bold') &&
          fontDecorations.bold !== trackEvent.fontDecorations.bold) {
          trackEvent.fontDecorations.bold = fontDecorations.bold;
        }
        if (fontDecorations.hasOwnProperty('italics') &&
          fontDecorations.italics !== trackEvent.fontDecorations.italics) {
          trackEvent.fontDecorations.italics = fontDecorations.italics;
        }
        if (fontDecorations.hasOwnProperty('responsive') &&
          fontDecorations.responsive !== trackEvent.fontDecorations.responsive) {
          trackEvent.fontDecorations.responsive = fontDecorations.responsive;
        }
      }

      if (options.hasOwnProperty('transition') && options.transition !== trackEvent.transition) {
        trackEvent._transitionContainer.classList.remove(trackEvent.transition);
        trackEvent.transition = options.transition;
      }

      if (options.hasOwnProperty('rotation') && options.rotation !== trackEvent.rotation) {
        trackEvent.rotation = options.rotation;
      }

      if (options.hasOwnProperty('fontColor') && options.fontColor !== trackEvent.fontColor) {
        trackEvent.fontColor = options.fontColor;
      }

      if (options.hasOwnProperty('shadow') && options.shadow !== trackEvent.shadow) {
        trackEvent.shadow = options.shadow;
      }

      if (options.hasOwnProperty('shadowColor') && options.shadowColor !== trackEvent.shadowColor) {
        trackEvent.shadowColor = options.shadowColor;
      }

      if (options.hasOwnProperty('background') && options.background !== trackEvent.background) {
        trackEvent.background = options.background;
      }

      if (options.hasOwnProperty('backgroundColor') && options.backgroundColor !== trackEvent.backgroundColor) {
        trackEvent.backgroundColor = options.backgroundColor;
      }

      if (options.hasOwnProperty('stroke') && options.stroke !== trackEvent.stroke) {
        trackEvent.stroke = options.stroke;
      }

      if (options.hasOwnProperty('strokeColor') && options.strokeColor !== trackEvent.strokeColor) {
        trackEvent.strokeColor = options.strokeColor;
      }

      if (options.hasOwnProperty('alignment') && options.alignment !== trackEvent.alignment) {
        trackEvent._container.firstChild.firstChild.classList.remove(trackEvent.alignment);
        trackEvent.alignment = options.alignment;
      }

      if (options.hasOwnProperty('position') && options.position !== trackEvent.position) {
        trackEvent.position = options.position;
      }

      if (options.hasOwnProperty('strokeColor') && options.strokeColor !== trackEvent.strokeColor) {
        trackEvent.strokeColor = options.strokeColor;
      }

      if (options.hasOwnProperty('text') && options.text !== trackEvent.text) {
        trackEvent.text = options.text;
      }

      if (options.hasOwnProperty('linkUrl') && options.linkUrl !== trackEvent.linkUrl) {
        trackEvent.linkUrl = options.linkUrl;
      }

      if (options.hasOwnProperty('linkTarget') && options.linkTarget !== trackEvent.linkTarget) {
        trackEvent.linkTarget = options.linkTarget;
      }

      const spanContainer = trackEvent._contentSpan.parentNode;
      spanContainer.removeChild(trackEvent._contentSpan);
      const innerSpan = document.createElement('span');
      if (trackEvent.linkUrl) {
        const linkDiv = document.createElement('div');
        const linkTextSpan = document.createElement('span');
        const linkUrlSpan = document.createElement('span');

        linkDiv.classList.add('span-container');
        linkTextSpan.classList.add('text-container');
        linkUrlSpan.classList.add('url-container');

        linkTextSpan.innerText = trackEvent.text;
        linkUrlSpan.innerText = trackEvent.linkUrl;
        linkDiv.appendChild(linkTextSpan);
        linkDiv.appendChild(linkUrlSpan);

        linkTextSpan.addEventListener('click', catchCaretCharacterOffsetWithin(trackEvent, 'text'));
        linkTextSpan.setAttribute('contenteditable', '');
        linkTextSpan.addEventListener('input', (event) => {
          trackEvent.text = event.target.outerText;
          if (trackEvent.fontDecorations.responsive) {
            runTextfill();
          }
          trackEvent._context.emit('elementUpdated', {
            type: 'text',
            element: trackEvent,
            options: {
              text: event.target.outerText,
            },
          });
        });
        linkUrlSpan.addEventListener('click', catchCaretCharacterOffsetWithin(trackEvent, 'linkUrl'));
        linkUrlSpan.setAttribute('contenteditable', '');
        linkUrlSpan.addEventListener('input', (event) => {
          trackEvent.linkUrl = event.target.outerText;
          trackEvent._context.emit('elementUpdated', {
            type: 'text',
            element: trackEvent,
            options: {
              linkUrl: event.target.outerText,
            },
          });
        });
        trackEvent._contentContainer = linkDiv;

        linkDiv.style.color = trackEvent._container.firstChild.style.color;
        linkDiv.style.fontFamily = trackEvent.fontFamily;

        innerSpan.appendChild(linkDiv);
      } else {
        innerSpan.innerHTML = trackEvent.text;
        innerSpan.addEventListener('click', catchCaretCharacterOffsetWithin(trackEvent, 'text'));
        innerSpan.setAttribute('contenteditable', '');
        innerSpan.addEventListener('input', (event) => {
          trackEvent.text = event.target.outerText;
          if (trackEvent.fontDecorations.responsive) {
            runTextfill();
          }
          trackEvent._context.emit('elementUpdated', {
            type: 'text',
            element: trackEvent,
            options: {
              text: event.target.outerText,
            },
          });
        });
        trackEvent._contentContainer = innerSpan;
      }
      spanContainer.append(innerSpan);
      trackEvent._context.on('elementSelected', (event) => {
        const { element } = event;
        if (trackEvent._container) {
          trackEvent._container.classList[element === options ? 'add' : 'remove']('active');
        }
      });
      trackEvent._contentContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        trackEvent._context.emit('elementSelected', {
          element: trackEvent,
        });
      });
      trackEvent._contentSpan = innerSpan;

      const padding = '3';
      const width = 100 - (padding * 2);
      if (trackEvent.position === 'top') {
        trackEvent._container.style.left = `${padding}%`;
        trackEvent._container.style.width = `${width}%`;
        trackEvent._container.style.top = `${padding}%`;
      } else if (trackEvent.position === 'bottom') {
        trackEvent._container.style.left = `${padding}%`;
        trackEvent._container.style.width = `${width}%`;
        trackEvent._container.style.top = `${100 - padding - trackEvent.fontSize}%`;
      } else if (trackEvent.position === 'middle') {
        trackEvent._container.style.left = `${padding}%`;
        trackEvent._container.style.width = `${width}%`;
        trackEvent._container.style.top = `${50 - (trackEvent.fontSize / 2)}%`;
      } else if (trackEvent.position === 'custom') {
        trackEvent._container.style.left = `${trackEvent.left}%`;
        trackEvent._container.style.top = `${trackEvent.top}%`;
        if (trackEvent.width) {
          trackEvent._container.style.width = `${trackEvent.width}%`;
        }
        if (!trackEvent.fontDecorations.responsive) {
          trackEvent._container.style.height = '';
          trackEvent._container.style.maxHeight = `${100 - trackEvent.top}%`;
        }
      }
      if (trackEvent.fontDecorations.responsive) {
        if (trackEvent.height) {
          trackEvent._container.style.height = `${trackEvent.height}%`;
          trackEvent._container.firstChild.style.height = '100%';
        }
        runTextfill();
      } else if (!trackEvent.fontDecorations.responsive) {
        trackEvent._container.firstChild.style.fontSize = `${trackEvent.fontSize}%`;
        let innerSpan = trackEvent._container.firstChild.querySelector('span');
        innerSpan.style.width = innerSpan.style.height = '100%';
      }
      trackEvent._container.style.zIndex = +trackEvent.zindex;
      trackEvent._container.firstChild.style.fontStyle =
        trackEvent.fontDecorations.italics ? 'italic' : 'normal';
      trackEvent._container.firstChild.style.fontWeight =
        trackEvent.fontDecorations.bold ? 'bold' : 'normal';
      trackEvent._transitionContainer.classList.add(trackEvent.transition);
      trackEvent._container.style.transform
        = trackEvent._container.style['-webkit-transform']
        = trackEvent._container.style['-moz-transform']
        = trackEvent._container.style['-ms-transform']
        = `rotate(${trackEvent.rotation || 0}deg)`;
      trackEvent._container.firstChild.style.color = trackEvent.fontColor;

      if (trackEvent.background) {
        trackEvent._container.firstChild.style.backgroundColor = trackEvent.backgroundColor;
      }

      if (trackEvent.shadow) {
        trackEvent._container.firstChild.style.textShadow =
          `0 1px 5px ${trackEvent.shadowColor}, 0 1px 10px ${trackEvent.shadowColor}`;
      }

      if (trackEvent.stroke) {
        if (/WebKit/.test(navigator.userAgent)) {
          trackEvent._container.firstChild.style.webkitTextStroke =
            `${trackEvent.fontSize * 0.2}px ${trackEvent.strokeColor}`;
        } else {
          trackEvent._container.firstChild.style.textShadow =
            `-${trackEvent.fontSize * 0.2}px -${trackEvent.fontSize * 0.2}px 0 ${trackEvent.strokeColor}, ${trackEvent.fontSize * 0.2}px -${trackEvent.fontSize * 0.2}px 0 ${trackEvent.strokeColor}, -${trackEvent.fontSize * 0.2}px ${trackEvent.fontSize * 0.2}px 0 ${trackEvent.strokeColor}, ${trackEvent.fontSize * 0.2}px ${trackEvent.fontSize * 0.2}px 0 ${trackEvent.strokeColor}`;
        }
      }

      let flexAlignment;
      let textAlignment;
      switch (trackEvent.alignment) {
        case 'center':
          flexAlignment = 'center';
          textAlignment = 'center';
          break;
        case 'right':
          flexAlignment = 'flex-end';
          textAlignment = 'right';
          break;
        default:
          flexAlignment = 'flex-start';
          textAlignment = 'left';
          break;
      }

      trackEvent._container.firstChild.firstChild.style['justify-content'] = flexAlignment;
      trackEvent._container.firstChild.firstChild.classList.add(textAlignment);

      draggableResizable(trackEvent, runTextfill);
    },

    end(event, options) {
      if (!isSafari()) {
        if (options._transitionContainer) {
          options._transitionContainer.classList.remove('on');
          options._transitionContainer.classList.add('off');
        }

        buildScripts(options);
        if (options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd) {
          options.scripts._compiled.onEnd();
        }
      } else {
        setTimeout(() => {
          if (options._transitionContainer) {
            options._transitionContainer.classList.remove('on');
            options._transitionContainer.classList.add('off');
          }

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd) {
            options.scripts._compiled.onEnd();
          }
        }, 430);
      }
    },

    _teardown(options) {
      if (options._target) {
        options._target.removeChild(options._container);
      }

      if (options._fontSheet) {
        document.head.removeChild(options._fontSheet);
      }
    },
  });
}(window.Popcorn, window.jQuery));
