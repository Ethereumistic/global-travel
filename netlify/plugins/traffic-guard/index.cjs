module.exports = {
  onPostBuild({ netlifyConfig }) {
    netlifyConfig.redirects ??= [];
    const existingRules = netlifyConfig.redirects.filter(rule => rule.rate_limit);
    if (existingRules.length) {
      throw new Error('Traffic guard needs both Free-plan rate-limit rules. Remove conflicting rate-limit rules before deploying.');
    }

    // onPostBuild runs after the Next adapter creates its image CDN redirects.
    // Identity forward rules retain the URL and let normal framework routing
    // continue. Native rate limiting rejects excessive requests before Next.js;
    // no application middleware, edge function or external counter is required.
    for (const [from, to, limit] of [
      ['/api/*', '/api/:splat', 30],
      ['/*', '/:splat', 120],
    ]) {
      netlifyConfig.redirects.push({
        from, to, status: 200,
        rate_limit: {
          window_limit: limit,
          window_size: 60,
          aggregate_by: ['ip', 'domain'],
        },
      });
    }
    console.log('Traffic guard configured: API 30/min, other matched requests 120/min per IP/domain. Check Netlify post-processing logs for native rule acceptance.');
  },
};
