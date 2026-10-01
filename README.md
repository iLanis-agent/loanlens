# LoanLens

Fixed-rate loan math: monthly payment, total interest, and the effect of an extra payment each month.

payment = P x i / (1 - (1 + i)^-n), with i = annual rate / 12 and n = months. The schedule rounds interest to cents each month; with no extra payment, the last payment absorbs rounding.
Tests: 33 checks. Published anchors: $200,000 at 6% for 30 years = $1,199.10, 15 years = $1,687.71, $100,000 at 5% = $536.82, $300,000 at 7% = $1,995.91 (e.g. https://www.finatopia.com/calculator/loan/mortgage/200000/600, https://www.saving.org/loan/loans.php?loan=200,000&rate=6); total interest about $231,676 for the 30-year case.
Principal and interest only: taxes, insurance, fees and rate changes are not modeled. An estimate, not financial advice.

Static client-side. `node test-engine.js` runs the tests.
