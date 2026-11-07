const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
}

function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

// Luminancia relativa según WCAG 2.2.
function relativeLuminance(hex: string): number {
  const red = channelToLinear(parseInt(hex.slice(1, 3), 16));
  const green = channelToLinear(parseInt(hex.slice(3, 5), 16));
  const blue = channelToLinear(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: number, second: number): number {
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

// Valores claros de --color-text-on-brand y --color-text-on-accent en tokens.json.
const LIGHT_TEXT_LUMINANCE = relativeLuminance('#FFFFFF');
const DARK_TEXT_LUMINANCE = relativeLuminance('#0C2256');

export function readableTextTone(background: string): 'light' | 'dark' {
  const backgroundLuminance = relativeLuminance(background);
  const lightContrast = contrastRatio(
    backgroundLuminance,
    LIGHT_TEXT_LUMINANCE,
  );
  const darkContrast = contrastRatio(backgroundLuminance, DARK_TEXT_LUMINANCE);
  return lightContrast >= darkContrast ? 'light' : 'dark';
}
