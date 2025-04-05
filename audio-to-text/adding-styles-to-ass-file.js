import fs from 'fs';

// ✅ Alignment 5 = Center horizontally and vertically
// ✅ Font size increased for visibility
const newStyle = `
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: ReelSub, Verdana, 8, &H00FFFFFF, &H000000FF, &H00000000, &H00000000, -1, 0, 0, 0, 100, 100, 0, 0, 1, 2, 0, 5, 50, 50, 50, 1
`; 
// 🔥 Alignment 5 centers the text on screen

const modifyAssFile = (inputFile, outputFile) => {
  let assContent = fs.readFileSync(inputFile, 'utf8');

  // Replace the Styles block with the new centered style
  assContent = assContent.replace(/\[V4\+ Styles\][\s\S]*?\[Events\]/, `${newStyle}\n[Events]`);

  // Process each Dialogue line
  assContent = assContent.split('\n').map(line => {
    if (!line.startsWith('Dialogue:')) return line;

    const parts = line.split(',');
    const preText = parts.slice(0, 9).join(',');
    let text = parts.slice(9).join(',');

    // Skip if \fad already exists
    if (text.includes('\\fad')) return `${preText},${text}`;

    // Inject \fad for smooth fade-in/out
    if (text.startsWith('{')) {
      text = text.replace('{', '{\\fad(500,500)');
    } else {
      text = `{\\fad(500,500)}${text}`;
    }

    // Change style to ReelSub (field 4)
    const fields = preText.split(',');
    fields[3] = 'ReelSub';

    return `${fields.join(',')},${text}`;
  }).join('\n');

  fs.writeFileSync(outputFile, assContent, 'utf8');
  console.log('✅ ASS file updated with ReelSub style, fade effect, and CENTERED text!');
};

// Example usage
modifyAssFile('audio-to-text/output.ass', 'audio-to-text/final.ass');
