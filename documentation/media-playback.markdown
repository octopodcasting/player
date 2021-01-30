# Media Playback

The `<octopod-player>` element was created with compatibility in mind.
Internally it uses an instance of [HTMLMediaElement][mdn-htmlmediaelement]
such as `<audio>` or `<video>` to handle playback of media files, while also
mimicking its functionality. This means you can implement it alongside an
existing media player or use it as a replacement.

To use an existing media player, either specify the element ID of the media
element inside the `player` attribute or set the `mediaPlayer` property:

```html
<!-- Not implemented yet -->
```

```js
const audioPlayer = document.createElement('audio');
audioPlayer.src = /* your media file */;

const octopodPlayer = document.createElement('octopod-player');
octopodPlayer.mediaPlayer = audioPlayer;
```

[mdn-htmlmediaelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
