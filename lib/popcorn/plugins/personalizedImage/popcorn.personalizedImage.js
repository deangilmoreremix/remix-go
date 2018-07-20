const interact = require('interactjs');
const { extendObservable } = require('mobx');

function isSafari() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1) {
    return ua.indexOf('chrome') === -1;
  }
  return false;
}

// PLUGIN: PERSONALIZED IMAGE
// Key
(function (Popcorn) {

  var PLACEHOLDER_URL = 'https://cdn.vidcloud.io/src/plugins/personalizedImage/personalizedImage-placeholder.svg';

  var urlRegex = /[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

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

  function validateDimension(value, fallback) {
    if (typeof value === "number") {
      return value;
    }
    return fallback;
  }

  function draggableResizable(element) {
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
        element.height = relativeHeight;
        element._container.style.width = `${relativeWidth}%`;
        element._container.style.height = `${relativeHeight}%`;
      }

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
      if (['dragend', 'resizeend'].indexOf(event.type) !== -1) {
        element._context.emit('elementUpdated', {
          type: 'personalizedImage',
          element,
          options: {
            top: element.top,
            left: element.left,
            width: element.width,
            height: element.height,
          },
        });
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
        edges: { left: true, right: true, bottom: true, top: true },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },
        // minimum size
        restrictSize: {
          min: { width: 30, height: 30 },
        },
        inertia: true,
        onmove: dragMoveListener,
        onend: dragMoveListener,
      });
  }

  function buildScripts(options) {
    if (!options.scripts) {
      options.scripts = {};

      Object.keys(options._natives.manifest.options.scripts).forEach(function (key) {
        options.scripts[key] = "";
      });
    } else {
      options.scripts._compiled = options.scripts._compiled || {};

      Object.keys(options._natives.manifest.options.scripts).forEach(function (key) {
        /*jslint evil: true */
        var fn = new Function('options', options.scripts[key]);
        options.scripts._compiled[key] = function () {
          return fn.apply(fn, [{
            event: options
          }]);
        };
      });
    }
  }

  function createImageDiv(element, imageUrl) {
    const link = document.createElement('div');
    const imageDiv = document.createElement('div');
    const linkSpan = document.createElement('span');
    link.classList.add('image-plugin-link');
    imageDiv.classList.add('image-plugin-img');
    linkSpan.classList.add('url-container');

    imageDiv.style.backgroundImage = "url( \"" + imageUrl + "\" )";
    link.appendChild(imageDiv);

    linkSpan.addEventListener('click', catchCaretCharacterOffsetWithin(element, 'src'));
    linkSpan.setAttribute('contenteditable', '');
    linkSpan.addEventListener('input', (event) => {
      element.src = event.target.outerText;
      element._context.emit('elementUpdated', {
        type: 'personalizedImage',
        element,
        options: {
          src: event.target.outerText,
        },
      });
    });

    linkSpan.innerText = element.src;
    link.appendChild(linkSpan);

    return link;
  }

  Popcorn.plugin("personalizedImage", {

    _setup: function (options) {

      var _target,
        _container,
        _link,
        _image,
        _this = this;

      function setupImageDiv() {

        _container.appendChild(_link);
        _image = _link.querySelector(".image-plugin-img");
        _image.style.left = validateDimension(options.innerLeft, "0") + "%";
        _image.style.top = validateDimension(options.innerTop, "0") + "%";
        if (options.innerHeight) {
          _image.style.height = validateDimension(options.innerHeight, "0") + "%";
        }
        if (options.innerWidth) {
          _image.style.width = validateDimension(options.innerWidth, "0") + "%";
        }
        options.link = _link;
        options.image = _image;
      }

      options._target = _target = Popcorn.dom.find(options.target);
      options._container = _container = document.createElement("div");
      options._context = _this;

      function setupDraggable() {
        options.dragging = {
          pos1: 0,
          pos2: 0,
          pos3: 0,
          pos4: 0,
        };

        function elementDrag(e) {
          e = e || window.event;
          options.dragging.pos1 = options.dragging.pos3 - e.clientX;
          options.dragging.pos2 = options.dragging.pos4 - e.clientY;
          options.dragging.pos3 = e.clientX;
          options.dragging.pos4 = e.clientY;

          const absoluteTop = options._container.offsetTop - options.dragging.pos2;
          const absoluteLeft = options._container.offsetLeft - options.dragging.pos1;
          const relativeTop = (absoluteTop / options._container.parentNode.offsetHeight) * 100;
          const relativeLeft = (absoluteLeft / options._container.parentNode.offsetWidth) * 100;
          options.top = relativeTop;
          options.left = relativeLeft;
          options._container.style.top = `${relativeTop}%`;
          options._container.style.left = `${relativeLeft}%`;
        }

        function closeDragElement() {
          document.removeEventListener('mouseup', closeDragElement);
          document.removeEventListener('mousemove', elementDrag);

          options._context.emit('elementUpdated', {
            type: 'personalizedImage',
            element: options,
            options: {
              top: options.top,
              left: options.left,
            },
          });
        }

        function dragMouseDown(e) {
          e = e || window.event;
          options.dragging.pos3 = e.clientX;
          options.dragging.pos4 = e.clientY;
          document.addEventListener('mouseup', closeDragElement);
          document.addEventListener('mousemove', elementDrag);
        }

        options._container.addEventListener('mousedown', dragMouseDown);
      }

      _this.on('elementSelected', (event) => {
        const { element } = event;
        if (options._container) {
          options._container.classList[element === options ? 'add' : 'remove']('active');
        }
      });

      _container.addEventListener('click', (event) => {
        event.stopPropagation();
        _this.emit('elementSelected', {
          element: options,
        });
      });

      _container.classList.add("personalized-image");
      _container.style.width = validateDimension(options.width, "100") + "%";
      _container.style.height = validateDimension(options.height, "100") + "%";
      _container.style.top = validateDimension(options.top, "0") + "%";
      _container.style.left = validateDimension(options.left, "0") + "%";
      _container.style.zIndex = +options.zindex;
      _container.classList.add(options.transition);
      _container.classList.add("off");

      var rotation = options.rotation || 0;
      _container.style.transform
        = _container.style['-webkit-transform']
        = _container.style['-moz-transform']
        = _container.style['-ms-transform']
        = 'rotate(' + rotation + 'deg)';

      if (_target) {

        _target.appendChild(_container);

        if (options.src) {
          _link = createImageDiv(options, PLACEHOLDER_URL);
          setupImageDiv();
        }

        options.toString = function () {
          var _splitSource = [];
          if (options.title) {
            return options.title;
          } else if (/^data:/.test(options.src)) {
            // might ba a data URI
            return options.src.substring(0, 30) + "...";
          } else if (options.src) {
            _splitSource = options.src.split("/");
            return _splitSource[_splitSource.length - 1];
          }
          return "Image Plugin";
        };
      }

      options.image.style.borderRadius = `${options.cornerRadius || 0}%`;
      if (options.background) {
        options._container.style.background = options.backgroundColor;
      }

      draggableResizable(options);
      buildScripts(options);
      extendObservable(options, {
        src: options.src,
        innerTop: options.innerTop,
        innerLeft: options.innerLeft,
        innerWidth: options.innerWidth,
        background: options.background,
        innerHeight: options.innerHeight,
        cornerRadius: options.cornerRadius,
        backgroundColor: options.backgroundColor,
      });
    },

    start: function (event, options) {

      if (!isSafari()) {
        var container = options._container;

        if (container) {
          if (options._updateImage) {
            this.on("timeupdate", options._updateImage);
          }

          container.classList.add("on");
          container.classList.remove("off");

          // Safari Redraw hack - #3066
          container.style.display = "none";
          container.style.display = "";
        }

        buildScripts(options);
        if (options.scripts && options.scripts._compiled && options.scripts._compiled.onStart) {
          options.scripts._compiled.onStart();
        }
      } else {
        setTimeout(function () {
          var container = options._container;

          if (container) {
            if (options._updateImage) {
              this.on("timeupdate", options._updateImage);
            }

            container.classList.add("on");
            container.classList.remove("off");

            // Safari Redraw hack - #3066
            container.style.display = "none";
            container.style.display = "";
          }

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onStart) {
            options.scripts._compiled.onStart();
          }
        }, 430);
      }
    },

    _update(trackEvent, options) {
      if (options.hasOwnProperty('innerLeft') && options.innerLeft !== trackEvent.innerLeft) {
        trackEvent.innerLeft = options.innerLeft;
      }

      if (options.hasOwnProperty('innerTop') && options.innerTop !== trackEvent.innerTop) {
        trackEvent.innerTop = options.innerTop;
      }

      if (options.hasOwnProperty('innerHeight') && options.innerHeight !== trackEvent.innerHeight) {
        trackEvent.innerHeight = options.innerHeight;
      }

      if (options.hasOwnProperty('innerWidth') && options.innerWidth !== trackEvent.innerWidth) {
        trackEvent.innerWidth = options.innerWidth;
      }

      if (options.hasOwnProperty('width') && options.width !== trackEvent.width) {
        trackEvent.width = options.width;
        trackEvent._container.style.width = `${validateDimension(trackEvent.width, '100')}%`;
      }

      if (options.hasOwnProperty('height') && options.height !== trackEvent.height) {
        trackEvent.height = options.height;
        trackEvent._container.style.height = `${validateDimension(trackEvent.height, '100')}%`;
      }

      if (options.hasOwnProperty('top') && options.top !== trackEvent.top) {
        trackEvent.top = options.top;
        trackEvent._container.style.top = `${validateDimension(trackEvent.top, '0')}%`;
      }

      if (options.hasOwnProperty('left') && options.left !== trackEvent.left) {
        trackEvent.left = options.left;
        trackEvent._container.style.left = `${validateDimension(trackEvent.left, '0')}%`;
      }

      if (options.hasOwnProperty('zindex') && options.zindex !== trackEvent.zindex) {
        trackEvent.zindex = options.zindex;
        trackEvent._container.style.zIndex = +trackEvent.zindex;
      }
      if (options.hasOwnProperty('transition') && options.transition !== trackEvent.transition) {
        trackEvent.transition = options.transition;
        trackEvent._container.classList.add(trackEvent.transition);
      }

      if (options.hasOwnProperty('rotation') && options.rotation !== trackEvent.rotation) {
        trackEvent.rotation = options.rotation;
        trackEvent._container.style.transform
          = trackEvent._container.style['-webkit-transform']
          = trackEvent._container.style['-moz-transform']
          = trackEvent._container.style['-ms-transform']
          = `rotate(${trackEvent.rotation || 0}deg)`;
      }

      if (options.hasOwnProperty('cornerRadius') && options.cornerRadius !== trackEvent.cornerRadius) {
        trackEvent.cornerRadius = options.cornerRadius;
      }

      if (options.hasOwnProperty('background') && options.background !== trackEvent.background) {
        trackEvent.background = options.background;
      }

      if (options.hasOwnProperty('backgroundColor') && options.backgroundColor !== trackEvent.backgroundColor) {
        trackEvent.backgroundColor = options.backgroundColor;
      }

      if ((options.hasOwnProperty('src') && options.src !== trackEvent.src)) {
        if (options.hasOwnProperty('src')) {
          trackEvent.src = options.src;
        }
        if (options.hasOwnProperty('linkSrc')) {
          trackEvent.linkSrc = options.linkSrc;
        }
        trackEvent._container.removeChild(trackEvent._container.querySelector('.image-plugin-link'));
        const _link = createImageDiv(trackEvent, PLACEHOLDER_URL);
        trackEvent._container.appendChild(_link);
        const _image = _link.querySelector('.image-plugin-img');
        trackEvent.link = _link;
        trackEvent.image = _image;
      }
      trackEvent.image.style.left = `${validateDimension(trackEvent.innerLeft, '0')}%`;
      trackEvent.image.style.top = `${validateDimension(trackEvent.innerTop, '0')}%`;
      if (trackEvent.innerHeight) {
        trackEvent.image.style.height = `${validateDimension(trackEvent.innerHeight, '100')}%`;
      }
      if (trackEvent.innerWidth) {
        trackEvent.image.style.width = `${validateDimension(trackEvent.innerWidth, '100')}%`;
      }
      trackEvent.image.style.borderRadius = `${trackEvent.cornerRadius || 0}%`;
      if (trackEvent.background) {
        trackEvent.link.style.background = trackEvent.backgroundColor;
      } else {
        trackEvent.link.style.background = 'unset';
      }
    },

    end: function (event, options) {
      if (!isSafari()) {
        if (options._container) {
          if (options._updateImage) {
            this.off("timeupdate", options._updateImage);
          }

          options._container.classList.add("off");
          options._container.classList.remove("on");
        }

        buildScripts(options);
        if (options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd) {
          options.scripts._compiled.onEnd();
        }
      } else {
        setTimeout(function () {
          if (options._container) {
            if (options._updateImage) {
              this.off("timeupdate", options._updateImage);
            }

            options._container.classList.add("off");
            options._container.classList.remove("on");
          }

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd) {
            options.scripts._compiled.onEnd();
          }
        }, 430);
      }
    },

    _teardown: function (options) {
      if (options._updateImage) {
        this.off(options._updateImage);
      }
      options._container.parentNode.removeChild(options._container);
      delete options._container;
    },

    manifest: {
      about: {
        name: "Popcorn image Plugin",
        version: "0.1",
        author: "cadecairos",
        website: "https://chrisdecairos.ca/"
      },
      options: {
        target: "video-overlay",
        src: {
          elem: "input",
          type: "url",
          label: "Param Name",
          "default": "{{IMAGE}}"
        },
        linkSrc: {
          elem: "input",
          type: "url",
          label: "Link URL",
          validation: urlRegex
        },
        width: {
          elem: "input",
          type: "number",
          label: "Width",
          "default": 100,
          "units": "%",
          hidden: true
        },
        cornerRadius: {
          elem: 'input',
          type: 'number',
          label: 'Corner Radius',
          default: 0,
          units: '%',
          hidden: true,
        },
        height: {
          elem: "input",
          type: "number",
          label: "Height",
          "default": 100,
          "units": "%",
          hidden: true
        },
        top: {
          elem: "input",
          type: "number",
          label: "Top",
          "default": 0,
          "units": "%",
          hidden: true
        },
        left: {
          elem: "input",
          type: "number",
          label: "Left",
          "default": 0,
          "units": "%",
          hidden: true
        },
        innerTop: {
          elem: "input",
          type: "number",
          "default": 0,
          "units": "%",
          hidden: true
        },
        innerLeft: {
          elem: "input",
          type: "number",
          "default": 0,
          "units": "%",
          hidden: true
        },
        innerWidth: {
          elem: "input",
          type: "number",
          "default": 0,
          "units": "%",
          hidden: true
        },
        innerHeight: {
          elem: "input",
          type: "number",
          "default": 0,
          "units": "%",
          hidden: true
        },
        background: {
          elem: 'input',
          type: 'checkbox',
          label: 'Background',
          default: false,
          hidden: true,
        },
        backgroundColor: {
          elem: 'input',
          type: 'color',
          label: 'Background color',
          hidden: true,
        },
        title: {
          elem: "input",
          type: "text",
          label: "Image Title",
          "default": ""
        },
        transition: {
          elem: "select",
          options: ["None", "Pop", "Slide Up", "Slide Down", "Fade", "Fade In", "Fade In Up",],
          values: ["popcorn-none", "popcorn-pop", "popcorn-slide-up", "popcorn-slide-down", "popcorn-fade", "popcorn-fade-in", "popcorn-fade-in-up"],
          label: "Transition",
          "default": "popcorn-fade"
        },
        rotation: {
          elem: "input",
          type: "number",
          label: "Rotation",
          "default": 0,
          units: "degrees"
        },
        start: {
          elem: "input",
          type: "text",
          label: "Start",
          units: "seconds"
        },
        end: {
          elem: "input",
          type: "text",
          label: "End",
          units: "seconds"
        },
        zindex: {
          hidden: true
        },
        scripts: {
          onStart: "",
          onEnd: ""
        }
      }
    }
  });
}(window.Popcorn));
