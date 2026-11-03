import test from 'node:test';
import assert from 'node:assert/strict';
import plugin from '../netlify/plugins/traffic-guard/index.cjs';

test('native guards preserve image CDN and existing redirects ahead of the wildcard', () => {
  const imageRule = { from: '/_next/image', to: '/.netlify/images', status: 200 };
  const existingRedirect = { from: '/old-contact', to: '/contact', status: 301 };
  const config = { redirects: [imageRule, existingRedirect] };
  plugin.onPostBuild({ netlifyConfig: config });
  assert.deepEqual(config.redirects.slice(0, 2), [imageRule, existingRedirect]);
  const guards = config.redirects.slice(2);
  assert.deepEqual(guards.map(r => [r.from, r.to, r.status]), [
    ['/api/*', '/api/:splat', 200], ['/*', '/:splat', 200],
  ]);
  assert.ok(guards.every(r => r.rate_limit.aggregate_by.includes('ip')));
});

test('conflicting rules fail the build rather than silently exceeding the free allowance', () => {
  const config = { redirects: [{ from: '/other', to: '/other', rate_limit: {} }] };
  assert.throws(() => plugin.onPostBuild({ netlifyConfig: config }), /both Free-plan/);
  assert.equal(config.redirects.length, 1);
});
