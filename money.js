(function (root) {
  const m = (x) => Math.round(Number(x) * 100);
  function invoice(o) {
    const g = m(o.gross);
    if (!(g > 0)) throw new Error('Enter an amount above 0.');
    const plat = Math.round((g * (Number(o.platPct) || 0)) / 100) + m(o.platFixed || 0);
    const wd = Math.round(((g - plat) * (Number(o.wdPct) || 0)) / 100) + m(o.wdFixed || 0);
    const net = g - plat - wd;
    const fx = o.cur === 'KES' ? 1 : Number(o.fx);
    if (!(fx > 0)) throw new Error('Enter an exchange rate above 0.');
    const grossK = Math.round(g * fx), netK = Math.round(net * fx);
    const tax = o.paid ? Math.round((grossK * (Number(o.taxPct) || 0)) / 100) : 0;
    return { plat, wd, net, grossK, netK, tax, takeHome: netK - tax };
  }
  const api = { invoice };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Money = api;
})(typeof window !== 'undefined' ? window : globalThis);
