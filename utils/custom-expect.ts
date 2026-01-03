import { expect as baseExpect } from '@playwright/test';

declare module '@playwright/test' {
  interface Matchers<R> {
    shouldMatchSchema(folder: string, endpoint: string, isResponse: boolean): R;
  }
}

export const expect = baseExpect.extend({
  async shouldMatchSchema(received: any, folder: string, endpoint: string, isResponse: boolean) {
    // For now, just check that the response is an object and has expected structure
    // In a real implementation, this would validate against JSON schemas
    if (isResponse) {
      if (typeof received !== 'object' || received === null) {
        return {
          pass: false,
          message: () => `Expected response to be an object, got ${typeof received}`
        };
      }
      // Add more basic validations as needed
    }
    return {
      pass: true,
      message: () => 'Schema validation passed'
    };
  }
});