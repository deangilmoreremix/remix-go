import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { observer } from 'mobx-react';

import PropTypes from '../../../../lib/PropTypes';
import ConstructionScene from './construction/ConstructionScene';
import CheckpointsList from './construction/CheckpointsList';

const samplePopcornData = { targets: [{ id: 'Target0', name: 'video-container', element: 'video-container' }], media: [{ id: 'Media0', name: 'Media0', url: '#t=,41', target: 'video', duration: 41, popcornOptions: { frameAnimation: true, framerate: 120 }, controls: true, tracks: [{ name: '', id: '0', order: 0, trackEvents: [{ id: '1.0657919038338906', type: 'form', popcornOptions: { start: 39.08, end: 40.94, target: 'video-container', zindex: 1000, caption: 'Find Out More', elements: [{ type: 'singleline', label: 'Name', token: 'NAME' }, { type: 'email', label: 'Email', token: 'EMAIL' }, { type: 'singleline', label: 'Mobile', token: 'MOBILE' }], webhookEnabled: false, webhook: '', verifyWebhook: '', emailEnabled: false, emailAddress: '', padding: 5, fontFamily: 'Lato', fontSize: '110', fontColor: '#030303', backgroundColor: '#eb5054', scripts: '', id: '1.0657919038338906', position: 'middle' }, track: '0', name: '1.0657919038338906' }] }, { name: '', id: '1', order: 1, trackEvents: [{ id: '3.329154137767298', type: 'text', popcornOptions: { start: 0, end: 5, left: 0, top: 50.00191972781213, text: 'Welcome To Your New Home', linkUrl: '', linkTarget: '_blank', position: 'custom', alignment: 'center', transition: 'popcorn-fade', fontFamily: 'Raleway', fontSize: '7', fontColor: '#ffffff', shadow: false, shadowColor: '#444444', background: false, backgroundColor: '#888888', fontDecorations: { bold: false, italics: false }, width: 99.79910727529106, zindex: 999, target: 'video-container', rotation: 0, stroke: false, strokeColor: '#000000', height: 10, scripts: '', id: '3.329154137767298' }, track: '1', name: '3.329154137767298' }, { id: '1.6473139910495311', type: 'pausePlugin', popcornOptions: { start: 40.3, end: 41, target: 'video-container', duration: '0', id: '1.6473139910495311' }, track: '1', name: '1.6473139910495311' }] }, { name: '', id: '2', order: 2, trackEvents: [{ id: '4.188625861820314', type: 'text', popcornOptions: { start: 0, end: 5, left: 0, top: 41.015399592398886, text: '{{up FIRSTNAME}}', linkUrl: '', linkTarget: '_blank', position: 'custom', alignment: 'center', transition: 'popcorn-fade', fontFamily: 'Raleway', fontSize: '9', fontColor: '#ffffff', shadow: false, shadowColor: '#444444', background: false, backgroundColor: '#888888', fontDecorations: { bold: true, italics: false }, width: 99.79910727529106, zindex: 998, target: 'video-container', rotation: 0, stroke: false, strokeColor: '#000000', height: 10, scripts: '', id: '4.188625861820314' }, track: '2', name: '4.188625861820314' }] }, { name: '', id: '3', order: 3, trackEvents: [{ id: '5.711551387130163', type: 'image', popcornOptions: { src: 'https://cdn.vidcloud.io/events/blur_bg_title_overlay/blur_bg_title_overlay.svg', width: 100, height: 100, top: 0, left: 0, innerTop: 0, innerLeft: 0, innerWidth: 0, innerHeight: 0, transition: 'popcorn-fade', zindex: 997, target: 'video-container', start: 0, end: 5, linkSrc: '', tags: 'Mozilla', photosetId: 'http://www.flickr.com/photos/etherworks/sets/72157630563520740/', count: 3, title: '', rotation: 0, scripts: '', id: '5.711551387130163' }, track: '3', name: '5.711551387130163' }] }, { name: '', id: '4', order: 4, trackEvents: [{ id: '6.260054083063013', type: 'text', popcornOptions: { start: 8.96, end: 13.96, text: 'Style Perfectly Designed To Give You Bright Areas', linkUrl: '', linkTarget: '_blank', position: 'custom', alignment: 'center', transition: 'popcorn-fade', fontFamily: 'Lato', fontSize: '7', fontColor: '#f1f4f1', shadow: false, shadowColor: '#444444', background: false, backgroundColor: '#888888', fontDecorations: { bold: false, italics: false }, left: 13.067065938125888, top: 41.815604798285335, width: 73.54891399459427, zindex: 996, target: 'video-container', rotation: 0, stroke: false, strokeColor: '#000000', height: 17.25723372627649, scripts: '', id: '6.260054083063013' }, track: '4', name: '6.260054083063013' }] }, { name: '', id: '5', order: 5, trackEvents: [{ id: '7.017177641519959', type: 'image', popcornOptions: { src: 'https://cdn.vidcloud.io/events/center_overlay_band/center_overlay_band.svg', width: 100, height: 100, top: 0, left: 0, innerTop: 0, innerLeft: 0, innerWidth: 0, innerHeight: 0, transition: 'popcorn-fade', zindex: 995, target: 'video-container', start: 8.96, end: 13.96, linkSrc: '', tags: 'Mozilla', photosetId: 'http://www.flickr.com/photos/etherworks/sets/72157630563520740/', count: 3, title: '', rotation: 0, scripts: '', id: '7.017177641519959' }, track: '5', name: '7.017177641519959' }] }, { name: '', id: '6', order: 6, trackEvents: [] }, { name: '', id: '7', order: 7, trackEvents: [] }, { name: '', id: '8', order: 8, trackEvents: [{ id: '10.150499934842127', type: 'text', popcornOptions: { start: 22.17, end: 27.17, text: '3 Bedrooms\n2 Bathrooms\n1 Fitness Room\n1 Terrace\n1 Pool', linkUrl: '', linkTarget: '_blank', position: 'custom', alignment: 'center', transition: 'popcorn-fade', fontFamily: 'Lato', fontSize: '7', fontColor: '#f1f4f1', shadow: false, shadowColor: '#444444', background: false, backgroundColor: '#888888', fontDecorations: { bold: false, italics: false }, left: 8.960273786143466, top: 28.762056210460813, width: 82.00049517207229, zindex: 992, target: 'video-container', rotation: 0, stroke: false, strokeColor: '#000000', height: 10, scripts: '', id: '10.150499934842127' }, track: '8', name: '10.150499934842127' }] }, { name: '', id: '9', order: 9, trackEvents: [{ id: '11.108147472663543', type: 'image', popcornOptions: { src: 'https://cdn.vidcloud.io/events/center_overlay_band/center_overlay_band.svg', width: 100, height: 100, top: 0, left: 0, innerTop: 0, innerLeft: 0, innerWidth: 0, innerHeight: 0, transition: 'popcorn-fade', zindex: 991, target: 'video-container', start: 22.21, end: 27.21, linkSrc: '', tags: 'Mozilla', photosetId: 'http://www.flickr.com/photos/etherworks/sets/72157630563520740/', count: 3, title: '', rotation: 0, scripts: '', id: '11.108147472663543' }, track: '9', name: '11.108147472663543' }] }, { name: '', id: '10', order: 10, trackEvents: [] }, { name: '', id: '11', order: 11, trackEvents: [] }, { name: '', id: '12', order: 12, trackEvents: [{ id: '14.163845615276445', type: 'image', popcornOptions: { src: 'https://cdn.vidcloud.io/events/blur_bg_title_overlay/blur_bg_title_overlay.svg', width: 100, height: 100, top: 0, left: 0, innerTop: 0, innerLeft: 0, innerWidth: 0, innerHeight: 0, transition: 'popcorn-fade', zindex: 988, target: 'video-container', start: 38.37, end: 41, linkSrc: '', tags: 'Mozilla', photosetId: 'http://www.flickr.com/photos/etherworks/sets/72157630563520740/', count: 3, title: '', rotation: 0, scripts: '', id: '14.163845615276445' }, track: '12', name: '14.163845615276445' }] }, { name: '', id: '13', order: 13, trackEvents: [{ id: '1.5820839546020447', type: 'sequencer', popcornOptions: { source: ['http://www.youtube.com/watch?v=_IkTTTMp0a4'], fallback: '', denied: false, start: 0, end: 41, type: 'YouTube', thumbnailSrc: 'https://i.ytimg.com/vi/_IkTTTMp0a4/mqdefault.jpg', from: 33, title: '7 Bedroom House for sale in Kwazulu Natal | Dolphin Coast | Ballito | Sheffield Beach | |', duration: 523.1209999999998, linkback: '', contentType: '', hidden: false, target: 'video-container', mobile: true, width: 100, height: 100, top: -0.6637397587029419, left: 0, volume: 100, mute: false, zindex: 987, scripts: '', id: '1.5820839546020447' }, track: '13', name: '1.5820839546020447' }] }], clipData: { 'http://www.youtube.com/watch?v=_IkTTTMp0a4': { source: 'http://www.youtube.com/watch?v=_IkTTTMp0a4', title: '7 Bedroom House for sale in Kwazulu Natal | Dolphin Coast | Ballito | Sheffield Beach | |', type: 'YouTube', thumbnail: 'https://i.ytimg.com/vi/_IkTTTMp0a4/sddefault.jpg', author: 'Private Property', duration: 523.1209999999998 } }, currentTime: 39.14 }], allowFacebook: true, thumbnailWidth: 640, thumbnailHeight: 480 };

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


@observer
export default class ConstructionWorkspace extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    popcornData: null,
  };

  render() {
    const { className } = this.props;
    const popcornData = generatePopcornObject(samplePopcornData);
    return (
      <Container className={`construction-workspace ${className || ''}`}>
        <ConstructionScene popcornData={popcornData} />
        <CheckpointsList popcornData={popcornData} className="construction-thumbnails" />
      </Container>
    );
  }
}
