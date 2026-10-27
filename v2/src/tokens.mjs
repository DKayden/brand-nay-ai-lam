// Token bản v2: giữ nguyên bản gốc, chỉ đổi màu mascot (nâu ấm hơn, mõm sáng hơn, bớt hồng) + màu cà vạt nền tối.
export * from '../../src/tokens.mjs';
import { COLORS as BASE } from '../../src/tokens.mjs';
export const COLORS = {
  ...BASE,
  buffalo: '#8A6A56', // nâu ấm bão hoà hơn #8C7B70
  belly: '#A98A72',
  nose: '#D6B39B', // mõm be sáng, hết hồng xám (không giống mõm heo)
  accent: '#F4A259', // cam nắng, màu nhấn ấm duy nhất; chữ navy trên nền này 5.56:1; không dùng làm màu chữ trên nền sáng
  'tie-dark': '#6FA3D6', // cà vạt trên nền tối: 5.8:1 so với dark-bg
};
