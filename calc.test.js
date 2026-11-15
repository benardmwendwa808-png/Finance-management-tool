const test = require('node:test');
const assert = require('node:assert');
const { quote, snippet } = require('./calc.js');

test('plain USD quote', () => {
  const q = quote({ baseUsd: 100, qty: 1, depositPct: 50, currency: 'USD' });
  assert.deepStrictEqual([q.total, q.deposit, q.balance], [10000, 5000, 5000]);
});
test('rush 25%', () => {
  const q = quote({ baseUsd: 100, qty: 1, rush: true, rushPct: 25, depositPct: 50, currency: 'USD' });
  assert.deepStrictEqual([q.rush, q.total, q.deposit], [2500, 12500, 6250]);
});
test('rounding: 33.33 + 25% rush', () => {
  const q = quote({ baseUsd: 33.33, qty: 1, rush: true, rushPct: 25, depositPct: 50, currency: 'USD' });
  assert.deepStrictEqual([q.rush, q.total, q.deposit, q.balance], [833, 4166, 2083, 2083]);
});
test('deposit + balance always equals total', () => {
  const q = quote({ baseUsd: 99.99, qty: 1, rush: true, rushPct: 10, depositPct: 50, currency: 'USD' });
  assert.strictEqual(q.deposit + q.balance, q.total);
  assert.strictEqual(q.total, 10999);
});
test('KES conversion at 129', () => {
  const q = quote({ baseUsd: 100, qty: 1, depositPct: 50, currency: 'KES', fx: 129 });
  assert.deepStrictEqual([q.total, q.deposit, q.balance], [1290000, 645000, 645000]);
});
test('KES needs a rate; negative price rejected', () => {
  assert.throws(() => quote({ baseUsd: 10, currency: 'KES', fx: 0 }));
  assert.throws(() => quote({ baseUsd: -1, currency: 'USD' }));
});
test('snippet includes deposit link', () => {
  const o = { service: 'Logo', client: 'Amina', qty: 1, depositPct: 50, link: 'https://pay.example/x', validDays: 7 };
  const s = snippet(o, quote({ ...o, baseUsd: 100, currency: 'USD' }));
  assert.match(s, /Hi Amina/);
  assert.match(s, /https:\/\/pay\.example\/x/);
});
