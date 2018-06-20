/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import { action, observable } from 'mobx';
import MediaTypeDetector from '../popcorn/util/mediaTypeDetector';

const generatePopcornObject = (projectData) => {
  let popcornObject = {};

  projectData.media.forEach((currentMedia) => {
    // We expect a string (one url) or an array of url strings.
    // Turn a single url into an array of 1 string.
    const mediaUrls = typeof currentMedia.url === 'string' ? [currentMedia.url] : currentMedia.url;
    const mediaUrlsString = `[ '${mediaUrls.join('', '')}' ]`;

    const mediaPopcornOptions = currentMedia.popcornOptions || {};
    // Force the Popcorn instance we generate to have an ID we can query.
    mediaPopcornOptions.id = 'Butter-Generated';

    const popcornData = {
      target: currentMedia.target,
      mediaUrlsString,
      elements: [],
    };

    currentMedia.tracks.forEach((currentTrack) => {
      currentTrack.trackEvents.forEach((currentTrackEvent) => {
        popcornData.elements.push({
          type: currentTrackEvent.type,
          popcornOptions: currentTrackEvent.popcornOptions,
        });
      });
    });
    popcornObject = popcornData;
  });

  return popcornObject;
};

const trailisePauseElements = (projectData) => {
  projectData.media.forEach((media) => {
    media.tracks.forEach((track) => {
      track.trackEvents.forEach((trackEvent) => {
        if (trackEvent.type === 'pausePlugin') {
          trackEvent.popcornOptions.start = media.duration - 0.3;
          trackEvent.popcornOptions.end = media.duration;
        }
      });
    });
  });
  return projectData;
};

class Project {
  static EditableElementTypes = [
    'text', 'seethroughtext', 'image', 'personalizedImage',
  ];

  @observable
  version = Math.random();

  @observable
  projectData = {};

  @observable
  name = null;

  @observable
  description = null;

  @observable
  source = null;

  @observable
  make = null;

  @observable
  activeElement = null;

  @observable
  usedWizard = null;

  @observable
  currentCheckpoint = 0;

  @observable
  _cta = null;

  @observable
  engines = [];

  set thumbnail(value) {
    this.projectData.thumbnail = value;
  }

  get thumbnail() {
    return this.projectData.thumbnail;
  }

  get stopOnCta() {
    let result = false;
    this.elements.forEach(({ type }) => {
      if (type === 'pausePlugin') {
        result = true;
      }
    });
    return result;
  }

  set stopOnCta(value) {
    if (value) {
      this.add({
        type: 'pausePlugin',
        popcornOptions: {
          start: this.projectData.media[0].duration - 0.3,
          end: this.projectData.media[0].duration,
          target: 'video-container',
          duration: 0,
        },
      });
    } else {
      this.projectData.media.forEach((media) => {
        media.tracks.forEach((track) => {
          track.trackEvents
            .filter(({ type }) => type === 'pausePlugin')
            .forEach(element => this.remove(element));
        });
      });
    }
  }

  constructor(make = {}) {
    this.projectData = trailisePauseElements(JSON.parse(make.project.data));
    this.projectData.allowFacebook = true;
    this.name = make.title;
    this.description = make.description;
    this.modified = true;
    this.thumbnail = make.thumbnail;
    this.make = make;
    this.mediaTypeDetector = new MediaTypeDetector();
  }

  static fromTemplate(makeTemplate = {}, isSource) {
    const result = new Project(makeTemplate);
    result.make = null;
    if (isSource) {
      this.source = makeTemplate._id;
    }
    return result;
  }

  get popcornObject() {
    return generatePopcornObject(this.projectData);
  }

  get elements() {
    return generatePopcornObject(this.projectData).elements;
  }

  get checkpoints() {
    const result = [];
    this.elements.forEach(({ type, popcornOptions: { start } }) => {
      // correction to trunc useless tail of number
      start = (Math.round(start * 100) / 100);
      if (result.indexOf(start) === -1 && Project.EditableElementTypes.indexOf(type) !== -1) {
        result.push(start);
      }
    });
    return result.sort((a, b) => a - b);
  }

