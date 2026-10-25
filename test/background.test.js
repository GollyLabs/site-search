import assert from 'node:assert/strict';
import test from 'node:test';

const listeners = {};
const calls = [];

globalThis.chrome = {
  omnibox: {
    setDefaultSuggestion(suggestion) {
      calls.push(['suggestion', suggestion]);
    },
    onInputChanged: {
      addListener(listener) {
        listeners.changed = listener;
      }
    },
    onInputEntered: {
      addListener(listener) {
        listeners.entered = listener;
      }
    }
  },
  tabs: {
    async query(queryInfo) {
      calls.push(['query', queryInfo]);
      return [{ id: 42, url: 'https://support.microsoft.com/edge' }];
    },
    async update(...args) {
      calls.push(['update', ...args]);
    },
    async create(createProperties) {
      calls.push(['create', createProperties]);
    }
  }
};

await import('../background.js');

test('sets an informative and safely escaped default suggestion', () => {
  listeners.changed('  <reset> & repair  ');

  const [, suggestion] = calls.at(-1);
  assert.equal(
    suggestion.description,
    'Search the current site with Google: <match>&lt;reset&gt; &amp; repair</match>'
  );
});

test('queries the active tab and updates it for currentTab', async () => {
  calls.length = 0;
  await listeners.entered('reset profile', 'currentTab');

  assert.deepEqual(calls[0], [
    'query',
    { active: true, currentWindow: true }
  ]);
  assert.equal(calls[1][0], 'update');
  assert.equal(calls[1][1], 42);
  assert.equal(
    new URL(calls[1][2].url).searchParams.get('q'),
    'site:support.microsoft.com reset profile'
  );
});

test('opens a selected tab for newForegroundTab', async () => {
  calls.length = 0;
  await listeners.entered('reset profile', 'newForegroundTab');

  assert.equal(calls[1][0], 'create');
  assert.equal(calls[1][1].active, true);
});

test('opens an unselected tab for newBackgroundTab', async () => {
  calls.length = 0;
  await listeners.entered('reset profile', 'newBackgroundTab');

  assert.equal(calls[1][0], 'create');
  assert.equal(calls[1][1].active, false);
});

test('falls back to an unscoped current-tab search when tab access fails', async () => {
  calls.length = 0;
  chrome.tabs.query = async (queryInfo) => {
    calls.push(['query', queryInfo]);
    throw new Error('Tab URL unavailable');
  };

  await listeners.entered('plain search', 'currentTab');

  assert.equal(calls[1][0], 'update');
  assert.equal(calls[1].length, 2);
  assert.equal(
    new URL(calls[1][1].url).searchParams.get('q'),
    'plain search'
  );
});
