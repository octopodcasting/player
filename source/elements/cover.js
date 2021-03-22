import ChaptersElement from './mixins/chapters';
import MediaDelegateElement from './mixins/media-delegate';
import {buildComposite} from '../utilities/composite';

import podcastSvg from '../../assets/podcast.svg';

const fadeInDurationMs = 350;

const OctopodCoverElement = function (BaseElement, composite) {
  return class extends BaseElement {
    #currentImageUrl = null;
    #imageCache = {};

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
      });

      composite.addAttributeChangedCallback('image', (oldValue, newValue) => {
        this.#redraw();
      });

      this.addEventListener('chapterupdate', this.#chapterUpdateListener);
    }

    get imageUrl() {
      return this.getAttribute('image') ?? this.targetPlayer?.imageUrl ?? null;
    }

    set imageUrl(url) {
      this.setAttribute('image', url);
    }

    #loadImage(src) {
      return new Promise(resolve => {
        if (this.#imageCache[src]) {
          resolve(this.#imageCache[src]);
        }

        const image = document.createElement('img');

        image.addEventListener('load', () => {
          this.#imageCache[src] = image;

          if (this.#currentImageUrl === src) {
            resolve(image);
          } else {
            resolve(null);
          }
        });

        image.src = src;
      });
    }

    #drawImage(src, force = false) {
      if (!force && this.#currentImageUrl === src) {
        return;
      }

      this.#currentImageUrl = src;

      this.#loadImage(src).then(image => {
        if (image) {
          this.#doDrawImage(image);
        }
      });
    }

    #doDrawImage(image) {
      const imageElement = document.createElement("img");
      imageElement.src = image.src;

      const oldImagesToRemove = [
        ...this.#shadowDom.querySelectorAll(".images img"),
      ];

      // Add new image
      this.#shadowDom.querySelector(".images").appendChild(imageElement);

      setTimeout(() => {
        // Remove any images that aren't at the front
        oldImagesToRemove.forEach((oldImage) => oldImage.remove());
      }, fadeInDurationMs);
    }

    #redraw(force = false) {
      const chapter = this.currentChapter;

      if (chapter && chapter.img) {
        this.#drawImage(chapter.img, force);
      } else if (this.imageUrl) {
        this.#drawImage(this.imageUrl, force);
      }
    }

    #renderShadowDom() {
      this.#shadowDom.innerHTML = coverDom;
      this.#redraw();
    }

  };
};

const coverDom = `
  <style type="text/css">
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
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .container .images:after {
      /* Keeps .images always in a square aspect ratio */
      content: "";
      display: block;
      padding-bottom: 100%;
    }

    .container .images img {
      object-fit: contain;
      width: 100%;
      max-height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      animation: fadeIn ${fadeInDurationMs}ms;
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
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
