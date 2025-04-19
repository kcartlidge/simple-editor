/* Simple Editor script */

// Converts a div (by id) to a live editor with styling, fonts, and layout
var simpleEditor = {

    // Any registered handler to receive changes
    changeHandler: null,

    // The editor's container element
    container: null,

    // The editor element
    editor: null,

    // Convert a div (by id) to a live editor
    // Optionally provide a handler that will be called when content changes
    attach: function (editorId, changeHandler) {
        simpleEditor.container = document.getElementById(editorId);
        if (simpleEditor.container == null) {
            throw new Error("Cannot attach simple editor to the given editorId.");            
        }
        simpleEditor.container.className = (simpleEditor.container.className + ' simple-editor-container').trim();

        // Create the toolbar
        simpleEditor.toolbar = document.createElement('div');
        simpleEditor.toolbar.id = 'simple-editor-toolbar';
        simpleEditor.container.appendChild(simpleEditor.toolbar);

        // Helper function to add a button, label, and optional class
        function addButton(idSuffix, innerHTML, classNameSuffix = '') {
            var newButton = document.createElement('button');
            newButton.setAttribute('id', 'simple-editor-' + idSuffix);
            newButton.innerHTML = innerHTML;
            if (classNameSuffix) {
                newButton.className = 'simple-editor-' + classNameSuffix;
            }
            simpleEditor.toolbar.appendChild(newButton);
        }

        // Helper function to add a dropdown button and options
        function addDropdownButton(idSuffix, options = []) {
            var newSelect = document.createElement('select');
            newSelect.setAttribute('id', 'simple-editor-' + idSuffix);
            for(var i = 0; i < options.length; i++) {
                var newOption = document.createElement('option');
                newOption.textContent = options[i];
                newOption.value = (i == 0 ? '' : options[i]);
                newSelect.appendChild(newOption);
            }
            newSelect.selectedIndex = 0;
            simpleEditor.toolbar.appendChild(newSelect);
        }

        // Helper function to add a button separator
        function addSeparator() {
            var newSeparator = document.createElement('span');
            newSeparator.className = 'simple-editor-separator';
            simpleEditor.toolbar.appendChild(newSeparator);
        }

        // Add the toolbar buttons
        // This *could* be merged in with the 'buttons' array below, but it's
        // clearer keeping the two aspects separate - and the button handlers
        // defined below will only be added if the button is created here
        addButton('b', '<strong>B</strong>');
        addButton('i', '<em>I</em>');
        addButton('u', '<u>U</u>');
        addSeparator();
        addButton('sk', '<s>S</s>');
        addSeparator();
        addButton('color-default', 'A', 'text-black');
        addButton('color-red', 'A', 'text-red');
        addButton('color-green', 'A', 'text-green');
        addButton('color-blue', 'A', 'text-blue');
        addButton('color-orange', 'A', 'text-orange');
        addButton('color-purple', 'A', 'text-purple');
        addSeparator();
        addButton('clear', 'X');
        addSeparator();
        addButton('left', '&lt;');
        addButton('center', 'C');
        addButton('right', '&gt;');
        addSeparator();
        addButton('hr', '-');
        addSeparator();
        addButton('p', 'P', 'small');
        addButton('h1', 'H1', 'small');
        addButton('h2', 'H2', 'small');
        addButton('h3', 'H3', 'small');
        addSeparator();
        addDropdownButton('font-name', [
            'Font',
            'Arial',
            'Bookman Old Style',
            'Comic Sans MS',
            'Consolas',
            'Courier New',
            'Courier',
            'Dark Courier',
            'Garamond',
            'Geneva',
            'Georgia',
            'Helvetica',
            'iA Writer Duo S',
            'Impact',
            'Lucida Console',
            'Lucida Sans Unicode',
            'Monaco',
            'Palatino',
            'PT Mono',
            'Tahoma',
            'Times New Roman',
            'Trebuchet MS',
            'Verdana'
        ]);
        addSeparator();
        addDropdownButton('font-size', ['Size', '1', '2', '3', '4', '5', '6', '7']);
        addSeparator();
        addButton('undo', '&hookleftarrow;');

        // Create the editor
        simpleEditor.editor = document.createElement('div');
        simpleEditor.editor.id = 'simple-editor';
        simpleEditor.editor.setAttribute('contenteditable', true);
        simpleEditor.editor.setAttribute('autofocus', 'autofocus');
        simpleEditor.container.appendChild(simpleEditor.editor);

        // Button definitions (id suffix, handler, optional event)
        // The event defaults to 'click' unless overridden
        var buttons = [
            ['b', () => { simpleEditor.formatText('bold') }],
            ['i', () => { simpleEditor.formatText('italic') }],
            ['u', () => { simpleEditor.formatText('underline') }],
            ['sk', () => { simpleEditor.formatText('strikethrough') }],

            ['left', () => { simpleEditor.formatText('justifyLeft') }],
            ['center', () => { simpleEditor.formatText('justifyCenter') }],
            ['right', () => { simpleEditor.formatText('justifyRight') }],

            ['color-default', () => { simpleEditor.formatText('foreColor', false, '#333') }],
            ['color-red', () => { simpleEditor.formatText('foreColor', false, '#ec5050') }],
            ['color-green', () => { simpleEditor.formatText('foreColor', false, '#299921') }],
            ['color-blue', () => { simpleEditor.formatText('foreColor', false, '#3d6ee9') }],
            ['color-orange', () => { simpleEditor.formatText('foreColor', false, '#d3992e') }],
            ['color-purple', () => { simpleEditor.formatText('foreColor', false, '#800080') }],

            ['p', () => { simpleEditor.formatText('formatBlock', false, 'P') }],
            ['h1', () => { simpleEditor.formatText('formatBlock', false, 'H1') }],
            ['h2', () => { simpleEditor.formatText('formatBlock', false, 'H2') }],
            ['h3', () => { simpleEditor.formatText('formatBlock', false, 'H3') }],

            ['font-name', () => { simpleEditor.setFont() }, 'change'],
            ['font-size', () => { simpleEditor.setFontSize() }, 'change'],

            ['hr', () => { simpleEditor.formatText('insertHorizontalRule') }],
            ['clear', () => { simpleEditor.formatText('removeFormat') }],
            ['undo', () => { simpleEditor.formatText('undo') }],
        ];

        // Attach all the toolbar handlers
        buttons.forEach(btn => {
            var evt = btn.length > 2 ? btn[2] : 'click';
            var btnElem = document.getElementById('simple-editor-' + btn[0]);
            if (btnElem != null) {
                btnElem.addEventListener(evt, btn[1]);
            }
        });

        // If there's a change handler, advise it when there are content changes
        if (changeHandler != null) {
            simpleEditor.changeHandler = changeHandler;
            simpleEditor.editor.addEventListener('input', () => {
                changeHandler();
            });
        }
    },

    // Set the HTML content
    setContent: function(innerHTML) {
        if (innerHTML) {
            simpleEditor.editor.innerHTML = innerHTML.replace(/\n/g, "<br>");
            simpleEditor.content = simpleEditor.editor.innerHTML;
            
            // If there's a change handler, advise it of the initial content being set
            if (simpleEditor.changeHandler != null) {
                simpleEditor.changeHandler();
            }
        }
    },

    // Get the HTML content
    // If it is unescaped then the HTML is raw (otherwise it's escaped for safety)
    getContent: function(unescaped = false) {
        if (unescaped) return simpleEditor.editor.innerHTML;
        else return simpleEditor.editor.innerHTML
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    },

    // Function to format text based on the command
    // Value and color are optional (often used for foreColor command)
    formatText: function (command, value, color) {
        simpleEditor.editor.focus();
        document.execCommand(command, value, color);
        return false;
    },

    // Function to set the font family
    setFont: function () {
        var dropdown = document.getElementById('simple-editor-font-name');
        var fontName = dropdown.value;
        dropdown.value = '';
        simpleEditor.formatText('fontName', false, fontName);
    },

    // Function to set the font size
    setFontSize: function () {
        const dropdown = document.getElementById('simple-editor-font-size');
        const fontSize = dropdown.value;
        dropdown.value = '';
        simpleEditor.formatText('fontSize', false, fontSize);
    },

};
