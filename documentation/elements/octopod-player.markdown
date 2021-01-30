# <octopod-player>: The Podcast Embed element

The `<octopod-player>` element is used to embed podcasts in HTML documents. It
wraps around an [HTML Media element][mdn-htmlmediaelement] such as `<audio>` and
adds features listeners have come to expect from podcast players like cover art,
custom playback speed and back/forward shortcuts.

```html
<octopod-player
  src="https://mp3s.nashownotes.com/PC20-07-2020-10-16-Final.mp3"
></octopod-player>
```

The above example shows basic usage of the `<octopod-player>` element by only
specifying a path inside the `src` attribute to the media we want to play. We
can include other attributes to specify information such as a path to cover art,
a path to a chapters file and media options.

## Attributes

This element's attributes include the [global attributes][mdn-global-attributes].

- `chapters`  
  The URL of the media chapters for the active media.

- `image`  
  The URL of the cover image for the active media.

- `mode`  
  This enumerated attribute indicates how the player is displayed:

  - `audio` Only show audio controls
  - `cover` Show cover image and audio controls

  Its default value is `audio`.

- `src`  
  The URL of the media to play. Playback is delegated to a real instance of
  [HTMLMediaElement][mdn-htmlmediaelement]. For more information, see the
  [Media playback](../media-playback.markdown) section.

## Properties

This element inherits properties from its ancestors
[HTMLElement][mdn-htmlelement], [Element][mdn-element], [Node][mdn-node] and
[EventTarget][mdn-eventtarget].

This element acts as wrapper around an instance of [HTMLMediaElement][mdn-htmlmediaelement], 
properties of the active media element can also be read and changed on this
element.

- `chapters` (read-only)  
  An array containing chapter information for the active media.

- `chaptersUrl`  
  The URL of the media chapters for the active media.

- `currentChapter` (read-only)  
  The current chapter information for the active media.

- `imageUrl`  
  The URL of the cover image for the active media.

- `mediaPlayer`  
  The wrapped [HTMLMediaElement][mdn-htmlmediaelement] instance that's used for
  media playback.

- `mode`  
  Indicates how the player is displayed, see the `mode` attribute
  for possible values.

## Methods

This element inherits methods from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

This element acts as wrapper around an instance of [HTMLMediaElement][mdn-htmlmediaelement],
methods of the active media element can also be called on this element.

## Events

This element inherits events from its ancestors [HTMLElement][mdn-htmlelement]
and [Element][mdn-element].

This element acts as wrapper around an instance of [HTMLMediaElement][mdn-htmlmediaelement],
events emitted by the active media element will also be emitted by this element.

- `loadedchapters`  
  Fired when chapter data has been loaded.

- `chapterupdate`  
  Fired when the current chapter has been updated.

[mdn-global-attributes]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
[mdn-htmlmediaelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
[mdn-htmlelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[mdn-element]: https://developer.mozilla.org/en-US/docs/Web/API/Element
[mdn-node]: https://developer.mozilla.org/en-US/docs/Web/API/Node
[mdn-eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
