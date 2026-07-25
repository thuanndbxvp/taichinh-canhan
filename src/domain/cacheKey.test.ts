import { describe, it, expect, beforeEach } from 'vitest';
import { buildCacheKey, fnv1a, parseCacheKey } from './cacheKey';

describe('fnv1a', () => {
  it('hash empty string cho ra giá trị offset basis', () => {
    expect(fnv1a('')).toBe('811c9dc5');
  });

  it('hash khác nhau cho input khác nhau', () => {
    expect(fnv1a('a')).not.toBe(fnv1a('b'));
  });

  it('hash deterministic', () => {
    expect(fnv1a('hello world')).toBe(fnv1a('hello world'));
  });
});

describe('buildCacheKey + parseCacheKey', () => {
  beforeEach(() => {});

  it('build key đúng format 8 phần', () => {
    const key = buildCacheKey({
      kind: 'visual-prompt',
      documentId: 'doc-1',
      sceneId: 's-1',
      provider: 'kyma',
      model: 'gpt-4o-mini',
      promptVersion: '1.0.0',
      content: 'mô tả cảnh',
    });
    expect(key.split(':')).toHaveLength(8);
  });

  it('cùng input → cùng key', () => {
    const input = {
      kind: 'dialogue' as const,
      documentId: 'd1',
      provider: 'openai',
      model: 'gpt-4',
      promptVersion: '2.0.0',
      content: 'script body',
    };
    expect(buildCacheKey(input)).toBe(buildCacheKey(input));
  });

  it('thay đổi content → đổi hash → đổi key', () => {
    const base = {
      kind: 'video-prompt' as const,
      documentId: 'd1',
      provider: 'kyma',
      model: 'm',
      promptVersion: '1',
      content: 'a',
    };
    const changed = { ...base, content: 'b' };
    expect(buildCacheKey(base)).not.toBe(buildCacheKey(changed));
  });

  it('thay đổi provider → đổi key', () => {
    const base = {
      kind: 'scene-summary' as const,
      documentId: 'd1',
      provider: 'kyma',
      model: 'm',
      promptVersion: '1',
      content: 'x',
    };
    const changed = { ...base, provider: 'openai' };
    expect(buildCacheKey(base)).not.toBe(buildCacheKey(changed));
  });

  it('parse ngược lại đúng các field', () => {
    const key = buildCacheKey({
      kind: 'all-visual-prompts',
      documentId: 'doc-x',
      sceneId: 's-2',
      provider: 'openai',
      model: 'gpt-4o',
      promptVersion: '1.2.3',
      content: 'abc',
    });
    const parsed = parseCacheKey(key);
    expect(parsed).not.toBeNull();
    expect(parsed?.kind).toBe('all-visual-prompts');
    expect(parsed?.documentId).toBe('doc-x');
    expect(parsed?.sceneId).toBe('s-2');
    expect(parsed?.provider).toBe('openai');
    expect(parsed?.model).toBe('gpt-4o');
    expect(parsed?.promptVersion).toBe('1.2.3');
  });

  it('parseCacheKey trả null nếu sai format', () => {
    expect(parseCacheKey('too:few:parts')).toBeNull();
    expect(parseCacheKey('a:b:c:d:e:f:g')).toBeNull();
  });

  it('sceneId "-" parse thành null', () => {
    const key = buildCacheKey({
      kind: 'dialogue',
      documentId: 'd',
      provider: 'p',
      model: 'm',
      promptVersion: '1',
      content: 'c',
    });
    const parsed = parseCacheKey(key);
    expect(parsed?.sceneId).toBeNull();
  });
});