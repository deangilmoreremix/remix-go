(function (Butter) {

  var Editor = Butter.Editor;

  Editor.register('social', 'load!{{baseDir}}plugins/social-editor.html',
    function (rootElement, butter) {
      var _rootElement = rootElement;
      var _this = this;
      var _trackEvent;
      var _popcornOptions;
      var _butter;
      var basicContainer = _rootElement.querySelector('.editor-options');
      var advancedContainer = _rootElement.querySelector('.advanced-options');
      var scriptsContainer = _rootElement.querySelector( ".scripts-options" );
      var inputs;
      var ranOnce;
      var pluginOptions = {};
      var _defaults;
      
      
      function setDefaults(trackEvent) {
        var type = trackEvent.popcornOptions.type;
        var defaultHrefs = _defaults.defaultHrefs;

        trackEvent.manifest.options.href['default'] = _defaults[type].href;
        
        if (!trackEvent.popcornOptions.href || (defaultHrefs.indexOf(trackEvent.popcornOptions.href) !== -1)) {
          trackEvent.popcornOptions.href = _defaults[type].href;
        }


      }

      function prepareView(trackEvent) {
        var type = trackEvent.popcornOptions.type;
        inputs = {
          href: _rootElement.querySelector('[data-manifest-key=href]'),
          'include-parent': _rootElement.querySelector('[data-manifest-key=include-parent]')
        };
        var visibleInputs = Object.keys(_defaults[type]);
        var hiddenInputs = [];
        var parentElement;

        // hide target input
        var targetInput = _rootElement.querySelector('[data-manifest-key=target]');
        var targetContainer = targetInput && targetInput.closest('.trackevent-property');

        if (targetContainer) {
          targetContainer.classList.add('display-off');
        }

        for (var i in inputs) {
          if (inputs.hasOwnProperty(i)) {
            if (visibleInputs.indexOf(i) === -1) {
              hiddenInputs.push(inputs[i]);
            } else {
              parentElement = inputs[i].closest('.trackevent-property');
              if (parentElement) {
                parentElement.classList.remove('display-off');
              }

            }
          }
        }

        for (var input of hiddenInputs) {
          parentElement = input.closest('.trackevent-property');
          if (parentElement) {
            parentElement.classList.add('display-off');
          }

        }

      }

      function attachHandlers(trackEvent) {
        var key;
        var option;
        var facebookDiv = trackEvent.popcornTrackEvent._facebookDiv;
        var typeInput = document.querySelector('[data-manifest-key=type]');
        var includeParentInput = document.querySelector('[data-manifest-key=include-parent]');
        var callbacks = {
          href: function hrefCallback(trackEvent, updateOptions) {
            facebookDiv.setAttribute('data-href', updateOptions.href);
            trackEvent.update(updateOptions);
          },
          'include-parent': function includeParentCallback(trackEvent, updateOptions) {
            facebookDiv.setAttribute('data-include-parent', updateOptions['include-parent']);
            trackEvent.update(updateOptions);
          }
        };

        for (key in pluginOptions) {
          if (pluginOptions.hasOwnProperty(key)) {
            option = pluginOptions[key];

            if (option.elementType === 'select') {
              // plugin type selected

              _this.attachSelectChangeHandler(option.element, option.trackEvent, key);

            }
            else if (option.elementType === 'input') {

              _this.attachInputChangeHandler(option.element, option.trackEvent, key, callbacks[key]);
            }
          }
        }

        typeInput.addEventListener('change', function(e) {
          var type = e.target.value;
          var defaultHrefs = _defaults.defaultHrefs;
          
          if (!trackEvent.popcornOptions.href || (defaultHrefs.indexOf(trackEvent.popcornOptions.href) !== -1)) {
            trackEvent.popcornOptions.href = _defaults[type].href;
          }
        });

        includeParentInput.addEventListener('change', function(e) {
          var type = 'include-parent';
          callbacks[type](trackEvent, {'include-parent': e.target.checked});
        });

        if (!ranOnce) {
          ranOnce = true;
          basicContainer.insertBefore(_this.createStartEndInputs(trackEvent, _this.updateTrackEventSafe), basicContainer.firstChild);
        }

        prepareView(_trackEvent);

      }

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

        function callback(elementType, element, trackEvent, name) {
          pluginOptions[name] = {
            element: element,
            trackEvent: trackEvent,
            elementType: elementType
          };
        }

        _this.createPropertiesFromManifest({
          trackEvent: _trackEvent,
          callback: callback,
          basicContainer: basicContainer,
          advancedContainer: advancedContainer,
          ignoreManifestKeys: ['start', 'end', 'scripts']
        });

        setDefaults(_trackEvent);

        _this.createScriptEditors(trackEvent, scriptsContainer);

        attachHandlers(_trackEvent);
        _this.updatePropertiesFromManifest(_trackEvent);
        _this.setTrackEventUpdateErrorCallback(_this.setErrorState);

        // Wrap specific input elements
        _this.wrapTextInputElement(inputs.href);
      }

      function onTrackEventUpdated(e) {
        _trackEvent = e.target;

        setDefaults(_trackEvent);
        attachHandlers(_trackEvent);
        _this.updatePropertiesFromManifest(_trackEvent);
        _this.setTrackEventUpdateErrorCallback(_this.setErrorState);
      }

      // Extend this object to become a TrackEventEditor
      Editor.TrackEventEditor.extend(_this, butter, rootElement, {
        open: function (parentElement, trackEvent) {
          _defaults = trackEvent.manifest.defaultOptions;
          _butter = butter;

          // Update properties when TrackEvent is updated
          trackEvent.listen('trackeventupdated', onTrackEventUpdated);
          setup(trackEvent);

        },
        close: function () {
          _trackEvent.unlisten('trackeventupdated', onTrackEventUpdated);
        }
      });
    }, false, function (trackEvent, popcornInstance, $) {
      var _container = trackEvent.popcornTrackEvent._container;
      var _target = trackEvent.popcornTrackEvent._target;

      function createHelper( suffix ) {
        var el = document.createElement( 'div' );
        el.classList.add('ui-resizable-handle' );
        el.classList.add('ui-resizable-' + suffix );
        return el;
      }

      _container.appendChild(createHelper('top'));
      _container.appendChild(createHelper('bottom'));
      _container.appendChild(createHelper('left'));
      _container.appendChild(createHelper('right'));
      
      function initResizable () {
        // let user set width and height regardless they are adjustable or not
        $(_container).resizable({
          handles: 'n, e, s, w',
          resize: function( event, ui ) {
            _container.style.height = _container.clientHeight + 'px';
            _container.style.width = _container.clientWidth + 'px';
            _container.style.top = ui.position.top + 'px';
            _container.style.left = ui.position.left + 'px';

          },
          stop: function () {
            var height = _container.clientHeight;
            var width = _container.clientWidth;
            var targetWidth = _target.clientWidth;
            var targetHeight = _target.clientHeight;
            var top = _container.offsetTop * 100 / targetHeight;
            var left = _container.offsetLeft * 100 / targetWidth;
            var embedWidth = width * 100 / targetWidth;
            var embedHeight = height * 100 / targetHeight;
            var draggableHandle = _container.querySelector('.ui-draggable-handle');
            if (draggableHandle) {
              draggableHandle.style.width = '100%';
              draggableHandle.style.height = '100%';
            }

            var facebookDiv = trackEvent.popcornTrackEvent._facebookDiv;
            if (trackEvent.popcornOptions.type === 'fb-page') {
              facebookDiv.innerHTML = '';
            }
            
            trackEvent.update({
              width: embedWidth,
              height: embedHeight,
              editorWidth: width,
              editorHeight: height,
              left: Math.abs(left),
              top: Math.abs(top)
            });
          }
        });
      }


      this.draggable(trackEvent, _container, _target, {

        end: function() {
          var height = _container.clientHeight;
          var width = _container.clientWidth;
          var targetWidth = _target.clientWidth;
          var targetHeight = _target.clientHeight;
          var top = _container.offsetTop * 100 / targetHeight;
          var left = _container.offsetLeft * 100 / targetWidth;
          var embedWidth = width * 100 / targetWidth;
          var embedHeight = height * 100 / targetHeight;

          trackEvent.update({
            width: embedWidth,
            height: embedHeight,
            editorWidth: width,
            editorHeight: height,
            left: Math.abs(left),
            top: Math.abs(top)
          });
        }
      });

      this.droppable( trackEvent, _container );

      this.selectable(trackEvent, _container, _target);

      initResizable();
    });
}(window.Butter));
