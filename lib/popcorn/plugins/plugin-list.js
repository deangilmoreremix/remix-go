/* This Source Code Form is subject to the terms of the MIT license
 * If a copy of the MIT license was not distributed with this file, you can
 * obtain one at https://raw.github.com/mozilla/butter/master/LICENSE */

define( [ "localized", "util/dragndrop", "util/lang", "util/mediatypes", "editor/editor", "analytics",
          "l10n!/layouts/plugin-list-editor.html" ],
  function( Localized, DragNDrop, LangUtils, MediaUtils, Editor, analytics, EDITOR_LAYOUT ) {

  return function( butter ) {

    var adminAccess = {
        isAvailable: function() {
          return butter.app.cornfield.isWlAdmin();
        }
    };

    function checkAccess (featureName) {
      return {
        isAvailable: function () {
          return butter.app.cornfield.isAvailableFeature(featureName);
        },
        isUpgradable: function () {
          return butter.app.cornfield.isUpgradableFeature(featureName);
        },
        featureName: featureName
      };
    }
    
    var defaultAvailability = {
      isAvailable: true
    };
    var featureAvailability = {
      text: defaultAvailability,
      seethroughtext: defaultAvailability,
      popup: defaultAvailability,
      googlemap: adminAccess,
      image: defaultAvailability,
      loopPlugin: defaultAvailability,
      skip: defaultAvailability,
      pausePlugin: defaultAvailability,
      wikipedia: adminAccess,
      form: adminAccess,
      sketchfab: adminAccess,
      sequencer: defaultAvailability,
      combined: checkAccess('comboElements'),
      personalizedImage: {
        isAvailable: function () {
          var personalizer360 =
            !window.Butter.app.cornfield.isAvailableFeature('personalizer') &&
            window.Butter.app.cornfield.isAvailableFeature('op360');
          var personalizerStandard =
            window.Butter.app.cornfield.isAvailableFeature('personalizer') &&
            !window.Butter.app.cornfield.isAvailableFeature('op360') &&
            !window.Butter.app.cornfield.isAvailableFeature('video360');
          var personalizerBoth = (
            window.Butter.app.cornfield.isAvailableFeature('personalizer') &&
            !window.Butter.app.cornfield.isAvailableFeature('owp360')
          ) || (
            window.Butter.app.cornfield.isAvailableFeature('personalizer') &&
            window.Butter.app.cornfield.isAvailableFeature('owp360') &&
            (
              window.Butter.app.cornfield.isAvailableFeature('op360') ||
              window.Butter.app.cornfield.isAvailableFeature('video360')
            )
          );
          return personalizerBoth ||
            (personalizer360 && !window.Butter.app.hasVideoTypes(window.MediaUtils.featuredSourceTypes('personalizer'))) ||
            (personalizerStandard && !window.Butter.app.hasVideoTypes(window.MediaUtils.featuredSourceTypes('owp360'))) ||
            ((personalizerBoth || personalizer360 || personalizerStandard) && !window.Butter.app.hasActiveSequencers());
        }
      },
      social: checkAccess('socialFbElement')
    };

    var _parentElement = LangUtils.domFragment( EDITOR_LAYOUT, ".plugin-list-editor" ),
        _containerElement = _parentElement.querySelector( ".plugin-container" ),
        _targets = butter.targets,
        _iframeCovers = document.querySelectorAll( ".butter-iframe-fix" );

    var _pluginArchetype = _containerElement.querySelector( ".butter-plugin-tile" );
    _pluginArchetype.parentNode.removeChild( _pluginArchetype );

    Editor.register( "plugin-list", null, function( rootElement, butter ) {
      rootElement = _parentElement;

      Editor.BaseEditor.extend( this, butter, rootElement, {
        open: function() {
        },
        close: function() {
        }
      });
    }, true );

    butter.listen( "pluginadded", function( e ) {
      var element = _pluginArchetype.cloneNode( true ),
          iconImg = e.data.helper,
          icon = element.querySelector( ".butter-plugin-icon" ),
          text = element.querySelector( ".butter-plugin-label" ),
          pluginName = e.data.name,
          pluginType = e.data.type;

      DragNDrop.helper( element, {
        id: e.data.type,
        aliases: e.data.draggable,
        start: function() {
          for ( var i = 0, l = _targets.length; i < l; ++i ) {
            _targets[ i ].view.blink();
            _iframeCovers[ i ].style.display = "block";
          }
        },
        stop: function() {
          butter.currentMedia.pause();
          for ( var i = 0, l = _targets.length; i < l; ++i ) {
            _iframeCovers[ i ].style.display = "none";
          }
        }
      });

      function checkAvailability () {
        var isAvailable;
        var isUpgradable;
        if (typeof featureAvailability[pluginType].isAvailable === 'function') {
          isAvailable = featureAvailability[pluginType].isAvailable();
        } else {
          isAvailable = featureAvailability[pluginType].isAvailable;
        }

        if (typeof featureAvailability[pluginType].isUpgradable === 'function') {
          isUpgradable = featureAvailability[pluginType].isUpgradable();
        } else {
          isUpgradable = featureAvailability[pluginType].isUpgradable;
        }

        return {
          isAvailable: isAvailable,
          isUpgradable: isUpgradable
        };
      }

      function onClick( clickEvent ) {
        var availability = checkAvailability();

        if ( butter.currentMedia.ready ) {
          if (availability.isAvailable) {
            butter.deselectAllTrackEvents();
            butter.generateSafeTrackEvent({
              type: e.data.type,
              popcornOptions: {
                start: butter.currentTime
              }
            }, function( trackEvent ) {
              analytics.event( "Track Event Added", {
                label: "clicked"
              });
              if ( clickEvent.shiftKey ) {
                butter.currentTime = trackEvent.popcornOptions.end;
              } else {
                butter.editor.editTrackEvent( trackEvent );
              }
            });
          } else if (availability.isUpgradable) {
            return butter.app.showUpgradeDialog({
              link: butter.app.cornfield.getFeatureUpgradeLink(featureAvailability[pluginType].featureName),
              featureName: featureAvailability[pluginType].featureName
            });
          }
        }
      }

      function onDrag() {
        var availability = checkAvailability();

        if (availability.isUpgradable) {
          return butter.app.showUpgradeDialog({
            link: butter.app.cornfield.getFeatureUpgradeLink(featureAvailability[pluginType].featureName),
            featureName: featureAvailability[pluginType].featureName
          });
        }
      }

      element.addEventListener( "click", onClick );
      element.addEventListener( "drag", onDrag );

      if ( iconImg ) {
        icon.style.backgroundImage = "url('" + iconImg.src + "')";
      }

      text.innerHTML = Localized.get( pluginName );

      element.setAttribute( "data-popcorn-plugin-type", e.data.type );
      element.setAttribute( "data-butter-draggable-type", "plugin" );

      if ( e.data.hidden ) {
        element.style.display = "none";
      }

      butter.listen( "authenticated", function() {
        var availability = checkAvailability();
        if (availability.isAvailable || availability.isUpgradable) {
          _containerElement.appendChild(element);
        }
      });
    });

  };
});
