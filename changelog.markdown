# Changelog

## 0.2.2 (2021-01-10)

Ditch GL.

- Replace canvas for cover rendering with image elements (thanks to @curtgrimes).

## 0.2.1 (2021-01-10)

Bug fix release.

- Fixes size of buttons on iOS devices.
- Removes a defunct animation when changing playback speed.
- Fixes independent cover elements not updating chapters correctly.

## 0.2.0 (2021-01-09)

Maintenance release with JS mixin classes.

- New basic testing suite with `web-test-runner`.
- Introduces composite utilities to build elements out of mixins.
- Fixes usage of HTML attributes.

## 0.1.0 (2020-12-20)

The first release of the Octopod Player with the `<octopod-player>` and `<octopod-cover>` elements.

- New `<octopod-player>` element that mimics the default media playback HTML elements like `<audio>` and `<video>`.
- Support for covers with the `<octopod-cover>` element, including images provided by chapters.
- Controls currently only support click controls. Dragging and keyboard controls will be coming in a future release.
