const fs = require('fs');
const path = require('path');

function prepend(file, text) {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (!content.startsWith('@use')) {
        fs.writeFileSync(file, text + '\n' + content);
    }
}

let baseDir = './scss/base';
let compDir = './scss/components';

if (fs.existsSync(baseDir)) {
    fs.readdirSync(baseDir).forEach(f => {
        if (f.endsWith('.scss') && f !== '_tokens.scss') {
            prepend(path.join(baseDir, f), `@use 'tokens' as *;`);
        }
    });
}
if (fs.existsSync(compDir)) {
    fs.readdirSync(compDir).forEach(f => {
        if (f.endsWith('.scss')) {
            prepend(path.join(compDir, f), `@use '../base/tokens' as *;`);
        }
    });
}
