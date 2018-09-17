import Route from 'ember-route';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Route.extend({
  webrtc: service(),

  init() {
    const webrtc = get(this, 'webrtc');

    webrtc.on('readyToCall', () => {
      webrtc.joinRoom('bejuster');
    });
  }
});
