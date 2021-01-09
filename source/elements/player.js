import ChaptersElement from './mixins/chapters';
import ControlsElement from './mixins/controls';
import MediaWrapperElement from './mixins/media-wrapper';
import {buildComposite} from '../utilities/composite';

import audioPlayerDom from './player/audio-player.html';
import baseDom from './player/base.html';
import coverPlayerDom from './player/cover-player.html';

const OctopodPlayerElement = function (BaseElement) {
  return class extends BaseElement {
    #shadowDom = null;

    #cover = null;

    static get observedAttributes() {
      return [
        'mode',
        'src',
      ];
    }

    constructor() {
      super();

      this.#shadowDom = this.attachShadow({mode: 'closed'});

      this.addConnectedCallback(() => {
        if (!this.hasAttribute('tabindex')) {
          this.setAttribute('tabindex', '0');
        }

        this.#renderShadowDom();
      });

      this.addAttributeChangedCallback('mode', (oldValue, newValue) => {
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
      return this.setAttribute('mode', mode);
    }

    get imageUrl() {
      return this.getAttribute('image');
    }

    set imageUrl(url) {
      this.setAttribute('image', url);
    }

    #renderShadowDom() {
      this.#shadowDom.innerHTML = baseDom;

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
        this.#cover.style.width = coverSize;
        this.#cover.style.height = coverSize;
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
