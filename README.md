canvas-animation-loader lets you hardware accelerate your canvas animations.

It converts a javascript file that exports an icon class into a static SVG,
with one panel for each frame of the animation. This lets you run the animation
on the GPU using CSS's `translateX()` transform with a `step()` parameter.

# Installation

```
npm install --save-dev canvas-animation-loader
```

# Usage

First create a javascript file that exports an icon class:

```
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

Then require it, and use it as a background image on some HTML in this configuration:

```html
var animationSvg = require('url!val!canvas-animation-loader!./bounce.js');

<div className="animation-viewPort">
    <div className="animation-slider" style={backgroundImage: animationSvg} />
</div>

<style>
.animation-viewPort {
  width: 32px;
  height: 32px;
  overflow: hidden;
}

.animation-slider {
    width: calc(32px * 11);
    // transform one less than the number of frames so that the last
    // frame is visible in the viewport.
    transform: translateX(calc(-32px * 10));
    transition: transform 166ms step(10);
}
.animation-slider:hover {
    transform: translateX(0);
}
</style>
```

