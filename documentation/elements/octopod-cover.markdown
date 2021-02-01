# &lt;octopod-cover&gt;: The Media Cover element

The `<octopod-cover>` element draws current chapter art while media is playing
in the browser window.

When media is playing the element will look for updates to the current chapter
and is going to show one of three things:

- *A placeholder* when no image is specified and no current chapter information
  was found.
- *The main image* specified inside the `image` attribute.
- *A chapter image* specified in the chapter data for the current chapter.

```html
<octopod-cover
  target="podcasting2_0Player"
  image="https://noagendaassets.com/enc/1601061118.678_pciavatar.jpg"
  chapters="https://studio.hypercatcher.com/chapters/podcast/http:mp3s.nashownotes.compc20rss.xml/episode/http:adam.curry.comhtmlPC201020201106Podcas-ZV7ms5XRW9t58ntbVrTRT4WJdFKD2p.html"
></octopod-cover>

<audio
  id="podcasting2_0Player"
  src="https://mp3s.nashownotes.com/PC20-10-2020-11-06-Final.mp3"
  controls
>
  Your browser does not support audio playback.
</audio>
```

The above example shows usage of the `<octopod-cover>` element by specifying
paths to an image and chapter data for a podcast episode. In order to make the
element aware of changes to the current chapter, the ID of the media element we
want to show chapter images for is specified inside the `target` attribute.

## Attributes

This element's attributes include the [global attributes][mdn-global-attributes].

- `chapters`  
  The URL of the media chapters for the active media.

- `image`  
  The URL of the cover image for the active media.

- `target`  
  The element ID of the [HTMLMediaElement][mdn-htmlmediaelement] instance
  this element will observe for media events.

## Properties

This element inherits properties from its ancestors
[HTMLElement][mdn-htmlelement], [Element][mdn-element], [Node][mdn-node] and
[EventTarget][mdn-eventtarget].

- `chapters` (read-only)  
  An array containing chapter information for the active media.

- `chaptersUrl`  
  The URL of the media chapters for the active media.

- `currentChapter` (read-only)  
  The current chapter information for the active media.

- `currentTime` (read-only)  
  The current timestamp for the active media. If no media element is specified, changing this value will still update
  the current chapter.

- `imageUrl`  
  The URL of the cover image for the active media.

- `targetPlayer`  
  The [HTMLMediaElement][mdn-htmlmediaelement] instance that's playing the media this element is observing for media
  events.

## Methods

This element inherits methods from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

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
