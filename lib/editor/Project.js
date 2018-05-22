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
      // mediaPopcornOptions: mediaPopcornOptions,
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
  _video = null;

  constructor(make = {}, isSource) {
    this.name = make.title;
    this.description = make.description;
    this.thumbnail = make.thumbnail;
    this.modified = false;
    if (isSource) {
      this.source = make._id;
    }
    this.projectData = JSON.parse(make.project.data);
  }

  get elements() {
    return generatePopcornObject(this.projectData).elements;
  }

  get video() {
    return this._video;
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
    const videoMeta = await this.videTypeDetector.getMetadata(value);
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
    this._video = value;
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
    return null;
  }
  set cta(value) {

  }

  @action
  popcornify(target) {
    const popcornData = generatePopcornObject(this.projectData);
    return window.Popcorn.smart(target,
      popcornData.mediaUrlsString, popcornData.mediaPopcornOptions);
  }

  @action
  attach(popcorn, target) {
    generatePopcornObject(this.projectData).elements.forEach((element) => {
      popcorn[element.type](target ?
        Object.assign({}, element.popcornOptions, { target }) :
        element.popcornOptions);
    });
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

  promptUnsavedChanges() {
    return (() => confirm('Leave with unsaved change?'));
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
