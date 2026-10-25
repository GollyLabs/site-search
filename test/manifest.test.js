import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const manifest = JSON.parse(
  await readFile(new URL('../manifest.json', import.meta.url), 'utf8')
);

test('declares a minimal Manifest V3 omnibox extension', () => {
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.omnibox.keyword, 'ss');
  assert.deepEqual(manifest.permissions, ['activeTab']);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.content_scripts, undefined);
  assert.deepEqual(manifest.background, {
    service_worker: 'background.js',
    type: 'module'
  });
});

test('contains every declared local icon', async () => {
  await Promise.all(
    Object.values(manifest.icons).map((icon) =>
      access(new URL(`../${icon}`, import.meta.url))
    )
  );
});

test('declares no remotely hosted executable resources', () => {
  const serialized = JSON.stringify(manifest);

  assert.doesNotMatch(serialized, /https?:\\?\/\\?\//);
  assert.equal(manifest.externally_connectable, undefined);
  assert.equal(manifest.sandbox, undefined);
});
