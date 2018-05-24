

const { extendObservable } = require('mobx');

function isSafari() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1) {
    return ua.indexOf('chrome') === -1;
  }
  return false;
}

// PLUGIN: IMAGE
// Key
(function (Popcorn) {
  let APIKEY = '&api_key=b939e5bd8aa696db965888a31b2f1964',
    flickrUrl = 'https://secure.flickr.com/services/',
    searchPhotosCmd = `${flickrUrl}rest/?method=flickr.photos.search&extras=url_m&media=photos&safe_search=1`,
    getPhotosetCmd = `${flickrUrl}rest/?method=flickr.photosets.getPhotos&extras=url_m&media=photos`,
    getPhotoSizesCmd = `${flickrUrl}rest/?method=flickr.photos.getSizes`,
    jsonBits = '&format=json&jsoncallback=flickr',
    FLICKR_SINGLE_CHECK = 'flickr.com/photos/',
    PER_PAGE_MAX = 100,
    urlRegex = /[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,
    logoUrlMeta = document.querySelector('meta[property="logo"]');

  function searchImagesFlickr(tags, count, userId, ready) {
    let uri = `${searchPhotosCmd + APIKEY}&page=1&per_page=${PER_PAGE_MAX}`;
    if (userId && typeof userId !== 'function') {
      uri += `&user_id=${userId}`;
    }
    if (tags) {
      uri += `&tags=${window.encodeURIComponent(tags)}`;
    }
    uri += jsonBits;
    Popcorn.getJSONP(uri, (data) => {
      const callback = ready || userId;

      callback(data, uri);
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

  function getPhotoSet(photosetId, ready, pluginInstance) {
    let photoSplit,
      ln,
      url,
      uri,
      i;

    /* Allow for a direct gallery URL to be passed or just a gallery ID. This will accept:
     *
     * http://www.flickr.com/photos/etherworks/sets/72157630563520740/
     * or
     * 72157630563520740
     */
    if (isNaN(photosetId)) {
      if (photosetId.indexOf('flickr.com') === -1) {
        pluginInstance.emit('invalid-flickr-image');
        return;
      }

      photoSplit = photosetId.split('/');

      // Can't always look for the ID in the same spot depending if the user includes the
      // last slash
      for (i = 0, ln = photoSplit.length; i < ln; i++) {
        url = photoSplit[i];
        if (!isNaN(url) && url !== '') {
          photosetId = url;
          break;
        }
      }
    }

    uri = `${getPhotosetCmd}&photoset_id=${photosetId}&per_page=${PER_PAGE_MAX}${APIKEY}${jsonBits}`;
    Popcorn.getJSONP(uri, (data) => {
      ready(data, uri);
    });
  }

  function calculateInOutTimes(start, duration, count) {
    let inArr = [],
      i = 0,
      last = start,
      interval = duration / count;

    while (i < count) {
      inArr.push({
        in: last = Math.round((start + (interval * i++)) * 100) / 100,
        out: i < count ? Math.round((last + interval) * 100) / 100 : start + duration,
      });
    }
    return inArr;
  }

  function validateDimension(value, fallback) {
    if (typeof value === 'number') {
      return value;
    }
    return fallback;
  }

  function createImageDiv(imageUrl, linkUrl, instance) {
    let imageDiv = document.createElement('div'),
      link = document.createElement('a');

    imageDiv.style.backgroundImage = `url( "${imageUrl}" )`;
    imageDiv.classList.add('image-plugin-img');

    if (linkUrl && linkUrl.match(urlRegex)) {
      link.setAttribute('href', linkUrl);

      link.onclick = function () {
        instance && instance.media.pause();
      };
    }
    link.setAttribute('target', '_blank');
    link.classList.add('image-plugin-link');

    link.appendChild(imageDiv);
    return link;
  }

  Popcorn.plugin('image', {

    _setup(options) {
      let _target,
        _container,
        _flickrCallback,
        _link,
        _image,
        _this = this;

      function setupImageDiv() {
        _container.appendChild(_link);
        _image = _link.querySelector('.image-plugin-img');
        _image.style.left = `${validateDimension(options.innerLeft, '0')}%`;
        _image.style.top = `${validateDimension(options.innerTop, '0')}%`;
        if (options.innerHeight) {
          _image.style.height = `${validateDimension(options.innerHeight, '0')}%`;
        }
        if (options.innerWidth) {
          _image.style.width = `${validateDimension(options.innerWidth, '0')}%`;
        }
        options.link = _link;
        options.image = _image;
      }

      options._target = _target = Popcorn.dom.find(options.target);
      options._container = _container = document.createElement('div');

      _container.addEventListener('click', () => {
        _this.emit('elementSelected', {
          element: options,
        });
      });

      _container.classList.add('image-plugin-container');
      _container.style.width = `${validateDimension(options.width, '100')}%`;
      _container.style.height = `${validateDimension(options.height, '100')}%`;
      _container.style.top = `${validateDimension(options.top, '0')}%`;
      _container.style.left = `${validateDimension(options.left, '0')}%`;
      _container.style.zIndex = +options.zindex;
      _container.classList.add(options.transition);
      _container.classList.add('off');

      const rotation = options.rotation || 0;
      _container.style.transform
        = _container.style['-webkit-transform']
        = _container.style['-moz-transform']
        = _container.style['-ms-transform']
        = `rotate(${rotation}deg)`;

      if (_target) {
        _target.appendChild(_container);

        if (options.src) {
          if (options.src.indexOf(FLICKR_SINGLE_CHECK) > -1) {
            let url = options.src,
              urlSplit,
              uri,
              ln,
              _flickrStaticImage,
              photoId,
              i;

            urlSplit = url.split('/');

            for (i = 0, ln = urlSplit.length; i < ln; i++) {
              url = urlSplit[i];
              if (!isNaN(url) && url !== '') {
                photoId = url;
                break;
              }
            }

            uri = `${getPhotoSizesCmd + APIKEY}&photo_id=${photoId}${jsonBits}`;


            _flickrStaticImage = function (data) {
              if (data.stat === 'ok') {
                // Unfortunately not all requests contain an "Original" size option
                // so I'm always taking the second last one. This has it's upsides and downsides
                _link = createImageDiv(data.sizes.size[data.sizes.size.length - 2].source, options.linkSrc, _this);
                setupImageDiv();
              }
            };

            Popcorn.getJSONP(uri, _flickrStaticImage);
          } else if (options.dropData && options.dropData.files && options.dropData.files[0]) {
            options.src = undefined;
          } else {
            _link = createImageDiv(options.src, options.linkSrc, _this);
            setupImageDiv();
          }
        } else {
          let _inOuts = [],
            _lastVisible,
            _tagRefs = [];

          options._updateImage = function () {
            let io,
              ref,
              currTime = _this.currentTime(),
              i = _tagRefs.length - 1;
            for (; i >= 0; i--) {
              io = _inOuts[i];
              ref = _tagRefs[i];
              if (io && currTime >= io.in && currTime < io.out && ref.classList.contains('image-plugin-hidden')) {
                if (_lastVisible) {
                  _lastVisible.classList.add('image-plugin-hidden');
                }
                ref.classList.remove('image-plugin-hidden');
                _lastVisible = ref;
                break;
              }
            }
          };

          _flickrCallback = function (data, url) {
            let _collection = (data.photos || data.photoset),
              _photos,
              _url,
              _totalPhotos,
              item;

            if (!_collection) {
              return;
            }

            _totalPhotos = _collection.total;
            _photos = _collection.photo;

            if (!_photos) {
              return;
            }

            for (let i = 0; i < _photos.length; i++) {
              if (options.count > _tagRefs.length) {
                item = _photos[i];
                _url = (item.media && item.media.m) || window.unescape(item.url_m);
                _link = createImageDiv(_url, _url, _this);
                _link.classList.add('image-plugin-hidden');
                _container.insertBefore(_link, _container.children[i]);
                _tagRefs.push(_link);
              } else {
                break;
              }
            }

            if (_tagRefs.length < options.count && _collection.page !== _collection.pages && _photos.length === PER_PAGE_MAX) {
              url = url.replace(/\&per\_page\=[0-9]+/, '');
              url += `&per_page=${_collection.page}${1}`;

              Popcorn.getJSONP(url, (data) => {
                _flickrCallback(data, url);
              });
            } else {
              _inOuts = calculateInOutTimes(options.start, options.end - options.start, _tagRefs.length);

              if (!_tagRefs.length) {
                _this.emit('popcorn-image-failed-retrieve');
                return;
              }

              if (options.count !== _tagRefs.length) {
                options.count = _tagRefs.length;
                // Used to sync back the new count data with Butter Events
                _this.emit('popcorn-image-count-update', options.count);
              }

              // Check if should be currently visible
              options._updateImage();

              //  Check if should be updating
              if (_this.currentTime() >= options.start && _this.currentTime() <= options.end) {
                _this.on('timeupdate', options._updateImage);
              }
            }
          };

          if (options.tags) {
            searchImagesFlickr(options.tags, options.count || 10, _flickrCallback);
          } else if (options.photosetId) {
            getPhotoSet(options.photosetId, _flickrCallback, _this);
          }
        }

        options.toString = function () {
          let _splitSource = [];
          if (options.title) {
            return options.title;
          } else if (/^data:/.test(options.src)) {
            // might ba a data URI
            return `${options.src.substring(0, 30)}...`;
          } else if (options.src) {
            _splitSource = options.src.split('/');
            return _splitSource[_splitSource.length - 1];
          } else if (options.tags) {
            return options.tags;
          } else if (options.photosetId) {
            return options.photosetId;
          }

          return 'Image Plugin';
        };
      }

      buildScripts(options);
      extendObservable(options, {
        src: options.src,
      });
    },

    start(event, options) {
      if (!isSafari()) {
        let container = options._container,
          redrawBug;

        if (container) {
          if (options._updateImage) {
            this.on('timeupdate', options._updateImage);
          }

          container.classList.add('on');
          container.classList.remove('off');

          // Safari Redraw hack - #3066
          const safariHack = function () {
            container.style.display = 'none';
            redrawBug = container.offsetHeight;
            container.style.display = '';
          };

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
      } else {
        setTimeout(function () {
          let container = options._container,
            redrawBug;

          if (container) {
            if (options._updateImage) {
              this.on('timeupdate', options._updateImage);
            }

            container.classList.add('on');
            container.classList.remove('off');

            // Safari Redraw hack - #3066
            const safariHack = function () {
              container.style.display = 'none';
              redrawBug = container.offsetHeight;
              container.style.display = '';
            };

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
        }, 430);
      }
    },

    _update(trackEvent, options) {
      if ((options.hasOwnProperty('src') && options.src !== trackEvent.src) ||
        (options.hasOwnProperty('linkSrc') && options.linkSrc !== trackEvent.linkSrc)) {
        if (options.hasOwnProperty('src')) {
          trackEvent.src = options.src;
        }
        if (options.hasOwnProperty('linkSrc')) {
          trackEvent.linkSrc = options.linkSrc;
        }
        trackEvent._container.removeChild(trackEvent._container.querySelector('.image-plugin-link'));
        const _link = createImageDiv(trackEvent.src, trackEvent.linkSrc, null);
        trackEvent._container.appendChild(_link);
        const _image = _link.querySelector('.image-plugin-img');
        _image.style.left = `${validateDimension(trackEvent.innerLeft, '0')}%`;
        _image.style.top = `${validateDimension(trackEvent.innerTop, '0')}%`;
        if (trackEvent.innerHeight) {
          _image.style.height = `${validateDimension(trackEvent.innerHeight, '0')}%`;
        }
        if (trackEvent.innerWidth) {
          _image.style.width = `${validateDimension(trackEvent.innerWidth, '0')}%`;
        }
        trackEvent.link = _link;
        trackEvent.image = _image;
      }

      if (options.hasOwnProperty('innerLeft') && options.innerLeft !== trackEvent.innerLeft) {
        trackEvent.innerLeft = options.innerLeft;
        trackEvent.image.style.left = `${validateDimension(options.innerLeft, '0')}%`;
      }

      if (options.hasOwnProperty('innerTop') && options.innerTop !== trackEvent.innerTop) {
        trackEvent.innerTop = options.innerTop;
        trackEvent.image.style.top = `${validateDimension(options.innerTop, '0')}%`;
      }

      if (options.hasOwnProperty('innerHeight') && options.innerHeight !== trackEvent.innerHeight) {
        trackEvent.innerHeight = options.innerHeight;
        trackEvent.image.style.height = `${validateDimension(options.innerHeight, '0')}%`;
      }

      if (options.hasOwnProperty('innerWidth') && options.innerWidth !== trackEvent.innerWidth) {
        trackEvent.innerWidth = options.innerWidth;
        trackEvent.image.style.width = `${validateDimension(options.innerWidth, '0')}%`;
      }

      if (options.hasOwnProperty('width') && options.width !== trackEvent.width) {
        trackEvent.width = options.width;
        trackEvent._container.style.width = `${validateDimension(options.width, '100')}%`;
      }

      if (options.hasOwnProperty('height') && options.height !== trackEvent.height) {
        trackEvent.height = options.height;
        trackEvent._container.style.height = `${validateDimension(options.height, '100')}%`;
      }

      if (options.hasOwnProperty('top') && options.top !== trackEvent.top) {
        trackEvent.top = options.top;
        trackEvent._container.style.top = `${validateDimension(options.top, '0')}%`;
      }

      if (options.hasOwnProperty('left') && options.left !== trackEvent.left) {
        trackEvent.left = options.left;
        trackEvent._container.style.left = `${validateDimension(options.left, '0')}%`;
      }

      if (options.hasOwnProperty('zindex') && options.zindex !== trackEvent.zindex) {
        trackEvent.zindex = options.zindex;
        trackEvent._container.style.zIndex = +options.zindex;
      }
      if (options.hasOwnProperty('transition') && options.transition !== trackEvent.transition) {
        trackEvent.transition = options.transition;
        trackEvent._container.classList.add(options.transition);
      }

      if (options.hasOwnProperty('rotation') && options.rotation !== trackEvent.rotation) {
        trackEvent.rotation = options.rotation;
        trackEvent._container.style.transform
          = trackEvent._container.style['-webkit-transform']
          = trackEvent._container.style['-moz-transform']
          = trackEvent._container.style['-ms-transform']
          = `rotate(${options.rotation || 0}deg)`;
      }

      if (options.hasOwnProperty('title') && options.title !== trackEvent.title) {
        trackEvent.title = options.title;
      }
    },

    end(event, options) {
      if (!isSafari()) {
        if (options._container) {
          if (options._updateImage) {
            this.off('timeupdate', options._updateImage);
          }

          options._container.classList.add('off');
          options._container.classList.remove('on');
        }

        buildScripts(options);
        if (options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd) {
          options.scripts._compiled.onEnd();
        }
      } else {
        setTimeout(function () {
          if (options._container) {
            if (options._updateImage) {
              this.off('timeupdate', options._updateImage);
            }

            options._container.classList.add('off');
            options._container.classList.remove('on');
          }

          buildScripts(options);
          if (options.scripts && options.scripts._compiled && options.scripts._compiled.onEnd) {
            options.scripts._compiled.onEnd();
          }
        }, 430);
      }
    },

    _teardown(options) {
      if (options._updateImage) {
        this.off(options._updateImage);
      }
      options._container.parentNode.removeChild(options._container);
      delete options._container;
    },

    manifest: {
      about: {
        name: 'Popcorn image Plugin',
        version: '0.1',
        author: 'cadecairos',
        website: 'https://chrisdecairos.ca/',
      },
      options: {
        target: 'video-overlay',
        src: {
          elem: 'input',
          type: 'url',
          label: 'Source URL',
          default: logoUrlMeta ? logoUrlMeta.content : '',
          FLICKR_SINGLE_CHECK,
        },
        linkSrc: {
          elem: 'input',
          type: 'url',
          label: 'Link URL',
          validation: urlRegex,
        },
        tags: {
          elem: 'input',
          type: 'text',
          label: 'Flickr: Tags',
          optional: true,
          default: '',
        },
        photosetId: {
          elem: 'input',
          type: 'text',
          label: 'Flickr: Photoset Id',
          optional: true,
          default: '',
        },
        count: {
          elem: 'input',
          type: 'number',
          label: 'Flickr: Count',
          optional: true,
          default: 3,
          MAX_COUNT: 20,
        },
        width: {
          elem: 'input',
          type: 'number',
          label: 'Width',
          default: 100,
          units: '%',
          hidden: true,
        },
        height: {
          elem: 'input',
          type: 'number',
          label: 'Height',
          default: 100,
          units: '%',
          hidden: true,
        },
        top: {
          elem: 'input',
          type: 'number',
          label: 'Top',
          default: 0,
          units: '%',
          hidden: true,
        },
        left: {
          elem: 'input',
          type: 'number',
          label: 'Left',
          default: 0,
          units: '%',
          hidden: true,
        },
        innerTop: {
          elem: 'input',
          type: 'number',
          default: 0,
          units: '%',
          hidden: true,
        },
        innerLeft: {
          elem: 'input',
          type: 'number',
          default: 0,
          units: '%',
          hidden: true,
        },
        innerWidth: {
          elem: 'input',
          type: 'number',
          default: 0,
          units: '%',
          hidden: true,
        },
        innerHeight: {
          elem: 'input',
          type: 'number',
          default: 0,
          units: '%',
          hidden: true,
        },
        title: {
          elem: 'input',
          type: 'text',
          label: 'Image Title',
          default: '',
        },
        transition: {
          elem: 'select',
          options: ['None', 'Pop', 'Slide Up', 'Slide Down', 'Fade', 'Fade In', 'Pan & Zoom', 'Fade In Up'],
          values: ['popcorn-none', 'popcorn-pop', 'popcorn-slide-up', 'popcorn-slide-down', 'popcorn-fade',
            'popcorn-fade-in', 'popcorn-pan-zoom', 'popcorn-fade-in-up'],
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
        start: {
          elem: 'input',
          type: 'text',
          label: 'Start',
          units: 'seconds',
        },
        end: {
          elem: 'input',
          type: 'text',
          label: 'End',
          units: 'seconds',
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
  });
}(window.Popcorn));
