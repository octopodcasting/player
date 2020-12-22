const mediaEvents = [
  'abort',
  'canplay',
  'canplaythrough',
  'durationchange',
  'emptied',
  'ended',
  'error',
  'interruptbegin',
  'interruptend',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'timeupdate',
  'volumechange',
  'waiting',
];

const MediaWrapperElement = BaseElement => class extends BaseElement {
  constructor() {
    super();

    this.internalPlayer = null;

    this.mediaPlayerListenerCallback = this.mediaPlayerListenerCallback.bind(this);
  }

  get mediaPlayer() {
    return this.internalPlayer;
  }

  set mediaPlayer(player) {
    if (this.internalPlayer) {
      this.destroyMediaPlayerListeners();
    }

    this.internalPlayer = player;

    this.initializeMediaPlayerListeners();
  }

  get currentTime() {
    return this.internalPlayer?.currentTime ?? 0;
  }

  set currentTime(timestamp) {
    if (this.internalPlayer) {
      this.internalPlayer.currentTime = timestamp;
    }
  }

  get duration() {
    return this.internalPlayer?.duration ?? 0;
  }

  get paused() {
    return this.internalPlayer?.paused ?? true;
  }

  get playbackRate() {
    return this.internalPlayer?.playbackRate ?? 1;
  }

  set playbackRate(rate) {
    if (this.internalPlayer) {
      this.internalPlayer.playbackRate = rate;
    }
  }

  get volume() {
    return this.internalPlayer?.volume ?? 1;
  }

  set volume(level) {
    if (this.internalPlayer) {
      this.internalPlayer.volume = level;
    }
  }

  initializeMediaPlayerListeners() {
    mediaEvents.forEach(eventName => {
      this.internalPlayer.addEventListener(eventName, this.mediaPlayerListenerCallback);
    });
  }

  destroyMediaPlayerListeners() {
    mediaEvents.forEach(eventName => {
      this.internalPlayer.removeEventListener(eventName, this.mediaPlayerListenerCallback);
    });
  }

  mediaPlayerListenerCallback(event) {
    const newEvent = new event.constructor(event.type, event);

    Object.defineProperty(newEvent, 'target', {value: this, enumerable: true});

    this.dispatchEvent(newEvent);
  }
};

export default MediaWrapperElement;
