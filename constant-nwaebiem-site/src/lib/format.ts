/** Small helpers shared by the components. */

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Turns **bold** in CMS text into <b>bold</b>, safely. Use with set:html. */
export const rich = (s: string) => escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

/** Stops a line break between a minus sign and a £ figure (e.g. −£138m). */
export const keepFigures = (s: string) => s.replace(/−£/g, '−⁠£');

export const coord = (v: number, pos: string, neg: string) =>
  `${Math.abs(v).toFixed(3)}° ${v >= 0 ? pos : neg}`;

/** Equirectangular projection used by the Global map (20°W–60°E, 0°–62°N). */
const K = Math.cos((35 * Math.PI) / 180);
export const project = (lat: number, lon: number): [number, number] => [
  +((lon + 20) * K).toFixed(2),
  +(62 - lat).toFixed(2),
];
