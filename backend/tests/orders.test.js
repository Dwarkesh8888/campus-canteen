const http = require('http');
const app = require('../server');

let server;
let port;
let baseUrl;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: null, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('=== Running Task 4: Orders Service Tests ===');

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    // Test 1: POST /api/v1/orders with valid payload
    console.log('Test 1: Valid order POST');
    const res1 = await makeRequest('POST', '/api/v1/orders', {
      itemName: 'Samosa',
      qty: 2,
      weightG: 100
    });
    assert(res1.status === 201, `Expected status 201, got ${res1.status}`);
    assert(res1.body.itemName === 'Samosa', 'Expected itemName to be Samosa');
    assert(res1.body.qty === 2, 'Expected qty to be 2');
    assert(res1.body.weightG === 100, 'Expected weightG to be 100');
    assert(res1.body.kcal === 520, `Expected kcal 520 (260*100/100*2), got ${res1.body.kcal}`);
    assert(res1.body.id, 'Expected generated id');
    const createdId = res1.body.id;
    console.log('✓ Passed');

    // Test 2: POST /api/v1/orders with defaults (missing qty and weightG)
    console.log('Test 2: Defaults for omitted qty and weightG');
    const res2 = await makeRequest('POST', '/api/v1/orders', {
      itemName: 'Masala Chai'
    });
    assert(res2.status === 201, `Expected status 201, got ${res2.status}`);
    assert(res2.body.qty === 1, 'Expected default qty 1');
    assert(res2.body.weightG === 100, 'Expected default weightG 100');
    assert(res2.body.kcal === 50, `Expected kcal 50, got ${res2.body.kcal}`);
    console.log('✓ Passed');

    // Test 3: Reject unknown itemName
    console.log('Test 3: Reject unknown itemName');
    const res3 = await makeRequest('POST', '/api/v1/orders', {
      itemName: 'Pizza'
    });
    assert(res3.status === 400, `Expected status 400, got ${res3.status}`);
    assert(res3.body && res3.body.error, 'Expected error message in body');
    console.log('✓ Passed');

    // Test 4: Reject invalid qty (0, 11, decimal, negative)
    console.log('Test 4: Reject invalid qty');
    const res4a = await makeRequest('POST', '/api/v1/orders', { itemName: 'Samosa', qty: 0 });
    assert(res4a.status === 400, 'Expected 400 for qty=0');
    const res4b = await makeRequest('POST', '/api/v1/orders', { itemName: 'Samosa', qty: 11 });
    assert(res4b.status === 400, 'Expected 400 for qty=11');
    const res4c = await makeRequest('POST', '/api/v1/orders', { itemName: 'Samosa', qty: 1.5 });
    assert(res4c.status === 400, 'Expected 400 for fractional qty');
    const res4d = await makeRequest('POST', '/api/v1/orders', { itemName: 'Samosa', qty: 'two' });
    assert(res4d.status === 400, 'Expected 400 for string qty');
    console.log('✓ Passed');

    // Test 5: Reject invalid weightG (0, negative, string)
    console.log('Test 5: Reject invalid weightG');
    const res5a = await makeRequest('POST', '/api/v1/orders', { itemName: 'Veg Thali', weightG: 0 });
    assert(res5a.status === 400, 'Expected 400 for weightG=0');
    const res5b = await makeRequest('POST', '/api/v1/orders', { itemName: 'Veg Thali', weightG: -50 });
    assert(res5b.status === 400, 'Expected 400 for negative weightG');
    console.log('✓ Passed');

    // Test 6: GET /api/v1/orders
    console.log('Test 6: GET /api/v1/orders returns array');
    const res6 = await makeRequest('GET', '/api/v1/orders');
    assert(res6.status === 200, 'Expected 200 for GET all');
    assert(Array.isArray(res6.body), 'Expected array response');
    assert(res6.body.length >= 2, 'Expected at least 2 orders');
    console.log('✓ Passed');

    // Test 7: GET /api/v1/orders/:id
    console.log('Test 7: GET /api/v1/orders/:id');
    const res7a = await makeRequest('GET', `/api/v1/orders/${createdId}`);
    assert(res7a.status === 200, 'Expected 200 for existing ID');
    assert(res7a.body.id === createdId, 'Expected matching order ID');

    const res7b = await makeRequest('GET', '/api/v1/orders/non-existent-id-999');
    assert(res7b.status === 404, 'Expected 404 for missing ID');
    assert(res7b.body && res7b.body.error, 'Expected error message');
    console.log('✓ Passed');

    // Test 8: DELETE /api/v1/orders/:id
    console.log('Test 8: DELETE /api/v1/orders/:id');
    const res8a = await makeRequest('DELETE', `/api/v1/orders/${createdId}`);
    assert(res8a.status === 200, 'Expected 200 on successful delete');

    const res8b = await makeRequest('DELETE', `/api/v1/orders/${createdId}`);
    assert(res8b.status === 404, 'Expected 404 on deleting already deleted order');
    console.log('✓ Passed');

    // Test 9: GET /api/v1/boom unhandled error handling
    console.log('Test 9: GET /api/v1/boom triggers centralized error middleware');
    const res9 = await makeRequest('GET', '/api/v1/boom');
    assert(res9.status === 500, `Expected status 500, got ${res9.status}`);
    assert(res9.body && res9.body.error === 'Something went wrong', `Expected { error: "Something went wrong" }, got: ${JSON.stringify(res9.body)}`);
    assert(!res9.raw.includes('stack'), 'Response must not contain stack trace');
    console.log('✓ Passed');

    console.log('\n🎉 ALL TASK 4 TESTS PASSED SUCCESSFULLY!\n');
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error('Test suite failed:', err);
    process.exit(1);
  });
}

module.exports = runTests;
