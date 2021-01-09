import ChaptersElement from './mixins/chapters';
import MediaDelegateElement from './mixins/media-delegate';
import {buildComposite} from '../utilities/composite';

import podcastSvg from '../../assets/podcast.svg';

function vector(x, y) {
  return {x, y};
}

const OctopodCoverElement = function (BaseElement) {
  return class extends BaseElement {
    #coverImageUrl = null;
    #currentImageUrl = null;
    #imageCache = {};

    #shadowDom = null;

    #canvas = null;
    #canvasContext = null;
    #resizeObserver = null;

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

      this.addConnectedCallback(() => {
        this.#canvas = document.createElement('canvas');
        this.#canvasContext = this.#canvas.getContext('2d');

        this.#resizeObserver = new ResizeObserver(() => this.#resize());
        this.#resizeObserver.observe(this);

        this.#renderShadowDom();
      });

      this.addAttributeChangedCallback('image', (oldValue, newValue) => {
        this.#coverImageUrl = newValue;

        if (this.#canvas) {
          this.#redraw();
        }
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

    #drawImage(src) {
      if (this.#currentImageUrl === src) {
        return;
      }

      this.#showPlaceholder();

      this.#currentImageUrl = src;

      this.#loadImage(src).then(image => {
        if (image) {
          this.#doDrawImage(image);
        }
      });
    }

    #doDrawImage(image) {
      const rect = this.getBoundingClientRect();

      const canvasSize = vector(rect.width, rect.height);
      const sourceSize = vector(image.width, image.height);

      const destination = vector(0, 0);
      const size = {...canvasSize};

      const ratio = sourceSize.x / sourceSize.y;
      const targetWidth = canvasSize.y * ratio;

      if (canvasSize.x >= targetWidth) {
        // Resized image fits width of container
        size.x = targetWidth;
        destination.x = canvasSize.x / 2 - size.x / 2;
      } else {
        // Resized image doesn't fit width of container
        size.y = canvasSize.x / ratio;
        destination.y = canvasSize.y / 2 - size.y / 2;
      }

      this.#hidePlaceholder();

      this.#canvasContext.clearRect(0, 0, canvasSize.x, canvasSize.y);

      this.#canvasContext.drawImage(
        image,
        0, 0, sourceSize.x, sourceSize.y,
        destination.x, destination.y, size.x, size.y
      );
    }

    #hidePlaceholder() {
      this.#shadowDom.querySelector('.placeholder').classList.add('hide');
    }

    #showPlaceholder() {
      this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

      this.#shadowDom.querySelector('.placeholder').classList.remove('hide');
    }

    #redraw() {
      const chapter = this.currentChapter;

      if (chapter && chapter.img) {
        this.#drawImage(chapter.img);
      } else if (this.imageUrl) {
        this.#drawImage(this.imageUrl);
      } else {
        this.#showPlaceholder();
      }
    }

    #resize() {
      const container = this.#shadowDom.querySelector('.container');
      const placeholder = this.#shadowDom.querySelector('.placeholder');

      const setSizes = (width, height) => {
        this.#canvas.width = width;
        this.#canvas.height = height;

        const placeholderSize = Math.min(width, height);

        placeholder.style.width = placeholderSize === 0 ? '0' : placeholderSize + 'px';
        placeholder.style.height = placeholderSize === 0 ? '0' : placeholderSize + 'px';
        placeholder.style.top = null;
        placeholder.style.left = null;

        if (height > width) {
          placeholder.style.top = ((height - width) / 2) + 'px';
        } else if (height < width) {
          placeholder.style.left = ((width - height) / 2) + 'px';
        }
      };

      container.style.height = null;
      setSizes(0, 0);

      const width = +window.getComputedStyle(this).width.replace('px', '');
      let height = +window.getComputedStyle(this).height.replace('px', '');

      if (height === 0) {
        height = width;

        container.style.height = width + 'px';
      }

      setSizes(width, height);

      this.#redraw();
    }

    #renderShadowDom() {
      this.#shadowDom.innerHTML = `
        <style type="text/css">
          :host {
            position: relative;
            display: block;
            overflow: hidden;
            width: 360px;
            background: #f1f3f4;
          }

          .container, .reference {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .reference {
            z-index: -1;
          }

          .placeholder, canvas {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: block;
            width: 100%;
            height: 100%;
          }

          .placeholder.hide {
            display: none;
          }

          .placeholder svg {
            margin: 25% 28%;
            color: #000000;
          }
        </style>
        <div class="container">
          <div class="placeholder">
            ${podcastSvg}
          </div>
        </div>
      `;

      this.#shadowDom.querySelector('.container').appendChild(this.#canvas);

      this.#resize();
    }
  };
};

customElements.define('octopod-cover', buildComposite([
  MediaDelegateElement,
  ChaptersElement,
  OctopodCoverElement,
]));
