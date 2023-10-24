import downloadSvg from '../../assets/download.svg';
import pauseSvg from '../../assets/pause.svg';
import playSvg from '../../assets/play.svg';
import podcastSvg from '../../assets/podcast.svg';
import skipSvg from '../../assets/skip.svg';
import volumeSvg from '../../assets/volume.svg';

const icons = {
  podcast: podcastSvg,
  download: downloadSvg,
  pause: pauseSvg,
  play: playSvg,
  skip: skipSvg,
  volume: volumeSvg,
};

export function render(template) {
  for (const icon in icons) {
    template = template.replaceAll(`{icon:${icon}}`, icons[icon]);
  }

  return template;
}
