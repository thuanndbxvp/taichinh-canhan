import { describe, it, expect } from 'vitest';
import { createBlankScene, newSceneId } from './Scene';

describe('Scene', () => {
  it('createBlankScene có id + order + kind', () => {
    const s = createBlankScene(0, 'hook');
    expect(s.id).toBeTruthy();
    expect(s.order).toBe(0);
    expect(s.kind).toBe('hook');
    expect(s.claimIds).toEqual([]);
    expect(s.calculationIds).toEqual([]);
  });

  it('default kind = context', () => {
    const s = createBlankScene(5);
    expect(s.kind).toBe('context');
    expect(s.order).toBe(5);
  });

  it('newSceneId unique', () => {
    const a = newSceneId();
    const b = newSceneId();
    expect(a).not.toBe(b);
  });
});