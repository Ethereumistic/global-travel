import test from 'node:test';
import assert from 'node:assert/strict';
import { readPlanetDetail } from '../lib/planet-detail-request.ts';

const id = 'c7081135-b74c-4f59-8dec-50e2103de21d';

test('supplier denial, throttling and outages never become a cacheable missing offer', async () => {
  for (const status of [403, 429, 500, 503]) {
    await assert.rejects(readPlanetDetail('hotels', id, async () => new Response('', { status })), new RegExp(`HTTP ${status}`));
  }
  await assert.rejects(readPlanetDetail('hotels', id, async () => { throw new Error('connection reset'); }), /connection reset/);
});

test('only a real upstream 404 is a missing offer', async () => {
  const item = { id, name: 'Existing hotel' };
  assert.equal(await readPlanetDetail('hotels', id, async () => new Response('', { status: 404 })), null);
  assert.deepEqual(await readPlanetDetail('hotels', id, async () => Response.json(item)), item);
});

test('invalid route IDs do not make supplier requests', async () => {
  let requests = 0;
  const fetcher = async () => { requests++; return Response.json({}); };
  for (const value of ['wp-admin.php', '../countries', `${id}?limit=1000`, 'random-scan']) {
    assert.equal(await readPlanetDetail('hotels', value, fetcher), null);
  }
  assert.equal(requests, 0);
});
