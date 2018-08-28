(function (Popcorn) {

  var
    DEFAULT_BACKGROUND_COLOR = '#eb5054',
    BASIC_TOKEN = 'WEZLdFZhcnRiSllNNzJTNTo0ajRZdEV1QmEyYmFxckRN',
    DEFAULT_FONT_COLOR = '#000000',
    DEFAULT_BUTTON_BACKGROUND_COLOR = '#ec6442',
    DEFAULT_BUTTON_FONT_COLOR = '#ffffff',
    DEFAULT_BUTTON_BOTTOM_BORDER_COLOR = '#c85135',
    DEFAULT_BUTTON_BORDER_RADIUS = '1',
    WEBHOOK_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
        value.split(',').map(function (item) {
          return item.trim();
        }).forEach(function (item) {
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
        var nonemptyValidator = function (val) {
          if (val && val.length > 0) {
            return null;
          }
          return 'value can\'t be empty';
        };
        var validators = {
          singleline: nonemptyValidator,
          multiline: nonemptyValidator,
          email: function (val) {
            if (nonemptyValidator(val)) {
              return nonemptyValidator(val);
            }
            if (!EMAIL_REGEX.test(val)) {
              return 'email format is invalid';
            }
          },
          number: function (val) {
            if (nonemptyValidator(val) || !/^[0-9]*$/.test(val)) {
              return 'value is not a valid number';
            }
          },
          date: nonemptyValidator
        };

        var validationMessage = null;
        options.elements.forEach(function (element) {
          var result = validators[element.type](submission[element.token]);
          if (result) {
            validationMessage = 'Validation failed for ' + element.label + ': ' + result;
          }
        });
        return validationMessage;
      }

      function resumePlayback(options) {
        _popcorn.expectsUserInput = false;
        if (options._transitionContainer) {
          options._transitionContainer.classList.remove('on');
          options._transitionContainer.classList.add('off');
        }

        if (options._container) {
          options._container.style.zIndex = '-9999';
          options._container.style.visibility = 'hidden';
        }
        _popcorn.play();
        return false;
      }

      function buildForm(options) {
        var form = document.createElement('form');
        var personalizedTokens = window.digistrats ? window.digistrats.getPersonalizedTokens() : {};

        var inner = document.createElement('div');
        inner.classList.add('form-inner');

        var innerHeight = options.innerHeight || options._natives.manifest.options.innerHeight.default;
        var innerWidth = options.innerWidth || options._natives.manifest.options.innerWidth.default;
        if (!isMobile()) {
          inner.style.margin = (100 - innerHeight) / 2 + '% ' + ((100 - innerWidth) / 2) + '%';
        } else {
          inner.style.margin = 'auto';
          inner.style.height = '90%';
          inner.style.width = inner.style.minWidth = '90%';
        }
        if (options.innerColor) {
          inner.style.background = 'rgba(' +
            parseInt(options.innerColor.substring(1, 3), 16) + ',' +
            parseInt(options.innerColor.substring(3, 5), 16) + ',' +
            parseInt(options.innerColor.substring(5, 7), 16) +
            ', ' + options.innerOpacity / 100.0 + ')';
        }

        var formScrollable = document.createElement('div');
        formScrollable.classList.add('form-scrollable');

        var formScrollableInner = document.createElement('div');
        formScrollableInner.classList.add('form-scrollable-inner');

        if (options.brandLogoSrc) {
          var brandLogoHandle = document.createElement('img');
          brandLogoHandle.classList.add('brand-logo');
          brandLogoHandle.setAttribute('src', options.brandLogoSrc);
          formScrollableInner.appendChild(brandLogoHandle);
        }

        var captionHandle = document.createElement('div');
        captionHandle.classList.add('lead-form-caption');
        captionHandle.innerText = options.caption || options._natives.manifest.options.caption.default;
        captionHandle.style.fontSize = (options.captionFontSize || options.fontSize) + '%';
        captionHandle.style.textAlign = options.captionAlignment || options._natives.manifest.options.captionAlignment.default;
        formScrollableInner.appendChild(captionHandle);

        options.elements.forEach(function (declaration) {
          var inputWrapper = document.createElement('div');
          inputWrapper.classList.add('input-wrapper');
          var input;
          switch (declaration.type) {
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
          input.setAttribute('placeholder', declaration.label + ' ');
          inputWrapper.appendChild(input);
          formScrollableInner.appendChild(inputWrapper);
        });

        var buttonsInner = document.createElement('div');
        buttonsInner.classList.add('buttons-inner');

        var submitButton = document.createElement('button');
        submitButton.innerText = 'Confirm';
        submitButton.style.float = options.btnAlignment;
        if (options.btnWidth) {
          submitButton.style.width = options.btnWidth + '%';
        }
        buttonsInner.appendChild(submitButton);

        formScrollableInner.appendChild(buttonsInner);

        if (options.privacyDisclaimer) {
          var disclaimerHandle = document.createElement('div');
          disclaimerHandle.classList.add('privacy-disclaimer');
          disclaimerHandle.innerText = options.privacyDisclaimer;
          formScrollableInner.appendChild(disclaimerHandle);
        }

        if (options.privacyPolicyCaption && options.privacyPolicyLink) {
          var privacyLinkHandle = document.createElement('a');
          privacyLinkHandle.classList.add('privacy-policy-link');
          privacyLinkHandle.innerText = options.privacyPolicyCaption;
          privacyLinkHandle.setAttribute('href', options.privacyPolicyLink);
          formScrollableInner.appendChild(privacyLinkHandle);
        }

        formScrollable.appendChild(formScrollableInner);
        inner.appendChild(formScrollable);
        form.appendChild(inner);
        form.classList.add('popcorn', 'lead-form');
        form.setAttribute('action', '#');

        if (!isMobile()) {
          form.style.top = (100 - (options.height || options._natives.manifest.options.height.default)) / 2.0 + '%';
          form.style.left = (100 - (options.width || options._natives.manifest.options.width.default)) / 2.0 + '%';
          form.style.width = (options.width || options._natives.manifest.options.width.default) + '%';
          form.style.height = (options.height || options._natives.manifest.options.height.default) + '%';
        } else {
          form.style.width = form.style.height = '90%';
          form.style.top = form.style.left = '5%';
        }
        if (options.backgroundImage) {
          form.style.background = 'url(' + options.backgroundImage + ')';
        } else if (options.backgroundColor) {
          form.style.background = 'rgba(' +
            parseInt(options.backgroundColor.substring(1, 3), 16) + ',' +
            parseInt(options.backgroundColor.substring(3, 5), 16) + ',' +
            parseInt(options.backgroundColor.substring(5, 7), 16) + ', 0.8)';
        }
        form.style.backgroundSize = 'cover';
        // form.style.fontSize = (+options.fontSize + (isMobile() ? 30 : 0)) + '%';
        ['button', 'input', 'textarea'].forEach(function (type) {
          form.querySelectorAll(type).forEach(function (item) {
            item.style.fontSize = (+options.fontSize + (isMobile() ? 50 : 0)) + '%';
          });
        });
        form.style.color = options.fontColor;

        form.onsubmit = function () {
          return false;
        };
        ['.buttons-inner > button'].forEach(function (selector) {
          form.querySelectorAll(selector).forEach(function (item) {
            item.style.borderColor = 'transparent';
            item.style.boxShadow = '0px 1px 1px 0px rgba(0, 0, 0, 0.5)';
            if (options.btnBottomBorder) {
              item.style.borderBottom = '1px solid rgb(' +
                parseInt(options.btnBottomBorder.substring(1, 3), 16) + ',' +
                parseInt(options.btnBottomBorder.substring(3, 5), 16) + ',' +
                parseInt(options.btnBottomBorder.substring(5, 7), 16) + ')';
            }
            if (options.buttonBackground) {
              item.style.background = options.buttonBackground ? 'rgb(' +
                parseInt(options.buttonBackground.substring(1, 3), 16) + ',' +
                parseInt(options.buttonBackground.substring(3, 5), 16) + ',' +
                parseInt(options.buttonBackground.substring(5, 7), 16) + ')' : DEFAULT_BUTTON_BACKGROUND_COLOR;
            }
            item.style.borderRadius = options.buttonBorderRadius + '%';
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
            if (document.querySelector('meta[name=project]')) {
              var makeId = JSON.parse(document.querySelector('meta[name=project]').content).id;
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
          return resumePlayback(options);
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
          var
            _outer,
            fontSheet,
            transition = options.transition || options._natives.manifest.options.transition['default'];

          _popcorn = this;

          options._target = Popcorn.dom.find(options.target);

          if (!options._target) {
            return;
          }

          options._container = _outer = create('div');
          _outer.style.position = 'absolute';
          _outer.style.background = 'rgba(0, 0, 0, 0.8)';
          _outer.classList.add('leadform-outer-container');
          _outer.style.visibility = 'hidden';

          _outer.style.width = _outer.style.height = '100%';
          _outer.style.top = _outer.style.left = '0';
          _outer.style.zIndex = +options.zindex;

          options._transitionContainer = buildForm(options);
          _outer.appendChild(options._transitionContainer);

          if (!isMobile()) {
            options._target.appendChild(options._container);
          } else {
            window.document.body.appendChild(options._container);
          }

          options._transitionContainer.classList.add(transition);
          options._transitionContainer.classList.add('off');
          fontSheet = document.createElement('link');
          fontSheet.rel = 'stylesheet';
          fontSheet.type = 'text/css';
          options.fontFamily = options.fontFamily || options._natives.manifest.options.fontFamily['default'];
          // Store reference to generated sheet for removal later, remove any existing ones
          options._fontSheet = fontSheet;
          fontSheet.onload = function () {
            _outer.style.fontFamily = options.fontFamily;
            _outer.querySelectorAll('button').forEach(function (item) {
              item.style.fontFamily = options.fontFamily;
            });
          };

          fontSheet.href = 'https://fonts.googleapis.com/css?family=' +
            options.fontFamily.replace(/\s/g, '+') + ':400,700';
          document.head.appendChild(fontSheet);

          options.toString = function () {
            return 'Lead Generator';
          };

          buildScripts(options);
        },

        start: function (event, options) {
          if (options._submitted) {
            return;
          }
          var
            container = options._container,
            transitionContainer = options._transitionContainer;

          container.style.zIndex = '9999';
          if (container) {
            container.style.visibility = 'visible';

            // Safari Redraw hack - #3066
            container.style.display = 'none';
            container.style.display = '';
          }

          if (transitionContainer) {
            // Safari Redraw hack - #3066
            var safariHack = function () {
              transitionContainer.style.display = 'none';
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

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onStart) {
            options.scripts._compiled.onStart();
          }

          _popcorn.expectsUserInput = true;
          setTimeout(function () {
            _popcorn.pause();
          }, 10);
          window.addEventListener('orientationchange', onOrientationChange);
        },

        end: function (event, options) {
          window.removeEventListener('orientationchange', onOrientationChange);
          _popcorn.expectsUserInput = false;

          if (options._transitionContainer) {
            options._transitionContainer.classList.remove('on');
            options._transitionContainer.classList.add('off');
          }

          if (options._container) {
            options._container.style.zIndex = '-9999';
            options._container.style.visibility = 'hidden';
          }

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
            var inner = form.querySelector('.form-inner');

            if (options.hasOwnProperty('elements')) {
              trackEvent._container.removeChild(form);
              trackEvent.elements = options.elements;
              trackEvent._transitionContainer = buildForm(trackEvent);
              trackEvent._container.appendChild(trackEvent._transitionContainer);
            }
            if (options.hasOwnProperty('brandLogoSrc')) {
              trackEvent._container.removeChild(form);
              trackEvent.brandLogoSrc = options.brandLogoSrc;
              trackEvent._transitionContainer = buildForm(trackEvent);
              trackEvent._container.appendChild(trackEvent._transitionContainer);
            }
            if (options.hasOwnProperty('caption')) {
              trackEvent._container.removeChild(form);
              trackEvent.caption = options.caption;
              trackEvent._transitionContainer = buildForm(trackEvent);
              trackEvent._container.appendChild(trackEvent._transitionContainer);
            }
            if (options.hasOwnProperty('privacyDisclaimer')) {
              trackEvent._container.removeChild(form);
              trackEvent.privacyDisclaimer = options.privacyDisclaimer;
              trackEvent._transitionContainer = buildForm(trackEvent);
              trackEvent._container.appendChild(trackEvent._transitionContainer);
            }
            if (options.hasOwnProperty('privacyPolicyCaption')) {
              trackEvent._container.removeChild(form);
              trackEvent.privacyPolicyCaption = options.privacyPolicyCaption;
              trackEvent._transitionContainer = buildForm(trackEvent);
              trackEvent._container.appendChild(trackEvent._transitionContainer);
            }
            if (options.hasOwnProperty('privacyPolicyLink')) {
              trackEvent._container.removeChild(form);
              trackEvent.privacyPolicyLink = options.privacyPolicyLink;
              trackEvent._transitionContainer = buildForm(trackEvent);
              trackEvent._container.appendChild(trackEvent._transitionContainer);
            }
            if (options.hasOwnProperty('backgroundImage')) {
              trackEvent.backgroundImage = options.backgroundImage;
              form.style.background = 'url(' + options.backgroundImage + ') no-repeat';
            } else if (options.hasOwnProperty('backgroundColor')) {
              trackEvent.backgroundColor = options.backgroundColor;
              form.style.background = 'rgba(' +
                parseInt(options.backgroundColor.substring(1, 3), 16) + ',' +
                parseInt(options.backgroundColor.substring(3, 5), 16) + ',' +
                parseInt(options.backgroundColor.substring(5, 7), 16) + ', 0.8)';
            }
            if (options.hasOwnProperty('captionFontSize')) {
              trackEvent.captionFontSize = options.captionFontSize;
              form.querySelector('.lead-form-caption').style.fontSize = options.captionFontSize + '%';
            }
            if (options.hasOwnProperty('captionAlignment')) {
              trackEvent.captionAlignment = options.captionAlignment;
              form.querySelector('.lead-form-caption').style.textAlign = options.captionAlignment;
            }
            if (options.hasOwnProperty('innerWidth')) {
              trackEvent.innerWidth = options.innerWidth;
              inner.style.margin = (100 - trackEvent.innerHeight) / 2 + '% ' + ((100 - trackEvent.innerWidth) / 2) + '%';
            }
            if (options.hasOwnProperty('innerHeight')) {
              trackEvent.innerHeight = options.innerHeight;
              inner.style.margin = (100 - trackEvent.innerHeight) / 2 + '% ' + ((100 - trackEvent.innerWidth) / 2) + '%';
            }
            if (options.hasOwnProperty('innerColor')) {
              trackEvent.innerColor = options.innerColor;
              if (trackEvent.innerColor) {
                inner.style.background = 'rgba(' +
                  parseInt(trackEvent.innerColor.substring(1, 3), 16) + ',' +
                  parseInt(trackEvent.innerColor.substring(3, 5), 16) + ',' +
                  parseInt(trackEvent.innerColor.substring(5, 7), 16) +
                  ', ' + trackEvent.innerOpacity + ')';
              }
            }
            if (options.hasOwnProperty('innerOpacity')) {
              trackEvent.innerOpacity = options.innerOpacity;
              if (trackEvent.innerColor) {
                inner.style.background = 'rgba(' +
                  parseInt(trackEvent.innerColor.substring(1, 3), 16) + ',' +
                  parseInt(trackEvent.innerColor.substring(3, 5), 16) + ',' +
                  parseInt(trackEvent.innerColor.substring(5, 7), 16) +
                  ', ' + trackEvent.innerOpacity / 100.0 + ')';
              }
            }
            if (options.hasOwnProperty('height')) {
              trackEvent.height = options.height;
              form.style.top = (100 - options.height) / 2.0 + '%';
              form.style.height = options.height + '%';
            }
            if (options.hasOwnProperty('width')) {
              trackEvent.width = options.width;
              form.style.left = (100 - options.width) / 2.0 + '%';
              form.style.width = options.width + '%';
            }
            if (options.hasOwnProperty('btnWidth')) {
              trackEvent.btnWidth = options.btnWidth;
              form.querySelector('button').style.width = trackEvent.btnWidth + '%';
            }
            if (options.hasOwnProperty('btnAlignment')) {
              trackEvent.btnAlignment = options.btnAlignment;
              form.querySelector('button').style.float = trackEvent.btnAlignment;
            }
            if (options.hasOwnProperty('buttonBackground')) {
              trackEvent.buttonBackground = options.buttonBackground;
              ['.buttons-inner > button'].forEach(function (selector) {
                form.querySelectorAll(selector).forEach(function (item) {
                  item.style.background = 'rgba(' +
                    parseInt(options.buttonBackground.substring(1, 3), 16) + ',' +
                    parseInt(options.buttonBackground.substring(3, 5), 16) + ',' +
                    parseInt(options.buttonBackground.substring(5, 7), 16) + ')';
                });
              });
            }
            if (options.hasOwnProperty('buttonFontColor')) {
              trackEvent.buttonFontColor = options.buttonFontColor;
              ['.buttons-inner > button'].forEach(function (selector) {
                form.querySelectorAll(selector).forEach(function (item) {
                  item.style.color = 'rgba(' +
                    parseInt(options.buttonFontColor.substring(1, 3), 16) + ',' +
                    parseInt(options.buttonFontColor.substring(3, 5), 16) + ',' +
                    parseInt(options.buttonFontColor.substring(5, 7), 16) + ')';
                });
              });
            }
            if (options.hasOwnProperty('buttonBorderRadius')) {
              trackEvent.buttonBorderRadius = options.buttonBorderRadius;
              ['.buttons-inner > button'].forEach(function (selector) {
                form.querySelectorAll(selector).forEach(function (item) {
                  item.style.borderRadius = options.buttonBorderRadius + '%';
                });
              });
            }
            if (options.hasOwnProperty('btnBottomBorder')) {
              trackEvent.btnBottomBorder = options.btnBottomBorder;
              ['.buttons-inner > button'].forEach(function (selector) {
                form.querySelectorAll(selector).forEach(function (item) {
                  item.style.borderBottom = '1px solid rgba(' +
                    parseInt(options.btnBottomBorder.substring(1, 3), 16) + ',' +
                    parseInt(options.btnBottomBorder.substring(3, 5), 16) + ',' +
                    parseInt(options.btnBottomBorder.substring(5, 7), 16) + ')';
                });
              });
            }
            if (options.hasOwnProperty('fontColor')) {
              form.style.color = trackEvent.fontColor = options.fontColor;
              trackEvent._container.querySelectorAll('button').forEach(function (item) {
                item.style.fontFamily = options.fontFamily;
              });
            }
            if (options.hasOwnProperty('fontSize')) {
              trackEvent.fontSize = options.fontSize;
              // form.style.fontSize = options.fontSize + '%';
              ['button', 'input', 'textarea'].forEach(function (type) {
                form.querySelectorAll(type).forEach(function (item) {
                  item.style.fontSize = options.fontSize + '%';
                });
              });
            }
            if (options.hasOwnProperty('fontFamily')) {
              var fontSheet = document.createElement('link');
              fontSheet.rel = 'stylesheet';
              fontSheet.type = 'text/css';
              trackEvent.fontFamily = options.fontFamily || options._natives.manifest.options.fontFamily['default'];
              // Store reference to generated sheet for removal later, remove any existing ones
              trackEvent._fontSheet = fontSheet;
              fontSheet.onload = function () {
                form.style.fontFamily = options.fontFamily;
                form.querySelectorAll('button').forEach(function (item) {
                  item.style.fontFamily = options.fontFamily;
                });
              };

              fontSheet.href = 'https://fonts.googleapis.com/css?family=' +
                options.fontFamily.replace(/\s/g, '+') + ':400,700';
              document.head.appendChild(fontSheet);
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
        brandLogoSrc: {
          elem: 'input',
          type: 'url',
          label: 'Brand Logo URL'
        },
        caption: {
          elem: 'input',
          type: 'text',
          label: 'Caption',
          group: 'data',
          'default': 'Find out more'
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
        privacyDisclaimer: {
          elem: 'input',
          type: 'text',
          label: 'Privacy Disclaimer',
          group: 'data',
          'default': 'By opting in you are giving us permission to reach out to you concerning this service. We will not share your information or spam.'
        },
        privacyPolicyCaption: {
          elem: 'input',
          type: 'text',
          label: 'Privacy Policy Label',
          group: 'data'
        },
        privacyPolicyLink: {
          elem: 'input',
          type: 'text',
          label: 'Privacy Policy Link',
          group: 'data'
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
        width: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Width',
          'default': 90
        },
        height: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Height',
          'default': 90
        },
        fontFamily: {
          elem: 'select',
          label: 'Font',
          styleClass: '',
          googleFonts: true,
          'default': 'Open Sans'
        },
        captionFontSize: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          label: 'Caption Font Size',
          units: '%',
        },
        captionAlignment: {
          authorityLevel: 5,
          elem: 'select',
          options: ['Center', 'Left', 'Right'],
          values: ['center', 'left', 'right'],
          label: 'Caption Alignment',
          'default': 'left'
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
        innerWidth: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Inner Width',
          'default': 90
        },
        innerHeight: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Inner Height',
          'default': 90
        },
        innerColor: {
          authorityLevel: 5,
          elem: 'input',
          type: 'color',
          label: 'Inner Color',
          'default': DEFAULT_FONT_COLOR
        },
        innerOpacity: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Inner Opacity',
          'default': 0
        },
        backgroundImage: {
          elem: 'input',
          type: 'url',
          label: 'Background Source URL'
        },
        backgroundColor: {
          elem: 'input',
          type: 'color',
          label: 'Background color',
          'default': DEFAULT_BACKGROUND_COLOR
        },
        btnWidth: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          units: '%',
          label: 'Button Width',
          default: 10
        },
        btnAlignment: {
          authorityLevel: 5,
          elem: 'select',
          options: ['Center', 'Left', 'Right'],
          values: ['none', 'left', 'right'],
          label: 'Button Alignment',
          'default': 'right'
        },
        buttonBackground: {
          authorityLevel: 5,
          elem: 'input',
          type: 'color',
          label: 'Button Background color',
          'default': DEFAULT_BUTTON_BACKGROUND_COLOR
        },
        buttonFontColor: {
          authorityLevel: 5,
          elem: 'input',
          type: 'color',
          label: 'Button Font color',
          'default': DEFAULT_BUTTON_FONT_COLOR
        },
        buttonBorderRadius: {
          authorityLevel: 5,
          elem: 'input',
          type: 'number',
          label: 'Button border radius',
          'default': DEFAULT_BUTTON_BORDER_RADIUS
        },
        btnBottomBorder: {
          authorityLevel: 5,
          elem: 'input',
          type: 'color',
          label: 'Button Bottom Border color',
          'default': DEFAULT_BUTTON_BOTTOM_BORDER_COLOR
        },
        transition: {
          authorityLevel: 5,
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
            'Type Blink'
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
            'popcorn-type-blink'
          ],

          label: 'Transition',
          'default': 'popcorn-none'
        },
        scripts: {
          onStart: '',
          onEnd: ''
        }
      }
    });
}(Popcorn));
