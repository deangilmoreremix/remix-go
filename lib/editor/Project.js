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

  constructor(projectData = {}) {
    this.projectData = projectData;
  }

  get elements() {
    return generatePopcornObject(this.projectData).elements;
  }

  get video() {
    return null;
  }
  set video(value) {
  }

  get audio() {
    return null;
  }
  set audio(value) {
  }

  get script() {
    return null;
  }
  set script(value) {

  }

  get cta() {
    return null;
  }
  set cta(value) {

  }

  popcornify(target) {
    const popcornData = generatePopcornObject(this.projectData);
    return window.Popcorn.smart(target,
      popcornData.mediaUrlsString, popcornData.mediaPopcornOptions);
  }

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
