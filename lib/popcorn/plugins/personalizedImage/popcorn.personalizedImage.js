"use strict";

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

  function validateDimension(value, fallback) {
    if (typeof value === "number") {
      return value;
    }
    return fallback;
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

  function createImageDiv(imageUrl, linkUrl, instance) {
    var imageDiv = document.createElement("div"),
      link = document.createElement("a");

    imageDiv.style.backgroundImage = "url( \"" + imageUrl + "\" )";
    imageDiv.style.backgroundSize = "100%";
    imageDiv.classList.add("image-plugin-img");

    if (linkUrl && linkUrl.match(urlRegex)) {
      link.setAttribute("href", linkUrl);

      link.onclick = function () {
        instance.media.pause();
      };
    }
    link.setAttribute("target", "_blank");
    link.classList.add("image-plugin-link");

    link.appendChild(imageDiv);
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

      _container.addEventListener('click', () => {
        _this.emit('elementSelected', {
          element: options,
        });
      });

      _container.classList.add("image-plugin-container");
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
          var imageUrl = window.editorMode ? PLACEHOLDER_URL : options.src;

          _link = createImageDiv(imageUrl, options.linkSrc, _this);
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

      buildScripts(options);
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
