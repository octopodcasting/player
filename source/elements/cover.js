import ChaptersElement from './components/chapters';
import MediaDelegateElement from './components/media-delegate';
import {buildComposite} from '../utilities/composite';
import {render} from '../utilities/template';

import coverDom from './dom/cover.html';

const OctopodCoverElement = function (BaseElement, composite) {
  return class extends BaseElement {
    #activeSrc = null;

    #shadowDom = null;

    #chapterUpdateListener = null;

    static get observedAttributes() {
      return [
        'chapters',
        'image',
      ];
    }

    constructor() {
      super();

      this.#shadowDom = this.attachShadow({mode: 'closed'});

      this.#chapterUpdateListener = () => this.#redraw();

      composite.addConnectedCallback(() => {
        this.#renderShadowDom();

        composite.addAttributeChangedCallback('image', () => this.#redraw());

        this.addEventListener('chapterupdate', this.#chapterUpdateListener);

        setTimeout(() => this.#redraw());
      });
    }

    get imageUrl() {
      return this.getAttribute('image') ?? this.targetPlayer?.imageUrl ?? null;
    }

    set imageUrl(url) {
      if (!url) {
        this.removeAttribute('image');
      } else {
        this.setAttribute('image', url);
      }
    }

    #drawImage(src) {
      if (this.#activeSrc === src) {
        return;
      }

      this.#activeSrc = src;

      if (!src) {
        const existingImages = [...this.#shadowDom.querySelectorAll('.images .cover')];

        setTimeout(() => existingImages.forEach(existingImage => existingImage.remove()));

        return;
      }

      const containerElement = document.createElement('div');
      containerElement.classList.add('cover');

      const imageElement = document.createElement('img');
      imageElement.src = src;

      containerElement.appendChild(imageElement);

      imageElement.addEventListener('load', () => {
        const existingImages = [...this.#shadowDom.querySelectorAll('.images .cover')];

        this.#shadowDom.querySelector('.images').appendChild(containerElement);

        setTimeout(() => existingImages.forEach(existingImage => existingImage.remove()));
      });
    }

    #redraw() {
      const chapter = this.currentChapter;

      if (chapter && chapter.img) {
        this.#drawImage(chapter.img);
      } else if (this.imageUrl) {
        this.#drawImage(this.imageUrl);
      } else {
        this.#drawImage(null);
      }
    }

    #renderShadowDom() {
      this.#shadowDom.innerHTML = render(coverDom);
    }
  };
};

customElements.define('octopod-cover', buildComposite([
  MediaDelegateElement,
  ChaptersElement,
  OctopodCoverElement,
]));
