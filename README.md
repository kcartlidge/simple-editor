# Simple Editor v1.4.0

A rich text client side web editor in vanilla JavaScript and CSS.

## Contents

- [Features](#features)
- [Screenshot](#screenshot)
- [Examples](#examples)
- [Usage](#usage)
  - [Linking in the required JavaScript and CSS](#linking-in-the-required-javascript-and-css)
  - [Adding a placeholder into your page](#adding-a-placeholder-into-your-page)
  - [Activating the editor](#activating-the-editor)
- [Options](#options)
  - [Changing which features are visible](#changing-which-features-are-visible)
  - [Changing which fonts are available](#changing-which-fonts-are-available)
- [Content](#content)
- [Events](#events)
  - [On change](#instant-notification-on-changes)
  - [At intervals](#interval-based-notification-on-changes)
  - [When idle](#notification-when-idle-for-a-given-time)
- [License](#license)

## Features

- Extremely simple to set up (no build pipelines or bundling)
- Styling (bold, italic, underline, strikethrough, text colour)
- Alignment (left, right, center)
- Headings (paragraphs and h1, h2, h3)
- Bullets and numbered lists
- Blockquotes
- Font selection and size
  - Default font choices can be overridden
- *Intelligent* optional change event callbacks
  - Instantly when there are changes (e.g., for your own 'changed' flag)
  - At an interval if there have been changes (e.g., to trigger a word count update)
  - After a specified period of inactivity (e.g., autosave after 2 minutes)
- Get content as either escaped or raw HTML
- Options to select which features are shown

Handwritten. No AI.

## Screenshot

![screenshot](./screenshot.png)

*(from example 1 as detailed below)*

## Examples

There are five example HTML files in the repo:

- [Example 1](./examples/example-1.html) is a simple out-of-the-box experience
- [Example 2](./examples/example-2-change-event-handlers.html) has change event handlers showing both instant and interval-based activity
- [Example 3](./examples/example-3-some-buttons-hidden.html) shows how to pass options to hide chosen editor features
- [Example 4](./examples/example-4-custom-fonts.html) shows how to override the default list of fonts
- [Example 5](./examples/example-5-no-fixed-width.html) shows the behaviour without a fixed width editor
- [Example 6](./examples/example-6-idle-event-handler.html) has an idle event handler to show action after inactivity

## Usage

- [See example 1](./examples/example-1.html)

### Linking in the required JavaScript and CSS

- Download and link to the [CSS file](./dist/simple-editor.css) from the `dist` folder (place this at the end of the `head` of your page)
- Download and link to the [JavaScript file](./dist/simple-editor.js) from the `dist` folder (place this at the end of the `body` of your page)

``` html
<!DOCTYPE html>
<html>
<head>

    <link rel="stylesheet" href="dist/simple-editor.css">
</head>
<body>

    <script src="dist/simple-editor.js"></script>
</body>
</html>
```

The examples also link to `style.css` but that's not part of the editor and only serves the needs of the example page itself.

### Adding a placeholder into your page

- A single `div` is all that's needed
- Your own CSS can set the editor sizing by targeting this `id`

``` html
<div id="my-editor"></div>
```

### Activating the editor

- Simple Editor attaches to the `div` you just added
- Ensure you only do this after the page has loaded
- Place this at the bottom of the `body` (*after* the script is linked)

``` html
<script>
    // Wait till the page is ready
    document.addEventListener("DOMContentLoaded", function() {

        // Convert the div to an editor
        simpleEditor.attach('my-editor');

    });
</script>
```

## Options

### Changing which features are visible

- [See example 3](./examples/example-3-some-buttons-hidden.html)

The call to `simpleEditor.attach` can also suppress specific features.
For example you may support bold, italics, and underline, but nothing else.

Here's an example of specifying options:

``` javascript
simpleEditor.attach('my-editor', {
    allowStrikethrough: false,
    allowClear: false,
    allowAlignment: false,
    allowHeading1: false,
    allowFonts: false,
    allowUndo: false
});
```

Here's the list of options supported, taken from `simpleEditor.defaultOptions`:

- `allowStyling` - bold, italics, underline
- `allowStrikethrough` - strikethrough
- `allowColors` - changing text color
- `allowClear` - removing character-level formatting
- `allowAlignment` - paragraph alignment
- `allowLines` - horizontal lines
- `allowHeading1` - top level heading
- `allowSubheadings` - headings 2 and 3
- `allowBlockquotes` - indented blocks
- `allowUnorderedLists` - bullet lists
- `allowOrderedLists` - numbered lists
- `allowFonts` - changing the font
- `allowFontSizes` - changing the font size
- `allowUndo` - undo (always available from the keyboard)

### Changing which fonts are available

- [See example 4](./examples/example-4-custom-fonts.html)
- For the full list of default fonts look at the `fonts` array in [`simple-editor.js`](./dist/simple-editor.js)

*Before* calling `simpleEditor.attach` you can set the list of fonts the user can choose from:

``` javascript
simpleEditor.fonts = ['Arial', 'Sans-Serif', 'Tahoma', 'Verdana'];
simpleEditor.attach('my-editor');
```

## Content

- [See example 2](./examples/example-2-change-event-handlers.html)

Methods exist to get and set the content of the editor, which is always in HTML format.

- `simpleEditor.setContent('<p>This is <b>bold</b> text.</p>')`
  - Any text with HTML markup is fine, but ideally only allow markup that your choice of active editor features supports
- `simpleEditor.getContent()`
  - Get the current user text, with HTML *escaped* (eg `&lt;b&gt;bold text&lt;/b&gt;`)
- `simpleEditor.getContent(true)`
  - Get the current user text, with *raw* HTML (eg `<b>bold text</b>`)

## Events

*Before* calling `simpleEditor.attach` you can provide optional event handlers for when the text changes.

For each type of event you can register as many handlers as you need.
Each is called according to its own specified timings.

You can query Simple Editor for the content at any time, but the actual text is not passed *directly* to handlers for two reasons:

- That's extra overhead when some usages may not need the text
- It's not known in advance if you want unescaped or raw HTML

### Instant notification on changes

- [See example 2](./examples/example-2-change-event-handlers.html)

Your handler is called the moment a change occurs.
Useful for things like showing a 'changed' marker on a browser tab title. 

``` javascript
simpleEditor.onchange(() => { sourceDiv.innerHTML = simpleEditor.getContent(); });
simpleEditor.onchange(() => console.log('Changed!'));
simpleEditor.attach('my-editor');
```

This example adds two handlers for when the text changes:
- The first sets an element (already captured as `sourceDiv`) to always show the latest escaped (safe) HTML
- The second is a simple message in the console to say something has changed

### Interval-based notification on changes

- [See example 2](./examples/example-2-change-event-handlers.html)

Your handler is called at a regular interval, but only if there has been a change since it was last called.
Useful for things that need to be kept up to date, but for performance reasons doing them once for every change is too much overhead.
For example, a live word count could be updated just once every 3 seconds and only needs to occur if there have been changes.

``` javascript
simpleEditor.onchangeInterval(() => { alert('At least one change in the last 10s'); }, 10000);
simpleEditor.attach('my-editor');
```

This example sets up an interval handler called every 10 seconds if there have been any changes since the last time it was called.

### Notification when idle for a given time

- [See example 6](./examples/example-6-idle-event-handler.html)

Your handler is only called when nothing has changed for a specified time.
Useful for things that only need to happen when the text is stable, like an autosave every couple of minutes.

``` javascript
simpleEditor.onchangeIdle(() => { alert('Changed, but now idle for 3s'); }, 3000);
simpleEditor.attach('my-editor');
```

This example sets up an idle handler to show an alert if there have been no changes in the last 3 seconds.
In reality you'd likely wait longer and do something more productive!

## License

Copyright K Cartlidge, 2025.

[MIT license](./LICENSE.md)

## Implementation Note

*In common with most rich editors* it uses `execCommand` which is marked as deprecated (not obsolete).

The deprecation is largely because no exact standard exists, but ongoing in-browser support is virtually guaranteed as there are no spec'ed alternatives.
For example, https://github.com/whatwg/html/pull/7064 discusses a declined pull request to remove it's recommended use from the specs ("*User agents are encouraged to implement the features described in execCommand*").
