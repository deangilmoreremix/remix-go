import { action, observable } from 'mobx';

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
  _video = null;

  constructor(projectData = {}) {
    this.projectData = projectData;
  }

  get elements() {
    return generatePopcornObject(this.projectData).elements;
  }

  get video() {
    return this._video;
  }
  set video(value) {
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
    if (sequencerElement) {
      this.update(sequencerElement, {
        src: [value],
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
                end: 35, // TODO: Put actual video duration
                source: [value],
                fallback: '',
                denied: false,
                from: 0,
                title: 'Plumber', // TODO: Put actual video title
                duration: 35, // TODO: Put actual video duration
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
}

export default Project;
