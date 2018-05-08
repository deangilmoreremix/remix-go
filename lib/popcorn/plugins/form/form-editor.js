/* This Source Code Form is subject to the terms of the MIT license
 * If a copy of the MIT license was not distributed with this file, you can
 * obtain one at https://raw.github.com/mozilla/butter/master/LICENSE */

(function (Butter, VariableDescriptorFactory) {

  var FORM_FIELD_TYPES = [
    'singleline', 'multiline', 'email', 'number', 'date'
  ];

  var
    WEBHOOK_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  Butter.Editor.register("form", "load!{{baseDir}}plugins/form-editor.html",
    function (rootElement, butter) {
      var _this = this;

      function validateValueArray(regexp, value) {
        var isValid = true;
        value.split(',').map(function (item) { return item.trim(); }).forEach(function(item) {
          if (!regexp.test(item)) {
            isValid = false;
          }
        });
        return isValid;
      }

      var _rootElement = rootElement,
        _trackEvent,
        _butter,
        _popcornOptions,
        _falseClick = function () {
          return false;
        },
        _trueClick = function () {
          return true;
        };

      /**
       * Member: setup
       *
       * Sets up the content of this editor
       *
       * @param {TrackEvent} trackEvent: The TrackEvent being edited
       */
      function setup(trackEvent) {
        _trackEvent = trackEvent;
        _popcornOptions = _trackEvent.popcornOptions;

        _popcornOptions.emailEnabled = _popcornOptions.emailEnabled &&
          validateValueArray(EMAIL_REGEX, _popcornOptions.emailAddress);
        _popcornOptions.webhookEnabled = _popcornOptions.webhookEnabled &&
          validateValueArray(WEBHOOK_REGEX, _popcornOptions.webhook);

        var basicContainer = _rootElement.querySelector(".editor-options"),
          dataContainer = _rootElement.querySelector(".data-options"),
          advancedContainer = _rootElement.querySelector(".advanced-options"),
          scriptsContainer = _rootElement.querySelector(".scripts-options"),
          pluginOptions = {},
          pickers = {};

        function callback(elementType, element, trackEvent, name) {
          pluginOptions[name] = {element: element, trackEvent: trackEvent, elementType: elementType};
        }

        function attachHandlers() {
          var key,
            option;

          function colorCallback(te, options, message, prop) {
            var newOpts = {};
            if (message) {
              _this.setErrorState(message);
              return;
            } else {
              newOpts[prop] = options[prop];
              te.update(newOpts);
            }
          }


          function integrationCallback(prop, regexp, formatMessage) {
            return function( te, options, message ) {
              var newOpts = {};
              if ( message ) {
                _this.setErrorState( message );
                if (prop === 'webhook') {
                  _rootElement.querySelector('button[data-manifest-key="verifyWebhook"]').style.display = 'none';
                }
              } else if (!validateValueArray(regexp, options[ prop ])) {
                _this.setErrorState( formatMessage );
                if (prop === 'webhook') {
                  _rootElement.querySelector('button[data-manifest-key="verifyWebhook"]').style.display = 'none';
                }
              } else {
                newOpts[ prop ] = options[ prop ];
                te.update( newOpts );
                if (prop === 'webhook') {
                  _rootElement.querySelector('button[data-manifest-key="verifyWebhook"]').style.display = 'inline-block';
                }
              }
            };
          }

          function checkboxCallback(trackEvent, updateOptions, prop) {
            if ("webhookEnabled emailEnabled".match(prop)) {
              if (updateOptions[prop]) {
                pickers[prop].classList.remove("butter-disabled");
                pickers[prop].removeAttribute('disabled');
                pickers[prop].onclick = _trueClick;
              } else {
                pickers[prop].classList.add("butter-disabled");
                pickers[prop].setAttribute('disabled', '');
                pickers[prop].onclick = _falseClick;
              }
            }
            trackEvent.update(updateOptions);
          }

          function elementsUpdate(parent) {
            var elementsOrder = [];
            for (var i = 0; i < parent.children.length; i++) {
              var item = parent.children[i];
              elementsOrder.push({
                type: item.getAttribute('data-type'),
                token: item.getAttribute('data-token'),
                label: item.getAttribute('data-label')
              });
            }
            trackEvent.update({
              elements: elementsOrder
            });
          }

          for (key in pluginOptions) {
            if (pluginOptions.hasOwnProperty(key)) {
              option = pluginOptions[key];

              if (option.elementType === "select") {
                _this.attachSelectChangeHandler(option.element, option.trackEvent, key, _this.updateTrackEventSafe);
                if (key === "linkTarget") {
                  pickers.linkTarget = option.element;
                  if (!_popcornOptions.linkUrl) {
                    option.element.classList.add("butter-disabled");
                    pickers.linkTarget.disabled = true;
                  }
                }
              } else if (option.elementType === "input") {
                if (option.element.type === "checkbox") {
                  _this.attachCheckboxChangeHandler(option.element, option.trackEvent, key, checkboxCallback);
                } else if (key === "fontColor") {
                  _this.attachColorChangeHandler(option.element, option.trackEvent, key, colorCallback);
                } else if (key === 'buttonBackground') {
                  _this.attachColorChangeHandler(option.element, option.trackEvent, key, colorCallback);
                } else if (key === 'buttonFontColor') {
                  _this.attachColorChangeHandler(option.element, option.trackEvent, key, colorCallback);
                } else if (key === 'btnBottomBorder') {
                  _this.attachColorChangeHandler(option.element, option.trackEvent, key, colorCallback);
                } else if (key === "backgroundColor") {
                  // set initial state
                  _this.attachColorChangeHandler(option.element, option.trackEvent, key, colorCallback);
                } else if (key === "webhook") {
                  pickers.webhookEnabled = option.element;
                  // set initial state
                  if (!_popcornOptions.webhookEnabled) {
                    option.element.classList.add("butter-disabled");
                    option.element.setAttribute('disabled', '');
                    option.element.onclick = _falseClick;
                  }
                  _this.attachInputChangeHandler(
                    option.element, option.trackEvent, key,
                    integrationCallback('webhook', WEBHOOK_REGEX, 'Webhook URL is invalid.')
                  );
                } else if (key === "emailAddress") {
                  pickers.emailEnabled = option.element;
                  // set initial state
                  if (!_popcornOptions.emailEnabled) {
                    option.element.classList.add("butter-disabled");
                    option.element.setAttribute('disabled', '');
                    option.element.onclick = _falseClick;
                  }
                  _this.attachInputChangeHandler(
                    option.element, option.trackEvent, key,
                    integrationCallback('emailAddress', EMAIL_REGEX, 'Email is invalid.')
                  );
                } else {
                  _this.attachInputChangeHandler(option.element, option.trackEvent, key, _this.updateTrackEventSafe);
                }
              } else if (option.elementType === "textarea") {
                option.element.parentElement.appendChild(VariableDescriptorFactory.create({
                  target: option.element,
                  callback: _this.updateTrackEventSafe,
                  trackEvent: option.trackEvent,
                  showTooltip: true
                }));
                _this.attachInputChangeHandler(option.element, option.trackEvent, key, _this.updateTrackEventSafe);
              } else if (option.elementType === "sortable-list") {
                var fieldsListElement  = option.element.querySelector(".list-group");
                _this.Sortable.create(fieldsListElement, {
                  /*jshint loopfunc:true */
                  onEnd: function() {
                    elementsUpdate(this.el);
                  }
                });

                var setupListField = function(element) {
                  var formListItem = document.createElement('li');
                  formListItem.classList.add('list-group-item');
                  formListItem.setAttribute('data-type', element.type);
                  formListItem.setAttribute('data-label', element.label);
                  formListItem.setAttribute('data-token', element.token);

                  var dragHandle = document.createElement('span');
                  dragHandle.classList.add('fa', 'fa-bars');
                  formListItem.appendChild(dragHandle);

                  var inputHandle = document.createElement('input');
                  inputHandle.setAttribute('type', 'text');
                  inputHandle.value = element.label;
                  formListItem.appendChild(inputHandle);

                  var typeHandle = document.createElement('select');
                  FORM_FIELD_TYPES.forEach(function(formFieldType) {
                    var optionHandle = document.createElement('option');
                    optionHandle.text = optionHandle.value = formFieldType;
                    if (element.type === formFieldType) {
                      optionHandle.setAttribute('selected', '');
                    }
                    typeHandle.appendChild(optionHandle);
                  });
                  formListItem.appendChild(typeHandle);

                  var removeHandle = document.createElement('button');
                  removeHandle.classList.add('fa', 'fa-trash');
                  formListItem.appendChild(removeHandle);

                  // attach event handlers to field modifications
                  inputHandle.addEventListener('change', function(event) {
                    var newName = event.target.value;
                    formListItem.setAttribute('data-label', newName);
                    formListItem.setAttribute('data-token',
                      encodeURIComponent(newName.toUpperCase().split(' ').join('_')));
                    elementsUpdate(fieldsListElement);
                  });

                  typeHandle.addEventListener('change', function(event) {
                    formListItem.setAttribute('data-type', event.target.value);
                    elementsUpdate(fieldsListElement);
                  });

                  removeHandle.addEventListener('click', function() {
                    if (fieldsListElement.children.length === 1) {
                      return _this.setErrorState( "Lead generator must have at least one field." );
                    }
                    fieldsListElement.removeChild(formListItem);
                    elementsUpdate(fieldsListElement);
                  });

                  fieldsListElement.appendChild(formListItem);
                };
                _popcornOptions[key].forEach(setupListField);
                /*jshint loopfunc:true */
                option.element.querySelector(".add-list-field").addEventListener('click', function() {
                  if (_popcornOptions.elements.length >= 5) {
                     return _this.setErrorState( "Lead generator can't have more than 5 fields." );
                  } else {
                    _this.setErrorState( false );
                  }
                  setupListField({
                    type: 'singleline',
                    label: 'Untitled',
                    token: 'UNTITLED'
                  });
                  elementsUpdate(fieldsListElement);
                });
              } else if (option.elementType === "button") {
                if (key === "verifyWebhook") {
                  _rootElement.querySelector('button[data-manifest-key="verifyWebhook"]').style.display =
                    _popcornOptions.webhookEnabled && validateValueArray(WEBHOOK_REGEX, _popcornOptions.webhook) ?
                      'inline-block' : 'none';
                  option.element.addEventListener('click', function() {
                    var verifyWebhookXhr = new XMLHttpRequest();
                    verifyWebhookXhr.open('POST', _popcornOptions.webhook);
                    verifyWebhookXhr.onreadystatechange = function() {
                      if (this.readyState !== 4) {
                        return;
                      }
                      if (verifyWebhookXhr.status !== 200) {
                        return _this.setErrorState("Webhook test error: HTTP error " + verifyWebhookXhr.status);
                      }
                      _this.setErrorState();
                      alert('Webhook test successful.');
                    };
                    verifyWebhookXhr.send(JSON.stringify({
                      EMAIL: 'john@doe.com',
                      NAME: 'John Doe',
                      MOBILE: '123-456-78-90'
                    }));
                  });
                }
              }
            }
          }

          basicContainer.insertBefore(_this.createStartEndInputs(trackEvent, _this.updateTrackEventSafe), basicContainer.firstChild);
        }

        // backwards comp
        if ("center left right".match(_popcornOptions.position)) {
          _popcornOptions.alignment = _popcornOptions.position;
          _popcornOptions.position = "middle";
        }

        _this.createPropertiesFromManifest({
          trackEvent: trackEvent,
          callback: callback,
          basicContainer: basicContainer,
          dataContainer: dataContainer,
          advancedContainer: advancedContainer,
          ignoreManifestKeys: ["start", "end", "scripts"]
        });

        _this.createScriptEditors(trackEvent, scriptsContainer);

        attachHandlers();
        _this.updatePropertiesFromManifest(trackEvent);
        _this.setTrackEventUpdateErrorCallback(_this.setErrorState);
      }

      function anchorClickPrevention(anchorContainer) {
        if (anchorContainer) {

          anchorContainer.onclick = _falseClick;
        }
      }

      function onTrackEventUpdated(e) {
        _trackEvent = e.target;

        var anchorContainer = _trackEvent.popcornTrackEvent._container.querySelector("a");
        anchorClickPrevention(anchorContainer);

        _this.updatePropertiesFromManifest(_trackEvent);
        _this.setErrorState(false);
      }

      // Extend this object to become a TrackEventEditor
      Butter.Editor.TrackEventEditor.extend(_this, butter, rootElement, {
        open: function (parentElement, trackEvent) {
          var anchorContainer = trackEvent.popcornTrackEvent._container.querySelector("a");

          anchorClickPrevention(anchorContainer);

          _butter = butter;

          // Update properties when TrackEvent is updated
          trackEvent.listen("trackeventupdated", onTrackEventUpdated);
          setup(trackEvent);
        },
        close: function () {
          _trackEvent.unlisten("trackeventupdated", onTrackEventUpdated);
        }
      });
    }, false, function () {  });
}(window.Butter, window.VariableDescriptorFactory));
