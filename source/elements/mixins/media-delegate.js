import {mediaEvents} from '../../utilities/media';

const MediaDelegateElement = function (BaseElement) {
  return class extends BaseElement {
    #internalCurrentTime = 0;

    #internalTargetPlayer = null;

    #targetPlayerListener = null;
    #targetTimeUpdateListener = null;

    constructor() {
      super();

      this.#targetPlayerListener = this.#targetPlayerListenerCallback.bind(this);
      this.#targetTimeUpdateListener = this.#targetTimeUpdateCallback.bind(this);
    }

    get targetPlayer() {
      return this.#internalTargetPlayer;
    }

    set targetPlayer(player) {
      if (this.#internalTargetPlayer) {
        this.#destroyTargetPlayerListeners();
      }

      if (player) {
        this.#internalTargetPlayer = player;

        this.#initializeTargetPlayerListeners();
      }
    }

    get currentTime() {
      return this.#internalCurrentTime;
    }

    set currentTime(timestamp) {
      this.#internalCurrentTime = timestamp;

      this.dispatchEvent(new CustomEvent('timeupdate'));
    }

    #initializeTargetPlayerListeners() {
      mediaEvents.forEach(eventName => {
        this.#internalTargetPlayer.addEventListener(eventName, this.#targetPlayerListener);
      });

      this.#internalTargetPlayer.addEventListener('timeupdate', this.#targetTimeUpdateListener);
    }

    #destroyTargetPlayerListeners() {
      mediaEvents.forEach(eventName => {
        this.#internalTargetPlayer.removeEventListener(eventName, this.#targetPlayerListener);
      });

      this.#internalTargetPlayer.removeEventListener('timeupdate', this.#targetTimeUpdateListener);
    }

    #targetPlayerListenerCallback(sourceEvent) {
      const event = new sourceEvent.constructor(sourceEvent.type, sourceEvent);

      Object.defineProperty(event, 'target', {value: this, enumerable: true});

      this.dispatchEvent(event);
    }

    #targetTimeUpdateCallback() {
      this.#internalCurrentTime = this.#internalTargetPlayer.currentTime;
    }
  };
};

export default MediaDelegateElement;
