import podcastSvg from '../../assets/podcast.svg';

class OctopodCoverElement extends HTMLElement {
  constructor() {
    super();

    this.shadowDom = this.attachShadow({mode: 'closed'});

    this.resizeObserver = null;
    this.canvas = null;
    this.image = null;
    this.chapterImages = [];
    this.activeImage = null;

    this.timestamp = 0;
    this.chapters = null;
    this.activeChapter = null;
  }

  get chaptersUrl() {
    return this.getAttribute('chapters');
  }

  set chaptersUrl(url) {
    this.setAttribute('chapters', url);
  }

  set currentTime(timestamp) {
    this.timestamp = timestamp;

    if (this.chapters) {
      this.activeChapter = this.chapters.findIndex((chapter, index) => {
        return !this.chapters[index + 1] || this.chapters[index + 1].startTime > this.timestamp;
      });

      if (this.chapterImages[this.activeChapter]) {
        this.drawImage(this.chapterImages[this.activeChapter]);

        return;
      }

      const chapter = this.chapters[this.activeChapter];

      if (chapter.img) {
        this.showPlaceholder();

        this.loadImage(chapter.img)
          .then(image => {
            this.chapterImages[this.activeChapter] = image;

            this.drawImage(image);
          })
        ;

        return;
      }
    }

    if (this.image) {
      this.drawImage(this.image);
    }
  }

  get imageUrl() {
    return this.getAttribute('image');
  }

  set imageUrl(url) {
    this.setAttribute('image', url);
  }

  connectedCallback() {
    this.renderShadowDom();

    if (this.imageUrl) {
      this.imageAttributeChangeCallback(null, this.imageUrl);
    }

    if (this.chaptersUrl) {
      this.chaptersAttributeChangeCallback(null, this.chaptersUrl);
    }

    this.resizeObserver = new ResizeObserver(() => this.renderShadowDom());

    this.resizeObserver.observe(this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const callbackMethod = `${name}AttributeChangeCallback`;

    if (this[callbackMethod]) {
      this[callbackMethod](oldValue, newValue);
    }
  }

  imageAttributeChangeCallback(oldValue, newValue) {
    this.image = null;

    this.loadImage(newValue)
      .then(image => {
        this.image = image;

        this.currentTime = this.timestamp;
      })
    ;
  }

  chaptersAttributeChangeCallback(oldValue, newValue) {
    this.chapters = null;
    this.chapterImages = [];

    fetch(newValue)
      .then(response => response.json())
      .then(data => {
        this.chapters = data.chapters;

        this.currentTime = this.timestamp;
      })
    ;
  }

  loadImage(src) {
    return new Promise(resolve => {
      const image = document.createElement('img');

      image.addEventListener('load', () => {
        resolve(image);
      });

      image.src = src;
    });
  }

  drawImage(image, resize = false) {
    if (this.activeImage === image && !resize) {
      return;
    }

    this.activeImage = image;

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

    this.hidePlaceholder();

    this.canvasContext.clearRect(0, 0, canvasSize.x, canvasSize.y);

    this.canvasContext.drawImage(
      image,
      0, 0, sourceSize.x, sourceSize.y,
      destination.x, destination.y, size.x, size.y
    );
  }

  hidePlaceholder() {
    this.shadowDom.querySelector('.placeholder').classList.add('hide');
  }

  showPlaceholder() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shadowDom.querySelector('.placeholder').classList.remove('hide');
  }

  renderShadowDom() {
    this.shadowDom.innerHTML = `
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

    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvasContext = this.canvas.getContext('2d');
    }

    const container = this.shadowDom.querySelector('.container');
    const placeholder = this.shadowDom.querySelector('.placeholder');

    const setSizes = (width, height) => {
      this.canvas.width = width;
      this.canvas.height = height;

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

      if (this.activeImage) {
        this.drawImage(this.activeImage, true);
      }
    };

    setSizes(0, 0);

    const width = +window.getComputedStyle(this).width.replace('px', '');
    let height = +window.getComputedStyle(this).height.replace('px', '');

    if (height === 0) {
      height = width;

      this.style.height = width + 'px';
    }

    setSizes(width, height);

    container.appendChild(this.canvas);
  }
}

const vector = (x, y) => {
  return {x, y};
};

customElements.define('octopod-cover', OctopodCoverElement);
