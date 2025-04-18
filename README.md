# Simple Editor

A simple client side editor in vanilla JavaScript, CSS, and HTML.

It's presented as a three-file example, but it's extremely simple to extract the HTML (the `editor-container` and contents) to place into other projects.  Remember to link the CSS and JS files, as per the example page.

Handwritten. No AI.

![screenshot](./screenshot.png)

## Usage

It's standalone.
Just open `index.html` with the CSS and JS files in the same folder.

## Implementation Note

Uses `execCommand` which is marked deprecated (not obsolete).
However this is largely because no exact standard exists and it needs HTML4.
Ongoing in-browser support is virtually guaranteed as there are no alternatives.
For example https://github.com/whatwg/html/pull/7064 shows a declined pull request to remove it's recommended use from the specs ("*User agents are encouraged to implement the features described in execCommand*").

## License

Copyright K Cartlidge, 2025.

[MIT license](./LICENSE.md)
