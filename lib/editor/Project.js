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

class Project {
  static EditableElementTypes = [
    'text', 'seethroughtext', 'image', 'personalizedImage',
  ];

  @observable
  projectData = {};

  @observable
  name = null;

  @observable
  description = null;

  @observable
  thumbnail = null;

  @observable
  source = null;

  @observable
  make = null;

  @observable
  activeElement = null;

  @observable
  usedWizard = null;


  @observable
  _cta = null;

  @observable
  _engines = [];

  constructor(make = {}) {
    this.name = make.title;
    this.description = make.description;
    this.thumbnail = make.thumbnail;
    this.modified = false;
    this.projectData = JSON.parse(make.project.data);
    this.make = make;
    this.videoTypeDetector = new MediaTypeDetector();
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
          if (trackEvent.type === 'sequencer' && !sequencerElement) {
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

  async updateVideo(value) {
    let sequencerElement = null;
    this.projectData.media.forEach((media) => {
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type === 'sequencer' && !sequencerElement) {
            sequencerElement = trackEvent;
          }
        });
      });
    });
    const videoMeta = await this.videoTypeDetector.getMetadata(value);
    if (sequencerElement) {
      this.update(sequencerElement, {
        src: [value],
        end: videoMeta.duration,
        title: videoMeta.title,
        duration: videoMeta.duration,
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
                start: 0,
                end: videoMeta.duration,
                source: [value],
                fallback: '',
                denied: false,
                from: 0,
                title: videoMeta.title,
                duration: videoMeta.duration,
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
    this.recompressProject(videoMeta.duration);
  }

  recompressProject(newDuration) {
    this.projectData.media.forEach((media) => {
      if (media.duration === newDuration) {
        return;
      }
      const recompressRatio = newDuration / media.duration;
      media.duration = newDuration;
      media.src = `#t=,${media.duration}`;
      media.tracks.forEach((track) => {
        track.trackEvents.forEach((trackEvent) => {
          if (trackEvent.type !== 'sequencer') {
            trackEvent.popcornOptions.start *= recompressRatio;
            trackEvent.popcornOptions.end *= recompressRatio;
          }
        });
      });
    });
  }

  get audio() {
    return null;
  }
  set audio(value) {
  }

  get cta() {
    return this._cta;
  }
  set cta(value) {
    const ctaCheckpoint = this.checkpoints.pop();
    const { elements: ctaElements } = value;

    this._engines.forEach((popcorn) => {
      this.projectData.media.forEach((media) => {
        media.tracks.forEach((track) => {
          track.trackEvents = track.trackEvents.filter(
            element => element.popcornOptions.start !== ctaCheckpoint,
          );
        });

        popcorn.data.trackEvents.byStart
          .filter(element => element.start === ctaCheckpoint)
          .forEach(element => popcorn.removeTrackEvent(element.id));

        ctaElements.forEach((element, trackId) => {
          const elementId = `${trackId}.${Math.random()}`;
          const options = _.omit(element.popcornOptions, ['id', 'start', 'end']);
          Object.assign(options, {
            id: elementId,
            start: ctaCheckpoint,
            end: ctaCheckpoint + (element.popcornOptions.end - element.popcornOptions.start),
            target: popcorn.target || element.popcornOptions.target,
          });
          media.tracks[0].trackEvents.push({
            id: elementId,
            name: elementId,
            track: media.tracks[0].id,
            type: element.type,
            popcornOptions: options,
          });
          popcorn[element.type](options);
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
    this._engines.push(popcorn);
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
  serialize() {
    return {
      data: JSON.stringify(this.projectData),
      name: this.name,
      description: this.description,
      thumbnail: this.thumbnail,
      remixedFrom: this.source,
    };
  }
}

export default Project;
