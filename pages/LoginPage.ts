import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // baseURL is set in playwright.config.ts.  
  async goto() {
    await this.page.goto('/');
  }

  // username and password are parameters
  async login(username: string, password: string) {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-button').click();
  }
 
  // shortcut for tests using starting point
  async loginAsStandardUser() {
    await this.goto();
    await this.login('standard_user', 'secret_sauce');
  }
}