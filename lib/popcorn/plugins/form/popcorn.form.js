(function (Popcorn) {

  var
    DEFAULT_BACKGROUND_COLOR = '#eb5054',
    BASIC_TOKEN = 'WEZLdFZhcnRiSllNNzJTNTo0ajRZdEV1QmEyYmFxckRN',
    DEFAULT_FONT_COLOR = '#000000',
    DEFAULT_BUTTON_BACKGROUND_COLOR  = '#ec6442',
    DEFAULT_BUTTON_FONT_COLOR = '#ffffff',
    DEFAULT_BUTTON_BOTTOM_BORDER_COLOR = '#c85135',
    DEFAULT_BUTTON_BORDER_RADIUS = '2',
    WEBHOOK_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  Popcorn.plugin('form', function () {

      var _popcorn;

      function isMobile() {
        return navigator.userAgent.match(/(iPad|iPhone|iPod|Android)/g);
      }

      function create(type) {
        return document.createElement(type);
      }

      function validateValues(regexp, value) {
        var isValid = true;
        value.split(',').map(function (item) { return item.trim(); }).forEach(function(item) {
          if (!regexp.test(item)) {
            isValid = false;
          }
        });
        return isValid;
      }

      function buildFormSubmission(form) {
        var result = {};
        for (var i = 0; i < form.elements.length; i++) {
          var element = form.elements[i];
          if (element.type === 'hidden' || !element.value || !element.getAttribute('name')) {
            continue;
          }
          result[element.getAttribute('name')] = element.value;
        }
        return result;
      }

      function validateFormSubmission(options, submission) {
        var nonemptyValidator = function(val) {
          if (val && val.length > 0) {
            return null;
          }
          return 'value can\'t be empty';
        };
        var validators = {
          singleline:nonemptyValidator,
          multiline: nonemptyValidator,
          email: function(val) {
            if (nonemptyValidator(val)) {
              return nonemptyValidator(val);
            }
            if (!EMAIL_REGEX.test(val)) {
              return 'email format is invalid';
            }
          },
          number: function(val) {
            if (nonemptyValidator(val) || !/^[0-9]*$/.test(val)) {
              return 'value is not a valid number';
            }
          },
          date: nonemptyValidator
        };

        var validationMessage = null;
        options.elements.forEach(function(element) {
          var result = validators[element.type](submission[element.token]);
          if (result) {
            validationMessage = 'Validation failed for ' + element.label + ': ' + result;
          }
        });
        return validationMessage;
      }

      function resumePlayback(container) {
        _popcorn.expectsUserInput = false;
        if (container) {
          container.style.visibility = 'hidden';
        }
        _popcorn.play();
        return false;
      }

      function buildForm(options) {
        var form = document.createElement('form');
        var personalizedTokens = window.digistrats ? window.digistrats.getPersonalizedTokens() : {};

        var inner = document.createElement('div');
        inner.classList.add('form-inner');

        var formScrollable = document.createElement('div');
        formScrollable.classList.add('form-scrollable');

        var formScrollableInner = document.createElement('div');
        formScrollableInner.classList.add('form-scrollable-inner');

        var captionHandle = document.createElement('div');
        captionHandle.classList.add('lead-form-caption');
        captionHandle.innerText = options.caption;
        formScrollableInner.appendChild(captionHandle);

        options.elements.forEach(function (declaration) {
          var inputWrapper = document.createElement('div');
          var label = document.createElement('label');
          label.innerText = declaration.label;
          var input;
          switch(declaration.type) {
            case 'singleline':
              input = document.createElement('input');
              input.setAttribute('type', 'text');
              input.setAttribute('maxlength', '80');
              break;
            case 'multiline':
              input = document.createElement('textarea');
              input.setAttribute('maxlength', '250');
              break;
            case 'email':
              input = document.createElement('input');
              input.setAttribute('type', 'email');
              break;
            case 'number':
              input = document.createElement('input');
              input.setAttribute('type', 'text');
              input.setAttribute('maxlength', '80');
              input.setAttribute('pattern', '\\d*');
              input.addEventListener('input', function () {
                var strippedNumber = input.value.replace(/[^0-9]/g, '');
                input.value = strippedNumber;
              });
              break;
            case 'date':
              input = document.createElement('input');
              input.style['-webkit-appearance'] = 'none';
              input.style['-moz-appearance'] = 'none';
              input.setAttribute('type', 'date');
              input.valueAsDate = new Date();
              break;
          }
          input.setAttribute('name', declaration.token);
          if (personalizedTokens[declaration.token]) {
            input.setAttribute('value', personalizedTokens[declaration.token]);
          }
          inputWrapper.appendChild(label);
          inputWrapper.appendChild(document.createElement('br'));
          inputWrapper.appendChild(input);
          formScrollableInner.appendChild(inputWrapper);
        });

        var buttonsInner = document.createElement('div');
        buttonsInner.classList.add('buttons-inner');

        var submitButton = document.createElement('button');
        submitButton.innerText = 'Confirm';
        buttonsInner.appendChild(submitButton);

        formScrollableInner.appendChild(document.createElement('br'));
        formScrollableInner.appendChild(buttonsInner);
        formScrollable.appendChild(formScrollableInner);
        inner.appendChild(formScrollable);
        form.appendChild(inner);
        form.classList.add('popcorn', 'lead-form');
        form.setAttribute('action', '#');

        if (!isMobile()) {
          form.style.width = form.style.height = (100 - options.padding * 2) + '%';
          form.style.top = form.style.left = options.padding + '%';
        } else {
          form.style.width = form.style.height = '100%';
          form.style.top = form.style.left = '0';
        }
        form.style.background = 'rgba('+
          parseInt(options.backgroundColor.substring(1, 3), 16) + ',' +
          parseInt(options.backgroundColor.substring(3, 5), 16) + ',' +
          parseInt(options.backgroundColor.substring(5, 7), 16)+', 0.8)';
        form.style.fontSize = (+options.fontSize + (isMobile() ? 30 : 0)) + '%';
        ['button', 'input', 'textarea', 'label', '.lead-form-caption'].forEach(function(type) {
          form.querySelectorAll(type).forEach(function(item) {
            item.style.fontSize = (+options.fontSize + (isMobile() ? 50 : 0)) + '%';
          });
        });
        form.style.color = options.fontColor;

        form.onsubmit = function() {
          return false;
        };
        ['.buttons-inner > button'].forEach(function(selector) {
          form.querySelectorAll(selector).forEach(function(item){
            item.style.borderColor = 'transparent';
            item.style.boxShadow = '0px 1px 1px 0px rgba(0, 0, 0, 0.5)';
            item.style.borderBottom = '1px solid ' + options.btnBottomBorder;
            item.style.background = '#ec6442';
            item.style.borderRadius = options.buttonBorderRadius;
            item.style.color = options.buttonFontColor;
          });
        });

        submitButton.addEventListener('click', function () {
          var formData = buildFormSubmission(form);
          var validationMessage = validateFormSubmission(options, formData);
          if (validationMessage) {
            return alert(validationMessage);
          }
          for (var key in formData) {
            if (formData.hasOwnProperty(key)) {
              window.digistrats.setPersonalizedToken(key, formData[key]);
              window.digistrats.storePersonalizedToken(key, formData[key]);
            }
          }
          Popcorn.current.emit('tokenupdate');
          if (options.webhookEnabled && validateValues(WEBHOOK_REGEX, options.webhook)) {
            var webhookXhr = new XMLHttpRequest();
            webhookXhr.open('POST', options.webhook);
            webhookXhr.send(JSON.stringify(formData));
          }
          if (options.emailEnabled && validateValues(EMAIL_REGEX, options.emailAddress)) {
            var emailXhr = new XMLHttpRequest();
            if (document.querySelector("meta[name=project]")) {
              var makeId = JSON.parse(document.querySelector("meta[name=project]").content).id;
              var EMAILING_ENDPOINT = 'https://api.vidcloud.io/api/makes/' + makeId + '/lead';
              emailXhr.open('POST', EMAILING_ENDPOINT);
              emailXhr.setRequestHeader('Authorization', 'Basic ' + BASIC_TOKEN);
              emailXhr.setRequestHeader('Content-Type', 'application/json');
              emailXhr.send(JSON.stringify({
                to: options.emailAddress,
                data: formData,
              }));
            }
          }
          options._submitted = true;
          return resumePlayback(options._container);
        });

        return form;
      }

      function buildScripts(options) {
        if (!options.scripts) {
          options.scripts = {};

          Object.keys(options._natives.manifest.options.scripts).forEach(function (key) {
            options.scripts[key] = '';
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

      function onOrientationChange() {
        document.activeElement.blur && document.activeElement.blur();
      }

      return {
        _setup: function (options) {
          var _outer, fontSheet;

          _popcorn = this;

          options._target = Popcorn.dom.find(options.target);

          if (!options._target) {
            return;
          }

          options._container = _outer = create('div');
          _outer.style.position = 'absolute';
          _outer.classList.add('leadform-outer-container');
          _outer.style.visibility = 'hidden';

          _outer.style.width = _outer.style.height = '100%';
          _outer.style.top = _outer.style.left = '0';
          _outer.style.zIndex = +options.zindex;

          _outer.appendChild(buildForm(options));

          if (!isMobile()) {
            options._target.appendChild(options._container);
          } else {
            window.document.body.appendChild(options._container);
          }

          fontSheet = document.createElement( 'link' );
          fontSheet.rel = 'stylesheet';
          fontSheet.type = 'text/css';
          options.fontFamily = options.fontFamily || options._natives.manifest.options.fontFamily[ 'default' ];
          // Store reference to generated sheet for removal later, remove any existing ones
          options._fontSheet = fontSheet;
          fontSheet.onload = function () {
            _outer.style.fontFamily = options.fontFamily;
            _outer.querySelectorAll('button').forEach(function(item) {
              item.style.fontFamily = options.fontFamily;
            });
          };

          fontSheet.href = 'https://fonts.googleapis.com/css?family=' +
            options.fontFamily.replace( /\s/g, '+' ) + ':400,700';
          document.head.appendChild( fontSheet );

          options.toString = function () {
            return 'Lead Generator';
          };

          buildScripts(options);
        },

        start: function (event, options) {
          if (options._submitted) {
            return;
          }
          var container = options._container,
            redrawBug;

          container.style.zIndex = '9999';
          if (container) {
            container.style.visibility = 'visible';

            // Safari Redraw hack - #3066
            container.style.display = 'none';
            redrawBug = container.offsetHeight;
            container.style.display = '';
          }

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onStart) {
            options.scripts._compiled.onStart();
          }

          _popcorn.expectsUserInput = true;
          setTimeout(function () { _popcorn.pause(); }, 10);
          window.addEventListener("orientationchange", onOrientationChange);
        },

        end: function (event, options) {
          window.removeEventListener("orientationchange", onOrientationChange);
          var container = options._container;
          _popcorn.expectsUserInput = false;
          if (options._container) {
            options._container.style.visibility = 'hidden';
          }

          container.style.zIndex = '-9999';

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd) {
            options.scripts._compiled.onEnd();
          }
        },

        _teardown: function (options) {
          if (options._target && options._container) {
            options._target.removeChild(options._container);
          }
        },

        _update: function (trackEvent, options) {

          if (options.transition && options.transition !== trackEvent.transition) {
            trackEvent._container.classList.remove(trackEvent.transition);
            trackEvent.transition = options.transition;
            trackEvent._container.classList.add(trackEvent.transition);
          }
          if (options.hasOwnProperty('zindex')) {
            trackEvent._container.style.zIndex = trackEvent.zindex = +options.zindex;
          }
          if (trackEvent._container) {
            var form = trackEvent._container.querySelector('form');
            if (options.hasOwnProperty('elements')) {
              trackEvent._container.removeChild(form);
              trackEvent.elements = options.elements;
              trackEvent._container.appendChild(buildForm(trackEvent));
            }
            if (options.hasOwnProperty('caption')) {
              trackEvent._container.removeChild(form);
              trackEvent.caption = options.caption;
              trackEvent._container.appendChild(buildForm(trackEvent));
            }
            if (options.hasOwnProperty('backgroundColor')) {
              trackEvent.backgroundColor = options.backgroundColor;
              form.style.background = 'rgba('+
                parseInt(options.backgroundColor.substring(1, 3), 16) + ',' +
                parseInt(options.backgroundColor.substring(3, 5), 16) + ',' +
                parseInt(options.backgroundColor.substring(5, 7), 16)+', 0.8)';
            }
            if (options.hasOwnProperty('buttonBackground')) {
              trackEvent.buttonBackground = options.buttonBackground;
              ['.buttons-inner > button'].forEach(function(selector) {
                  form.querySelectorAll(selector).forEach(function(item){
                      item.style.background = 'rgba('+
                        parseInt(options.buttonBackground.substring(1, 3), 16) + ',' +
                        parseInt(options.buttonBackground.substring(3, 5), 16) + ',' +
                        parseInt(options.buttonBackground.substring(5, 7), 16)+')';
                  });
              });
            }
            if (options.hasOwnProperty('buttonFontColor')) {
              trackEvent.buttonFontColor = options.buttonFontColor;
              ['.buttons-inner > button'].forEach(function(selector) {
                  form.querySelectorAll(selector).forEach(function(item){
                      item.style.color = 'rgba('+
                        parseInt(options.buttonFontColor.substring(1, 3), 16) + ',' +
                        parseInt(options.buttonFontColor.substring(3, 5), 16) + ',' +
                        parseInt(options.buttonFontColor.substring(5, 7), 16)+')';
                  });
              });
            }
            if (options.hasOwnProperty('buttonBorderRadius')) {
              trackEvent.buttonBorderRadius = options.buttonBorderRadius;
              ['.buttons-inner > button'].forEach(function(selector) {
                form.querySelectorAll(selector).forEach(function(item){
                  item.style.borderRadius = options.buttonBorderRadius + 'px';
                });
              });
            }
            if (options.hasOwnProperty('btnBottomBorder')) {
              trackEvent.btnBottomBorder = options.btnBottomBorder;
              ['.buttons-inner > button'].forEach(function(selector) {
                  form.querySelectorAll(selector).forEach(function(item){
                      item.style.borderBottom = '1px solid rgba('+
                        parseInt(options.btnBottomBorder.substring(1, 3), 16) + ',' +
                        parseInt(options.btnBottomBorder.substring(3, 5), 16) + ',' +
                        parseInt(options.btnBottomBorder.substring(5, 7), 16)+')';
                  });
              });
            }
            if (options.hasOwnProperty('fontColor')) {
              form.style.color = trackEvent.fontColor = options.fontColor;
              trackEvent._container.querySelectorAll('button').forEach(function(item) {
                item.style.fontFamily = options.fontFamily;
              });
            }
            if (options.hasOwnProperty('fontSize')) {
              trackEvent.fontSize = options.fontSize;
              form.style.fontSize = options.fontSize + '%';
              ['button', 'input', 'textarea'].forEach(function(type) {
                form.querySelectorAll(type).forEach(function(item) {
                  item.style.fontSize = options.fontSize + '%';
                });
              });
            }
            if (options.hasOwnProperty('fontFamily')) {
              var fontSheet = document.createElement( 'link' );
              fontSheet.rel = 'stylesheet';
              fontSheet.type = 'text/css';
              trackEvent.fontFamily = options.fontFamily || options._natives.manifest.options.fontFamily[ 'default' ];
              // Store reference to generated sheet for removal later, remove any existing ones
              trackEvent._fontSheet = fontSheet;
              fontSheet.onload = function () {
                form.style.fontFamily = options.fontFamily;
                form.querySelectorAll('button').forEach(function(item) {
                  item.style.fontFamily = options.fontFamily;
                });
              };

              fontSheet.href = 'https://fonts.googleapis.com/css?family=' +
                options.fontFamily.replace( /\s/g, '+' ) + ':400,700';
              document.head.appendChild( fontSheet );
            }
          }
          if (options.hasOwnProperty('webhook')) {
            trackEvent.webhook = options.webhook;
          }
          if (options.hasOwnProperty('emailAddress')) {
            trackEvent.emailAddress = options.emailAddress;
          }
        }
      };
    },
    {
      displayName: 'Lead Generator',
      options: {
        start: {
          elem: 'input',
          type: 'text',
          label: 'In',
          units: 'seconds'
        },
        end: {
          elem: 'input',
          type: 'text',
          units: 'seconds',
          hidden: true
        },
        target: {
          hidden: true
        },
        zindex: {
          hidden: true
        },
        caption: {
          elem: 'input',
          type: 'text',
          label: 'Caption',
          group: 'data',
          'default': 'Please fill out this form'
        },
        elements: {
          label: 'Elements',
          type: 'list',
          elem: 'sortable-list',
          group: 'data',
          'default': [{
            type: 'singleline',
            label: 'Name',
            token: 'NAME'
          }, {
            type: 'email',
            label: 'Email',
            token: 'EMAIL'
          }, {
            type: 'singleline',
            label: 'Mobile',
            token: 'MOBILE'
          }]
        },
        webhookEnabled: {
          elem: 'input',
          type: 'checkbox',
          label: 'Webhook Call',
          'default': false,
          group: 'advanced'
        },
        webhook: {
          elem: 'input',
          type: 'text',
          label: 'Webhook Address',
          group: 'advanced'
        },
        verifyWebhook: {
          elem: 'button',
          type: 'button',
          label: 'Test Webhook',
          group: 'advanced'
        },
        emailEnabled: {
          elem: 'input',
          type: 'checkbox',
          label: 'Email Notification',
          'default': false,
          group: 'advanced'
        },
        emailAddress: {
          elem: 'input',
          type: 'text',
          label: 'Notification Address',
          group: 'advanced'
        },
        padding: {
          hidden: true,
          'default': 5
        },
        fontFamily: {
          elem: 'select',
          label: 'Font',
          styleClass: '',
          googleFonts: true,
          'default': 'Open Sans'
        },
        fontSize: {
          elem: 'input',
          type: 'number',
          label: 'Font Size',
          'default': 80,
          units: '%',
        },
        fontColor: {
          elem: 'input',
          type: 'color',
          label: 'Font color',
          'default': DEFAULT_FONT_COLOR
        },
        backgroundColor: {
          elem: 'input',
          type: 'color',
          label: 'Background color',
          'default': DEFAULT_BACKGROUND_COLOR
        },
        buttonBackground: {
          elem: 'input',
          type: 'color',
          label: 'Button Background color',
          'default': DEFAULT_BUTTON_BACKGROUND_COLOR
        },
        buttonFontColor: {
          elem: 'input',
          type: 'color',
          label: 'Button Font color',
          'default': DEFAULT_BUTTON_FONT_COLOR
        },
        buttonBorderRadius: {
          elem: 'input',
          type: 'number',
          label: 'Border radius',
          'default': DEFAULT_BUTTON_BORDER_RADIUS
        },
        btnBottomBorder: {
          elem: 'input',
          type: 'color',
          label: 'Button Bottom Border color',
          'default': DEFAULT_BUTTON_BOTTOM_BORDER_COLOR
        },
        scripts: {
          onStart: '',
          onEnd: ''
        }
      }
    });
}(Popcorn));
