import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { en, hi, kn } from '../src/i18n/locales.js';
import {schemeCopy} from '../src/i18n/schemes.js';
import { isProfile, states, categories, stateLabels } from '../src/data/options.js';
import { readPreferences, writePreferences, preferenceKey } from '../src/lib/preferences.js';
import { states as serverStates, categories as serverCategories } from '../../backend/src/validators/profile.js';
function flatten(value, prefix = '') { return Object.entries(value).flatMap(([key, item]) => typeof item === 'object' ? flatten(item, `${prefix}${key}.`) : [[`${prefix}${key}`, item]]); }
test('scheme discovery and publication caveats have complete trilingual labels',()=>{
 const keys=Object.keys(schemeCopy.en).sort();for(const lang of ['hi','kn']){assert.deepEqual(Object.keys(schemeCopy[lang]).sort(),keys);for(const value of Object.values(schemeCopy[lang]))assert.ok(value.trim());}
});
test('English, Hindi and Kannada cover identical static UI keys with no empty translations', () => {
  const reference = flatten(en).map(([key]) => key).sort();
  for (const locale of [hi, kn]) { assert.deepEqual(flatten(locale).map(([key]) => key).sort(), reference); for (const [, value] of flatten(locale)) assert.ok(value.trim().length); }
  assert.ok(flatten(hi).some(([, value]) => /[\u0900-\u097f]/u.test(value)));
  assert.ok(flatten(kn).some(([, value]) => /[\u0c80-\u0cff]/u.test(value)));
});
test('frontend preferences match backend validation options, including all translated states', () => {
  assert.deepEqual([...states].sort(), [...serverStates].sort()); assert.deepEqual(categories, serverCategories);
  assert.equal(states.length, 36); for (const name of states) assert.equal(stateLabels[name].length, 2);
  assert.equal(isProfile({ state: 'Karnataka', category: 'Student', language: 'kn' }), true);
  assert.equal(isProfile({ state: 'Karnataka', category: 'Student', language: 'kn', uuid: 'invalid' }), false);
});
test('local persistence stores only preferences and sync state, never session credentials', () => {
  const map = new Map(); const storage = { getItem: key => map.get(key), setItem: (key, value) => map.set(key, value) };
  const profile = { state: 'Karnataka', category: 'Student', language: 'kn' };
  assert.equal(writePreferences(storage, profile, true), true); assert.deepEqual(readPreferences(storage), { profile, pending: true });
  assert.deepEqual(Object.keys(JSON.parse(map.get(preferenceKey))).sort(), ['pending', 'profile']);
  map.set(preferenceKey, '{bad'); assert.equal(readPreferences(storage), null);
  map.set(preferenceKey, JSON.stringify({ profile: { ...profile, state: 'invalid' } })); assert.equal(readPreferences(storage), null);
  assert.equal(readPreferences({ getItem() { throw new Error('Storage unavailable'); } }), null);
  assert.equal(writePreferences({ setItem() { throw new Error('Storage unavailable'); } }, profile, false), false);
});
test('core text colors meet WCAG AA contrast on their intended surfaces', () => {
  function luminance(hex) {
    const values = hex.replace('#', '').match(/../g).map(s => parseInt(s, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  }
  const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
  const token=name=>css.match(new RegExp(`--civic-${name}:\\s*(#[0-9a-fA-F]{6})`))[1];
  assert.equal(token('primary').toUpperCase(),'#1E3A8A');assert.equal(token('accent').toUpperCase(),'#4F46E5');
  for (const [text, surface] of [[token('text'),token('background')],[token('muted'),token('surface')],[token('on-primary'),token('primary')],[token('danger'),token('surface')],[token('on-primary'),token('accent')]]) {
    const a = luminance(text), b = luminance(surface); assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `${text} on ${surface}`);
  }
});
