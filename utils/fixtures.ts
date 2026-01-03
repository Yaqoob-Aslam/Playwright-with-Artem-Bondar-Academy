import { test as base } from '@playwright/test';

class APIHelper {
  private baseURL = 'https://conduit-api.bondaracademy.com/api';
  private request: any;
  private token: string | null = null;
  private currentPath = '';
  private currentBody: any = null;
  private currentParams: any = {};

  constructor(request: any) {
    this.request = request;
  }

  private async ensureAuthenticated() {
    if (!this.token) {
      // Login to get token
      const loginResponse = await this.request.post(`${this.baseURL}/users/login`, {
        data: {
          user: {
            email: 'pwtest@test.com',
            password: 'Welcome2'
          }
        }
      });
      const loginData = await loginResponse.json();
      this.token = loginData.user.token;
    }
  }

  path(path: string) {
    this.currentPath = path;
    return this;
  }

  body(body: any) {
    this.currentBody = body;
    return this;
  }

  params(params: any) {
    this.currentParams = params;
    return this;
  }

  private getHeaders() {
    const headers: any = {};
    // Only add auth for requests that need it
    if (this.needsAuth()) {
      if (!this.token) {
        throw new Error('Authentication required but no token available');
      }
      headers['Authorization'] = `Token ${this.token}`;
    }
    return headers;
  }

  private needsAuth() {
    // Based on HAR analysis, these endpoints require auth
    return this.currentPath.includes('/articles') && (this.currentBody !== null || this.currentPath.match(/\/articles\/[^\/]+/) || this.currentPath.includes('/comments'));
  }

  async getRequest(expectedStatus: number = 200) {
    const url = this.buildUrl();
    const headers = this.getHeaders();

    const response = await this.request.get(url, { headers });
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status()}`);
    }
    return await response.json();
  }

  async postRequest(expectedStatus: number = 201) {
    await this.ensureAuthenticated();
    const url = this.buildUrl();
    const headers = this.getHeaders();

    const response = await this.request.post(url, {
      data: this.currentBody,
      headers
    });
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status()}`);
    }
    return await response.json();
  }

  private buildUrl() {
    let url = this.baseURL + this.currentPath;
    const params = new URLSearchParams();
    Object.keys(this.currentParams).forEach(key => {
      params.append(key, this.currentParams[key]);
    });
    const paramString = params.toString();
    if (paramString) {
      url += '?' + paramString;
    }
    return url;
  }

  async deleteRequest(expectedStatus: number = 204) {
    await this.ensureAuthenticated();
    const url = this.buildUrl();
    const headers = this.getHeaders();

    const response = await this.request.delete(url, { headers });
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${response.status()}`);
    }
    // For 204 No Content, return empty object instead of trying to parse JSON
    if (response.status() === 204) {
      return {};
    }
    return await response.json();
  }
}

type MyFixtures = {
  api: APIHelper;
};

export const test = base.extend<MyFixtures>({
  api: async ({ request }, use) => {
    const apiHelper = new APIHelper(request);
    await use(apiHelper);
  },
});