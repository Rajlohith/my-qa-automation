# QA Automation Take-Home (Playwright + TypeScript)

Automated tests for two demo sites:

- **UI tests** against [saucedemo.com](https://www.saucedemo.com)
- **API tests** against [reqres.in](https://reqres.in)

## Setup

### 1. Get the code (clone the repository)

Install [Git](https://git-scm.com) if you do not have it, then run:

```bash
git clone https://github.com/Rajlohith/my-qa-automation.git
cd my-qa-automation
```

These commands are the same on Windows, macOS and Linux. All remaining commands are run from inside this `my-qa-automation` folder. (No Git? Use the green **Code** button on the GitHub page, choose **Download ZIP**, unzip it and open a terminal in that folder.)

### 2. Install Node.js (version 18 or newer)

Download the LTS version from https://nodejs.org (Windows, macOS and Linux installers are available), then check it:

```bash
node -v
npm -v
```

### 3. Install dependencies and the Chromium browser

These commands are the same on Windows, macOS and Linux. Run them in the project folder:

```bash
npm install
npx playwright install chromium
```

On Linux, if the browser fails to start because of missing system libraries, run this instead:

```bash
npx playwright install --with-deps chromium
```

### 4. Create the `.env` file with your ReqRes API key

The API tests need a free ReqRes API key (without it ReqRes returns 401).

1. Create a free account at https://reqres.in and generate an API key.
2. Copy the template file `.env.example` to a new file named `.env` (in the project root, next to `package.json`):

**Windows (Command Prompt):**

```cmd
copy .env.example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**macOS and Linux (Terminal):**

```bash
cp .env.example .env
```

3. Open `.env` in any text editor and replace `your_key_here` with your key:

```
REQRES_API_KEY=your_key_here
```

`.env` is listed in `.gitignore`, so your real key is never committed. `.env.example` is only a template.

## API Key Handling

The Playwright configuration loads environment variables from the `.env` file using `dotenv`.

The API project conditionally adds the `x-api-key` HTTP header:

- If `REQRES_API_KEY` is configured, the key is trimmed and included in API requests.
- If the key is missing, no empty API-key header is sent.
- The API test file checks for a missing key using `test.beforeAll()` and displays a warning explaining how to configure it.

The API tests still run if the key is missing, but ReqRes may reject requests with `401 Unauthorized`.

UI tests do not require a ReqRes API key and can run independently:

```bash
npx playwright test --project=ui
```

## Run the tests

```bash
npx playwright test                 # all 8 tests
npx playwright test --project=ui    # UI tests only
npx playwright test --project=api   # API tests only
npx playwright test --headed        # watch the browser run the tests
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
| Remove from cart, badge disappears | tests/ui/cart.spec.ts |
| Logout from the side menu returns to the login page | tests/ui/login.spec.ts |
| GET /api/users/23 returns 404 | tests/api/users.spec.ts |
| Login steps moved into a Page Object | pages/LoginPage.ts |

## Project structure

```
pages/LoginPage.ts        Page Object for the login steps
tests/ui/                 browser tests (saucedemo)
tests/api/                HTTP tests (reqres.in)
playwright.config.ts      two projects: "ui" and "api"
.env.example              template for the API key file (copy to .env)
```

## Notes

- `playwright.config.ts` has two projects. `ui` runs in Chromium with saucedemo as the base URL and `testIdAttribute: 'data-test'`, so `getByTestId` matches saucedemo's `data-test` attributes. `api` uses no browser, sets reqres.in as the base URL, and sends the `x-api-key` header on every request.
- Assertions stay in the test files. The Page Object only performs actions.

## Scope and limitations

Kept small on purpose, as per documentation. Not done:

- Only Chromium (no Firefox/WebKit); no CI, Docker or extra reporting tools.
- Only `standard_user` and `locked_out_user`; no wrong-password, empty-field or other-user cases.
- Cart tests cover a single product; no checkout, sorting or multi-item flows.
- API tests cover only the endpoints in the brief; no schema validation. ReqRes is a fake API, so created users are not persisted.
- Each UI test logs in through the UI (simple and independent, but slower than reusing a saved login state).
- The API tests need a personal ReqRes key (free keys are time-limited), so they fail with 401 without one.

## Reflection

**What I completed:** All five required scenarios plus all four bonus tasks.

**Where I got stuck:** My first test failed with an "invalid URL" error because the `baseURL` line was still commented out in `playwright.config.ts`. Once I set it, `page.goto('/')` worked. I checked that the 404 test really tests something by temporarily using an existing user id and watching it fail.

**What I learned:** How Playwright fixtures, auto-waiting assertions and async/await work, and why an API key would belong in the .gitignore `.env` file.

**What I would improve with more time:** Add a shared logged-in fixture to avoid repeating the UI login, cover more users and negative cases, and run the suite in CI.