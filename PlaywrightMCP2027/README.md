# Playwright MCP + TypeScript Practice

This repository is a learning project for exploring a public demo site with
Playwright MCP and building repeatable browser and HTTP smoke tests with
Playwright Test in TypeScript.

> **Demo-site limitation:** The Rahul Shetty Academy ProtoCommerce site is a
> teaching demo, not an enterprise application or a production test
> environment. The login, shop, and form flows explored here did not expose a
> backend JSON API. The form's success message is client-side, so the API suite
> checks HTTP page delivery only; it does not test business APIs or prove that
> form data was stored.

## Requirements

- Node.js 18 or newer and npm
- VS Code (optional, for MCP exploration)

## Install and run

From the project root:

```powershell
npm ci
npx playwright install chromium
```

Run the browser UI tests:

```powershell
npm test
```

Run UI tests with a visible browser:

```powershell
npm run test:headed
```

Run the HTTP smoke tests:

```powershell
npm run test:api
```

Open the most recent HTML test report:

```powershell
npm run report
```

The UI report is generated under `playwright-report/`; view the HTTP smoke-test
report with `npm run report:api` (generated under `playwright-report-api/`).
Playwright's temporary results are written under `test-results/`.

## Project layout

```text
.
├── .vscode/
│   └── mcp.json                  # VS Code Playwright MCP server
├── APITesting/
│   └── site-smoke.api.spec.ts    # Direct HTTP checks for page delivery
├── pages/
│   ├── home-page.ts              # Home form Page Object
│   ├── login-page.ts             # Login Page Object
│   └── shop-page.ts              # Shop Page Object
├── tests/
│   └── proto-commerce.spec.ts    # Browser UI tests
├── package.json
├── playwright.api.config.ts      # Isolated API/HTTP test configuration
└── playwright.config.ts          # Browser UI test configuration
```

## What the UI tests cover

The UI tests run in Chromium and use the Page Object Model (POM):

1. Open the demo login page, choose the **Teacher** role, accept the terms, and
   verify navigation to the shop.
2. Verify that **iPhone X** is visible in the shop.
3. Check that each of **Category 1**, **Category 2**, and **Category 3** opens
   the home form.
4. Fill the enabled home form controls, including the checkbox, select, radio
   button, and date field; submit and verify the success message.

On the explored site, all three category links lead to the same home form;
they do not filter products. The demo also has no logout control on the shop
page, so these tests do not claim to verify logout.

The login Page Object reads the publicly displayed demo credentials from the
login page instead of copying the password into the test source. This is a
convenience specific to this teaching site, **not** a production authentication
pattern. For a real application, use credentials supplied through protected
environment variables or a secrets manager, and never print them in logs or
commit them.

## What the HTTP tests cover (and do not cover)

`APITesting/site-smoke.api.spec.ts` uses Playwright's `APIRequestContext` to
send direct GET requests and check:

- The login route returns HTML containing the expected login form elements.
- The shop and home routes return the ProtoCommerce HTML application shell.

These are useful availability and response-contract smoke checks, but they are
**not** tests of a REST/GraphQL API. Browser exploration of the covered flows
showed page and static-asset requests, but no backend API request for login or
form submission. Do not invent endpoints or treat the UI's success toast as
proof of persistence. If testing a real API, obtain its documented endpoints
and authorization rules from its owner first.

The API tests have a separate config so they run without launching a browser
and do not get mixed with UI tests. Both configs currently target the public
demo host.

## Playwright MCP in VS Code

`.vscode/mcp.json` configures the Playwright MCP server for this workspace.
VS Code starts it; you generally do not need to launch the server manually in
the terminal.

1. Open this folder in VS Code.
2. Open the Command Palette and run **MCP: List Servers**.
3. Start or inspect the `playwright` server if it is not already running.
4. Ask Copilot to perform a small, read-only browser task, for example:
   `Use the Playwright MCP server to open https://example.com and report the page title.`

MCP is useful for interactive exploration and investigation. Playwright Test
files are the repeatable, version-controlled automation suite. When exploring
public sites, avoid actions that create real purchases, send messages, change
accounts, or otherwise affect other users.

## Suggestions for enterprise-level framework practice

Grow the framework in small steps and keep the distinction between demo
limitations and real application behavior clear:

1. **Configuration by environment:** Move base URLs into environment-specific
   configuration (local, test, staging) and fail clearly when required values
   are missing. Keep secrets out of source control.
2. **Reusable fixtures:** Add typed Playwright fixtures for page objects,
   authenticated users, and test data. Keep setup scoped to the test and avoid
   hidden dependencies between tests.
3. **Test data and cleanup:** Use unique data where needed; create and clean up
   records through supported APIs or database fixtures in an owned test
   environment. Make tests safe to rerun and parallelize.
4. **Real API coverage:** For an application with a documented API, add
   positive and negative tests for status codes, response schemas, validation,
   authorization, and relevant business rules. Use isolated test data and
   verify persistence through supported interfaces.
5. **Authentication:** Use a dedicated test account and a safe authentication
   setup such as a fixture or saved `storageState` where appropriate. Ensure
   auth state files and secrets are ignored by Git.
6. **Resilience and diagnostics:** Prefer accessible role/label locators,
   explicit assertions, and condition-based waiting. Capture traces, screenshots,
   and reports on failure; avoid arbitrary sleeps and brittle selectors.
7. **CI and quality gates:** Run linting, type-checking, and tests in CI. Start
   with one reliable browser; add browser/device coverage when the application
   and environment support it. Publish reports and failure artifacts, while
   keeping credentials masked.
8. **Broader quality:** Add accessibility checks, visual regression, and
   cross-browser testing selectively. Treat performance and security testing
   as separate, authorized efforts with appropriate environments and limits.
9. **Maintainability:** Add test tags (smoke/regression), naming conventions,
   ownership, and short documentation for fixtures and test-data strategy.
   Avoid building abstractions before repeated needs appear.

For this specific demo, good next exercises are negative login behavior,
required-field and invalid-email checks, verifying checkbox/radio/select
behavior, and tracing browser network traffic to distinguish browser-driven
navigation from actual API calls. Keep expectations aligned with what the demo
really implements.
