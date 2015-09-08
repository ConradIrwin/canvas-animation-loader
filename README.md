canvas-animation-loader lets you hardware accelerate your canvas animations.

It converts a javascript file that exports an icon class into a static SVG,
with one panel for each frame of the animation. This lets you run the animation
on the GPU using CSS's `translateX()` transform with a `step()` parameter.

# Installation

```
npm install --save-dev canvas-animation-loader
```

# Usage

First create a javascript file that exports an animated icon class:

```javascript
export default class SearchIcon {
    constructor(duration, width, height) {
        // configure your renderer to produce an animation of the given size
        // when render is called.
        // in the default configuration animations last for 166 milliseconds and
        // are 32x32pixels.
    }

    render(context, time) {
        // context is obtained from a canvas element's .getContext('2d'),
        // time is the point in time that the animation should render at.
        // In the default configuration this method will be called 11 times
        // at 16.6ms intervals (60 frames per second), e.g. with values:
        // [0, 16.6, 33.2, 49.8, 66.4, 83, 99.6, 116.2, 132.8, 149.4, 166]
    }
}
```

```coffee

module.exports = class SearchIcon
  constructor: (@duration, @width, @height) ->

  render: (context, time) ->
    # draw your animation to the canas as it should appear at time T.
```

Then use it as a background image on some HTML in this configuration:

```html
<div class="animation-viewPort">
  <div class="animation-slider"/>
</div>
```

And load the image into CSS thusly:
```css

.animation-viewPort {
  width: 32px;
  height: 32px;
  overflow: hidden;
}

.animation-slider {
    width: calc(32px * 11);
    height: 32px;

    background-image: url(~!url-loader?mimeType=image/svg+xml!val-loader!canvas-animation-loader!./search_icon.js);
    // transform one less than the number of frames so that the last
    // frame is visible in the viewport.
    transform: translateX(calc(-32px * 10));
    // show ten frames, each one lasts for 16.6ms (which is a rounded approximation of 1/60, so 60 frames per second)
    transition: transform 166ms step(10);
}
.animation-slider:hover {
    // cause the animation to move to the other end.
    transform: translateX(0);
}
```

# Options

There are four configurable parameters to the loader, each of which is determined by the values in your CSS (or vice-versa).

```
url(~!url-loader?mimeType=image/svg+xml!val-loader!canvas-animation-loader?width=X&height=X&duration=X&interval=X);
```

* *width* (32) — the number of pixels wide your icon expects to be (passed into the constructor)
* *height* (32) — the number of pixels tall your icon expects to be (passed into the constructor)
* *duration* (166) — the number of milliseconds your animation will run for (passed into the constructor)
* *interval* (16.6) — the number of milliseconds between each frame (render will be called duration/interval + 1 times)

To make all this work in the CSS:

* The width and height of the viewport should be set to the width and height of each frame.
* The height of the slider should be the same as the height of the viewport.
* The width of the slider should be the width of each frame * (duration/interval + 1).
* The initial transform should be `translateX(-(duration/interval) * frame width)`.
* The final transform should be `translateX(0px)`.

