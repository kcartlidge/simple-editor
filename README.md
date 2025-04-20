# Simple Editor v1.0.0

A simple client side editor in vanilla JavaScript, CSS, and HTML.

## Contents

- [Features](#features)
- [Screenshot](#screenshot)
- [Usage](#usage)
- [Example](#example)
- [License](#license)

## Features

- Extremely simple to set up (no build pipelines or bundling)
- Styling (bold, italic, underline, strikethrough, text colour)
- Alignment (left, right, center)
- Headings (paragraphs and h1, h2, h3)
- Font selection and size
  - Default font choices can be overridden
  - Unavailable fonts silently suppressed
- Optional change event callback
- Get content as either escaped or raw HTML
- Options to select which features are shown

Coming soon:

- Bullets and numbered lists
- Blockquotes
- More change event handling options

Handwritten. No AI.

## Screenshot

![screenshot](./screenshot.png)

*(from example 2 as detailed below)*

## Usage

- Look at the first example (below) to get started
- Download and link to the [CSS file](./dist/simple-editor.css) (from the `dist` folder) in your header
- Download and link to the [JavaScript file](./dist/simple-editor.js) (from the `dist` folder) at the end of the body
- Add a `div` with an id (eg `<div id='my-editor'></div>`)
- Call `simpleEditor.attach('my-editor');` to switch the div to an editor
  - You should do this within a `DOMContentLoaded` event listener

## Example

There are five example HTML files in the repo:

- [Example 1](./example-1.html) is a simple out-of-the-box experience
- [Example 2](./example-2-showing-changing-source.html) has a change event handler that shows the HTML source for the text being edited
- [Example 3](./example-3-some-buttons-hidden.html) shows how to pass options to hide chosen editor features
- [Example 4](./example-4-custom-fonts.html) shows how to override the default list of fonts
- [Example 5](./example-5-no-fixed-width.html) shows the behaviour without a fixed width editor

## License

Copyright K Cartlidge, 2025.

[MIT license](./LICENSE.md)

## Implementation Note

*In common with most rich editors* it uses `execCommand` which is marked as deprecated (not obsolete).

The deprecation is largely because no exact standard exists, but ongoing in-browser support is virtually guaranteed as there are no spec'ed alternatives.
For example, https://github.com/whatwg/html/pull/7064 discusses a declined pull request to remove it's recommended use from the specs ("*User agents are encouraged to implement the features described in execCommand*").
