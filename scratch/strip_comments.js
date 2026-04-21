const fs = require('fs');
const path = require('path');

function removeComments(code) {
    let result = '';
    let i = 0;
    let inString = null; // null, ", ', `
    let inComment = null; // null, //, /*

    while (i < code.length) {
        const char = code[i];
        const nextChar = code[i + 1];

        // String handling
        if (!inComment) {
            if (inString) {
                if (char === '\\') { // Escape char
                    result += char + (nextChar || '');
                    i += 2;
                    continue;
                }
                if (char === inString) { // End of string
                    result += char;
                    inString = null;
                    i++;
                    continue;
                }
            } else {
                if (char === '"' || char === "'" || char === '`') {
                    inString = char;
                    result += char;
                    i++;
                    continue;
                }
            }
        }

        // Comment handling
        if (!inString) {
            if (inComment) {
                if (inComment === '//' && (char === '\n' || char === '\r')) {
                    inComment = null;
                    // Preserve the newline
                    result += char;
                    i++;
                    continue;
                }
                if (inComment === '/*' && char === '*' && nextChar === '/') {
                    inComment = null;
                    i += 2;
                    continue;
                }
                i++;
                continue;
            } else {
                if (char === '/' && nextChar === '/') {
                    inComment = '//';
                    i += 2;
                    continue;
                }
                if (char === '/' && nextChar === '*') {
                    inComment = '/*';
                    i += 2;
                    continue;
                }
            }
        }

        if (!inComment) {
            result += char;
        }
        i++;
    }
    return result;
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                walk(fullPath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            console.log('Processing:', fullPath);
            const content = fs.readFileSync(fullPath, 'utf8');
            const cleaned = removeComments(content);
            fs.writeFileSync(fullPath, cleaned, 'utf8');
        }
    }
}

walk('./src');
console.log('Done!');
