(function (root) {
  'use strict';
  // Fixed-rate loan math. payment = P*i / (1 - (1+i)^-n), i = annual rate / 12, n = months.
  function payment(P, ratePct, months) {
    var i = ratePct / 1200;
    if (months <= 0) return NaN;
    return i === 0 ? P / months : P * i / (1 - Math.pow(1 + i, -months));
  }
  // Simulate with an optional extra principal payment each month. Rounds the balance to cents each month like a lender.
  function schedule(P, ratePct, months, extra) {
    var i = ratePct / 1200, pay = Math.round(payment(P, ratePct, months) * 100) / 100, bal = P, rows = [], paid = 0, intTot = 0, m = 0;
    extra = extra || 0;
    while (bal > 0.004 && m < months + 1) {
      m++;
      var int = Math.round(bal * i * 100) / 100, pr = Math.min(bal, pay - int + extra), thisPay;
      if (m === months && extra === 0) pr = bal; // last payment absorbs rounding
      bal = Math.round((bal - pr) * 100) / 100; thisPay = int + pr; paid += thisPay; intTot += int;
      rows.push({ m: m, interest: int, principal: pr, balance: bal });
      if (pay - int + extra <= 0) break; // payment does not cover interest
    }
    return { payment: pay, months: m, totalInterest: Math.round(intTot * 100) / 100, totalPaid: Math.round(paid * 100) / 100, rows: rows, ok: bal <= 0.004 };
  }
  // Compare with and without extra payment
  function compare(P, ratePct, months, extra) {
    var a = schedule(P, ratePct, months, 0), b = schedule(P, ratePct, months, extra);
    return { base: a, fast: b, monthsSaved: a.months - b.months, interestSaved: Math.round((a.totalInterest - b.totalInterest) * 100) / 100 };
  }
  // How much the monthly payment moves for rate changes
  function sensitivity(P, ratePct, months, deltas) {
    var base = payment(P, ratePct, months);
    return deltas.map(function (d) { var r = Math.max(0, ratePct + d), p = payment(P, r, months); return { rate: r, payment: p, delta: p - base, extraInterest: p * months - P - (base * months - P) }; });
  }
  function money(v, dec) { var neg = v < 0; v = Math.abs(v); var s = (dec === 0 ? Math.round(v) : v).toFixed(dec == null ? 2 : dec).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (neg ? '-' : '') + '$' + s; }
  function span(months) { var y = Math.floor(months / 12), m = months % 12; return (y ? y + ' yr' + (y > 1 ? 's' : '') : '') + (y && m ? ' ' : '') + (m || !y ? m + ' mo' : ''); }
  var api = { payment: payment, schedule: schedule, compare: compare, sensitivity: sensitivity, money: money, span: span };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Loan = api;
})(typeof window !== 'undefined' ? window : this);
