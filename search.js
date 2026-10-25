const GOOGLE_SEARCH_URL = 'https://www.google.com/search';

/**
 * Builds a Google Web search URL, scoped to the exact hostname when possible.
 *
 * @param {string | undefined} pageUrl URL of the page active at submission.
 * @param {string} input User-entered omnibox text.
 * @returns {string}
 */
export function buildSearchUrl(pageUrl, input) {
  const terms = input.trim();
  const hostname = getWebHostname(pageUrl);
  const query = hostname
    ? `site:${hostname}${terms ? ` ${terms}` : ''}`
    : terms;

  const searchUrl = new URL(GOOGLE_SEARCH_URL);
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('udm', '14');
  return searchUrl.href;
}

/**
 * Returns a hostname only for ordinary HTTP(S) pages.
 *
 * @param {string | undefined} pageUrl
 * @returns {string | null}
 */
function getWebHostname(pageUrl) {
  if (!pageUrl) {
    return null;
  }

  try {
    const url = new URL(pageUrl);
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.hostname) {
      return url.hostname;
    }
  } catch {
    // A malformed or unavailable page URL produces an unscoped search.
  }

  return null;
}
