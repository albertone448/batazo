import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = new URL('../src/styles/tokens.json', import.meta.url);
const OUTPUT = new URL('../src/styles/tokens.css', import.meta.url);

const tokens = JSON.parse(await readFile(SOURCE, 'utf8'));

const rootDeclarations = [];
const darkDeclarations = [];

function declaration(name, value) {
  return `  --${name}: ${value};`;
}

function addToken(name, value) {
  if (typeof value === 'string') {
    rootDeclarations.push(declaration(name, value));
    return;
  }

  rootDeclarations.push(declaration(name, value.light));
  darkDeclarations.push(declaration(name, value.dark));
}

const simpleGroups = [
  tokens.color,
  tokens.spacing,
  tokens.radius,
  tokens.shadow,
  tokens.duration,
];

for (const group of simpleGroups) {
  for (const token of group.tokens) {
    addToken(token.name, token.value);
  }
}

for (const [family, stack] of Object.entries(tokens.type.families)) {
  addToken(`font-${family}`, stack);
}

for (const group of tokens.type.groups) {
  for (const style of group.styles) {
    addToken(
      `text-${style.name}`,
      `${style.fontWeight} ${style.fontSize}/${style.lineHeight} var(--font-${group.family})`,
    );

    if (style.letterSpacing) {
      addToken(`text-${style.name}-letter-spacing`, style.letterSpacing);
    }
  }
}

const reducedMotionDeclarations = tokens.duration.tokens.map((token) =>
  declaration(token.name, '0ms'),
);

const css = [
  '/* Generado por scripts/build-tokens.js a partir de tokens.json. No editar a mano. */',
  '',
  ':root {',
  '  color-scheme: light dark;',
  ...rootDeclarations,
  '}',
  '',
  '@media (prefers-color-scheme: dark) {',
  '  :root {',
  ...darkDeclarations.map((line) => `  ${line}`),
  '  }',
  '}',
  '',
  '@media (prefers-reduced-motion: reduce) {',
  '  :root {',
  ...reducedMotionDeclarations.map((line) => `  ${line}`),
  '  }',
  '}',
  '',
].join('\n');

await writeFile(OUTPUT, css);
