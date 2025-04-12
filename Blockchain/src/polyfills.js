// Browser polyfills for Node.js built-in modules
import { Buffer } from 'buffer';
import process from 'process';

// Make these available globally
window.Buffer = Buffer;
window.process = process;

// Polyfill for crypto.getRandomValues
if (typeof window !== 'undefined' && !window.crypto) {
  window.crypto = {};
}

if (typeof window !== 'undefined' && window.crypto && !window.crypto.getRandomValues) {
  window.crypto.getRandomValues = function(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}