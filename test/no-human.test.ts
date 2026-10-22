import { afterEach, describe, expect, it, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { MantisBrowser, createServer } from '../src/index.js';
import { CAPTCHA_WARNING, captchaWarning } from '../src/fallback/captcha.js';

afterEach(() => vi.unstubAllEnvs());

describe('MANTIS_NO_HUMAN', () => {
  it('drops the ask_human instruction from the CAPTCHA warning', () => {
    vi.stubEnv('MANTIS_NO_HUMAN', '1');
    expect(captchaWarning()).not.toContain('ask_human');
    expect(captchaWarning()).toContain('CAPTCHA');
  });

  it('askHuman returns at once without opening any browser', async () => {
    vi.stubEnv('MANTIS_NO_HUMAN', '1');
    const b = new MantisBrowser();
    // Never opened: a launch (headless or headed) would make this reject or take seconds.
    expect(await b.askHuman('captcha', undefined, 5)).toBe('no human available; choose another route or report blocked');
    expect(b.page).toBeFalsy();
    await b.close();
  });

  it('does not expose ask_human or point to it when no human is available', async () => {
    vi.stubEnv('MANTIS_NO_HUMAN', '1');
    const client = new Client({ name: 'test', version: '0' });
    const [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([createServer().connect(serverTransport), client.connect(clientTransport)]);
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name)).not.toContain('ask_human');
    expect(tools.map((tool) => tool.description).join('\n')).not.toContain('ask_human');
    await client.close();
  });

  it('leaves the warning and ask_human registration unchanged when the variable is unset or not 1', async () => {
    vi.stubEnv('MANTIS_NO_HUMAN', '');
    expect(captchaWarning()).toBe(CAPTCHA_WARNING);
    expect(CAPTCHA_WARNING).toContain('ask_human("captcha")');
    const client = new Client({ name: 'test', version: '0' });
    const [serverTransport, clientTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([createServer().connect(serverTransport), client.connect(clientTransport)]);
    expect((await client.listTools()).tools.map((tool) => tool.name)).toContain('ask_human');
    await client.close();
    vi.stubEnv('MANTIS_NO_HUMAN', '0');
    expect(captchaWarning()).toBe(CAPTCHA_WARNING);
  });
});
