export const COLORS = {
  primary: '#2B5C8A',
  'primary-soft': '#B8D8F5',
  background: '#F7FAFD',
  surface: '#E3EEF9',
  text: '#1F3A5F',
  'text-muted': '#4F6B8A',
  buffalo: '#8C7B70',
  success: '#5E8C3A',
  'dark-bg': '#13243B',
  // mascot-only (không dùng cho chữ)
  horn: '#FBE9CF',
  nose: '#BA8F89',
  cheek: '#F2A99A',
};

const H = 'Bricolage Grotesque', B = 'Be Vietnam Pro';
export const TYPE = {
  display: { family: H, weight: 800, size: 56, lineHeight: 1.15 },
  h1: { family: H, weight: 800, size: 40, lineHeight: 1.15 },
  h2: { family: H, weight: 700, size: 32, lineHeight: 1.15 },
  h3: { family: H, weight: 700, size: 24, lineHeight: 1.2 },
  'body-lg': { family: B, weight: 400, size: 18, lineHeight: 1.6 },
  body: { family: B, weight: 400, size: 16, lineHeight: 1.6 },
  label: { family: B, weight: 600, size: 14, lineHeight: 1.4 },
  caption: { family: B, weight: 500, size: 13, lineHeight: 1.5 },
};
export const SPACING = { xs: 4, sm: 8, md: 12, base: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64 };
export const ROUNDED = { sm: 8, md: 14, lg: 24, pill: 999 };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
