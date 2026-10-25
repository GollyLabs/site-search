# Site Search

Site Search is a small, open-source Manifest V3 extension for Microsoft Edge and other Chromium browsers. It searches Google for a phrase restricted to the exact hostname of the page you are viewing—directly from the address bar.

## Use Site Search

1. Open any ordinary web page.
2. Focus the address bar with <kbd>Ctrl</kbd>+<kbd>L</kbd> on Windows/Linux or <kbd>Cmd</kbd>+<kbd>L</kbd> on macOS.
3. Type `ss`, then press <kbd>Space</kbd> or <kbd>Tab</kbd> to activate Site Search.
4. Enter a query and press <kbd>Enter</kbd>.

For example, from:

```text
https://support.microsoft.com/en-us/microsoft-edge
```

entering:

```text
ss reset edge profile
```

opens a Google search equivalent to:

```text
https://www.google.com/search?q=site%3Asupport.microsoft.com%20reset%20edge%20profile&udm=14
```

The generated URL may represent spaces as `+`, which is equivalent in URL query parameters.

Site Search preserves the exact hostname. A search started on `support.microsoft.com` remains restricted to `support.microsoft.com`; it is not broadened to `microsoft.com`.

Holding the browser's normal modifier for a new foreground or background result preserves that omnibox disposition. A regular submission replaces the current tab.

## Google Web results

Every search includes [`udm=14`](https://developers.google.com/search/docs/appearance/ai-features), which selects Google's Web-results mode. Site Search navigates explicitly to `https://www.google.com/search`; Chromium's internal `{google:baseURL}` token is not available to ordinary extensions.

## Internal and unsupported pages

Pages such as `edge://extensions`, `chrome://extensions`, extension pages, blank pages, and malformed or unavailable URLs have no ordinary web hostname. From those pages, Site Search falls back to a normal Google Web search without a `site:` restriction. It does not crash or guess a domain.

An empty query on an ordinary HTTP or HTTPS page searches for `site:<exact-hostname>` by itself.

## Privacy and permissions

Site Search requests one permission:

- **`activeTab`** — temporary access to the active tab after the user accepts the omnibox input, so the extension can read that tab's URL and obtain its exact hostname.

Chrome documents [accepting an omnibox suggestion as an invocation that grants `activeTab`](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab), including temporary access to the tab URL. Microsoft Edge documents [Manifest V3 support for both the omnibox and tabs APIs](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/api-support). No broader permission is required.

The extension does not request host permissions, `<all_urls>`, browsing history, storage, scripting, or access to page contents. It injects no content scripts. It stores and collects no data, sends no analytics or telemetry, and contains no third-party or remote runtime code. Its only network effect is the Google Search navigation explicitly submitted by the user. See [PRIVACY.md](PRIVACY.md).

## Install unpacked in Microsoft Edge

1. Open `edge://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select this project directory (the directory containing `manifest.json`).
5. Visit an ordinary website and follow the `ss` workflow above.

Test from a normal HTTP or HTTPS page. If the first search after loading or reloading the extension is missing the `site:` restriction, refresh the page or open the website in a new tab and try again.

Edge may initially show a hint about using <kbd>Tab</kbd> after the keyword. Either <kbd>Space</kbd> or <kbd>Tab</kbd> activates the extension's omnibox mode.

## Install unpacked in Google Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select this project directory (the directory containing `manifest.json`).
5. Visit an ordinary website and follow the `ss` workflow above.

## Development and validation

Site Search has no production dependencies and no build step. Node.js 20 or later is used only for local tests.

```sh
npm test
npm run check
```

`npm test` runs the Node built-in test runner. `npm run check` additionally syntax-checks the service worker and pure URL module before running all tests.

The suite covers exact and subdomain hostnames, whitespace trimming, special characters, Unicode, empty searches, internal and malformed URL fallbacks, `udm=14`, correct `site:` construction, single encoding, all three omnibox dispositions, the suggestion text, manifest fields, permissions, local icons, and the absence of remote executable resources.

## Project structure

```text
manifest.json              Manifest V3 metadata and the `ss` keyword
background.js              Omnibox listeners and tab navigation
search.js                  Pure Google URL builder
test/                      Node built-in tests
icons/                     Original SVG and generated PNG extension icons
PRIVACY.md                 Plain-language privacy policy
LICENSE                    MIT license
package.json               Test and validation scripts
```

## References and attribution

The extension's structure follows Google's official Manifest V3 documentation and sample:

- [`chrome.omnibox` API](https://developer.chrome.com/docs/extensions/reference/api/omnibox)
- [Google Chrome extensions omnibox samples](https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/api-samples/omnibox)
- [Microsoft Edge extension API support](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/api-support)

The retired [Enumerate Site](https://github.com/brettz9/enumerate-site) project was reviewed only as a behavior reference for site-restricted omnibox search. [ContextSearch web-ext](https://github.com/ssborbis/ContextSearch-web-ext) is acknowledged as a related, broader project. Site Search is an original minimal implementation; no source code or third-party runtime dependency was copied from either project.

## License

[MIT](LICENSE)
