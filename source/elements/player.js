import ChaptersElement from './components/chapters';
import ControlsElement from './components/controls';
import MediaWrapperElement from './components/media-wrapper';
import {buildComposite} from '../utilities/composite';

import audioPlayerDom from './dom/audio-player.html';
import coverPlayerDom from './dom/cover-player.html';
import playerDom from './dom/player.html';

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
      this.#shadowDom.innerHTML = playerDom;

      if (this.mode === 'cover') {
        this.#shadowDom.innerHTML += coverPlayerDom;
      } else {
        this.#shadowDom.innerHTML += audioPlayerDom;
      }

      const select = this.#shadowDom.querySelector.bind(this.#shadowDom);

      const coverContainer = select('.cover');

      if (!this.#cover) {
        const coverSize = coverContainer ? window.getComputedStyle(coverContainer).width : 0;

        this.#cover = document.createElement('octopod-cover');
        this.#cover.targetPlayer = this;

        this.#cover.style.setProperty('--octopod-cover-size', coverSize);
      }

      coverContainer?.appendChild(this.#cover);

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
