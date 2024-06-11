export default function getEmSizeInPixels(em, container) {
  let baseFontSize = window.getComputedStyle(container, null).getPropertyValue('font-size');
  baseFontSize = parseFloat(baseFontSize);
  return Math.round(baseFontSize * em);
}
