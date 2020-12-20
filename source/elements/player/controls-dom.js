import downloadSvg from '../../../assets/download.svg';
import playSvg from '../../../assets/play.svg';
import skipSvg from '../../../assets/skip.svg';
import volumeSvg from '../../../assets/volume.svg';

export default `
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
