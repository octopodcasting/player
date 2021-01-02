import {formatTime} from '../../utilities/time';

import downloadSvg from '../../../assets/download.svg';
import pauseSvg from '../../../assets/pause.svg';
import playSvg from '../../../assets/play.svg';
import skipSvg from '../../../assets/skip.svg';
import volumeSvg from '../../../assets/volume.svg';

const ControlsElement = function (BaseElement) {
  return class extends BaseElement {
    #controlsElement;

    controlsDom() {
      if (this.#controlsElement) {
        return this.#controlsElement;
      }

      this.#controlsElement = document.createElement('div');
      this.#controlsElement.classList.add('controls');
      this.#controlsElement.innerHTML = controlsDom;

      const select = this.#controlsElement.querySelector.bind(this.#controlsElement);
      const selectAll = this.#controlsElement.querySelectorAll.bind(this.#controlsElement);

      selectAll('button').forEach(button => {
        button.tabIndex = -1;
        button.addEventListener('mousedown', event => {
          event.preventDefault();

          this.focus();
        });
      });

      const playButton = select('.button.play');
      const progressContainer = select('.progress');
      const progressIndicator = select('.progress .progress-indicator');
      const volumeContainer = select('.button.volume .progress');
      const volumeIndicator = select('.button.volume .progress-indicator');

      this.addEventListener('durationchange', () => {
        select('.timestamp-duration').innerHTML = formatTime(this.duration);
      });

      this.addEventListener('timeupdate', () => {
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
        playButton.innerHTML = this.paused ? playSvg : pauseSvg;
      };
      this.addEventListener('play', playPauseListener);
      this.addEventListener('pause', playPauseListener);

      playButton.addEventListener('click', () => {
        if (this.paused) {
          this.play();
        } else {
          this.pause();
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

      return this.#controlsElement;
    }
  };
};

const controlsDom = `
  <div class="timestamps">
    <div class="timestamp-current">0:00</div>
    <div class="timestamp-duration">0:00</div>
  </div>
  <div class="progress">
    <div class="progress-bar">
      <div class="progress-indicator"></div>
      <div class="progress-played"></div>
    </div>
  </div>
  <div class="buttons">
    <div class="button speed">
      <button class="option" data-rate="0.8"><small>0.8x</small></button>
      <button class="option active" data-rate="1"><small>1x</small></button>
      <button class="option" data-rate="1.2"><small>1.2x</small></button>
      <button class="option" data-rate="1.5"><small>1.5x</small></button>
      <button class="option" data-rate="2"><small>2x</small></button>
    </div>
    <div class="button invisible"></div>
    <div class="control-button-group">
      <button class="button rewind">${skipSvg}</button>
      <button class="button play">${playSvg}</button>
      <button class="button skip">${skipSvg}</button>
    </div>
    <div class="button volume">
      <div class="progress">
        <div class="progress-bar">
          <div class="progress-indicator"></div>
          <div class="progress-played"></div>
        </div>
      </div>
      <button class="mute">${volumeSvg}</button>
    </div>
    <a class="button download" target="_blank" download>${downloadSvg}</a>
  </div>
`;

export default ControlsElement;
