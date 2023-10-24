import ChaptersElement from './components/chapters';
import ControlsElement from './components/controls';
import MediaWrapperElement from './components/media-wrapper';
import {buildComposite} from '../utilities/composite';

import audioPlayerDom from './dom/player-audio.html';
import basePlayerDom from './dom/player-base.html';
import coverPlayerDom from './dom/player-cover.html';

const OctopodPlayerElement = function (BaseElement, composite) {
  return class extends BaseElement {
    #shadowDom = null;

    #cover = null;

    static get observedAttributes() {
      return [
        'chapters',
        'image',
        'mode',
        'src',
      ];
    }

    constructor() {
      super();

      this.#shadowDom = this.attachShadow({mode: 'closed'});

      composite.addConnectedCallback(() => {
        if (!this.hasAttribute('tabindex')) {
          this.setAttribute('tabindex', '0');
        }

        this.#renderShadowDom();
      });

      composite.addAttributeChangedCallback('image', (oldValue, newValue) => {
        if (this.#cover) {
          this.#cover.imageUrl = newValue;
        }
      });

      composite.addAttributeChangedCallback('mode', (oldValue, newValue) => {
        if (!['audio', 'cover'].includes(newValue)) {
          throw new Error(`Invalid display mode: ${newValue}`);
        }

        this.#renderShadowDom();
      });
    }

    get mode() {
      return this.getAttribute('mode') ?? 'audio';
    }

    set mode(mode) {
      if (!mode) {
        this.removeAttribute('mode');
      } else {
        this.setAttribute('mode', mode);
      }
    }

    get imageUrl() {
      return this.getAttribute('image');
    }

    set imageUrl(url) {
      if (!url) {
        this.removeAttribute('image');
      } else {
        this.setAttribute('image', url);
      }
    }

    #renderShadowDom() {
      const select = this.#shadowDom.querySelector.bind(this.#shadowDom);

      this.#shadowDom.innerHTML = basePlayerDom;

      if (this.mode === 'cover') {
        this.#shadowDom.innerHTML += coverPlayerDom;

        if (!this.#cover) {
          this.#cover = document.createElement('octopod-cover');
          this.#cover.setAttribute('slot', 'cover');
          this.#cover.targetPlayer = this;

          this.appendChild(this.#cover);
        }
      } else {
        this.#shadowDom.innerHTML += audioPlayerDom;
      }

      let controlsContainer = select('[data-controls]');

      controlsContainer?.parentNode.replaceChild(this.controlsDom(), controlsContainer);
    }
  };
};

customElements.define('octopod-player', buildComposite([
  MediaWrapperElement,
  ControlsElement,
  ChaptersElement,
  OctopodPlayerElement,
]));