  get video() {
    let sequencerElement = null;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type === 'sequencer' &&
            trackEvent.popcornOptions.subtype !== 'audio' && !sequencerElement) {
            sequencerElement = trackEvent;
          }
        });
      });
    });
    if (!sequencerElement) {
      return null;
    }
    return sequencerElement.popcornOptions.source[0];
  }

  async updateVideo(value, trimming) {
    const videoMeta = await this.mediaTypeDetector.getMetadata(value);
    let sequencerElement = null;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type === 'sequencer' &&
            trackEvent.popcornOptions.subtype !== 'audio' && !sequencerElement) {
            sequencerElement = trackEvent;
          }
        });
      });
    });
    if (sequencerElement) {
      this.update(sequencerElement, {
        source: [value],
        type: videoMeta.type,
        title: videoMeta.title,
        from: trimming ? trimming.min : 0,
        end: (trimming ? trimming.max : videoMeta.duration) - (trimming ? trimming.min : 0),
        duration: videoMeta.duration,
      });
    } else {
      this.projectData.media.forEach((media) => {
        if (media.tracks.length > 0) {
          const elementId = `${media.tracks.length}.${Math.random()}`;
          media.tracks.push({
            name: `${media.tracks.length}`,
            id: `${media.tracks.length}`,
            order: media.tracks.length,
            trackEvents: [{
              id: elementId,
              type: 'sequencer',
              popcornOptions: {
                start: 0,
                source: [value],
                fallback: '',
                denied: false,
                from: trimming ? trimming.min : 0,
                end: (trimming ? trimming.max : videoMeta.duration) - (trimming ? trimming.min : 0),
                title: videoMeta.title,
                duration: videoMeta.duration,
                type: videoMeta.type,
                hidden: false,
                target: 'video-container',
                mobile: true,
                width: 100,
                height: 100,
                top: 0,
                left: 0,
                volume: 100,
                mute: false,
                zindex: 1000 - media.tracks.length,
                id: elementId,
              },
              track: `${media.tracks.length}`,
              name: elementId,
            }],
          });
        }
      });
    }
    this.recompressProject(trimming ? (trimming.max - trimming.min) : videoMeta.duration);
  }

  recompressProject(newDuration) {
    this.projectData.media.forEach((media) => {
      const initialDuration = media.duration;
      if (initialDuration === newDuration) {
        return;
      }
      media.duration = newDuration;
      media.url = `#t=,${media.duration}`;
      const recompressRatio = newDuration / initialDuration;
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type !== 'sequencer') {
            trackEvent.popcornOptions.start *= recompressRatio;
            trackEvent.popcornOptions.end *= recompressRatio;
          }
        });
      });
    });
    this.projectData = trailisePauseElements(this.projectData);
  }

  get audio() {
    let sequencerElement = null;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type === 'sequencer' &&
            trackEvent.popcornOptions.subtype === 'audio' && !sequencerElement) {
            sequencerElement = trackEvent;
          }
        });
      });
    });
    if (!sequencerElement) {
      return null;
    }
    return sequencerElement.popcornOptions.source[0];
  }

  async updateAudio(value) {
    let videoElement = null;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type === 'sequencer' &&
            trackEvent.popcornOptions.subtype !== 'audio' && !videoElement) {
            videoElement = trackEvent;
            videoElement.popcornOptions.mute = !!value;
          }
        });
      });
    });
    if (!value) {
      return;
    }
    const audioMeta = await this.mediaTypeDetector.getMetadata(value);
    let sequencerElement = null;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type === 'sequencer' &&
            trackEvent.popcornOptions.subtype === 'audio' && !sequencerElement) {
            sequencerElement = trackEvent;
          }
        });
      });
    });
    if (sequencerElement) {
      this.update(sequencerElement, {
        source: [value],
        type: audioMeta.type,
        end: audioMeta.duration,
        title: audioMeta.title,
        duration: audioMeta.duration,
      });
    } else {
      this.projectData.media.forEach((media) => {
        if (media.tracks.length > 0) {
          const elementId = `${media.tracks.length}.${Math.random()}`;
          media.tracks.push({
            name: '',
            id: `${media.tracks.length}`,
            order: media.tracks.length,
            trackEvents: [{
              id: elementId,
              type: 'sequencer',
              popcornOptions: {
                start: videoElement.popcornOptions.start,
                subtype: 'audio',
                end: videoElement.popcornOptions.end,
                source: [value],
                fallback: '',
                denied: false,
                from: 0,
                title: audioMeta.title,
                duration: audioMeta.duration,
                type: audioMeta.type,
                hidden: false,
                target: 'video-container',
                mobile: true,
                width: 100,
                height: 100,
                top: 0,
                left: 0,
                volume: 100,
                mute: false,
                zindex: 1000 - media.tracks.length,
                id: elementId,
              },
              track: `${media.tracks.length}`,
              name: elementId,
            }],
          });
        }
      });
    }
  }

  get cta() {
    return this._cta;
  }
  set cta(value) {
    const ctaCheckpoint = this.checkpoints.pop();
    const { elements: ctaElements } = value;

    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents = track.trackEvents.filter(
          element => (Math.round(element.popcornOptions.start * 100) / 100) !== ctaCheckpoint,
        );
      });

      this.engines.forEach((popcorn) => {
        popcorn.data.trackEvents.byStart
          .filter(element => (Math.round(element.start * 100) / 100) === ctaCheckpoint)
          .forEach(element => popcorn.removeTrackEvent(element.id));
      });

      const minCtaZIndex = ctaElements
        .map(element => element.popcornOptions.zindex)
        .filter(element => element)
        .sort()[0];
      const videoIndex = this.elements
        .find(element => element.type === 'sequencer')
        .popcornOptions.zindex;
      const zindexShifting = minCtaZIndex <= videoIndex ? (videoIndex - minCtaZIndex) + 1 : 0;
      ctaElements.forEach((element, trackId) => {
        if (element.type === 'pausePlugin') {
          return;
        }
        const elementId = `${trackId}.${Math.random()}`;
        const options = _.omit(element.popcornOptions, ['id', 'start', 'end']);
        Object.assign(options, {
          id: elementId,
          start: ctaCheckpoint,
          end: Math.min(
            ctaCheckpoint + (element.popcornOptions.end - element.popcornOptions.start),
            media.duration,
          ),
          target: element.popcornOptions.target,
          zindex: options.zindex + zindexShifting,
        });
        media.tracks[0].trackEvents.push({
          id: elementId,
          name: elementId,
          track: media.tracks[0].id,
          type: element.type,
          popcornOptions: options,
        });

        this.engines.forEach((popcorn) => {
          popcorn[element.type](Object.assign({}, options, { target: popcorn.target }));
        });
      });
    });

    this._cta = value;
  }

  get personalizations() {
    const processElement = (str, item) => {
      if (item.type === 'personalizedImage') {
        str = `${str} ${item.popcornOptions.src}`;
      }
      if (item.popcornOptions.text !== undefined) {
        str = `${str} ${item.popcornOptions.text.replace(/uppercase /g, '').replace(/up /g, '')}`;
        const regexVars = item.popcornOptions.text.match(/{{(.*?)}}/g);
        if (regexVars) {
          regexVars.forEach((varItem) => {
            const regexMatches = varItem.match(/'(.[^']*)'/);
            if (regexMatches) {
              str = `${str} {{${regexMatches[1]}}}`;
            }
          });
        }
      }
      return str;
    };

    const getCustomVarsFromStr = (str) => {
      const list = [];

      const matches = str.match(/{{\s?[\w\s]*\s?}}/g);

      if (matches !== null) {
        matches.forEach((x) => {
          const getMatch = x.match(/\{\{([^}]+)\}\}/);
          if (getMatch) {
            const key = getMatch[1];
            if (list.indexOf(key) < 0) {
              list.push(key);
            }
          }
        });
      }
      return list;
    };

    const { media } = this.projectData;
    if (media.length > 0) {
      let str = '';
      media.forEach((currentMedia) => {
        currentMedia.tracks.forEach((track) => {
          track.trackEvents.forEach((element) => {
            str = processElement(str, element);
          });
        });
      });
      return getCustomVarsFromStr(str);
    } else {
      return [];
    }
  }

  @action
  popcornify(target) {
    const popcornData = generatePopcornObject(this.projectData);
    const popcorn = window.Popcorn.smart(target,
      popcornData.mediaUrlsString, popcornData.mediaPopcornOptions);
    popcorn.seek = (at) => {
      popcorn.currentTime(at + 0.01);
    };
    this.engines.push(popcorn);
    return popcorn;
  }

  @action
  attach(popcorn, target) {
    generatePopcornObject(this.projectData).elements.forEach((element) => {
      popcorn[element.type](target ?
        Object.assign({}, element.popcornOptions, { target }) :
        element.popcornOptions);
    });
    popcorn.target = target;
    return popcorn;
  }

  @action
  detach(popcorn) {
    popcorn.data.trackEvents.byStart
      .forEach(element => popcorn.removeTrackEvent(element.id));
    return popcorn;
  }

  @action
  add(element) {
    this.modified = true;
    const elementId = `0.${Math.random()}`;
    Object.assign(element.popcornOptions, {
      id: elementId,
    });
    Object.assign(element, {
      id: elementId,
      name: elementId,
      track: '0',
    });
    this.projectData.media.forEach((media) => {
      media.tracks[0].trackEvents.push(element);
    });
    this.engines.forEach((popcorn) => {
      popcorn[element.type](popcorn.target ?
        Object.assign({}, element.popcornOptions, { target: popcorn.target }) :
        element.popcornOptions);
    });
  }

  @action
  update(element, options) {
    this.modified = true;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.id === element.id) {
            Object.assign(trackEvent.popcornOptions, options);
          }
        });
      });
    });
  }

  @action
  remove(element) {
    this.modified = true;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents = track.trackEvents.filter(trackEvent => trackEvent.id !== element.id);
      });
    });
    this.engines.forEach(popcorn => popcorn.removeTrackEvent(element.id));
  }

  @action
  serialize() {
    return {
      data: JSON.stringify(this.projectData),
      name: this.name,
      editor: 'go',
      description: this.description,
      thumbnail: this.thumbnail,
      source: this.source,
    };
  }
}

export default Project;
