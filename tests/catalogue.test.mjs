import test from 'node:test';
import assert from 'node:assert/strict';
import { pageRequest, priceSortValue, readCompleteCatalogue, readVisiblePage, sliceCatalogue } from '../lib/catalogue.ts';

test('all records and countries remain reachable beyond 1,000, even if the API clamps page sizes', async () => {
  const source = Array.from({ length: 1205 }, (_, id) => ({ id: String(id), country: id > 1000 ? 'jp' : 'gr' }));
  const offsets = [];
  const result = await readCompleteCatalogue(async offset => {
    offsets.push(offset);
    return { items: source.slice(offset, offset + 37), total: source.length };
  });
  assert.equal(result.length, 1205);
  assert.equal(result.at(-1).id, '1204');
  assert.ok(offsets.includes(1036));
  const japanese = result.filter(item => item.country === 'jp');
  assert.equal(sliceCatalogue(japanese, 12, 192).items.length, 12);
  assert.equal(sliceCatalogue(japanese, 12, 192).nextOffset, null);
});

test('hidden hotels advance the raw cursor without skipping visible hotels or ending pagination early', async () => {
  const source = Array.from({ length: 10 }, (_, id) => ({ id, enabled: id % 3 === 0 }));
  const read = async (limit, offset) => ({ items: source.slice(offset, offset + limit), total: source.length });
  const first = await readVisiblePage(read, 2, 0, item => item.enabled);
  const second = await readVisiblePage(read, 2, first.nextOffset, item => item.enabled);
  assert.deepEqual(first.items.map(i => i.id), [0, 3]);
  assert.equal(first.nextOffset, 4);
  assert.deepEqual(second.items.map(i => i.id), [6, 9]);
  assert.equal(second.nextOffset, null);
});

test('a short upstream page does not mean the catalogue is exhausted', async () => {
  const source = Array.from({ length: 7 }, (_, id) => ({ id }));
  const page = await readVisiblePage(async (_limit, offset) => ({ items: source.slice(offset, offset + 2), total: 7 }),
    4, 0, () => true);
  assert.deepEqual(page.items.map(i => i.id), [0, 1, 2, 3]);
  assert.equal(page.nextOffset, 4);
});

test('upstream failures are errors, never cached empty catalogues', async () => {
  await assert.rejects(readCompleteCatalogue(async () => { throw new Error('503'); }), /503/);
  await assert.rejects(readVisiblePage(async () => { throw new Error('503'); }, 12, 0, () => true), /503/);
});

test('ignored offsets and unexpectedly empty pages fail instead of looping or silently truncating', async () => {
  await assert.rejects(readCompleteCatalogue(async () => ({ items: [{ id: 'same' }], total: 1205 })), /no progress/);
  await assert.rejects(readCompleteCatalogue(async () => ({ items: [], total: 1 })), /no progress/);
  await assert.rejects(readVisiblePage(async () => ({ items: [], total: 5 }), 12, 0, () => true), /stopped/);
});

test('normalization bounds work per request without bounding the total catalogue', () => {
  assert.deepEqual(pageRequest(12, 530000, ' GR '), { limit: 12, offset: 530000, country: 'gr' });
  assert.deepEqual(pageRequest(9, 0, ''), { limit: 9, offset: 0, country: null });
  for (const [limit, offset, country] of [[0, 0, null], [1000, 0, null], [12, -1, null], [12, NaN, null], [12, 0, 'gr&limit=1000']]) {
    assert.throws(() => pageRequest(limit, offset, country));
  }
});

test('exact last pages and empty countries have no unnecessary load-more request', () => {
  const items = Array.from({ length: 24 }, (_, id) => id);
  assert.equal(sliceCatalogue(items, 12, 0).nextOffset, 12);
  assert.equal(sliceCatalogue(items, 12, 12).nextOffset, null);
  assert.deepEqual(sliceCatalogue([], 12, 0), { items: [], total: 0, nextOffset: null });
});

test('unpriced offers remain visible after priced offers and zero is a valid price', () => {
  const offers = [null, { value: 80 }, { value: 0 }, { value: 105 }];
  offers.sort((a, b) => priceSortValue(a) - priceSortValue(b));
  assert.deepEqual(offers, [{ value: 0 }, { value: 80 }, { value: 105 }, null]);
});
