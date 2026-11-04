import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = new URL('../src/styles/tokens.json', import.meta.url);
const OUTPUT = new URL('../src/styles/tokens.css', import.meta.url);

const tokens = JSON.parse(await readFile(SOURCE, 'utf8'));

function declaration(name, value) {
  return `  --${name}: ${value};`;
}

const lightDeclarations = [];
const darkDeclarations = [];

for (const token of tokens.color.tokens) {
  if (typeof token.value === 'string') {
    lightDeclarations.push(declaration(token.name, token.value));
  } else {
    lightDeclarations.push(declaration(token.name, token.value.light));
    darkDeclarations.push(declaration(token.name, token.value.dark));
  }
}

const css = [
  '/* Generado por scripts/build-tokens.js a partir de tokens.json. No editar a mano. */',
  '',
  ':root {',
  '  color-scheme: light dark;',
  ...lightDeclarations,
  '}',
  '',
  '@media (prefers-color-scheme: dark) {',
  '  :root {',
  ...darkDeclarations.map((line) => `  ${line}`),
  '  }',
  '}',
  '',
].join('\n');

await writeFile(OUTPUT, css);
