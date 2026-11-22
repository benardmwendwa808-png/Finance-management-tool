const test = require('node:test'); const assert = require('node:assert');
const { invoice } = require('./money.js');
test('matches the Sheet example row', () => {
  const r = invoice({ gross: 150, cur: 'USD', fx: 129, platPct: 5, platFixed: 0.5, wdPct: 1, wdFixed: 0, taxPct: 1.5, paid: true });
  assert.deepStrictEqual([r.plat, r.wd, r.net, r.grossK, r.netK, r.tax, r.takeHome], [800, 142, 14058, 1935000, 1813482, 29025, 1784457]);
});
test('KES needs no rate; unpaid has no tax', () => {
  const r = invoice({ gross: 50000, cur: 'KES', taxPct: 1.5, paid: false });
  assert.deepStrictEqual([r.netK, r.tax], [5000000, 0]);
});
test('rejects bad input', () => {
  assert.throws(() => invoice({ gross: 0, cur: 'KES' }));
  assert.throws(() => invoice({ gross: 10, cur: 'USD', fx: 0 }));
});
