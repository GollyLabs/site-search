import { buildSearchUrl } from './search.js';

const DEFAULT_SUGGESTION_PREFIX = 'Search the current site with Google:';

chrome.omnibox.setDefaultSuggestion({
  description: `${DEFAULT_SUGGESTION_PREFIX} <dim>&lt;query&gt;</dim>`
});

chrome.omnibox.onInputChanged.addListener((text) => {
  const query = escapeXml(text.trim()) || '&lt;site only&gt;';
  chrome.omnibox.setDefaultSuggestion({
    description: `${DEFAULT_SUGGESTION_PREFIX} <match>${query}</match>`
  });
});

chrome.omnibox.onInputEntered.addListener(async (text, disposition) => {
  const tab = await getActiveTab();
  const searchUrl = buildSearchUrl(tab?.url, text);

  switch (disposition) {
    case 'newForegroundTab':
      await chrome.tabs.create({ url: searchUrl, active: true });
      break;
    case 'newBackgroundTab':
      await chrome.tabs.create({ url: searchUrl, active: false });
      break;
    case 'currentTab':
    default:
      await (tab?.id == null
        ? chrome.tabs.update({ url: searchUrl })
        : chrome.tabs.update(tab.id, { url: searchUrl }));
      break;
  }
});

async function getActiveTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  } catch {
    return undefined;
  }
}

function escapeXml(text) {
  return text.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&apos;',
    '"': '&quot;'
  })[character]);
}
