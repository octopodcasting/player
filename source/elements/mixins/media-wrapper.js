import {mediaEvents} from '../../utilities/media';

const MediaWrapperElement = function (BaseElement) {
  return class extends BaseElement {
    #internalPlayer = null;

    #mediaPlayerListener = null;

    constructor() {
      super();

      this.#mediaPlayerListener = this.#mediaPlayerListenerCallback.bind(this);
    }

    get mediaPlayer() {
      return this.#internalPlayer;
    }

    set mediaPlayer(player) {
      if (this.#internalPlayer) {
        this.#destroyMediaPlayerListeners();
      }

      if (player) {
        this.#internalPlayer = player;

        this.#initializeMediaPlayerListeners();
      }
    }

    get currentTime() {
      return this.#internalPlayer?.currentTime ?? 0;
    }

    set currentTime(timestamp) {
      if (this.#internalPlayer) {
        this.#internalPlayer.currentTime = timestamp;
      }
    }

    get duration() {
      return this.#internalPlayer?.duration ?? 0;
    }

    get paused() {
      return this.#internalPlayer?.paused ?? true;
    }

    get playbackRate() {
      return this.#internalPlayer?.playbackRate ?? 1;
    }

    set playbackRate(rate) {
      if (this.#internalPlayer) {
        this.#internalPlayer.playbackRate = rate;
      }
    }

    get volume() {
      return this.#internalPlayer?.volume ?? 1;
    }

    set volume(level) {
      if (this.#internalPlayer) {
        this.#internalPlayer.volume = level;
      }
    }

    play() {
      if (this.#internalPlayer) {
        this.#internalPlayer.play();
      }
    }

    pause() {
      if (this.#internalPlayer) {
        this.#internalPlayer.pause();
      }
    }

    #initializeMediaPlayerListeners() {
      mediaEvents.forEach(eventName => {
        this.#internalPlayer.addEventListener(eventName, this.#mediaPlayerListener);
      });
    }

    #destroyMediaPlayerListeners() {
      mediaEvents.forEach(eventName => {
        this.#internalPlayer.removeEventListener(eventName, this.#mediaPlayerListener);
      });
    }

    #mediaPlayerListenerCallback(sourceEvent) {
      const event = new sourceEvent.constructor(sourceEvent.type, sourceEvent);

      Object.defineProperty(event, 'target', {value: this, enumerable: true});

      this.dispatchEvent(event);
    }
  };
};

export default MediaWrapperElement;
