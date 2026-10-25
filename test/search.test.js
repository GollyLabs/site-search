import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSearchUrl } from '../search.js';

function parse(pageUrl, query) {
  return new URL(buildSearchUrl(pageUrl, query));
}

test('scopes an ordinary query to the exact standard hostname', () => {
  const url = parse('https://example.com/articles/one', '  browser tips  ');

  assert.equal(url.origin + url.pathname, 'https://www.google.com/search');
  assert.equal(url.searchParams.get('q'), 'site:example.com browser tips');
  assert.equal(url.searchParams.get('udm'), '14');
});

test('preserves the complete subdomain instead of broadening it', () => {
  const url = parse(
    'https://support.microsoft.com/en-us/microsoft-edge',
    'reset edge profile'
  );

  assert.equal(
    url.searchParams.get('q'),
    'site:support.microsoft.com reset edge profile'
  );
});

test('encodes spaces and special characters exactly once', () => {
  const result = buildSearchUrl(
    'https://docs.example.com/',
    'C++ & URLSearchParams? 100%'
  );
  const url = new URL(result);

  assert.equal(
    url.searchParams.get('q'),
    'site:docs.example.com C++ & URLSearchParams? 100%'
  );
  assert.doesNotMatch(result, /%25(?:2B|26|3F|25|3A)/i);
});

test('preserves Unicode search terms', () => {
  const url = parse('https://例え.テスト/path', '  café 東京 🔎  ');

  assert.equal(
    url.searchParams.get('q'),
    'site:xn--r8jz45g.xn--zckzah café 東京 🔎'
  );
});

test('allows a site-only search when the term is empty', () => {
  const url = parse('http://example.com/', '   ');

  assert.equal(url.searchParams.get('q'), 'site:example.com');
});

test('falls back to an ordinary search for an internal URL', () => {
  const url = parse('edge://extensions/', 'extension help');

  assert.equal(url.searchParams.get('q'), 'extension help');
});

test('falls back to an ordinary search for missing and malformed URLs', () => {
  assert.equal(parse(undefined, 'plain search').searchParams.get('q'), 'plain search');
  assert.equal(parse('not a valid URL', 'plain search').searchParams.get('q'), 'plain search');
});

test('always selects Google Web-results mode with udm=14', () => {
  const url = parse('about:blank', 'news');

  assert.equal(url.searchParams.get('udm'), '14');
  assert.equal([...url.searchParams.keys()].sort().join(','), 'q,udm');
});
