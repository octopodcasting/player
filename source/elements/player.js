import pauseSvg from '../../assets/pause.svg';
import playSvg from '../../assets/play.svg';
import {formatTime} from '../utilities/time';

import audioPlayerDom from './player/audio-player.html';
import baseDom from './player/base.html';
import controlsDom from './player/controls-dom.js';
import coverPlayerDom from './player/cover-player.html';
import MediaWrapperElement from './player/media-wrapper';

const BaseElement = MediaWrapperElement(HTMLElement);

class OctopodPlayerElement extends BaseElement {
  constructor() {
    super();

    this.shadowDom = this.attachShadow({mode: 'closed'});

    this.cover = null;
  }

  get chaptersUrl() {
    return this.getAttribute('chapters');
  }

  set chaptersUrl(url) {
    this.setAttribute('chapters', url);
  }

  get mode() {
    return this.getAttribute('mode') ?? 'audio';
  }

  set mode(mode) {
    if (!['audio', 'cover'].includes(mode)) {
      console.error(`Invalid display mode: ${mode}`);
    }

    return this.setAttribute('mode', mode);
  }

  get imageUrl() {
    return this.getAttribute('image');
  }

  set imageUrl(url) {
    this.setAttribute('image', url);
  }

  connectedCallback() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    this.renderShadowDom();
  }

  playButtonSvg() {
    return this.paused ? playSvg : pauseSvg;
  }

  renderShadowDom() {
    this.shadowDom.innerHTML = baseDom;

    if (this.mode === 'cover') {
      this.shadowDom.innerHTML += coverPlayerDom;
    } else {
      this.shadowDom.innerHTML += audioPlayerDom;
    }

    const select = this.shadowDom.querySelector.bind(this.shadowDom);
    const selectAll = this.shadowDom.querySelectorAll.bind(this.shadowDom);

    select('.controls').innerHTML = controlsDom;

    selectAll('button').forEach(button => {
      button.tabIndex = -1;
      button.addEventListener('mousedown', event => {
        event.preventDefault();

        this.focus();
      });
    });

    const playButton = select('.button.play');
    const progressContainer = select('.controls > .progress');
    const progressIndicator = select('.controls > .progress .progress-indicator');
    const volumeContainer = select('.button.volume .progress');
    const volumeIndicator = select('.button.volume .progress-indicator');

    if (!this.mediaPlayer) {
      this.mediaPlayer = document.createElement('audio');
      this.mediaPlayer.src = this.getAttribute('src');

      this.addEventListener('durationchange', () => {
        select('.timestamp-duration').innerHTML = formatTime(this.duration);
      });

      this.addEventListener('timeupdate', () => {
        this.cover.currentTime = this.currentTime;
        select('.timestamp-current').innerHTML = formatTime(this.currentTime);

        const rect = progressContainer.getBoundingClientRect();
        const indicatorRect = progressIndicator.getBoundingClientRect();

        const width = rect.width - indicatorRect.width;
        const percentage = ((this.currentTime / this.duration) * 100) || 0;
        const widthValue = ((percentage * width / 100) + (indicatorRect.width / 2)) + 'px';

        let playedValue = widthValue;
        if (this.currentTime === 0) {
          playedValue = '0';
        } else if (this.currentTime === this.duration) {
          playedValue = '100%';
        }

        progressIndicator.style.left = widthValue;
        select('.progress-played').style.width = playedValue;
      });

      this.addEventListener('volumechange', () => {
        const rect = volumeContainer.getBoundingClientRect();
        const indicatorRect = volumeIndicator.getBoundingClientRect();

        const width = rect.width - indicatorRect.width;
        const widthValue = ((this.volume * width) + (indicatorRect.width / 2)) + 'px';

        let playedValue = widthValue;
        if (this.volume === 0) {
          playedValue = '0';
        } else if (this.volume === 1) {
          playedValue = '100%';
        }

        volumeIndicator.style.left = widthValue;
        select('.button.volume .progress-played').style.width = playedValue;
      });

      const playPauseListener = () => {
        playButton.innerHTML = this.playButtonSvg();
      };
      this.addEventListener('play', playPauseListener);
      this.addEventListener('pause', playPauseListener);
    }

    this.shadowDom.appendChild(this.mediaPlayer);

    const coverContainer = select('.cover');

    if (!this.cover) {
      const coverSize = coverContainer ? window.getComputedStyle(coverContainer).width : 0;

      this.cover = document.createElement('octopod-cover');
      this.cover.imageUrl = this.imageUrl;
      this.cover.chaptersUrl = this.chaptersUrl;
      this.cover.style.width = coverSize;
      this.cover.style.height = coverSize;
    }

    coverContainer?.appendChild(this.cover);

    playButton.addEventListener('click', () => {
      if (this.paused) {
        this.mediaPlayer.play();
      } else {
        this.mediaPlayer.pause();
      }
    });

    progressContainer.addEventListener('click', event => {
      const rect = progressContainer.getBoundingClientRect();
      const indicatorRect = progressIndicator.getBoundingClientRect();

      const distance = event.pageX - rect.left - (indicatorRect.width / 2);
      const percentage = distance / (rect.width - indicatorRect.width);

      let newTimestamp = percentage * this.duration;

      if (newTimestamp < 0) {
        newTimestamp = 0;
      } else if (newTimestamp > this.duration) {
        newTimestamp = this.duration;
      }

      this.currentTime = newTimestamp;
    });

    select('.button.rewind').addEventListener('click', () => {
      this.currentTime = this.currentTime - 15;
    });

    select('.button.skip').addEventListener('click', () => {
      this.currentTime = this.currentTime + 15;
    });

    select('.button.download').setAttribute('href', this.getAttribute('src'));

    selectAll('.button.speed .option').forEach(speedButton => {
      speedButton.addEventListener('click', () => {
        this.playbackRate = speedButton.dataset.rate;

        select('.button.speed .option.active').classList.remove('active');
        speedButton.classList.add('active');
      });
    });

    volumeContainer.addEventListener('click', event => {
      const rect = volumeContainer.getBoundingClientRect();
      const indicatorRect = volumeIndicator.getBoundingClientRect();

      const distance = event.pageX - rect.left - (indicatorRect.width / 2);
      let percentage = distance / (rect.width - indicatorRect.width);

      if (percentage < 0) {
        percentage = 0;
      } else if (percentage > 1) {
        percentage = 1;
      }

      this.volume = percentage;
    });
  }
}

customElements.define('octopod-player', OctopodPlayerElement);
