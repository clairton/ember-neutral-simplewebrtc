import Ember from 'ember';
import Service from 'ember-service';
import Evented from 'ember-evented';
import SimpleWebRTC from 'simplewebrtc';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Service.extend(Evented, {
  rtcManager: null,
  localMedia: null,
  connectionReady: false,

  init() {
    this._super(...arguments);

    const rtcManager = new SimpleWebRTC({
      localVideoEl: 'localVideo',
      remoteVideosEl: 'remoteVideos',
      nick: 'Me',
      debug: false,
      autoRequestMedia: true,
      autoAdjustMic: false
    });

    rtcManager.on('connectionReady', () => set(this, 'connectionReady', true));
    rtcManager.on('message', this.trigger.bind(this));
    rtcManager.webrtc.on('peerStreamAdded', this.videoAdded.bind(this));
    rtcManager.webrtc.on('peerStreamRemoved', this.videoRemoved.bind(this));

    set(this, 'rtcManager', rtcManager);

    this.on('localMediaStarted', this.connectToRoom.bind(this));
  },

  joinRoom(room, media) {
    get(this, 'rtcManager').webrtc.startLocalVideo(media, (err, stream) => {
      if (err) {
        Ember.Logger.error('[Error]:', err);

        this.trigger('mediaError', err);
      } else {
        set(this, 'localMedia', stream);

        this.trigger('localMediaStarted', room, stream);
      }
    });
  },

  leaveRoom() {
    get(this, 'localMedia').getTracks().forEach(t => t.stop());
    get(this, 'rtcManager').leaveRoom(get(this, 'activeRoom'));
    set(this, 'activeRoom', false);
  },

  connectToRoom(room, stream) {
    const activeRoom = get(this, 'activeRoom');
    const webrtc = get(this, 'rtcManager');

    if (!stream || stream === activeRoom) return;

    if (activeRoom) webrtc.leaveRoom(activeRoom);

    get(this, 'rtcManager').joinRoom(room);
  },

  videoAdded(peer) {
    let user = get(this, 'currentUser.user');

    user.set('peer', peer);

    this.trigger('videoAdded', user);
  },

  videoRemoved() {
    let user = get(this, 'currentUser.user');

    user.set('peer', null);

    this.trigger('videoRemoved', user);
  }
});
