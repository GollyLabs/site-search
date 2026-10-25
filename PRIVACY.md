# Privacy Policy

**Effective date: July 11, 2026**

Site Search does not collect, store, sell, share, or otherwise process personal data.

The extension:

- stores no user data or settings;
- includes no analytics, telemetry, advertising, or tracking;
- includes no third-party or remotely hosted runtime code;
- injects no scripts into websites and does not inspect page contents;
- does not read browsing history; and
- makes no background network requests.

Site Search requests only the `activeTab` permission. When the user explicitly submits an `ss` omnibox search, this temporary permission lets the extension read the active tab's URL to identify its exact HTTP or HTTPS hostname. The extension uses that hostname in a `site:` operator and immediately navigates according to the user's selected tab disposition.

The only network activity caused by Site Search is the user-directed navigation to `https://www.google.com/search` after the user presses Enter. The search contains the terms the user entered and, when available, the active page's hostname. Google's handling of that request is governed by Google's own terms and privacy policy.

On browser-internal, blank, extension, unavailable, or malformed pages, Site Search cannot obtain a usable web hostname and submits an ordinary Google Web search instead.

Questions or changes can be raised through this project's issue tracker.
