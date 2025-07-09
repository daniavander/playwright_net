import { type Page, expect, request, APIRequestContext, APIResponse } from '@playwright/test';
import fs from 'fs';

export class ApiFuncs {
  readonly page: Page;
  readonly request: APIRequestContext;

  constructor(page: Page) {
    this.page = page;
  }

  async apiCall(request: APIRequestContext, method: string, url: string, headers: any, data?: any, timeout = 20_000) {
    let response: APIResponse;
    const options: any = { headers, timeout };

    // Only add 'data' for methods that support a body
    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      options.data = data;
    }
    console.log(timeout)

    switch (method.toUpperCase()) {
      case 'GET':
        response = await request.get(url, options);
        break;
      case 'POST':
        response = await request.post(url, options);
        break;
      case 'PUT':
        response = await request.put(url, options);
        break;
      case 'PATCH':
        response = await request.patch(url, options);
        break;
      case 'DELETE':
        response = await request.delete(url, options);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    // Try to parse JSON, but fallback to text if not JSON
    let responseBody: any;
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    return { response, responseBody };
  }
}
