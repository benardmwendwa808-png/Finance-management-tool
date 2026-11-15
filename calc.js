(function (root) {
  const toMinor = (x) => Math.round(Number(x) * 100);

  function quote(o) {
    const base = Number(o.baseUsd);
    if (!(base >= 0)) throw new Error('Enter a base price of 0 or more.');
    const qty = Math.max(1, Math.floor(Number(o.qty) || 1));
    const subtotal = toMinor(base) * qty;
    const rush = o.rush ? Math.round((subtotal * (Number(o.rushPct) || 0)) / 100) : 0;
    const total = subtotal + rush;
    const deposit = Math.round((total * (Number(o.depositPct) || 0)) / 100);
    if (o.currency !== 'KES') {
      return { currency: 'USD', subtotal, rush, total, deposit, balance: total - deposit };
    }
    const fx = Number(o.fx);
    if (!(fx > 0)) throw new Error('Enter a KES rate above 0.');
    const c = (m) => Math.round(m * fx);
    const kTotal = c(total);
    const kSub = c(subtotal);
    const kDep = c(deposit);
    return { currency: 'KES', subtotal: kSub, rush: kTotal - kSub, total: kTotal, deposit: kDep, balance: kTotal - kDep };
  }

  function format(minor, currency) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);
  }

  function snippet(o, q) {
    const f = (m) => format(m, q.currency);
    const qty = Math.max(1, Math.floor(Number(o.qty) || 1));
    const L = [];
    L.push('Hi' + (o.client ? ' ' + o.client : '') + ', here is your quote for ' + o.service + '.', '');
    if (qty > 1) L.push('Quantity: ' + qty);
    L.push('Price: ' + f(q.subtotal));
    if (q.rush) L.push('Rush delivery: ' + f(q.rush));
    L.push('Total: ' + f(q.total));
    if (Number(o.depositPct) > 0) {
      L.push('', 'To start, pay a ' + o.depositPct + '% deposit of ' + f(q.deposit) + (o.link ? ': ' + o.link : '.'));
      L.push('The balance of ' + f(q.balance) + ' is due on delivery.');
    }
    if (Number(o.validDays) > 0) L.push('', 'This quote is valid for ' + o.validDays + ' days.');
    return L.join('\n');
  }

  const api = { quote, format, snippet, toMinor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Calc = api;
})(typeof window !== 'undefined' ? window : globalThis);
