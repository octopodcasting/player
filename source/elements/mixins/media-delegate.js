import {mediaEvents} from '../../utilities/media';

const MediaDelegateElement = function (BaseElement) {
  return class extends BaseElement {
    #internalTargetPlayer = null;

    #targetPlayerListener = null;

    constructor() {
      super();

      this.#targetPlayerListener = this.#targetPlayerListenerCallback.bind(this);
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

    #initializeTargetPlayerListeners() {
      mediaEvents.forEach(eventName => {
        this.#internalTargetPlayer.addEventListener(eventName, this.#targetPlayerListener);
      });
    }

    #destroyTargetPlayerListeners() {
      mediaEvents.forEach(eventName => {
        this.#internalTargetPlayer.removeEventListener(eventName, this.#targetPlayerListener);
      });
    }

    #targetPlayerListenerCallback(sourceEvent) {
      const event = new sourceEvent.constructor(sourceEvent.type, sourceEvent);

      Object.defineProperty(event, 'target', {value: this, enumerable: true});

      this.dispatchEvent(event);
    }
  };
};

export default MediaDelegateElement;
