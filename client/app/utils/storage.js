/* eslint-disable */
import {
  local_storage_key,
} from '../../../config/config.js';
export const STORAGE_KEY = local_storage_key;

export function getFromStorage(key) {
  if (!key) {
    return null;
  }
  try {
    const valueStr = localStorage.getItem(key);
    if (valueStr) {
      return JSON.parse(valueStr);
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}
export function setInStorage(key, obj) {
  if (!key) {
    console.error('Error: Cannot save in storage. Key is null.');
  }
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    console.error('Error: Unable to parse the object.');
    console.error(err);
  }
}
/* eslint-enable */
