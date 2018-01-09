export const KEY_CHANGE = 'KEY_CHANGE';
export const QUALITY_CHANGE = 'QUALITY_CHANGE';
export const changeKey = (newKey) => ({ type: KEY_CHANGE, newKey });
export const changeQuality = (quality) => ({ type: QUALITY_CHANGE, quality });
