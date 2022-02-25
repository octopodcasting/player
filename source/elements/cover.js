import ChaptersElement from './mixins/chapters';
import MediaDelegateElement from './mixins/media-delegate';
import {buildComposite} from '../utilities/composite';

import podcastSvg from '../../assets/podcast.svg';

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
      this.setAttribute('image', url);
    }

    #drawImage(src) {
      if (this.#activeSrc === src) {
        return;
      }

      this.#activeSrc = src;

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
      }
    }

    #renderShadowDom() {
      this.#shadowDom.innerHTML = coverDom;
    }
  };
};

const coverDom = `
  <style>
    :host {
      position: relative;
      display: block;
      overflow: hidden;
      background: #f1f3f4;
      margin: 0 auto;
    }

    .container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .container .images {
      z-index: 2;
      position: relative;
      width: 100%;
      height: 100%;
    }

    .container .images:after {
      /* Keeps .images always in a square aspect ratio */
      content: "";
      display: block;
      padding-bottom: 100%;
    }

    .container .images .cover {
      position: relative;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #f1f3f4;
    }

    .container .images .cover img {
      object-fit: contain;
      width: 100%;
      max-height: 100%;
    }

    .placeholder {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder svg {
      width: 50%;
      height: 50%;
      color: #000000;
    }
  </style>
  <div class="container">
    <div class="images"></div>
    <div class="placeholder">
      ${podcastSvg}
    </div>
  </div>
`;

customElements.define('octopod-cover', buildComposite([
  MediaDelegateElement,
  ChaptersElement,
  OctopodCoverElement,
]));
