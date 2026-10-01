# Selvi PM Vishwakarma Page Guide (optional Chrome extension)

This helper is intentionally limited to the official `https://pmvishwakarma.gov.in` site (including `www`). It is activated only when the user opens the extension popup and presses **அடுத்த இடத்தைச் சுட்டுங்கள்**. Chrome's `activeTab` permission grants temporary access to the current tab after that user action; the extension has no persistent host access, storage, network permission, or AI/API key.

The content script reads only visible `a`, `button`, and `[role=button]` labels (including visible text, `aria-label`, or `title`) so it can match a user-entered goal locally. It never reads link URLs, form values, page text outside those controls, cookies, or credentials. It does not transmit data, click controls, fill forms, or submit anything. For a new-registration request it will prefer an official FAQ link and warn against using CSC Login unless the user is a CSC operator.

## Build and install

1. From the project root run `pnpm build:extension`.
2. Open Chrome's `chrome://extensions`, enable Developer mode, and choose **Load unpacked**.
3. Select the `extension/nila-page-guide` folder.
4. Open `https://pmvishwakarma.gov.in/`, click the Selvi extension icon, choose a task (or type one), then click **அடுத்த இடத்தைச் சுட்டுங்கள்**.
5. Compare the highlighted label with your goal. Selvi only points; you decide and click yourself.

To remove the extension, use **Remove** on `chrome://extensions`. It is not installed automatically by the Selvi website.
