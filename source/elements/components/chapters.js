const ChaptersElement = function (BaseElement, composite) {
  return class extends BaseElement {
    #abortController = new AbortController();

    #internalChapters = null;
    #currentChapterIndex = null;
    #currentChaptersUrl = null;
    #fetching = false;

    #timeUpdateListener = null;

    constructor() {
      super();

      this.#timeUpdateListener = this.#timeUpdateCallback.bind(this);

      composite.addAttributeChangedCallback('chapters', (oldValue, newValue) => {
        if (!newValue) {
          this.#loadChapters(null);
        } else {
          this.#fetchChapters(newValue);
        }
      });

      this.addEventListener('timeupdate', this.#timeUpdateListener);
    }

    get chaptersUrl() {
      return this.getAttribute('chapters');
    }

    set chaptersUrl(url) {
      if (!url) {
        this.removeAttribute('chapters');
      } else {
        this.setAttribute('chapters', url);
      }
    }

    get chapters() {
      return this.#internalChapters ?? this.targetPlayer?.chapters ?? null;
    }

    get currentChapter() {
      if (this.#internalChapters === null || this.#currentChapterIndex === null) {
        return this.targetPlayer?.currentChapter ?? null;
      }

      return this.#internalChapters[this.#currentChapterIndex];
    }

    #fetchChapters(url, type) {
      if (type && type !== 'application/json+chapters') {
        console.error(`Unknown chapters format: ${type}`);

        return;
      }

      if (url === this.#currentChaptersUrl) {
        return;
      }

      this.#currentChaptersUrl = url;

      this.#loadChapters(null);

      this.#fetching = true;

      fetch(url, {signal: this.#abortController.signal})
        .then(response => response.json())
        .then(data => {
          this.#fetching = false;

          this.#loadChapters(data.chapters);
        });
    }

    #loadChapters(data) {
      if (this.#fetching) {
        this.#fetching = false;

        this.#abortController.abort();
      }

      this.#internalChapters = data;
      this.#currentChapterIndex = null;

      this.dispatchEvent(new CustomEvent('loadedchapters'));
      this.dispatchEvent(new CustomEvent('chapterupdate'));
    }

    #timeUpdateCallback() {
      if (this.#internalChapters === null) {
        return;
      }

      const newChapterIndex = this.#internalChapters.findIndex((chapter, index) => {
        return !this.#internalChapters[index + 1] || this.#internalChapters[index + 1].startTime > this.currentTime;
      });

      if (newChapterIndex !== this.#currentChapterIndex) {
        this.#currentChapterIndex = newChapterIndex;

        this.dispatchEvent(new CustomEvent('chapterupdate'));
      }
    }
  };
};

export default ChaptersElement;
