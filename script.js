// Get the editor element
const editor = document.getElementById('editor');
const source = document.getElementById('source');

// Function to format text based on the command
// Value and color are optional (often used for foreColor command)
function formatText(command, value, color) {
    editor.focus();
    document.execCommand(command, value, color);
}

// Function to set the font family
function setFont() {
    const dropdown = document.getElementById('font-family');
    const fontName = dropdown.value;
    dropdown.value = '';
    formatText('fontName', false, fontName);
}

// Function to set the font size
function setFontSize() {
    const dropdown = document.getElementById('font-size');
    const fontSize = dropdown.value;
    dropdown.value = '';
    formatText('fontSize', false, fontSize);
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
editor.innerHTML = `<h1>Welcome to the Editor</h1><div>This is a sample <font color="#299921">formatted</font> text. You can use <i>italics</i>, <b>bold</b>, and <strike>strikethrough</strike> text.</div><div><br></div><h2>Features</h2><div><hr></div><div><span style="font-size: 1rem;">- Text <i>styling</i></span></div><div>- Line alignments</div><div>- <font color="#800080">Text</font> <font color="#ec5050">colours</font></div><div><hr></div><div><span style="font-size: 1rem;"><br></span></div><div><span style="font-size: 1rem;">Simple to add, and simple to use!</span></div>`;

// Initialize the output with the editor's initial content
updatePreview();

// Add an event listener to the editor
editor.addEventListener('input', updatePreview);
