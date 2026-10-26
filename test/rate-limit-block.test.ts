import { describe, expect, it } from 'vitest';
import { isAccessBlockText } from '../bench/agent/judge.js';

describe('whole-page rate-limit blocks', () => {
  it('recognises a bare rate-limit error page as blocked', () => {
    expect(isAccessBlockText('Rate exceeded.')).toBe(true);
  });

  it('does not block a longer page that merely discusses a rate limit', () => {
    const article = 'The deployment guide explains that a request may be rate exceeded when a client sends too many requests in a short time. It then describes exponential backoff, caching, request batching, and how to monitor normal traffic without treating this documentation as an error page.';
    expect(isAccessBlockText(article)).toBe(false);
  });

  it('recognises a short HTTP 429 error page as blocked', () => {
    expect(isAccessBlockText('429 Too Many Requests')).toBe(true);
  });
});
