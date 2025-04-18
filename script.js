// Get the editor element
const editor = document.getElementById('editor');
const source = document.getElementById('source');

// Function to format text based on the command
// Value and color are optional (often used for foreColor command)
function formatText(command, value, color) {
    console.log(command, value, color);
    editor.focus();
    document.execCommand(command, value, color);
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
}

// Add sample Markdown text
editor.innerHTML = `<h1>Welcome to the Editor</h1>This is a sample <font color="#299921">formatted</font> text. You can use <i>italics</i>, <b>bold</b>, and <strike>strikethrough</strike> text.<div><br><b>Features</b><br><hr>- Text <i>styling</i><br>- Line alignments<br>- <font color="#800080">Text</font> <font color="#ec5050">colours</font><br><hr><br><div>Simple to add, and simple to use!</div></div>`;

// Initialize the output with the editor's initial content
updatePreview();

// Add an event listener to the editor
editor.addEventListener('input', updatePreview);
