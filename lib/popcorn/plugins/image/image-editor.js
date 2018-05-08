/* This Source Code Form is subject to the terms of the MIT license
 * If a copy of the MIT license was not distributed with this file, you can
 * obtain one at https://raw.github.com/mozilla/butter/master/LICENSE */

(function( Butter, VariableDescriptorFactory ) {

  var Editor = Butter.Editor;
  var Cornfield = Butter.app.cornfield;
  var __EditorHelper;

  Editor.register( "image", "load!{{baseDir}}plugins/image-editor.html",
                   function( rootElement, butter, compiledLayout ) {

    var _rootElement = rootElement,
        _tagRadio = _rootElement.querySelector( "#image-tag-radio" ),
        _galleryRadio = _rootElement.querySelector( "#image-gallery-radio" ),
        _tagInput = _rootElement.querySelector( "#image-tag-input" ),
        _galleryInput = _rootElement.querySelector( "#image-gallery-input" ),
        _urlInput = _rootElement.querySelector( "#image-url-input" ),
        _titleInput = _rootElement.querySelector( "#image-title-input" ),
        _linkInput = _rootElement.querySelector( "#image-link-input" ),
        _countInput = _rootElement.querySelector( "#image-count-input" ),
        _rotationInput,
        _singleImageTab = _rootElement.querySelector( ".image-single" ),
        _flickrImageTab = _rootElement.querySelector( ".image-flickr" ),
        _dropArea = _rootElement.querySelector( ".image-droparea" ),
        _imageToggler = _rootElement.querySelector( "#image-toggler" ),
        _editImageButton = _rootElement.querySelector('.edit-image-button'),
        _urlRegex,
        _this = this,
        _trackEvent,
        _galleryActive = false,
        _tagsActive = false,
        _flickrActive = false,
        _singleActive = false,
        _popcornInstance,
        _inSetup,
        _cachedValues,
        HUGE_IMAGE_PIXELS = 1200 * 720;

     var adobeSceneEditorAvailable = Cornfield.isAvailableFeature('adobeSceneEditor');
     var adobeSceneEditorUpgradable = Cornfield.isUpgradableFeature('adobeSceneEditor');

    function updateTrackEvent( te, props ) {
      _this.setErrorState();
      _this.updateTrackEventSafe( te, props );
    }

    function toggleTabs() {
      _singleImageTab.classList.toggle( "display-off" );
      _flickrImageTab.classList.toggle( "display-off" );
    }

    function attachDropHandlers() {
      __EditorHelper.uploader( _trackEvent, _dropArea, true );
      __EditorHelper.droppable( _trackEvent, _dropArea, true );
      butter.listen( "droppable-unsupported", unSupported );
      butter.listen( "droppable-upload-failed", failedUpload );
      butter.listen( "droppable-succeeded", uploadSuceeded );
    }

    function unSupported() {
      _this.setErrorState( Butter.localized.get( "Sorry, but your browser doesn't support this feature." ) );
    }

    function failedUpload( e ) {
      _this.setErrorState( e.data );
    }

    function uploadSuceeded( e ) {
      _dropArea.querySelector( "img" ).src = e.data.url;
    }

    function calcImageTime() {
      var imageTime = rootElement.querySelector( ".image-time-bold" ),
          popcornOptions = _trackEvent.popcornOptions,
          eventDuration = popcornOptions.end - popcornOptions.start,
          time;

      time = Math.round( ( eventDuration / popcornOptions.count ) * ( Math.pow( 10, 1 ) ) ) / Math.pow( 10, 1 );
      time = time > 0.01 ? time : 0.01;

      imageTime.innerHTML = time + " seconds";
    }

    function galleryHandler() {
      if ( !_galleryActive && !_inSetup ) {
        _galleryActive = true;
        _trackEvent.update({
          src: "",
          linkSrc: "",
          tags: "",
          photosetId: _cachedValues.photosetId.data
        });
      }
      _tagsActive = _galleryInput.disabled = false;
      _tagInput.disabled = _galleryRadio.checked = true;
      _galleryInput.classList.remove( "butter-disabled" );
      _tagInput.classList.add( "butter-disabled" );
    }

    function tagHandler() {
      if ( !_tagsActive && !_inSetup ) {
        _tagsActive = true;
        _trackEvent.update({
          tags: _cachedValues.tags.data,
          src: "",
          linkSrc: "",
          photosetId: ""
        });
      }

      _galleryActive = _tagInput.disabled = false;
      _tagInput.classList.remove( "butter-disabled" );
      _galleryInput.disabled = _tagRadio.checked = true;
      _galleryInput.classList.add( "butter-disabled" );
    }

    function isEmptyInput( value ) {
      return value === "";
    }

    function isDataURI( url ) {
      return ( /^data:image/ ).test( url );
    }

    function flickrHandler() {
      var popcornOptions = _trackEvent.popcornOptions;

      _flickrActive = true;
      _singleActive = false;

      if ( _flickrImageTab.classList.contains( "display-off" ) ) {
        toggleTabs();
        _imageToggler.value = "image-flickr";
      }

      // Default state is Using a Flickr Tag Search. This ensures that even if the first two conditions are false
      // that a default state is still properly applied
      if ( _tagsActive || popcornOptions.tags || ( !popcornOptions.tags && !popcornOptions.photosetId ) ) {
        tagHandler();
      } else {
        galleryHandler();
      }

      calcImageTime();
    }

    function singleImageHandler() {
      _galleryActive = _tagsActive = _flickrActive = false;

      var img = new Image();
      img.onload = function() {
        if ((this.width * this.height) >= HUGE_IMAGE_PIXELS) {
          _this.setErrorState(Butter.localized.get("Warning: Image Size might affect playback"));
        }
      };
      img.src = _cachedValues.src.data;


      if ( !_singleActive && !_inSetup ) {
        _singleActive = true;
        _trackEvent.update({
          src: _cachedValues.src.data,
          linkSrc: _cachedValues.linkSrc.data,
          tags: "",
          photosetId: ""
        });
      }

      if ( isDataURI( _trackEvent.popcornOptions.src ) ) {
        _urlInput.value = "data:image";
      }

      if ( _singleImageTab.classList.contains( "display-off" ) ) {
        toggleTabs();
        _imageToggler.value = "image-single";
      }
    }

    // Mode specifies what values should be retrieved from the cached values
    function displayCachedValues( mode ) {
      var element;

      // Repopulate fields with old values to prevent confusion
      for ( var i in _cachedValues ) {
        if ( _cachedValues.hasOwnProperty( i ) ) {
          element = _rootElement.querySelector( "[data-manifest-key='" + i + "']" );

          if ( _cachedValues[ i ].type === mode ) {
            if ( isDataURI( _cachedValues[ i ].data ) ) {
              _urlInput.value = "data:image";
            } else {
              element.value = _cachedValues[ i ].data;
            }
          }
        }
      }
    }

    function setup( trackEvent ) {
      var container = _rootElement.querySelector( ".editor-options" ),
          scriptsContainer = _rootElement.querySelector( ".scripts-options" ),
          startEndElement,
          manifestOpts = trackEvent.popcornTrackEvent._natives.manifest.options;

      _inSetup = true;
      _urlRegex = manifestOpts.linkSrc.validation;

      function callback( elementType, element, trackEvent, name ) {
        if ( elementType === "select" ) {
          _this.attachSelectChangeHandler( element, trackEvent, name );
        }
      }

      function createYouzignButton() {
        var button = document.createElement("button");

        button.className = "integration-button youzign-button butter-btn btn-green";
        button.innerHTML = "Youzign";

        button.addEventListener("click", function() {
          var dialog;

          dialog = Butter.app.dialog.spawn("youzign", {
            data: {
              onSelect: function(imgUrl) {
                dialog.close();
                updateTrackEvent(trackEvent, {
                  src: imgUrl
                });
              }
            }
          });

          dialog.open();
        });

        return button;
      }

      function createDropMockButton() {
        var button = document.createElement("button");

        button.className = "integration-button dropmock-button butter-btn btn-green";
        button.innerHTML = "DropMock";

        button.addEventListener("click", function() {
          var dialog;

          dialog = Butter.app.dialog.spawn("dropMock", {
            data: {
              onSelect: function(imgUrl) {
                dialog.close();
                updateTrackEvent(trackEvent, {
                  src: imgUrl
                });
              }
            }
          });

          dialog.open();
        });

        return button;
      }

      function createDesignoProButton() {
        var button = document.createElement("button");

        button.className = "integration-button designo-pro-button butter-btn btn-green";
        button.innerHTML = "DesignoPro2";

        button.addEventListener("click", function() {
          var dialog;

          dialog = Butter.app.dialog.spawn("designoPro", {
            data: {
              onSelect: function(imgUrl) {
                dialog.close();
                updateTrackEvent(trackEvent, {
                  src: imgUrl
                });
              }
            }
          });

          dialog.open();
        });

        return button;
      }

      function attachHandlers() {
        _this.attachInputChangeHandler( _urlInput, trackEvent, "src", function( te, prop ) {

          var src = prop.src;

          if ( isEmptyInput( src ) ) {
            return;
          }

          // Chrome can't display really long dataURIs in their text inputs. This is to prevent accidentally
          // removing their image
          if ( src === "data:image" &&  isDataURI( te.popcornTrackEvent.src ) ) {
            src = te.popcornTrackEvent.src;
          }

          Editor.MediaUtils.getMetaData( src, function () {
            _dropArea.querySelector( "img" ).src = _cachedValues.src.data = src;

            updateTrackEvent( te, {
              src: src,
              tags: "",
              photosetId: ""
            });
          }, function( errorMessage ) {
            _this.setErrorState( errorMessage );
          });
        });

        _this.attachInputChangeHandler( _titleInput, trackEvent, "title", updateTrackEvent );

        _this.createTooltip( _linkInput, {
          name: "image-link-tooltip" + Date.now(),
          element: _linkInput.parentElement,
          message: Butter.localized.get( "Links will be clickable when shared." ),
          top: "105%",
          left: "50%",
          hidden: true,
          hover: false
        });

        var linkInputCallback = function( te, prop ) {
          if ( prop.linkSrc.match( _urlRegex ) ) {
            _cachedValues.linkSrc.data = prop.linkSrc;

            updateTrackEvent( te, {
              linkSrc: prop.linkSrc
            });
          } else if ( prop.linkSrc !== "" ) {
            _this.setErrorState( Butter.localized.get( "Not a valid URL" ) );
          } else {
            updateTrackEvent( te, {
              linkSrc: ""
            });
          }
        };
        _linkInput.parentElement.appendChild(VariableDescriptorFactory.create({
          target: _linkInput,
          key: "linkSrc",
          callback: linkInputCallback,
          trackEvent: trackEvent
        }));
        _this.attachInputChangeHandler( _linkInput, trackEvent, "linkSrc", linkInputCallback);

        _this.attachInputChangeHandler( _galleryInput, trackEvent, "photosetId", function( te, prop ) {
          if ( isEmptyInput( prop.photosetId ) ) {
            return;
          }

          _cachedValues.photosetId.data = prop.photosetId;

          updateTrackEvent( te, {
            src: "",
            linkSrc: "",
            tags: "",
            photosetId: prop.photosetId
          });
        });

        _this.attachInputChangeHandler( _tagInput, trackEvent, "tags", function( te, prop ) {
          if ( isEmptyInput( prop.tags ) ) {
            return;
          }

          _cachedValues.tags.data = prop.tags;

          updateTrackEvent( te, {
            src: "",
            linkSrc: "",
            tags: prop.tags,
            photosetId: ""
          });
        });

        _this.attachInputChangeHandler( _countInput, trackEvent, "count", function( te, prop ) {
          var count = prop.count > 0 ? prop.count : 1;

          if ( isEmptyInput( prop.count ) ) {
            return;
          }

          _cachedValues.count.data = count;

          updateTrackEvent( te, {
            count: count
          });
        });

        if (!_rotationInput) {
          _rotationInput = _rootElement.querySelector("[data-manifest-key=rotation]");
        }

        _this.attachInputChangeHandler( _rotationInput, trackEvent, "rotation", function( te, prop ) {
          var rotation = prop.rotation;

          if (isEmptyInput(prop.rotation)) {
            return;
          }

          updateTrackEvent(te, {
            rotation: rotation
          });
        });

        // Wrap specific input elements
        _this.wrapTextInputElement( _urlInput );
        _this.wrapTextInputElement( _titleInput );
        _this.wrapTextInputElement( _linkInput );
        _this.wrapTextInputElement( _galleryInput );

        _tagRadio.addEventListener( "click", tagHandler );
        _galleryRadio.addEventListener( "click", galleryHandler );

        /* add a button for youzign */
        _urlInput.parentNode.insertBefore(createYouzignButton(), _urlInput.nextSibling);
        _urlInput.parentNode.insertBefore(createDropMockButton(), _urlInput.nextSibling);
        _urlInput.parentNode.insertBefore(createDesignoProButton(), _urlInput.nextSibling);

        function onEditImage(event) {
          event.preventDefault();


          if (!adobeSceneEditorAvailable && adobeSceneEditorUpgradable) {
            return butter.app.showUpgradeDialog({
              link: Cornfield.getFeatureUpgradeLink('adobeSceneEditor'),
              featureName: 'adobeSceneEditor'
            });
          }

          window.aviaryEditor.launch(_dropArea.querySelector('img'), _cachedValues.src.data, function (err, newUrl) {

            if (err) {

              var dialog = Butter.app.dialog.spawn('svg-modal-dialog');
              dialog.open();

              console.log(err);
              return;
            }

            __EditorHelper.copyFile(newUrl, function (err, ourUrl) {
              if (err) {
                throw err;
              }

              _dropArea.querySelector("img").src = _cachedValues.src.data = ourUrl;

              updateTrackEvent(trackEvent, {
                src: ourUrl,
                tags: "",
                photosetId: ""
              });
            });

          });
        }

        if (!(adobeSceneEditorAvailable || adobeSceneEditorUpgradable)) {
          _editImageButton.classList.add('hidden');
        } else {
          _editImageButton.addEventListener("click", onEditImage);
        }

        attachDropHandlers();
      }

      startEndElement = _this.createStartEndInputs( trackEvent, updateTrackEvent );
      container.insertBefore( startEndElement, container.firstChild );

      _this.createPropertiesFromManifest({
        trackEvent: trackEvent,
        callback: callback,
        basicContainer: container,
        manifestKeys: ["transition", "rotation"],
        ignoreManifestKeys: [ "scripts" ]
      });

      _this.createScriptEditors(trackEvent, scriptsContainer);

      attachHandlers();
      container.appendChild( _this.createSetAsDefaultsButton( trackEvent ) );
      _this.updatePropertiesFromManifest( trackEvent );
      _this.setTrackEventUpdateErrorCallback( _this.setErrorState );

      if ( trackEvent.popcornOptions.src ) {
        _singleActive = true;
        singleImageHandler();
        displayCachedValues( "single" );
      } else {
        flickrHandler();
        displayCachedValues( "flickr" );
      }

      _this.scrollbar.update();
      _inSetup = false;

      var dropData = trackEvent.popcornOptions.dropData;
      if (dropData && dropData.files && dropData.files[0]) {
        __EditorHelper.sendFile(dropData.files[0], trackEvent, true);
      }
    }

    function toggleHandler( e ) {
      toggleTabs();

      if ( e.target.value === "image-single" ) {
        singleImageHandler();
      } else {
        flickrHandler();
      }

      _this.scrollbar.update();
    }

    function clickPrevention() {
      return false;
    }

    function onTrackEventUpdated( e ) {
      _trackEvent = e.target;
      calcImageTime();
      _this.updatePropertiesFromManifest( _trackEvent );
      _this.setErrorState( false );

      var links, i, ln,
          src = _trackEvent.popcornOptions.src;

      if ( _trackEvent.popcornTrackEvent._container ) {
        links = _trackEvent.popcornTrackEvent._container.querySelectorAll( "a" );

        if ( links ) {
          for ( i = 0, ln = links.length; i < ln; i++ ) {
            links[ i ].onclick = clickPrevention;
          }
        }
      }

      // Droppable images aren't getting their data URIs cached so just perform a double check here
      // on updating
      if ( src ) {
        _cachedValues.src.data = src;
      }

      // Ensure right group is displayed
      // Mode is flipped here to ensure cached values aren't placed right back in after updating
      if ( src && !_flickrActive ) {
        singleImageHandler();
        displayCachedValues( "flickr" );
      } else if ( _flickrActive ) {
        flickrHandler();
        displayCachedValues( "single" );
      }

      _this.scrollbar.update();
    }

    Editor.TrackEventEditor.extend( _this, butter, rootElement, {
      open: function( parentElement, trackEvent ) {
        var popcornOptions = trackEvent.popcornOptions,
            manifestOpts = trackEvent.popcornTrackEvent._natives.manifest.options;

        if ( !_cachedValues ) {
          _cachedValues = {
            src: {
              data: popcornOptions.src || manifestOpts.src.default,
              type: "single"
            },
            linkSrc: {
              data: popcornOptions.linkSrc,
              type: "single"
            },
            tags: {
              data: popcornOptions.tags || manifestOpts.tags.default,
              type: "flickr"
            },
            photosetId: {
              data: popcornOptions.photosetId || manifestOpts.photosetId.default,
              type: "flickr"
            },
            count: {
              data: popcornOptions.count,
              type: "flickr"
            }
          };
        }

        _popcornInstance = trackEvent.track._media.popcorn.popcorn;
        _imageToggler.addEventListener( "change", toggleHandler );

        _this.applyExtraHeadTags( compiledLayout );
        _trackEvent = trackEvent;
        _dropArea.querySelector( "img" ).src = _trackEvent.popcornOptions.src;

        // The current popcorn instance
        _popcornInstance.on( "invalid-flickr-image", function() {
          _this.setErrorState( Butter.localized.get( "Invalid Flicker Gallery URL" ) );
        });

        _popcornInstance.on( "popcorn-image-count-update", function( count ) {
          _trackEvent.popcornOptions.count = count;
          _cachedValues.count.data = count;
          _countInput.value = count;
        });

        _popcornInstance.on( "popcorn-image-failed-retrieve", function() {
          _this.setErrorState( Butter.localized.get( "No Images" ) );
        });

        _trackEvent.listen( "trackeventupdated", onTrackEventUpdated );

        setup( trackEvent );
      },
      close: function() {
        _imageToggler.removeEventListener( "change", toggleHandler, false );
        _this.removeExtraHeadTags();
        butter.unlisten( "droppable-unsupported", unSupported );
        butter.unlisten( "droppable-upload-failed", failedUpload );
        butter.unlisten( "droppable-succeeded", uploadSuceeded );
        _popcornInstance.off( "invalid-flickr-image" );
        _trackEvent.unlisten( "trackeventupdated", onTrackEventUpdated );
      }
    });
  }, false, function( trackEvent, popcornInstance, $ ) {

    var _popcornOptions = trackEvent.popcornTrackEvent,
        _container = _popcornOptions._container,
        _clone,
        _cloneContainer,
        _src = _popcornOptions.src,
        _target = _popcornOptions._target;

    // Work around since I can't just require it in for this editor.
    __EditorHelper = this;

    function createHelper( suffix ) {
      var el = document.createElement( "div" );
      el.classList.add( "ui-resizable-handle" );
      el.classList.add( "ui-resizable-" + suffix );
      return el;
    }

    this.selectable( trackEvent, _container );
    if ( _src ) {
      this.droppable( trackEvent, _container );

      var options = {
            tooltip: "Double click to crop image"
          };

      if ( _src.indexOf( trackEvent.manifest.options.src.FLICKR_SINGLE_CHECK ) > -1 ) {
        options.disableTooltip = true;
        options.editable = false;
      }

      trackEvent.draggable = this.draggable( trackEvent, _container, _target, options );
    } else {
      trackEvent.draggable = this.draggable( trackEvent, _container, _target, {
        disableTooltip: true,
        editable: false
      });
    }

    this.rotatable( trackEvent, _container, _target );

    _container.appendChild( createHelper( "top" ) );
    _container.appendChild( createHelper( "bottom" ) );
    _container.appendChild( createHelper( "left" ) );
    _container.appendChild( createHelper( "right" ) );

    if ( !$( _container ).data( "resizable" ) ) {
      $( _container ).resizable({
        handles: "n,ne,e,se,s,sw,w,nw",
        containment: "parent",
        start: function() {
          var image = trackEvent.popcornTrackEvent.image;
          if ( image && _container.classList.contains( "track-event-editing" ) ) {
            image.style.top = image.offsetTop + "px";
            image.style.left = image.offsetLeft + "px";
            image.style.width = image.clientWidth + "px";
            image.style.height = image.clientHeight + "px";
            if ( _clone ) {
              _clone.style.width = _clone.clientWidth + "px";
              _clone.style.height = _clone.clientHeight + "px";
              _cloneContainer.style.width = _cloneContainer.clientWidth + "px";
              _cloneContainer.style.height = _cloneContainer.clientHeight + "px";
              _clone.style.top = _clone.offsetTop + "px";
              _clone.style.left = _clone.offsetLeft + "px";
              _cloneContainer.style.top = _cloneContainer.offsetTop + "px";
              _cloneContainer.style.left = _cloneContainer.offsetLeft + "px";
            }
          }
        },
        stop: function( event, ui ) {
          var image = trackEvent.popcornTrackEvent.image,
              width = _container.clientWidth,
              height = _container.clientHeight,
              left = ui.position.left,
              top = ui.position.top,
              imageHeight,
              imageWidth,
              imageTop,
              imageLeft;

          if ( left < 0 ) {
            width += left;
            left = 0;
          }
          if ( top < 0 ) {
            height += top;
            top = 0;
          }

          if ( width + left > _target.clientWidth ) {
            width = _target.clientWidth - left;
          }
          if ( height + top > _target.clientHeight ) {
            height = _target.clientHeight - top;
          }

          width = width / _target.clientWidth * 100;
          height = height / _target.clientHeight * 100;
          left = left / _target.clientWidth * 100;
          top = top / _target.clientHeight * 100;

          if ( image ) {

            imageWidth = image.offsetWidth / _container.clientWidth * 100;
            imageHeight = image.offsetHeight / _container.clientHeight * 100;
            imageTop = image.offsetTop / _container.clientHeight * 100;
            imageLeft = image.offsetLeft / _container.clientWidth * 100;

            _container.style.width = width + "%";
            _container.style.height = height + "%";
            _container.style.top = top + "%";
            _container.style.left = left + "%";

            image.style.width = imageWidth + "%";
            image.style.height = imageHeight + "%";
            image.style.top = imageTop + "%";
            image.style.left = imageLeft + "%";

            trackEvent.update({
              innerWidth: imageWidth,
              innerHeight: imageHeight,
              innerTop: imageTop,
              innerLeft: imageLeft,
              width: width,
              height: height,
              left: left,
              top: top
            });
          } else {

            trackEvent.update({
              width: width,
              height: height,
              left: left,
              top: top
            });
          }
        }
      });
    }

    // The image plugin doesn't use an update function.
    // If it did, we wouldn't be able to set this up again and again.
    // We would need to make sure nothing gets duplicated on an update.
    if ( trackEvent.popcornTrackEvent.image && trackEvent.popcornOptions.src ) {
      _cloneContainer = document.createElement( "div" );
      _cloneContainer.classList.add( "clone-container" );
      _clone = trackEvent.popcornTrackEvent.image.cloneNode();
      _clone.classList.add( "image-crop-clone" );
      _cloneContainer.appendChild( _clone );
      _container.appendChild( _cloneContainer );

      _clone.appendChild( createHelper( "top" ) );
      _clone.appendChild( createHelper( "bottom" ) );
      _clone.appendChild( createHelper( "left" ) );
      _clone.appendChild( createHelper( "right" ) );

      $( _clone ).draggable({
        drag: function( event, ui ) {
          trackEvent.popcornTrackEvent.image.style.top = ui.position.top + "px";
          trackEvent.popcornTrackEvent.image.style.left = ui.position.left + "px";
        },
        stop: function( event, ui ) {
          var top = ui.position.top / _container.clientHeight * 100,
              left = ui.position.left / _container.clientWidth * 100;

          trackEvent.update({
            innerTop: top,
            innerLeft: left
          });
          trackEvent.draggable.edit();
        }
      });

      $( _clone ).resizable({
        handles: "n, ne, e, se, s, sw, w, nw",
        resize: function( event, ui ) {
          trackEvent.popcornTrackEvent.image.style.height = _clone.clientHeight + "px";
          trackEvent.popcornTrackEvent.image.style.width = _clone.clientWidth + "px";
          _clone.style.height = _clone.clientHeight + "px";
          _clone.style.width = _clone.clientWidth + "px";
          trackEvent.popcornTrackEvent.image.style.top = ui.position.top + "px";
          trackEvent.popcornTrackEvent.image.style.left = ui.position.left + "px";
          _clone.style.top = ui.position.top + "px";
          _clone.style.left = ui.position.left + "px";
        },
        stop: function( event, ui ) {
          trackEvent.update({
            innerHeight: _clone.offsetHeight / _container.clientHeight * 100,
            innerWidth: _clone.offsetWidth / _container.clientWidth * 100,
            innerTop: ui.position.top / _container.clientHeight * 100,
            innerLeft: ui.position.left / _container.clientWidth * 100
          });
          trackEvent.draggable.edit();
        }
      });
    }
  });
}( window.Butter, window.VariableDescriptorFactory ));
