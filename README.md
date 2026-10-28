# QA Automation Take-Home (Playwright + TypeScript)

Automated tests for two demo sites:

- **UI tests** against [saucedemo.com](https://www.saucedemo.com)
- **API tests** against [reqres.in](https://reqres.in)

## Setup

### 1. Install Node.js (version 18 or newer)

Download the LTS version from https://nodejs.org (Windows, macOS and Linux installers are available), then check it:

```bash
node -v
npm -v
```

### 2. Install dependencies and the Chromium browser

These commands are the same on Windows, macOS and Linux. Run them in the project folder:

```bash
npm install
npx playwright install chromium
```

On Linux, if the browser fails to start because of missing system libraries, run this instead:

```bash
npx playwright install --with-deps chromium
```

### 3. Create the `.env` file with your ReqRes API key

The API tests need a free ReqRes API key (without it ReqRes returns 401).

1. Create a free account at https://reqres.in and generate an API key.
2. Create a file named `.env` in the project root. Replace `your_key_here` with your key.

**Windows (Command Prompt):**

```cmd
echo REQRES_API_KEY=your_key_here> .env
```

**Windows (PowerShell):**

```powershell
Set-Content -Path .env -Value "REQRES_API_KEY=your_key_here"
```

**macOS and Linux (Terminal):**

```bash
echo "REQRES_API_KEY=your_key_here" > .env
```

Or create `.env` in any text editor with this single line:

```
REQRES_API_KEY=your_key_here
```

`.env` is listed in `.gitignore`, so the key is never committed.

## Run the tests

```bash
npx playwright test                 # all 8 tests
npx playwright test --project=ui    # UI tests only
npx playwright test --project=api   # API tests only
npx playwright test --headed        # watch the browser manually doing tests
npx playwright show-report          # open the HTML report
```

## What is covered

### Base Tests

| Test | File |
|------|------|
| Valid login shows the "Products" title | tests/ui/login.spec.ts |
| Locked-out user sees a "locked out" error | tests/ui/login.spec.ts |
| Add to cart, badge shows 1 | tests/ui/cart.spec.ts |
| GET /api/users/2 returns 200 and an email | tests/api/users.spec.ts |
| POST /api/users returns 201 and name "morpheus" | tests/api/users.spec.ts |

### Bonus Tests

| Test | File |
|------|------|
| removing from cart, badge disappears | tests/ui/cart.spec.ts |
| to check using logout of side menu returns to the login page | tests/ui/login.spec.ts |
| doing GET method on /api/users/23 returns 404 | tests/api/users.spec.ts |
| login steps moved into a Page Object | pages/LoginPage.ts |

## Project structure

```
pages/LoginPage.ts        Page Object for the login steps
tests/ui/                 browser tests (saucedemo)
tests/api/                HTTP tests (reqres.in)
playwright.config.ts      two projects: "ui" and "api"
```

## Notes

- `playwright.config.ts` has two projects. `ui` runs in Chromium with saucedemo as the base URL and `testIdAttribute: 'data-test'`, so `getByTestId` matches saucedemo's `data-test` attributes. `api` uses no browser, sets reqres.in as the base URL, and sends the `x-api-key` header on every request.
- Assertions stay in the test files. The Page Object only performs actions.