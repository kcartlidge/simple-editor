// Get the editor element
const editor = document.getElementById('editor');
const source = document.getElementById('source');

// Function to format text based on the command
function formatText(command) {
    document.execCommand(command, false, null);
}

// Function to escape HTML and convert line breaks to br tags
function showSource(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
}

// Function to update the preview
function updatePreview() {
    source.innerHTML = showSource(editor.innerHTML);
    // source.innerHTML = editor.innerHTML;
}

// Add sample Markdown text
editor.innerHTML = `# Welcome to the Editor

This is a sample text in **Markdown** format. You can use *italics* and ~~strikethrough~~ text.

## Features

- Real-time preview
- Line break support
- HTML escaping for security

Feel free to edit this text and see the changes in the preview below!`.replace(/\n/g, "<br>");

// Initialize the output with the editor's initial content
updatePreview();

// Add an event listener to the editor
editor.addEventListener('input', updatePreview);
