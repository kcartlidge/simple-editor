/* Simple Editor script */

/*
    MIT licence (see LICENSE.md)
    Copyright 2025, K Cartlidge
*/

// Converts a div (by id) to a live editor with styling, fonts, and layout
const simpleEditor = {

    // Has Simple Editor been attached?
    isAttached: false,

    // Any registered handlers to receive changes
    changeHandlers: [],

    // Any registered handlers to receive changes at intervals
    changeIntervalHandlers: [],

    // Any registered handlers to receive changes when the editor is idle
    changeIdleHandlers: [],

    // The editor's container element
    container: null,

    // The editor element
    editor: null,

    // Supported options
    defaultOptions: {
        allowStyling: true,
        allowStrikethrough: true,
        allowColors: true,
        allowClear: true,
        allowAlignment: true,
        allowLines: true,
        allowHeading1: true,
        allowSubheadings: true,
        allowBlockquotes: true,
        allowUnorderedLists: true,
        allowOrderedLists: true,
        allowFonts: true,
        allowFontSizes: true,
        allowUndo: true
    },

    // Supported fonts
    fonts: [
        'Andale Mono',
        'Arial',
        'Avenir Next',
        'Baskerville',
        'Bookman Old Style',
        'Comic Sans MS',
        'Consolas',
        'Courier',
        'Courier New',
        'Courier Prime',
        'Courier Screenplay',
        'Cousine',
        'Dark Courier',
        'Futura',
        'Garamond',
        'Geneva',
        'Georgia',
        'Helvetica',
        'Helvetica Neue',
        'iA Writer Duo S',
        'IBM Plex Mono',
        'Impact',
        'Lato',
        'Lucida Console',
        'Lucida Grande',
        'Lucida Sans Unicode',
        'Menlo',
        'Monaco',
        'Monospace',
        'Montserrat',
        'Open Sans',
        'Optima',
        'Palatino',
        'PT Mono',
        'PT Sans',
        'PT Serif',
        'Sans-Serif',
        'Serif',
        'Tahoma',
        'Times New Roman',
        'Trebuchet MS',
        'Verdana'
    ],

    // Convert a div (by id) to a live editor
    // Optionally provide a handler that will be called when content changes
    // Pass null if there's no handler but you want to override any options
    // For the options, any not provided use the value in 'defaultOptions'
    attach: function (editorId, options = {}) {

        // Don't allow multiple attachment calls
        if (simpleEditor.isAttached) {
            throw new Error("Cannot attach Simple Editor more than once.");
        }
        simpleEditor.isAttached = true;

        // Basic sanity check
        simpleEditor.container = document.getElementById(editorId);
        if (simpleEditor.container == null) {
            throw new Error("Cannot attach Simple Editor to the given editorId.");
        }
        simpleEditor.container.className = (simpleEditor.container.className + ' simple-editor-container').trim();

        // Merge in the default options
        options = options ? Object.assign({}, simpleEditor.defaultOptions, options) : simpleEditor.defaultOptions;

        // Create the toolbar
        simpleEditor.toolbar = document.createElement('div');
        simpleEditor.toolbar.id = 'simple-editor-toolbar';
        simpleEditor.container.appendChild(simpleEditor.toolbar);

        // Helper function to add a button, label, and optional class
        function addButton(idSuffix, title, innerHTML, classNameSuffix = '') {
            const newButton = document.createElement('button');
            newButton.setAttribute('id', 'simple-editor-' + idSuffix);
            newButton.setAttribute('alt', title);
            newButton.setAttribute('title', title);
            newButton.innerHTML = innerHTML;
            if (classNameSuffix) {
                newButton.className = 'simple-editor-' + classNameSuffix;
            }
            simpleEditor.toolbar.appendChild(newButton);
        }

        // Helper function to add a dropdown button and options
        function addDropdownButton(idSuffix, title, options = []) {
            const newSelect = document.createElement('select');
            newSelect.setAttribute('id', 'simple-editor-' + idSuffix);
            newSelect.setAttribute('alt', title);
            newSelect.setAttribute('title', title);
            for (let i = 0; i < options.length; i++) {
                const newOption = document.createElement('option');
                newOption.textContent = options[i];
                newOption.value = (i === 0 ? '' : options[i]);
                newSelect.appendChild(newOption);
            }
            newSelect.selectedIndex = 0;
            simpleEditor.toolbar.appendChild(newSelect);
        }

        // Helper function to add a button separator
        function addSeparator() {
            const newSeparator = document.createElement('span');
            newSeparator.className = 'simple-editor-separator';
            simpleEditor.toolbar.appendChild(newSeparator);
        }

        // Function to format text based on the command
        // Value and color are optional (often used for foreColor command)
        function formatText(command, value, color) {
            simpleEditor.editor.focus();
            document.execCommand(command, value, color);
            return false;
        }

        // Function to set the font family
        function setFont() {
            const dropdown = document.getElementById('simple-editor-font-name');
            const fontName = dropdown.value;
            dropdown.value = '';
            formatText('fontName', false, fontName);
        }

        // Function to set the font size
        function setFontSize() {
            const dropdown = document.getElementById('simple-editor-font-size');
            const fontSize = dropdown.value;
            dropdown.value = '';
            formatText('fontSize', false, fontSize);
        }

        // Function for interval-based actions
        function intervalTick(intervalIndex) {
            if (simpleEditor.changeIntervalHandlers[intervalIndex].isDirty) {
                simpleEditor.changeIntervalHandlers[intervalIndex].isDirty = false;
                simpleEditor.changeIntervalHandlers[intervalIndex].handler();
            }
        }

        // Set the list of fonts
        const fonts = simpleEditor.fonts;

        // Add the toolbar buttons
        // This *could* be merged in with the 'buttons' array below, but it's
        // clearer keeping the two aspects separate - the button handlers
        // defined underneath will only be added if the button exists here
        if (options.allowStyling) {
            addButton('b', 'Bold', '<strong>B</strong>');
            addButton('i', 'Italic', '<em>I</em>');
            addButton('u', 'Underline', '<u>U</u>');
            addSeparator();
        }
        if (options.allowStrikethrough) {
            addButton('sk', 'Strikethrough', '<s>S</s>');
            addSeparator();
        }
        if (options.allowColors) {
            addButton('color-default', 'Default colour', 'A', 'text-black');
            addButton('color-red', 'Red text', 'A', 'text-red');
            addButton('color-green', 'Green text', 'A', 'text-green');
            addButton('color-blue', 'Blue text', 'A', 'text-blue');
            addButton('color-orange', 'Orange text', 'A', 'text-orange');
            addButton('color-purple', 'Purple text', 'A', 'text-purple');
            addSeparator();
        }
        if (options.allowClear) {
            addButton('clear', 'Clear formatting', 'X');
            addSeparator();
        }
        if (options.allowAlignment) {
            addButton('left', 'Align left', '&lt;');
            addButton('center', 'Align center', 'C');
            addButton('right', 'Align right', '&gt;');
            addSeparator();
        }
        if (options.allowLines) {
            addButton('hr', 'Horizontal line', '&mdash;');
            addSeparator();
        }
        if (options.allowHeading1 || options.allowSubheadings || options.allowBlockquotes) {
            addButton('p', 'Normal paragraph', '&para;', 'small');
            if (options.allowHeading1) {
                addButton('h1', 'Heading 1', 'H1', 'small');
            }
            addButton('h2', 'Heading 2', 'H2', 'small');
            addButton('h3', 'Heading 3', 'H3', 'small');
            if (options.allowBlockquotes) {
                addButton('bq', 'Blockquote', '"', 'large');
            }
            addSeparator();
        }
        if (options.allowUnorderedLists || options.allowOrderedLists) {
            if (options.allowUnorderedLists) {
                addButton('ul', 'Unordered list', '=');
            }
            if (options.allowOrderedLists) {
                addButton('ol', 'Ordered list', '1.');
            }
            addSeparator();
        }
        if (options.allowFonts) {
            const fontList = fonts;
            fontList.splice(0, 0, 'Font')
            addDropdownButton('font-name', 'Select font', fontList);
            addSeparator();
        }
        if (options.allowFontSizes) {
            addDropdownButton('font-size', 'Select font size', ['Size', '1', '2', '3', '4', '5', '6', '7']);
            addSeparator();
        }
        if (options.allowUndo) {
            addButton('undo', 'Undo last change', '&hookleftarrow;');
            addSeparator();
        }

        // Create the editor
        simpleEditor.editor = document.createElement('div');
        simpleEditor.editor.id = 'simple-editor';
        simpleEditor.editor.setAttribute('contenteditable', true);
        simpleEditor.editor.setAttribute('autofocus', 'autofocus');
        simpleEditor.container.appendChild(simpleEditor.editor);

        // Button definitions (id suffix, handler, optional event)
        // The event defaults to 'click' unless overridden
        // Allows for buttons disabled by the options
        const buttons = [
            ['b', () => { formatText('bold') }],
            ['i', () => { formatText('italic') }],
            ['u', () => { formatText('underline') }],
            ['sk', () => { formatText('strikethrough') }],

            ['left', () => { formatText('justifyLeft') }],
            ['center', () => { formatText('justifyCenter') }],
            ['right', () => { formatText('justifyRight') }],

            ['color-default', () => { formatText('foreColor', false, '#333') }],
            ['color-red', () => { formatText('foreColor', false, '#ec5050') }],
            ['color-green', () => { formatText('foreColor', false, '#299921') }],
            ['color-blue', () => { formatText('foreColor', false, '#3d6ee9') }],
            ['color-orange', () => { formatText('foreColor', false, '#d3992e') }],
            ['color-purple', () => { formatText('foreColor', false, '#800080') }],

            ['p', () => { formatText('formatBlock', false, 'P') }],
            ['h1', () => { formatText('formatBlock', false, 'H1') }],
            ['h2', () => { formatText('formatBlock', false, 'H2') }],
            ['h3', () => { formatText('formatBlock', false, 'H3') }],
            ['bq', () => { formatText('formatBlock', false, 'BLOCKQUOTE') }],

            ['ul', () => { formatText('insertUnorderedList') }],
            ['ol', () => { formatText('insertOrderedList') }],

            ['font-name', () => { setFont() }, 'change'],
            ['font-size', () => { setFontSize() }, 'change'],

            ['hr', () => { formatText('insertHorizontalRule') }],
            ['clear', () => { formatText('removeFormat') }],
            ['undo', () => { formatText('undo') }],
        ];

        // Attach all the toolbar handlers
        buttons.forEach(btn => {
            const evt = btn.length > 2 ? btn[2] : 'click';
            const btnElem = document.getElementById('simple-editor-' + btn[0]);
            if (btnElem != null) {
                btnElem.addEventListener(evt, btn[1]);
            }
        });

        // If there are change handlers, advise them when there are content changes
        if (simpleEditor.changeHandlers.length > 0) {
            simpleEditor.editor.addEventListener('input', () => {
                // Update the dirty flag for interval-based change events
                for (let i = 0; i < simpleEditor.changeIntervalHandlers.length; i++) {
                    simpleEditor.changeIntervalHandlers[i].isDirty = true;
                }
                // Advise each change event handler
                simpleEditor.changeHandlers.forEach((handler) => handler());
            });
        }

        // Set up the timer-based interval events
        for (let i = 0; i < simpleEditor.changeIntervalHandlers.length; i++) {
            simpleEditor.changeIntervalHandlers[i].isDirty = false;
            setInterval(
                () => { intervalTick(i); },
                simpleEditor.changeIntervalHandlers[i].milliseconds);
        }

        // Set up the idle events
        // Uses its own change handler in case there are no standard ones registered
        for (let i = 0; i < simpleEditor.changeIdleHandlers.length; i++) {
            simpleEditor.editor.addEventListener('input', () => {
                // Restart any idle timers
                for (let i = 0; i < simpleEditor.changeIdleHandlers.length; i++) {
                    if (simpleEditor.changeIdleHandlers[i].timer != null) {
                        clearTimeout(simpleEditor.changeIdleHandlers[i].timer);
                        simpleEditor.changeIdleHandlers[i].timer = null;
                    }
                    simpleEditor.changeIdleHandlers[i].timer = setTimeout(
                        simpleEditor.changeIdleHandlers[i].handler,
                        simpleEditor.changeIdleHandlers[i].milliseconds);
                };
            });
        }
    },

    // Register a change handler
    onchange: function (handler) {
        if (simpleEditor.isAttached) {
            throw new Error("Cannot register a change handler after Simple Editor is attached.");
        }
        simpleEditor.changeHandlers.push(handler);
    },

    // Register an interval change handler
    onchangeInterval: function (handler, milliseconds) {
        if (simpleEditor.isAttached) {
            throw new Error("Cannot register an interval handler after Simple Editor is attached.");
        }
        simpleEditor.changeIntervalHandlers.push({
            handler,
            milliseconds,
            isDirty: false
        });
    },

    // Register an idle change handler
    onchangeIdle: function (handler, milliseconds) {
        if (simpleEditor.isAttached) {
            throw new Error("Cannot register an idle handler after Simple Editor is attached.");
        }
        simpleEditor.changeIdleHandlers.push({
            handler,
            milliseconds,
            timer: null
        });
    },

    // Set the HTML content
    setContent: function (innerHTML) {
        // Cannot set content until the editor is attached
        // It would still work, but we want a fully resolved stable state
        if (!simpleEditor.isAttached) {
            throw new Error("Cannot set content before Simple Editor is attached.");
        }

        // Only set the content if it has a string value
        if (typeof (innerHTML) === 'string') {
            simpleEditor.editor.innerHTML = innerHTML.replace(/\n/g, "<br>");
            simpleEditor.content = simpleEditor.editor.innerHTML;

            // If there are change handlers, advise them of the content being set
            if (simpleEditor.changeHandlers.length > 0) {
                simpleEditor.changeHandlers.forEach((handler) => handler());
            }
        }
    },

    // Get the HTML content
    // If it is unescaped, then the HTML is raw (otherwise it's escaped for safety)
    getContent: function (unescaped = false) {
        // Cannot get content until the editor is attached
        // It would still work, but we want a fully resolved stable state
        if (!simpleEditor.isAttached) {
            throw new Error("Cannot get content before Simple Editor is attached.");
        }

        if (unescaped) return simpleEditor.editor.innerHTML;
        else return simpleEditor.editor.innerHTML
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    },

};
