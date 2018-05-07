// PLUGIN: text

function isSafari() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1) {
    return ua.indexOf('chrome') === -1;
  }
  return false;
}

(function ( Popcorn, jQuery ) {

  /**
   * text Popcorn plug-in
   * Based on popcorn.text.js by @humph
   * @param {Object} options
   *
   * Example:

   **/

  var DEFAULT_FONT_COLOR = "#000000",
      DEFAULT_SHADOW_COLOR = "#444444",
      DEFAULT_STROKE_COLOR = "#000000",
      DEFAULT_BACKGROUND_COLOR = "#888888";

  function newlineToBreak( string ) {
    // Deal with both \r\n and \n
    return string.replace( /\r?\n/gm, "<br>" );
  }

  function buildScripts(options) {
    if(!options.scripts) {
      options.scripts = {};

      Object.keys(options._natives.manifest.options.scripts).forEach(function (key) {
        options.scripts[key] = "";
      });
    } else {
      options.scripts._compiled = options.scripts._compiled || {};

      Object.keys(options._natives.manifest.options.scripts).forEach(function (key) {
        /*jslint evil: true */
        var fn = new Function('options', options.scripts[key]);
        options.scripts._compiled[key] = function() {
          return fn.apply(fn, [{
            event: options
          }]);
        };
      });
    }
  }

  Popcorn.plugin( "text", {

    manifest: {
      about: {
        name: "Popcorn text Plugin",
        version: "0.1",
        author: "@k88hudson, @mjschranz"
      },
      options: {
        text: {
          elem: "textarea",
          label: "Text",
          "default": "Video Editor"
        },
        linkUrl: {
          elem: "input",
          type: "text",
          label: "Link URL"
        },
        linkTarget: {
          elem: "select",
          options: [ "New Tab", "Current Tab" ],
          values: [ "_blank", "_parent" ],
          label: "Open Link In",
          "default": "_blank"
        },
        position: {
          elem: "select",
          options: [ "Custom", "Middle", "Bottom", "Top" ],
          values: [ "custom", "middle", "bottom", "top" ],
          label: "Text Position",
          "default": "custom"
        },
        alignment: {
          elem: "select",
          options: [ "Center", "Left", "Right" ],
          values: [ "center", "left", "right" ],
          label: "Text Alignment",
          "default": "left"
        },
        start: {
          elem: "input",
          type: "text",
          label: "In",
          group: "advanced",
          "units": "seconds"
        },
        end: {
          elem: "input",
          type: "text",
          label: "Out",
          group: "advanced",
          "units": "seconds"
        },
        transition: {
          elem: "select",
          options: [ "None",
                     "Pop",
                     "Fade",
                     "Fade In",
                     "Fade In Up",
                     "Slide Up",
                     "Slide Down",
                     "Swivel In (Y-axis)",
                     "Swivel In (X-axis)",
                     "Typing Effect",
                     "Blur (White)",
                     "Wobble Vertical",
                     "Wobble Horizontal",
                     "Wobble Diagonal",
                     "Pulse (Looped)",
                     "Push",
                     "Bob",
                     "Buzz",
                     "Buzz out",
                     "Stroke Pulse (Looped)",
                     "Flicker",
                     "Type Blink"
                    ],

          values: [ "popcorn-none",
                    "popcorn-pop",
                    "popcorn-fade",
                    "popcorn-fade-in",
                    "popcorn-fade-in-up",
                    "popcorn-slide-up",
                    "popcorn-slide-down",
                    "popcorn-swivel-y",
                    "popcorn-swivel-x",
                    "popcorn-typing",
                    "popcorn-blur-w",
                    "popcorn-wobble-vertical",
                    "popcorn-wobble-horizontal",
                    "popcorn-wobble-diagonal",
                    "popcorn-pulse",
                    "popcorn-push",
                    "popcorn-bob",
                    "popcorn-buzz",
                    "popcorn-buzz-out",
                    "popcorn-stroke-pulse",
                    "animate-flicker",
                    "popcorn-type-blink"
                   ],

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
        fontFamily: {
          elem: "select",
          label: "Font",
          styleClass: "",
          googleFonts: true,
          group: "advanced",
          "default": "Open Sans"
        },
        fontSize: {
          elem: "input",
          type: "number",
          label: "Font Size",
          "default": 10,
          units: "%",
          group: "advanced"
        },
        fontColor: {
          elem: "input",
          type: "color",
          label: "Font color",
          "default": DEFAULT_FONT_COLOR,
          group: "advanced"
        },
        shadow: {
          elem: "input",
          type: "checkbox",
          label: "Shadow",
          "default": false,
          group: "advanced"
        },
        shadowColor: {
          elem: "input",
          type: "color",
          label: "Shadow colour",
          "default": DEFAULT_SHADOW_COLOR,
          group: "advanced"
        },
        background: {
          elem: "input",
          type: "checkbox",
          label: "Background",
          "default": false,
          group: "advanced"
        },
        backgroundColor: {
          elem: "input",
          type: "color",
          label: "Background color",
          "default": DEFAULT_BACKGROUND_COLOR,
          group: "advanced"
        },
        stroke: {
          elem: "input",
          type: "checkbox",
          label: "Stroke",
          "default": false,
          group: "advanced"
        },
        strokeColor: {
          elem: "input",
          type: "color",
          label: "Stroke color",
          "default": DEFAULT_STROKE_COLOR,
          group: "advanced"
        },
        fontDecorations: {
          elem: "checkbox-group",
          labels: { bold: "Bold", italics: "Italics", responsive: "Scale To Fit" },
          "default": { bold: false, italics: false, responsive: false },
          group: "advanced"
        },
        left: {
          elem: "input",
          type: "number",
          label: "Left",
          units: "%",
          "default": 25,
          hidden: true
        },
        top: {
          elem: "input",
          type: "number",
          label: "Top",
          units: "%",
          "default": 0,
          hidden: true
        },
        width: {
          elem: "input",
          type: "number",
          units: "%",
          label: "Width",
          "default": 50,
          hidden: true
        },
        height: {
          elem: "input",
          type: "number",
          units: "%",
          label: "Height",
          default: 10,
          hidden: true
        },
        zindex: {
          hidden: true
        },
        scripts: {
          onStart: "",
          onEnd: ""
        }
      }
    },

    _setup: function( options ) {
      var target = Popcorn.dom.find( options.target ),
          text = newlineToBreak( options.text ),
          container = options._container = document.createElement( "div" ),
          innerContainer = document.createElement( "div" ),
          innerDiv = document.createElement( "div" ),
          innerSpan = document.createElement( "span" ),
          fontSheet,
          fontDecorations = options.fontDecorations || options._natives.manifest.options.fontDecorations[ "default" ],
          position = options.position || options._natives.manifest.options.position[ "default" ],
          alignment = options.alignment,
          transition = options.transition || options._natives.manifest.options.transition[ "default" ],
          link,
          linkUrl = options.linkUrl,
          linkTarget = options.linkTarget,
          shadowColor = options.shadowColor || DEFAULT_SHADOW_COLOR,
          backgroundColor = options.backgroundColor || DEFAULT_BACKGROUND_COLOR,
          strokeColor = options.strokeColor || DEFAULT_STROKE_COLOR,
          rotation = options.rotation || 0,
          context = this;

      /* Detect if we're not in editor */
      if (!(window.Butter && window.Butter.Editor)) {
        container.style.pointerEvents = (!options.linkUrl || options.linkUrl === '') ? 'none' : 'auto';
      }

      var padding = "3",
          width = 100 - ( padding * 2 );

      if ( !target ) {
        target = this.media.parentNode;
      }

      options._target = target;
      container.style.position = "absolute";
      container.style.transform
        = container.style['-webkit-transform']
        = container.style['-moz-transform']
        = container.style['-ms-transform']
        = 'rotate(' + rotation + 'deg)';
      container.classList.add( "popcorn-text" );

      innerDiv.style.width = "100%";
      innerDiv.style.height = "100%";
      innerDiv.style.display = "flex";
      innerDiv.style["align-items"] = "center";

      // backwards comp
      if ( "center left right".match( position ) ) {
        alignment = position;
        position = "middle";
      }

      // innerSpan inside innerDiv is to allow zindex from layers to work properly.
      // if you mess with this code, make sure to check for zindex issues.
      innerDiv.appendChild( innerSpan );
      innerContainer.appendChild( innerDiv );
      container.appendChild( innerContainer );
      target.appendChild( container );

      // Add transition class
      // There is a special case where popup has to be added to the innerSpan, not the outer container.
      options._transitionContainer = container;

      options._transitionContainer.classList.add( transition );
      options._transitionContainer.classList.add( "off" );

      // Handle all custom fonts/styling
      options.fontColor = options.fontColor || DEFAULT_FONT_COLOR;
      innerContainer.classList.add( "text-inner-div" );
      innerContainer.style.color = options.fontColor;
      innerContainer.style.fontStyle = fontDecorations.italics ? "italic" : "normal";
      innerContainer.style.fontWeight = fontDecorations.bold ? "bold" : "normal";

      function runTextfill() {
        var resizeOptions = {
          innerTag: "span",
          maxFontPixels: -1,
          explicitWidth: container.clientWidth,
          explicitHeight: container.clientHeight
        };

        jQuery(innerDiv).textfill(resizeOptions);
      }

      if ( options.background ) {
        innerContainer.style.backgroundColor = backgroundColor;
      }
      if ( options.shadow ) {
        innerContainer.style.textShadow = "0 1px 5px " + shadowColor + ", 0 1px 10px " + shadowColor;
      }

      if ( options.stroke ) {
        if (/WebKit/.test(navigator.userAgent)) {
          innerContainer.style.webkitTextStroke = options.fontSize * 0.2 + "px " + strokeColor;
        } else {
          innerContainer.style.textShadow = "-" + options.fontSize * 0.2 + "px -" + options.fontSize * 0.2 + "px 0 " + strokeColor + ", " + options.fontSize * 0.2 + "px -" + options.fontSize * 0.2 + "px 0 " + strokeColor + ", -" + options.fontSize * 0.2 + "px " + options.fontSize * 0.2 + "px 0 " + strokeColor + ", " + options.fontSize * 0.2 + "px " + options.fontSize * 0.2 + "px 0 " + strokeColor;
        }
      }

      fontSheet = document.createElement( "link" );
      fontSheet.rel = "stylesheet";
      fontSheet.type = "text/css";
      options.fontFamily = options.fontFamily ? options.fontFamily : options._natives.manifest.options.fontFamily[ "default" ];
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
            var timer;
            jQuery(window).resize(function() {
                clearTimeout(timer);
                timer = setTimeout(runTextfill, 30);
            });
          }
        }
      };
      
      document.head.appendChild( fontSheet );

      if ( options.fontDecorations.responsive ) {
        runTextfill();
      } else {
        innerContainer.style.fontSize = options.fontSize + "%";
      }
      container.classList.add( "text-custom" );

      var flexAlignment;
      var textAlignment;
      switch (alignment) {
        case "center":
          flexAlignment = "center";
          textAlignment = "center";
          break;
        case "right":
          flexAlignment = "flex-end";
          textAlignment = "right";
          break;
        default:
          flexAlignment = "flex-start";
          textAlignment = "left";
          break;
      }

      innerDiv.style["justify-content"] = flexAlignment;
      innerDiv.classList.add(textAlignment);

      if ( position === "top" ) {
        container.style.left = padding + "%";
        container.style.width = width + "%";
        container.style.top = padding + "%";
      } else if ( position === "bottom" ) {
        container.style.left = padding + "%";
        container.style.width = width + "%";
        container.style.top = 100 - padding - options.fontSize + "%";
      } else if ( position === "middle" ) {
        container.style.left = padding + "%";
        container.style.width = width + "%";
        container.style.top = 50 - ( options.fontSize / 2 ) + "%";
      } else if ( position === "custom" ) {
        container.style.left = options.left + "%";
        container.style.top = options.top + "%";
        if ( options.width ) {
          container.style.width = options.width + "%";
        }
      }
      if (options.fontDecorations.responsive) {
        runTextfill();
        if (options.height) {
          container.style.height = options.height + "%";
          innerContainer.style.height = "100%";
        }
      }
      container.style.zIndex = +options.zindex;

      if ( linkUrl ) {

        link = document.createElement( "a" );
        link.href = linkUrl;
        link.target = linkTarget;
        link.innerHTML = text;

        link.addEventListener( "click", function() {
          context.media.pause();
        } );

        link.style.color = innerContainer.style.color;
        link.style.fontFamily = options.fontFamily;

        innerSpan.appendChild( link );
      } else {
        innerSpan.innerHTML = text;
      }

      fontSheet.href = "https://fonts.googleapis.com/css?family=" + options.fontFamily.replace( /\s/g, "+" ) + ":400,700";

      options.toString = function() {
        // use the default option if it doesn't exist
        return options.text || options._natives.manifest.options.text[ "default" ];
      };

      buildScripts(options);
    },

    start: function( event, options ) {
      if ( !isSafari() ) {
        var transitionContainer = options._transitionContainer,
          redrawBug;

        if ( transitionContainer ) {
          // Safari Redraw hack - #3066
          var safariHack = function() {
            transitionContainer.style.display = "none";
            redrawBug = transitionContainer.offsetHeight;
            transitionContainer.style.display = "";
          };

          transitionContainer.classList.add( "on" );
          transitionContainer.classList.remove( "off" );

          if (['popcorn-fade', 'popcorn-slide-up', 'popcorn-slide-down'].indexOf(options.transition) === -1) {
            safariHack();
          } else {
            setTimeout(safariHack, 430);
          }
        }

        // perform textfill
        (function() {
          var resizeOptions = {
            innerTag: "span",
            maxFontPixels: -1,
            explicitWidth: transitionContainer.clientWidth,
            explicitHeight: transitionContainer.clientHeight
          };
          jQuery(transitionContainer.childNodes[0].childNodes[0]).textfill(resizeOptions);
        })();

        buildScripts(options);
        if(options.scripts && options.scripts._compiled && options.scripts._compiled.onStart){
          options.scripts._compiled.onStart();
        }
      } else {
        setTimeout(function () {
          var transitionContainer = options._transitionContainer,
            redrawBug;

          if ( transitionContainer ) {
            // Safari Redraw hack - #3066
            var safariHack = function() {
              transitionContainer.style.display = "none";
              redrawBug = transitionContainer.offsetHeight;
              transitionContainer.style.display = "";
            };

            transitionContainer.classList.add( "on" );
            transitionContainer.classList.remove( "off" );

            if (['popcorn-fade', 'popcorn-slide-up', 'popcorn-slide-down'].indexOf(options.transition) === -1) {
              safariHack();
            } else {
              setTimeout(safariHack, 430);
            }
          }

          // perform textfill
          (function() {
            var resizeOptions = {
              innerTag: "span",
              maxFontPixels: -1,
              explicitWidth: transitionContainer.clientWidth,
              explicitHeight: transitionContainer.clientHeight
            };
            jQuery(transitionContainer.childNodes[0].childNodes[0]).textfill(resizeOptions);
          })();

          buildScripts(options);
          if(options.scripts && options.scripts._compiled && options.scripts._compiled.onStart){
            options.scripts._compiled.onStart();
          }
        }, 430);
      }
      if (options.fontDecorations.responsive) {
        document.querySelector('fieldset [data-manifest-key="fontSize"]').setAttribute('disabled', true);
      } else {
        document.querySelector('fieldset [data-manifest-key="fontSize"]').removeAttribute('disabled');
      }
    },

    end: function( event, options ) {
      if ( !isSafari() ) {
        if ( options._transitionContainer ) {
          options._transitionContainer.classList.remove( "on" );
          options._transitionContainer.classList.add( "off" );
        }

        buildScripts(options);
        if(options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd){
          options.scripts._compiled.onEnd();
        }
      } else {
        setTimeout(function () {
          if ( options._transitionContainer ) {
            options._transitionContainer.classList.remove( "on" );
            options._transitionContainer.classList.add( "off" );
          }

          buildScripts(options);
          if(options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd){
            options.scripts._compiled.onEnd();
          }
        }, 430);
      }
    },

    _teardown: function( options ) {
      if ( options._target ) {
        options._target.removeChild( options._container );
      }

      if ( options._fontSheet ) {
        document.head.removeChild( options._fontSheet );
      }
    }
  });
}( window.Popcorn, window.jQuery ));
