/**
 * Tests for deepSet utility function
 */

import { describe, it, expect } from 'vitest';
import { deepSet } from './deepSet';

describe('deepSet', () => {
  it('should set a simple property', () => {
    const obj = { a: 1 };
    deepSet(obj, 'b', 2);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it('should set a nested property', () => {
    const obj = { a: { b: 1 } };
    deepSet(obj, 'a.c', 2);
    expect(obj).toEqual({ a: { b: 1, c: 2 } });
  });

  it('should create missing nested objects', () => {
    const obj = {};
    deepSet(obj, 'a.b.c', 'value');
    expect(obj).toEqual({ a: { b: { c: 'value' } } });
  });

  it('should overwrite existing values', () => {
    const obj = { a: { b: { c: 'old' } } };
    deepSet(obj, 'a.b.c', 'new');
    expect(obj).toEqual({ a: { b: { c: 'new' } } });
  });

  it('should handle array indices', () => {
    const obj = { items: [{ name: 'first' }] };
    deepSet(obj, 'items.0.name', 'updated');
    expect(obj).toEqual({ items: [{ name: 'updated' }] });
  });

  it('should throw error for non-object target', () => {
    expect(() => deepSet(null, 'a.b', 'value')).toThrow('deepSet: target must be an object');
    expect(() => deepSet('string', 'a.b', 'value')).toThrow('deepSet: target must be an object');
  });

  it('should throw error for non-string path', () => {
    expect(() => deepSet({}, 123, 'value')).toThrow('deepSet: path must be a string');
  });
});
