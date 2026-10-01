var E = require('./engine.js'), n = 0, bad = 0;
function eq(a, b, m, t) { n++; if (!(Math.abs(a - b) <= (t == null ? 1e-9 : t))) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
// Widely published payments (finatopia, saving.org, nuvixcalc): $200,000 at 6% for 30 yrs = $1,199.10; 15 yrs = $1,687.71
eq(E.payment(200000, 6, 360), 1199.10, '200k 6% 30y', 0.005); eq(E.payment(200000, 6, 180), 1687.71, '200k 6% 15y', 0.005);
eq(E.payment(100000, 5, 360), 536.82, '100k 5% 30y', 0.005); eq(E.payment(300000, 7, 360), 1995.91, '300k 7% 30y', 0.005);
// 30-year total interest on $200k at 6% is about $231,676
var s = E.schedule(200000, 6, 360, 0);
eq(s.totalInterest, 231676, 'total interest', 5); is(s.months, 360, '360 months'); is(s.ok, true, 'pays off'); eq(s.payment, 1199.10, 'rounded pay', 1e-9);
eq(s.rows[0].interest, 1000, 'first interest'); eq(s.rows[0].principal, 199.10, 'first principal', 1e-9); eq(s.rows[359].balance, 0, 'last balance');
eq(s.totalPaid, 200000 + s.totalInterest, 'paid = principal + interest', 0.01);
// 0% rate: P / n, no interest
eq(E.payment(12000, 0, 12), 1000, 'zero rate'); eq(E.schedule(12000, 0, 12, 0).totalInterest, 0, 'zero interest');
// 15-year loan total interest = 15*12*1687.71 - 200000, about 103,788
eq(E.schedule(200000, 6, 180, 0).totalInterest, 103788, '15y interest', 5);
// extra payments: shorter, cheaper, ends at zero
var c = E.compare(200000, 6, 360, 200); is(c.fast.months < 360, true, 'extra shortens'); is(c.interestSaved > 0, true, 'extra saves'); is(c.fast.ok, true, 'extra pays off'); eq(c.monthsSaved, 360 - c.fast.months, 'months saved');
is(c.fast.months >= 200 && c.fast.months <= 270, true, 'extra 200 lands 200-270 months');
eq(E.compare(200000, 6, 360, 0).interestSaved, 0, 'no extra saves 0');
// doubling the first-month principal: extra just adds to principal
eq(E.schedule(200000, 6, 360, 500).rows[0].principal, 699.10, 'extra added to first principal', 1e-9);
// sensitivity: higher rate -> higher payment, symmetric zero delta
var q = E.sensitivity(200000, 6, 360, [-1, 0, 1]); is(q[0].payment < q[1].payment && q[1].payment < q[2].payment, true, 'monotone'); eq(q[1].delta, 0, 'zero delta'); eq(q[2].rate, 7, 'rate'); eq(q[2].payment, 1330.60, '200k 7%', 0.005);
// formatting
is(E.money(1199.1), '$1,199.10', 'money'); is(E.money(231676.4, 0), '$231,676', 'money0'); is(E.money(-5), '-$5.00', 'neg'); is(E.span(360), '30 yrs', '30 yrs'); is(E.span(13), '1 yr 1 mo', '1y1m'); is(E.span(5), '5 mo', '5mo'); is(E.span(12), '1 yr', '1yr');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
