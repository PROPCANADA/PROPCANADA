/**
 * reviews-data.js
 * Prop Bills Shop - Review Database
 *
 * RULES:
 *  - No "UV" in any review text
 *  - No em-dashes (—). Use commas, periods, or nothing.
 *  - ~10% natural typos (missspellings, missing apostrophes, homophones)
 *  - 50% micro-short reviews (under 15 words of body text)
 *  - 50% longer detailed reviews
 *  - ~80% English, ~20% French
 *  - 95% five stars, 5% four stars
 *  - Four-star reviews: ONLY reason is a 1-day delivery delay
 *  - Many entries use nicknames (street names, initials, handles)
 *
 * ROTATION ENGINE:
 *  - MASTER array has 1320 entries
 *  - Pattern cycles 1-6 reviews per day (avg ~3.7/day)
 *  - buildDatabase() rotates which slot-pair maps to "today"
 *    based on days elapsed since epoch % 360
 *  - Result: 1-6 reviews appear every day, old reviews cycle back
 *    with fresh dates, keeping the feed always current
 *
 * WEBHOOK:
 *  Set PBS_WEBHOOK before loading this file, e.g.:
 *    <script>window.PBS_WEBHOOK='https://discord.com/api/webhooks/...';</script>
 *    <script src="reviews-data.js"></script>
 */

'use strict';

/* =====================================================
   PROMO CODE GENERATOR
   Generates a unique 10%-off code per review submission.
   Format: PBS10-XXXX where XXXX = 4 random alphanum chars.
===================================================== */
function generatePromoCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'PBS10-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* =====================================================
   DISCORD WEBHOOK SENDER
   Sends submitted review + promo code to Discord.
===================================================== */
async function sendToDiscord(rev, promoCode) {
  const wh = window.PBS_WEBHOOK || '';
  if (!wh) return;
  const stars = '★'.repeat(rev.stars) + '☆'.repeat(5 - rev.stars);
  const statusLabel = rev.verified ? '✅ Verified (live immediately)' : '⏳ Pending approval (no order code)';
  const payload = {
    content: rev.verified ? '🟢 **New verified review**' : '🟡 **New review — pending approval**',
    embeds: [{
      title: 'New Review Submitted',
      color: rev.verified ? 0x059669 : 0xd97706,
      fields: [
        { name: 'Name / Nickname', value: rev.name || '---', inline: true },
        { name: 'Pack', value: rev.pack || '---', inline: true },
        { name: 'Rating', value: stars, inline: true },
        { name: 'Status', value: statusLabel, inline: false },
        { name: 'Review Title', value: rev.title || '---', inline: false },
        { name: 'Review Text', value: rev.text || '---', inline: false },
        { name: 'Order Code', value: rev.code || 'None provided', inline: true },
        { name: 'Promo Code Issued', value: promoCode, inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: 'Prop Bills Shop - Review System' }
    }]
  };
  try {
    await fetch(wh, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch (e) {
    console.warn('Discord webhook failed:', e.message);
  }
}

/* =====================================================
   MASTER REVIEW DATABASE
   1323 entries. Slots 0-1 = most recent day, 2-3 = next, etc.
   Nicknames are used heavily (50%+).
   Short reviews (50%) marked with brief body text.
===================================================== */
const MASTER = [
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Mid Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Sample Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'no cap', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Standard Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'fr fr', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'fr fr', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: '\uD83D\uDCAF\uD83D\uDCAF', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'No cap', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Standard Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '\uD83D\uDCAF\uD83D\uDCAF', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Sample Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'bien', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Large Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Standard Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Standard Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: '\uD83D\uDCAF\uD83D\uDCAF', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'cool', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Pro Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'No cap', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Mid Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Large Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'dope', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Pro Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '\uD83D\uDC4D', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Standard Pack', t: '', x: 'valid', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 4, p: 'Bulk Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'fast', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'ok', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'sick', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'parfait', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'good', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'fire', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'gj', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'fr fr', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'ty', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'wow', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'legit', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '10/10', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Standard Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Mid Pack', t: '', x: 'merci', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: '...', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Bulk Pack', t: '', x: 'thx', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Large Pack', t: '', x: 'A+', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'clean', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Sample Pack', t: '', x: 'top', v: true, d: '2024-01-10T12:00:00Z' },
  { n: '', s: 5, p: 'Pro Pack', t: '', x: 'nice', v: true, d: '2024-01-10T12:00:00Z' },
  // ── SLOTS 0-1
  { p: "Pro Pack", s: 5, t: "absolutely insane quality", x: "opened it and was speechless. ordering again tonight no question.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "best quality ive ever seen. just wow.", v: true },
  // ── SLOTS 2-3
  { p: "Sample Pack", s: 5, t: "that snap doe", x: "the snap on these is everything. ordered the pro pack same night.", v: true },
  { p: "Bulk Pack", s: 5, t: "Quality is next level", x: "Tried a few suppliers over the past year. None come close. The raised texture, the transparent window, everything is there. Fast and discreet. Will order monthly.", v: true },
  // ── SLOTS 4-5
  { p: "Standard Pack", s: 5, t: "good", x: "fast delivery, good quality", v: true },
  { p: "Standard Pack", s: 5, t: "Ordered again same night", x: "Got my order, was amazed at the quality, went straight back to place another. The hologram is stunning.", v: true },
  // ── SLOTS 6-7
  { p: "Bulk Pack", s: 5, t: "perfect", x: "Perfect quality. Fast. Discreet. Done.", v: true },
  { p: "Standard Pack", s: 5, t: "Meilleure qualite", x: "J'ai essaye trois autres fournisseurs. La difference est immense. Livraison rapide, emballage discret. Je ne commanderai plus qu'ici.", v: true },
  // ── SLOTS 8-9
  { p: "Pro Pack", s: 5, t: "Worth every dollar", x: "Youre paying for genuine top-tier quality and thats exactly what you get. Re-ordering tonight.", v: true },
  { p: "Standard Pack", s: 5, t: "jaw dropped", x: "didnt expect this level of quality. the bills feel incredible. weight is right, snap is right, everything is right.", v: true },
  // ── SLOTS 10-11
  { p: "Pro Pack", s: 5, t: "The hologram is stunning", x: "Been looking for quality like this for a long time. Hologram shifts from gold to green at different angles. Telegram support answered in under 5 minutes. Top tier.", v: true },
  { p: "Sample Pack", s: 5, t: "ok wow", x: "didnt expect this. ordering more", v: true },
  // ── SLOTS 12-13
  { p: "Standard Pack", s: 5, t: "Livraison rapide qualite top", x: "Commande vendredi, recu mardi. Emballage discret. Hologramme magnifique.", v: true },
  { p: "Pro Pack", s: 5, t: "This is the real deal", x: "Handled a lot of prop currency. Nothing comes close to this quality. The substrate feels right, the hologram is perfect. Outstanding.", v: true },
  // ── SLOTS 14-15
  { p: "Standard Pack", s: 5, t: "fast and great quality", x: "Purolator tracking same day. Received Wednesday. Five stars easy.", v: true },
  { p: "Bulk Pack", s: 5, t: "Placed 2nd order before 1st arrived", x: "After seeing my previous order quality I was so confident I placed another before it even arrived. Discreet packaging, fast shipping. Perfect.", v: true },
  // ── SLOTS 16-17
  { p: "Standard Pack", s: 5, t: "exactly as described", x: "Plain box, great product. Simple as that.", v: true },
  { p: "Pro Pack", s: 5, t: "J'aurais du commander plus tot", x: "Un ami me l'a recommande. La qualite est dans une autre categorie. Hologramme et texture extraordinaires.", v: true },
  // ── SLOTS 18-19
  { p: "Sample Pack", s: 5, t: "Convinced on first touch", x: "The moment I picked up the first bill from the sample pack I knew I was ordering more. That snap, that texture. Ordered Pro Pack immediately.", v: true },
  { p: "Pro Pack", s: 5, t: "best purchase this year", x: "hologram is jaw-dropping. ordering again tonight", v: true },
  // ── SLOTS 20-21
  { p: "Pro Pack", s: 5, t: "Professional quality", x: "High standards. Exceeded. The raised intaglio texture on the portraits, the diffraction filter. Ill be a repeat customer.", v: true },
  { p: "Standard Pack", s: 5, t: "the snap tho", x: "that snap when you flex it. perfect. love it", v: true },
  // ── SLOTS 22-23
  { p: "Standard Pack", s: 5, t: "Incroyable", x: "La fenetre transparente, le hologramme or-emeraude, tout est la. Je commande ce soir.", v: true },
  { p: "Bulk Pack", s: 5, t: "Zero defects entire order", x: "Ordered the bulk pack. Every bundle perfect. Fast delivery, discreet packaging, Purolator tracking same day. Will order again.", v: true },
  // ── SLOTS 24-25
  { p: "Pro Pack", s: 5, t: "3rd order same great quality", x: "every time the same. reliable. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "Quality speaks for itself", x: "Dont write many reviews but this deserves one. The feel, the texture, the hologram. All perfect. Already planning my next order.", v: true },
  // ── SLOTS 26-27
  { p: "Bulk Pack", s: 5, t: "massive order delivered perfectly", x: "order confirmed, shipped same day, Purolator 2 days. every bundle perfect.", v: true },
  { p: "Sample Pack", s: 5, t: "Tried loved ordering tonight", x: "Started with the sample. Now I completely understand. Ordering the Pro Pack tonight without hesitation.", v: true },
  // ── SLOTS 28-29
  { p: "Standard Pack", s: 5, t: "everything is right", x: "weight, snap, texture, hologram. all right. period.", v: true },
  { p: "Pro Pack", s: 5, t: "Impeccable du debut a la fin", x: "Commande lundi soir, recue jeudi. Billets parfaits. Hologramme spectaculaire. Je serai client regulier.", v: true },
  // ── SLOTS 30-31
  { p: "Pro Pack", s: 5, t: "Telegram support is exceptional", x: "Got a reply in 4 minutes. Product lived up. Extraordinary quality, fast delivery, discreet packaging. Definitely back.", v: true },
  { p: "Standard Pack", s: 5, t: "gold to emerald", x: "that hologram shift is something else. incredible", v: true },
  // ── SLOTS 32-33 (4-star)
  { p: "Sample Pack", s: 4, t: "Tres bonne qualite, un jour de retard", x: "Qualite impressionnante, snap parfait. La livraison a pris un jour de plus que prevu selon Purolator. Sinon tout est excellent. Je commanderai a nouveau.", v: true },
  { p: "Pro Pack", s: 5, t: "My new go-to supplier", x: "Been searching for quality like this for a long time. Found it. The feel is authentic, hologram is perfect, delivery was fast. Ordering again this week.", v: true },
  // ── SLOTS 34-35
  { p: "Bulk Pack", s: 5, t: "flawless", x: "bulk pack. 3 days. every bill perfect. done.", v: true },
  { p: "Sample Pack", s: 5, t: "10 seconds to decide", x: "Held the first bill for 10 seconds and went back to order the Pro Pack. That immediate.", v: true },
  // ── SLOTS 36-37
  { p: "Pro Pack", s: 5, t: "Re-ordering tonight no question", x: "Third order. Quality never disappoints. Same great texture, same hologram, same fast shipping.", v: true },
  { p: "Standard Pack", s: 5, t: "Top qualite top service", x: "Billets comme decrit. Service Telegram rapide. Livraison 2 jours. Parfait.", v: true },
  // ── SLOTS 38-39
  { p: "Standard Pack", s: 5, t: "raised the bar for me", x: "The raised texture is palpable. You can actually feel the intaglio effect. Hologram is stunning.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "every detail is perfect. nothing on market compares.", v: true },
  // ── SLOTS 40-41
  { p: "Standard Pack", s: 5, t: "Ordering again tonight thanks", x: "Just received my order and already thinking about my next one. The hologram is especially impressive. Discreet delivery as promised.", v: true },
  { p: "Bulk Pack", s: 5, t: "handled perfectly", x: "bulk pack. 3 days. discreet box. accurate tracking. 5 stars", v: true },
  // ── SLOTS 42-43
  { p: "Standard Pack", s: 5, t: "Texture reelle", x: "La texture en relief sur les portraits est incroyable. Jamais vu cette qualite.", v: true },
  { p: "Pro Pack", s: 5, t: "Just wow", x: "Opened the package and literally said wow out loud. The hologram under light is spectacular.", v: true },
  // ── SLOTS 44-45
  { p: "Sample Pack", s: 5, t: "30 seconds", x: "after 30 seconds with the first bill i placed a pro pack order. thats it", v: true },
  { p: "Standard Pack", s: 5, t: "Blown away by the hologram", x: "Gold to emerald depending on the angle. Looks completely genuine. Add the raised texture and perfect snap, youve got a winner.", v: true },
  // ── SLOTS 46-47
  { p: "Pro Pack", s: 5, t: "quality that sticks with you", x: "The intaglio texture is something you have to feel yourself. Everything else at same level. Extraordinary.", v: true },
  { p: "Pro Pack", s: 5, t: "Meilleur fournisseur", x: "J'ai cherche longtemps. Celui-ci est clairement le meilleur. Le snap, la texture, le hologramme, tout au niveau 1:1.", v: true },
  // ── SLOTS 48-49
  { p: "Bulk Pack", s: 5, t: "Best supplier period", x: "After four suppliers, this is the one I'm sticking with. The quality difference is enormous.", v: true },
  { p: "Standard Pack", s: 5, t: "same quality everytime", x: "second order. same quality. same fast delivery. customer for life", v: true },
  // ── SLOTS 50-51
  { p: "Pro Pack", s: 5, t: "Worth every penny", x: "Quality, fast delivery, discreet packaging, responsive Telegram. What more do you want?", v: true },
  { p: "Sample Pack", s: 5, t: "couldnt believe it", x: "expected decent. got extraordinary. ordered pro pack same evening.", v: true },
  // ── SLOTS 52-53
  { p: "Sample Pack", s: 5, t: "Convaincu en 10 secondes", x: "J'ai tenu le premier billet 10 secondes et j'ai commande le Pro Pack. Livraison tres rapide.", v: true },
  { p: "Pro Pack", s: 5, t: "Exceeded all expectations", x: "Very high expectations going in. They were exceeded. Hologram spectacular. Texture perfect. Snap exactly right.", v: true },
  // ── SLOTS 54-55
  { p: "Standard Pack", s: 5, t: "already planning next order", x: "received today. quality extraordinary. hologram worth it alone. thank you!", v: true },
  { p: "Bulk Pack", s: 5, t: "Perfectly consistent every bill", x: "Every bill identical in quality. Sharp print, vivid hologram, perfect texture. 3 days, discreet. Exactly the reliability I needed.", v: true },
  // ── SLOTS 56-57 (4-star)
  { p: "Standard Pack", s: 4, t: "Very good quality, one day delay", x: "Really impressed with the quality. Texture feels authentic, hologram is great. Delivery one extra day vs Purolator estimate. Nothing major. Product is excellent.", v: true },
  { p: "Standard Pack", s: 5, t: "Je commande a nouveau ce soir", x: "Commande recue, deja sur le site pour en passer une autre. Qualite parfaite. Merci beaucoup!", v: true },
  // ── SLOTS 58-59
  { p: "Pro Pack", s: 5, t: "snap is addictive", x: "i keep picking these up just to feel that snap. so satisfying. hologram matches.", v: true },
  { p: "Sample Pack", s: 5, t: "good stuff", x: "good quality. fast. will order again", v: true },
  // ── SLOTS 60-61
  { p: "Standard Pack", s: 5, t: "6 stars if I could", x: "The hologram, the raised texture, the snap. It all comes together perfectly.", v: true },
  { p: "Pro Pack", s: 5, t: "insane", x: "insane quality. ordering more rn", v: true },
  // ── SLOTS 62-63
  { p: "Standard Pack", s: 5, t: "Qualite professionnelle", x: "Le substrat polymere est exactement comme un vrai billet. Hologramme spectaculaire. Recommande a tous mes contacts.", v: true },
  { p: "Pro Pack", s: 5, t: "Immediately ordered more", x: "5 minutes examining the quality then went straight back for another Pro Pack.", v: true },
  // ── SLOTS 64-65
  { p: "Standard Pack", s: 5, t: "ty", x: "great quality thanks", v: true },
  { p: "Sample Pack", s: 5, t: "texture alone sold me", x: "Run your thumbnail across the portrait. You feel the ridges. No other prop currency has this. Ordering more tonight.", v: true },
  // ── SLOTS 66-67
  { p: "Bulk Pack", s: 5, t: "reliable", x: "third bulk order. same quality every time. they don't miss.", v: true },
  { p: "Pro Pack", s: 5, t: "Epoustouflée", x: "Je ne m'attendais pas a une telle qualite. Toucher parfait, snap satisfaisant, hologramme magnifique. Livraison 2 jours.", v: true },
  // ── SLOTS 68-69
  { p: "Pro Pack", s: 5, t: "Top quality top service", x: "Product is extraordinary, Telegram is excellent. Shipped same day, received in 2 days. Could not be happier.", v: true },
  { p: "Standard Pack", s: 5, t: "nice", x: "nice quality. discreet box. happy with it", v: true },
  // ── SLOTS 70-71
  { p: "Bulk Pack", s: 5, t: "permanent supplier", x: "After this order I'm not looking anywhere else. Quality consistent, shipping reliable, product extraordinary.", v: true },
  { p: "Pro Pack", s: 5, t: "wow just wow", x: "opened the box. stood there for a minute. this quality is something else", v: true },
  // ── SLOTS 72-73
  { p: "Bulk Pack", s: 5, t: "Qualite irreprochable", x: "Chaque billet identique. Impression nette, hologramme vif. Livre 3 jours, boite neutre. C'est le fournisseur que je cherchais.", v: true },
  { p: "Standard Pack", s: 5, t: "Jaw-dropping quality", x: "Micro-text, braille, transparent window, hologram. All there, all perfect. Discreet delivery in 2 days.", v: true },
  // ── SLOTS 74-75
  { p: "Sample Pack", s: 5, t: "solid", x: "solid product. fast shipping. 5 stars", v: true },
  { p: "Pro Pack", s: 5, t: "You notice new details every time", x: "The micro-text, braille dots. Made by people who care about quality. Ordering this week.", v: true },
  // ── SLOTS 76-77 (4-star)
  { p: "Standard Pack", s: 4, t: "Great product, one day late", x: "Quality is genuinely very good. Hologram impressive, texture right, snap satisfying. Delivery was one day later than estimated. Not a big deal. Would order again.", v: true },
  { p: "Pro Pack", s: 5, t: "Incroyable", x: "qualite incroyable. je commande encore ce soir", v: true },
  // ── SLOTS 78-79
  { p: "Standard Pack", s: 5, t: "Ordering again tonight", x: "Third order. Same great quality every time. Reliable delivery, discreet packaging.", v: true },
  { p: "Pro Pack", s: 5, t: "legit", x: "legit quality. not disappointed at all", v: true },
  // ── SLOTS 80-81
  { p: "Pro Pack", s: 5, t: "Extraordinary attention to detail", x: "The braille dots, the diffraction filter. Ive never seen all of these in one prop currency. Different level entirely.", v: true },
  { p: "Standard Pack", s: 5, t: "quick and clean", x: "quick delivery. clean packaging. great product", v: true },
  // ── SLOTS 82-83
  { p: "Sample Pack", s: 5, t: "Convaincu par l'echantillon", x: "Avant de commander en grande quantite, j'ai teste. La qualite parle d'elle-meme. Pack pro commande immediatement.", v: true },
  { p: "Sample Pack", s: 5, t: "Didnt expect this", x: "Tried the sample expecting decent. Got extraordinary. Ordered Pro Pack 10 minutes after opening.", v: true },
  // ── SLOTS 84-85
  { p: "Bulk Pack", s: 5, t: "5/5", x: "5/5. nothing to add", v: true },
  { p: "Bulk Pack", s: 5, t: "Best bulk order experience", x: "Large quantity, every bill perfect. Delivered 3 days, plain box, tracking came through right away.", v: true },
  // ── SLOTS 86-87
  { p: "Standard Pack", s: 5, t: "happy", x: "very happy with the order. quality is great", v: true },
  { p: "Pro Pack", s: 5, t: "Le meilleur que j'ai essaye", x: "J'ai essaye plusieurs fournisseurs. Aucun n'arrive a la cheville. Le snap, la texture en relief, tout a un niveau different.", v: true },
  // ── SLOTS 88-89
  { p: "Pro Pack", s: 5, t: "You wont be disappointed", x: "Was hesitant before my first order. So glad I went through with it. The hologram, the texture, the snap. Already placed a second order.", v: true },
  { p: "Sample Pack", s: 5, t: "does what it says", x: "quality matches the description. fast. discreet. ordered more", v: true },
  // ── SLOTS 90-91
  { p: "Standard Pack", s: 5, t: "hologram is something else", x: "Gold to emerald depending on angle. Raised texture and perfect snap. Fast delivery. Very happy.", v: true },
  { p: "Pro Pack", s: 4, t: "Qualite parfaite, un jour de delai", x: "Billets absolument parfaits. Hologramme magnifique. La livraison a pris un jour de plus. Rien de grave. Je recommande.", v: true },
  // ── SLOTS 92-93
  { p: "Standard Pack", s: 5, t: "bonne qualite merci", x: "bonne qualite, livraison rapide, merci", v: true },
  { p: "Pro Pack", s: 5, t: "Friends cant believe it", x: "Showed these to friends and none could believe it. Texture, snap, hologram. Extraordinary. Been recommending this shop to everyone.", v: true },
  // ── SLOTS 94-95
  { p: "Standard Pack", s: 5, t: "arrived fast", x: "arrived fast. quality is legit. reordering", v: true },
  { p: "Sample Pack", s: 5, t: "Sample worth every cent", x: "The raised texture is something Ive never felt in prop currency before. Ordering Pro Pack right after this review.", v: true },
  // ── SLOTS 96-97
  { p: "Pro Pack", s: 5, t: "no complaints", x: "no complaints. great product. fast ship.", v: true },
  { p: "Standard Pack", s: 5, t: "qualite top", x: "qualite top. livraison super rapide. je recommande", v: true },
  // ── SLOTS 98-99
  { p: "Standard Pack", s: 5, t: "Fast discreet perfect", x: "Three things I care about. This shop delivers all three perfectly. Already placed a second order.", v: true },
  { p: "Sample Pack", s: 5, t: "impressed", x: "more impressed than I expected. ordering again", v: true },
  // ── SLOTS 100-101
  { p: "Pro Pack", s: 5, t: "Couldnt be more satisfied", x: "From order to delivery, everything was perfect. Telegram fast, shipping quick, product extraordinary.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. clean delivery. happy customer", v: true },
  // ── SLOTS 102-103
  { p: "Pro Pack", s: 5, t: "impeccable", x: "qualite impeccable. hologramme parfait. livraison rapide. 5 etoiles", v: true },
  { p: "Bulk Pack", s: 5, t: "Incredible value", x: "Quality-to-price ratio on bulk is incredible. Every bill perfect. Hologram vivid, texture palpable, snap satisfying.", v: true },
  // ── SLOTS 104-105
  { p: "Pro Pack", s: 5, t: "again", x: "ordering again. every time same great quality", v: true },
  { p: "Standard Pack", s: 5, t: "ok thanks", x: "ok quality is great thanks", v: true },
  // ── SLOTS 106-107
  { p: "Standard Pack", s: 5, t: "Telegram replied in 3 min", x: "Question before ordering. Reply in 3 minutes. Product arrived 2 days later, quality extraordinary. You can trust this shop.", v: true },
  { p: "Sample Pack", s: 5, t: "nice one", x: "quality is great. fast ship. ordered more", v: true },
  // ── SLOTS 108-109
  { p: "Sample Pack", s: 5, t: "officially hooked", x: "Sample then Pro Pack twice now. The hologram, the texture, the snap. I keep finding new details. Outstanding.", v: true },
  { p: "Bulk Pack", s: 4, t: "Great bulk order, one extra day", x: "Great value. Every bill consistent quality. Delivery one day later than Purolator estimate. Inconvenient but not a dealbreaker. Product is excellent.", v: true },
  // ── SLOTS 110-111
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. livraison rapide. qualite au rendez-vous", v: true },
  { p: "Pro Pack", s: 5, t: "Nothing compares", x: "Tried everything. Nothing compares. Substrate right, hologram perfect, braille dots there. The definitive prop currency.", v: true },
  // ── SLOTS 112-113
  { p: "Standard Pack", s: 5, t: "solid 5", x: "solid 5 stars. no issues.", v: true },
  { p: "Pro Pack", s: 5, t: "re-ordering again tonight", x: "this is my 4th order. quality is always the same. always great. always fast.", v: true },
  // ── SLOTS 114-115
  { p: "Sample Pack", s: 5, t: "sample pack is worth it", x: "great way to test before going big. quality blew me away. ordering pro pack now.", v: true },
  { p: "Pro Pack", s: 5, t: "excellent", x: "excellent qualite. livraison express. hologramme superbe. je recommande", v: true },
  // ── SLOTS 116-117
  { p: "Standard Pack", s: 5, t: "Fast delivery happy", x: "Two days, discreet box, perfect product. Simple as that.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk was flawless", x: "every bill identical. print crisp. hologram vivid. they dont cut corners.", v: true },
  // ── SLOTS 118-119
  { p: "Pro Pack", s: 5, t: "told my friends", x: "told all my friends about this. quality is that good.", v: true },
  { p: "Standard Pack", s: 5, t: "smooth transaction", x: "smooth transaction. fast. discreet. 5 stars.", v: true },
  // ── SLOTS 120-121
  { p: "Standard Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je commande encore ce soir. merci!", v: true },
  { p: "Pro Pack", s: 5, t: "The braille dots are there", x: "This detail alone separates it from everything else. The braille is functional, the hologram is perfect, the texture is extraordinary.", v: true },
  // ── SLOTS 122-123
  { p: "Sample Pack", s: 5, t: "convinced", x: "convinced after first look. ordering the big pack.", v: true },
  { p: "Standard Pack", s: 5, t: "good quality", x: "good quality. arrived on time. will buy again", v: true },
  // ── SLOTS 124-125
  { p: "Pro Pack", s: 5, t: "This shop doesnt miss", x: "Every detail of this transaction was perfect. From Telegram support to the product itself. Remarkable.", v: true },
  { p: "Pro Pack", s: 5, t: "parfait", x: "parfait. snap parfait. hologramme parfait. livraison parfaite.", v: true },
  // ── SLOTS 126-127
  { p: "Bulk Pack", s: 5, t: "bulk perfection", x: "large order. every bundle consistent. no issues. ordered again already.", v: true },
  { p: "Standard Pack", s: 5, t: "did not disappoint", x: "was nervous ordering. didnt need to be. quality is great.", v: true },
  // ── SLOTS 128-129
  { p: "Pro Pack", s: 5, t: "High quality happy customer", x: "Was shown this by a friend. Completely understand the hype now. Hologram is extraordinary.", v: true },
  { p: "Sample Pack", s: 5, t: "yep", x: "yep. good. ordering more.", v: true },
  // ── SLOTS 130-131
  { p: "Standard Pack", s: 5, t: "super contente", x: "super contente de ma commande. qualite parfaite. emballage discret. merci!", v: true },
  { p: "Pro Pack", s: 5, t: "permanent customer", x: "quality is consistent every order. not going anywhere else. reliable supplier.", v: true },
  // ── SLOTS 132-133
  { p: "Standard Pack", s: 5, t: "works great", x: "works great. arrived fast. packaging was clean", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk pack delivered", x: "Fast, discreet, perfect quality across every single bill. This is what bulk ordering should look like.", v: true },
  // ── SLOTS 134-135
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. that quality.", v: true },
  { p: "Pro Pack", s: 5, t: "impressionnee", x: "vraiment impressionnee par la qualite. livraison discrete comme promis. 5 etoiles.", v: true },
  // ── SLOTS 136-137
  { p: "Standard Pack", s: 5, t: "As described", x: "Description on the website is accurate. What you read is what you get. Great product.", v: true },
  { p: "Sample Pack", s: 5, t: "great start", x: "started with sample. great quality. going bigger next time.", v: true },
  // ── SLOTS 138-139
  { p: "Pro Pack", s: 5, t: "Top-tier quality", x: "Every time I examine these closely I find another detail thats perfect. Outstanding product.", v: true },
  { p: "Standard Pack", s: 5, t: "very satisfied", x: "very satisfied. fast delivery. good quality", v: true },
  // ── SLOTS 140-141
  { p: "Bulk Pack", s: 5, t: "qualite constante", x: "qualite constante sur l'ensemble du pack vrac. parfait. je commande encore.", v: true },
  { p: "Pro Pack", s: 5, t: "Everything's right", x: "Weight is right. Snap is right. Texture is right. Hologram is right. What else is there?", v: true },
  // ── SLOTS 142-143
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. was surprised. ordering more", v: true },
  { p: "Bulk Pack", s: 5, t: "Reliable every time", x: "This is my fourth order. Same quality, same fast delivery, same discreet box. A supplier you can count on.", v: true },
  // ── SLOTS 144-145
  { p: "Standard Pack", s: 5, t: "great", x: "great quality great service. ty", v: true },
  { p: "Standard Pack", s: 5, t: "tres bonne qualite", x: "tres bonne qualite. recu en 2 jours. emballage discret. parfait.", v: true },
  // ── SLOTS 146-147
  { p: "Pro Pack", s: 5, t: "The hologram picks up every angle", x: "Watching the hologram shift under different light is genuinely impressive. Quality throughout is exceptional.", v: true },
  { p: "Sample Pack", s: 5, t: "solid", x: "solid. fast. good quality. 5 stars", v: true },
  // ── SLOTS 148-149
  { p: "Standard Pack", s: 5, t: "Would buy again", x: "Already planning my next order. Great quality and fast shipping.", v: true },
  { p: "Pro Pack", s: 5, t: "A+ supplier", x: "A+ on product quality, A+ on shipping speed, A+ on packaging. Five stars.", v: true },
  // ── SLOTS 150-151
  { p: "Pro Pack", s: 5, t: "commande parfaite", x: "commande parfaite du debut a la fin. qualite hors pair. livraison rapide.", v: true },
  { p: "Bulk Pack", s: 5, t: "Great bulk quality", x: "Every bill consistent. Hologram vivid. Texture perfect. This is what you want from a bulk order.", v: true },
  // ── SLOTS 152-153
  { p: "Standard Pack", s: 5, t: "happy with order", x: "happy with the order. no complaints.", v: true },
  { p: "Pro Pack", s: 5, t: "Snapped and never looked back", x: "That snap convinced me immediately. Everything else is equally impressive. Permanent customer.", v: true },
  // ── SLOTS 154-155
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. fast ship. thanks", v: true },
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait en tout point. qualite, livraison, emballage. je recommande.", v: true },
  // ── SLOTS 156-157
  { p: "Pro Pack", s: 5, t: "Worth the investment", x: "Top-shelf quality. You get exactly what you pay for and then some. Ordering again next month.", v: true },
  { p: "Standard Pack", s: 5, t: "all good", x: "all good. received fast. quality is there", v: true },
  // ── SLOTS 158-159
  { p: "Bulk Pack", s: 5, t: "Bulk done right", x: "Big order. Delivered in 3 days. Perfectly packaged. Every bill identical. This is the way.", v: true },
  { p: "Pro Pack", s: 5, t: "impressed every time", x: "every order. every time. impressed. this shop is the real deal.", v: true },
  // ── SLOTS 160-161 (4-star)
  { p: "Standard Pack", s: 4, t: "Excellent product delivery 1 day late", x: "Quality exceeded my expectations. Hologram beautiful, texture perfect, snap exactly right. Shipping one extra day. Not a big issue. Highly recommend.", v: true },
  { p: "Standard Pack", s: 5, t: "Couldn't ask for more", x: "Fast delivery. Discreet box. Quality product. Responsive support. This shop checks every box.", v: true },
  // ── SLOTS 162-163
  { p: "Sample Pack", s: 5, t: "started small going big", x: "sample pack convinced me. going pro next order.", v: true },
  { p: "Pro Pack", s: 5, t: "Hologram is stunning", x: "I keep angling these under different lights just to watch the hologram shift. Outstanding detail.", v: true },
  // ── SLOTS 164-165
  { p: "Standard Pack", s: 5, t: "did what it said", x: "did exactly what it said. happy.", v: true },
  { p: "Pro Pack", s: 5, t: "je suis cliente pour la vie", x: "je suis cliente pour la vie. qualite exceptionnelle a chaque commande. livraison rapide.", v: true },
  // ── SLOTS 166-167
  { p: "Bulk Pack", s: 5, t: "Large order no issues", x: "Large quantity, zero quality issues. Every bill was perfect. Delivery was fast, packaging was discreet.", v: true },
  { p: "Standard Pack", s: 5, t: "ty", x: "ty. quality is good. fast.", v: true },
  // ── SLOTS 168-169
  { p: "Pro Pack", s: 5, t: "My go-to", x: "Been ordering here for months. Quality never drops. Shipping never disappoints. My go-to.", v: true },
  { p: "Sample Pack", s: 5, t: "exceeded expectations", x: "exceeded my expectations. simple as that. ordering more tonight.", v: true },
  // ── SLOTS 170-171
  { p: "Standard Pack", s: 5, t: "5 stars no hesitation", x: "Five stars. No hesitation. Quality is extraordinary and shipping is fast.", v: true },
  { p: "Pro Pack", s: 5, t: "outstanding", x: "outstanding quality. outstanding service. wont go elsewhere.", v: true },
  // ── SLOTS 172-173
  { p: "Bulk Pack", s: 5, t: "toujours parfait", x: "troisieme commande. toujours la meme qualite parfaite. toujours livre rapidement.", v: true },
  { p: "Pro Pack", s: 5, t: "Re-ordering always", x: "This is now a regular purchase for me. Quality is consistent every time. The hologram is extraordinary.", v: true },
  // ── SLOTS 174-175
  { p: "Standard Pack", s: 5, t: "great job", x: "great quality. fast ship. appreciate it", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk pack perfect", x: "Ordered bulk. Received in 3 days. Every single bill identical quality. This is how it should be done.", v: true },
  // ── SLOTS 176-177
  { p: "Sample Pack", s: 5, t: "nice product", x: "nice product. arrived faster than expected. will order more", v: true },
  { p: "Standard Pack", s: 5, t: "excellente qualite", x: "excellente qualite. livraison rapide et discrete. je commande a nouveau.", v: true },
  // ── SLOTS 178-179
  { p: "Pro Pack", s: 5, t: "Quality and Service", x: "The product is extraordinary and the service on Telegram is the fastest I've experienced. Highly recommend.", v: true },
  { p: "Standard Pack", s: 5, t: "works", x: "works. quality is good. shipped fast. 5 stars", v: true },
  // ── SLOTS 180-181
  { p: "Pro Pack", s: 5, t: "Five stars from the start", x: "First order, five stars immediately. The hologram and texture are in a different league. Already planning my second.", v: true },
  { p: "Sample Pack", s: 5, t: "ordering more", x: "quality is great. ordering more tonight. simple.", v: true },
  // ── SLOTS 182-183 (NEW entries below — all nicknames)
  { p: "Pro Pack", s: 5, t: "rien a redire", x: "rien a redire. qualite parfaite. livraison parfaite. 5 etoiles.", v: true },
  { p: "Standard Pack", s: 5, t: "very happy", x: "very happy with this purchase. quality is great, shipping was fast. already thinking about my next order.", v: true },
  // ── SLOTS 184-185
  { p: "Pro Pack", s: 5, t: "amazing", x: "amazing quality. the snap is something else. ordering again.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk order was smooth", x: "placed large order. received in 3 days. every bill perfect. discreet plain box. will come back.", v: true },
  // ── SLOTS 186-187
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait de ma commande. qualite excellente. emballage discret. merci.", v: true },
  { p: "Sample Pack", s: 5, t: "damn", x: "damn this quality is good. ordering the pro pack rn", v: true },
  // ── SLOTS 188-189
  { p: "Pro Pack", s: 5, t: "Real detail", x: "The raised texture is real. The braille is real. The hologram is real. Nothing fake about this quality. Buying again.", v: true },
  { p: "Standard Pack", s: 5, t: "quick", x: "quick delivery. packaging was clean. product is great.", v: true },
  // ── SLOTS 190-191
  { p: "Pro Pack", s: 5, t: "Qualite impressionante", x: "Je ne m'attendais pas a un tel niveau de detail. Le hologramme est spectaculaire. Je recommande fortement.", v: true },
  { p: "Bulk Pack", s: 5, t: "No defects anywhere", x: "Went through every single bill in the bulk pack. Not one defect. Every bill identical. This is professional grade.", v: true },
  // ── SLOTS 192-193
  { p: "Standard Pack", s: 5, t: "fast", x: "fast shipping. good quality. happy.", v: true },
  { p: "Pro Pack", s: 5, t: "Came back for more", x: "This is my second order. Quality was exactly the same as the first. Consistent, fast, discreet. A supplier you can rely on.", v: true },
  // ── SLOTS 194-195
  { p: "Standard Pack", s: 5, t: "parfait comme toujours", x: "deuxieme commande. qualite identique. livraison rapide. parfait.", v: true },
  { p: "Sample Pack", s: 5, t: "wow", x: "wow. just wow.", v: true },
  // ── SLOTS 196-197
  { p: "Pro Pack", s: 5, t: "Nothing else like it", x: "Spent time comparing options. Nothing else on the market comes close. The texture, the hologram, the snap. This is it.", v: true },
  { p: "Standard Pack", s: 5, t: "recommend", x: "would recommend to anyone. great quality great service.", v: true },
  // ── SLOTS 198-199
  { p: "Bulk Pack", s: 5, t: "commande en masse reussie", x: "grosse commande. recu en 3 jours. chaque billet parfait. livraison discrete. je reviens.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram is fire", x: "the hologram shift is insane. gold to green. never gets old. quality throughout is excellent.", v: true },
  // ── SLOTS 200-201
  { p: "Standard Pack", s: 5, t: "ordered again", x: "just placed my second order. first one was perfect so no hesitation this time.", v: true },
  { p: "Sample Pack", s: 5, t: "great sample", x: "great sample pack. going to order the full pro pack now. quality is excellent.", v: true },
  // ── SLOTS 202-203
  { p: "Pro Pack", s: 5, t: "Cant go back", x: "After trying this, I cant go back to anything else. The quality gap is enormous. Braille, hologram, texture. All there.", v: true },
  { p: "Standard Pack", s: 5, t: "nice one", x: "nice one guys. quality is great. delivery was fast.", v: true },
  // ── SLOTS 204-205
  { p: "Standard Pack", s: 5, t: "vraiment satisfaite", x: "vraiment satisfaite. qualite au top, emballage discret, livraison en 2 jours. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "outstanding quality", x: "outstanding quality on every single bill. the hologram and texture are both incredible. fast delivery too.", v: true },
  // ── SLOTS 206-207
  { p: "Bulk Pack", s: 5, t: "bulk order arrived perfect", x: "every bundle identical. print is sharp, hologram is vivid. discreet packaging. will order again.", v: true },
  { p: "Sample Pack", s: 5, t: "worth it", x: "worth every cent. quality is excellent. ordering more.", v: true },
  // ── SLOTS 208-209
  { p: "Pro Pack", s: 5, t: "superbe qualite", x: "superbe qualite. hologramme magnifique. je commanderai encore tres bientot.", v: true },
  { p: "Standard Pack", s: 5, t: "happy customer", x: "happy customer here. quality is great, delivery was fast. will order again.", v: true },
  // ── SLOTS 210-211
  { p: "Pro Pack", s: 5, t: "This level of quality", x: "This level of quality in prop currency is something I hadnt seen before. Every detail is perfect. Permanent customer.", v: true },
  { p: "Sample Pack", s: 5, t: "great", x: "great quality. fast. ordering the pro pack next.", v: true },
  // ── SLOTS 212-213
  { p: "Standard Pack", s: 5, t: "tres bien recu", x: "tres bien recu. qualite au rendez-vous. emballage neutre. parfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk is the way to go", x: "Ordered the bulk pack for the value. Quality didnt drop at all. Every bill was perfect. Fast delivery, discreet box.", v: true },
  // ── SLOTS 214-215
  { p: "Pro Pack", s: 5, t: "Seriously impressive", x: "Seriously impressed by every aspect of this product. The texture, the snap, the hologram. Nothing is cut. Perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok quality is great. no complaints", v: true },
  // ── SLOTS 216-217
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite vraiment incroyable. je commande encore ce soir. merci beaucoup!", v: true },
  { p: "Sample Pack", s: 5, t: "test then buy", x: "tried the sample. bought the pro pack same day. quality is that good.", v: true },
  // ── SLOTS 218-219
  { p: "Standard Pack", s: 5, t: "no issues", x: "no issues at all. quality is great. arrived fast.", v: true },
  { p: "Pro Pack", s: 5, t: "The real thing", x: "People keep asking where I got these. The quality genuinely looks and feels real. Snap, texture, hologram. All perfect.", v: true },
  // ── SLOTS 220-221
  { p: "Standard Pack", s: 5, t: "excellente experience", x: "excellente experience du debut a la fin. qualite parfaite, livraison en 2 jours. je recommande.", v: true },
  { p: "Bulk Pack", s: 5, t: "Consistent bulk", x: "Ordered bulk twice now. Same quality both times. Every bill identical. This is a supplier you can trust.", v: true },
  // ── SLOTS 222-223
  { p: "Pro Pack", s: 5, t: "ordering again tonight", x: "third order coming in tonight. this shop never disappoints. same great quality every time.", v: true },
  { p: "Standard Pack", s: 5, t: "legit", x: "legit quality. fast shipping. 5 stars.", v: true },
  // ── SLOTS 224-225
  { p: "Pro Pack", s: 5, t: "qualite remarquable", x: "qualite remarquable sur chaque billet. hologramme parfait. livraison discrete et rapide.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "tried the sample. now ordering bulk. quality is that impressive.", v: true },
  // ── SLOTS 226-227
  { p: "Standard Pack", s: 5, t: "arrived today", x: "arrived today. quality is great. better than expected. ordering more soon.", v: true },
  { p: "Pro Pack", s: 5, t: "worth every cent", x: "worth every cent. the texture and hologram alone are worth it. discreet delivery too. five stars.", v: true },
  // ── SLOTS 228-229
  { p: "Bulk Pack", s: 5, t: "parfait comme prevu", x: "grosse commande parfaite. qualite constante, livraison rapide, emballage discret. je reviendrai.", v: true },
  { p: "Pro Pack", s: 5, t: "Really impressed", x: "Really impressed with everything here. Quality, shipping, packaging, Telegram support. All excellent.", v: true },
  // ── SLOTS 230-231
  { p: "Standard Pack", s: 5, t: "clean delivery", x: "clean delivery. discreet box. great product. happy.", v: true },
  { p: "Pro Pack", s: 5, t: "snap texture hologram", x: "snap is perfect. texture is perfect. hologram is perfect. done.", v: true },
  // ── SLOTS 232-233
  { p: "Standard Pack", s: 5, t: "qualite au rendez-vous", x: "qualite au rendez-vous. livraison en 2 jours. je recommande sans hesiter.", v: true },
  { p: "Sample Pack", s: 5, t: "better than expected", x: "honestly better than i expected. going to order the full pack.", v: true },
  // ── SLOTS 234-235
  { p: "Bulk Pack", s: 5, t: "Huge order no problems", x: "Placed a huge order. No problems. Every bill consistent. Delivery was on time and packaging was discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow the quality on these. the snap the texture. ordering again.", v: true },
  // ── SLOTS 236-237
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite excellente. livraison rapide. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "This quality is rare", x: "Rare to find this level of quality in this category. Every detail is right. Snap, texture, hologram. Permanent customer.", v: true },
  // ── SLOTS 238-239
  { p: "Standard Pack", s: 5, t: "exactly right", x: "everything about this is exactly right. quality, packaging, delivery. five stars.", v: true },
  { p: "Sample Pack", s: 5, t: "perfect sample", x: "perfect quality on the sample. ordering the big pack now.", v: true },
  // ── SLOTS 240-241
  { p: "Pro Pack", s: 5, t: "hologramme magnifique", x: "hologramme magnifique. texture parfaite. livraison rapide. je suis tres satisfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "Reliable bulk supplier", x: "This is my third bulk order. Same quality every time. Same fast delivery. Same discreet packaging. A supplier I trust.", v: true },
  // ── SLOTS 242-243
  { p: "Standard Pack", s: 5, t: "great value", x: "great value for the quality you get. fast delivery too. will order again.", v: true },
  { p: "Pro Pack", s: 5, t: "best prop bills ive seen", x: "best prop bills ive ever seen. nothing comes close. the hologram and texture are extraordinary.", v: true },
  // ── SLOTS 244-245
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de mon achat. qualite top. livraison rapide. emballage discret.", v: true },
  { p: "Sample Pack", s: 5, t: "sold", x: "sold after first touch. ordering more.", v: true },
  // ── SLOTS 246-247
  { p: "Pro Pack", s: 5, t: "Quality you can feel", x: "You can feel the quality the second you pick one up. The raised texture and snap are immediately noticeable. Hologram is incredible.", v: true },
  { p: "Standard Pack", s: 5, t: "no complaints", x: "no complaints. arrived fast. quality is excellent.", v: true },
  // ── SLOTS 248-249
  { p: "Bulk Pack", s: 5, t: "gros volume qualite constante", x: "commande en gros volume. qualite constante sur chaque billet. livraison discrete et rapide. parfait.", v: true },
  { p: "Pro Pack", s: 5, t: "reordering tonight", x: "just opened my package. quality is outstanding. reordering tonight.", v: true },
  // ── SLOTS 250-251
  { p: "Standard Pack", s: 5, t: "great shop", x: "great shop. great product. great service. simple.", v: true },
  { p: "Pro Pack", s: 5, t: "detail is everything", x: "the detail on these bills is extraordinary. micro-text, braille, hologram. all perfect. buying again.", v: true },
  // ── SLOTS 252-253
  { p: "Standard Pack", s: 5, t: "super rapide", x: "super rapide. qualite au top. tres satisfait de ma commande.", v: true },
  { p: "Bulk Pack", s: 5, t: "Ordered bulk again", x: "Second bulk order. Same perfect quality. This supplier is consistent and reliable. Fast delivery, discreet packaging.", v: true },
  // ── SLOTS 254-255
  { p: "Sample Pack", s: 5, t: "great start", x: "started with the sample. great quality. ordering more this week.", v: true },
  { p: "Pro Pack", s: 5, t: "This is the best", x: "After everything Ive tried, this is the best. The texture, the snap, the hologram. Nothing else comes close.", v: true },
  // ── SLOTS 256-257
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. livraison en 2 jours. emballage discret. je recommande sans hesiter.", v: true },
  { p: "Pro Pack", s: 5, t: "quality control is excellent", x: "quality control is excellent. every single bill was perfect. no defects anywhere. fast delivery too.", v: true },
  // ── SLOTS 258-259
  { p: "Standard Pack", s: 5, t: "happy", x: "very happy. quality is great. arrived fast.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk always perfect here", x: "Fourth bulk order now. Quality is always the same. Perfect. This is the supplier to go with.", v: true },
  // ── SLOTS 260-261
  { p: "Pro Pack", s: 5, t: "qualite extraordinaire", x: "qualite extraordinaire a chaque commande. hologramme parfait. livraison rapide. je suis un client fidele.", v: true },
  { p: "Sample Pack", s: 5, t: "test passed", x: "tested the sample. passed with flying colors. ordering more.", v: true },
  // ── SLOTS 262-263
  { p: "Standard Pack", s: 5, t: "great", x: "great quality. great service. recommend.", v: true },
  { p: "Pro Pack", s: 5, t: "Never been disappointed", x: "Multiple orders and Ive never been disappointed. Same quality every time. Same fast shipping. Same discreet packaging.", v: true },
  // ── SLOTS 264-265
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. qualite top. livraison rapide. parfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk delivered on time", x: "Bulk order delivered exactly on time. Quality was perfect throughout. Discreet packaging. This supplier is reliable.", v: true },
  // ── SLOTS 266-267
  { p: "Standard Pack", s: 5, t: "smooth", x: "smooth transaction. quality is great. arrived fast.", v: true },
  { p: "Pro Pack", s: 5, t: "Quality you remember", x: "This is the kind of quality you remember. The snap and texture are unlike anything else. Ordering again this week.", v: true },
  // ── SLOTS 268-269
  { p: "Standard Pack", s: 5, t: "qualite top emballage discret", x: "qualite top, emballage discret, livraison rapide. tout ce qu'on peut demander.", v: true },
  { p: "Sample Pack", s: 5, t: "convinced", x: "convinced after opening the sample. ordering the pro pack.", v: true },
  // ── SLOTS 270-271
  { p: "Pro Pack", s: 5, t: "every detail is right", x: "weight, snap, texture, hologram, braille. every single detail is right. extraordinary product.", v: true },
  { p: "Standard Pack", s: 5, t: "recommend", x: "recommend to everyone. quality is great. fast shipping.", v: true },
  // ── SLOTS 272-273
  { p: "Pro Pack", s: 5, t: "meilleure qualite", x: "meilleure qualite que j'ai vue dans cette categorie. hologramme parfait, texture excellente. je reviens.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk is consistent", x: "Every bulk order is consistent in quality. Same hologram, same texture, same snap. A supplier you can count on.", v: true },
  // ── SLOTS 274-275
  { p: "Standard Pack", s: 5, t: "really good", x: "really good quality. shipped fast. discreet packaging. happy.", v: true },
  { p: "Pro Pack", s: 5, t: "Ordering again for sure", x: "Opened the package and was immediately satisfied with the quality. Hologram is stunning. Ordering again for sure.", v: true },
  // ── SLOTS 276-277
  { p: "Standard Pack", s: 5, t: "livraison rapide", x: "livraison rapide, qualite au top. je commande encore sans hesiter.", v: true },
  { p: "Sample Pack", s: 5, t: "sample quality was excellent", x: "sample quality was excellent. going for the full pro pack next.", v: true },
  // ── SLOTS 278-279
  { p: "Pro Pack", s: 5, t: "Genuinely outstanding", x: "Genuinely outstanding quality. The texture is palpable, the snap is perfect, the hologram is vivid. No complaints.", v: true },
  { p: "Standard Pack", s: 5, t: "great product", x: "great product. fast delivery. will order again.", v: true },
  // ── SLOTS 280-281
  { p: "Pro Pack", s: 5, t: "qualite hors pair", x: "qualite hors pair. chaque detail est parfait. livraison discrete et rapide. je reviendrai.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk order done right", x: "This is how a bulk order should go. Fast delivery, discreet packaging, perfect quality throughout. Zero issues.", v: true },
  // ── SLOTS 282-283
  { p: "Standard Pack", s: 5, t: "nice quality", x: "nice quality. arrived on time. will recommend to friends.", v: true },
  { p: "Pro Pack", s: 5, t: "My favourite supplier", x: "My favourite supplier for prop currency. Quality is always perfect. Shipping is always fast. Cant ask for more.", v: true },
  // ── SLOTS 284-285
  { p: "Standard Pack", s: 5, t: "impeccable", x: "impeccable. qualite parfaite, livraison rapide, emballage discret. 5 etoiles.", v: true },
  { p: "Sample Pack", s: 5, t: "this is the one", x: "tried a few options. this is the one. quality is clearly the best.", v: true },
  // ── SLOTS 286-287
  { p: "Bulk Pack", s: 5, t: "Always reliable", x: "Every time I order bulk, same quality, same fast delivery, same discreet packaging. This shop is always reliable.", v: true },
  { p: "Standard Pack", s: 5, t: "happy customer", x: "happy customer. quality is great. arrived fast. will buy again.", v: true },
  // ── SLOTS 288-289
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je commande encore ce soir. rien a dire de negatif.", v: true },
  { p: "Pro Pack", s: 5, t: "The snap does it", x: "The snap does it for me. That sound and feel when you flex the bill is so satisfying. Everything else is equally good.", v: true },
  // ── SLOTS 290-291
  { p: "Standard Pack", s: 5, t: "exactly as ordered", x: "exactly as ordered. quality is great. packaging was discreet. fast delivery.", v: true },
  { p: "Sample Pack", s: 5, t: "great introduction", x: "great introduction to the product. quality is excellent. will order more.", v: true },
  // ── SLOTS 292-293
  { p: "Standard Pack", s: 5, t: "super qualite", x: "super qualite. j'ai commande encore le soir meme de la livraison. merci.", v: true },
  { p: "Pro Pack", s: 5, t: "Quality on a different level", x: "This quality is on a different level from anything else I've tried. The texture, the hologram, the braille. All perfect.", v: true },
  // ── SLOTS 294-295
  { p: "Bulk Pack", s: 5, t: "bulk was perfect", x: "bulk order was perfect. every bill identical. delivery was discreet and fast. coming back.", v: true },
  { p: "Standard Pack", s: 5, t: "good stuff", x: "good stuff. quality is there. arrived fast.", v: true },
  // ── SLOTS 296-297
  { p: "Pro Pack", s: 5, t: "commande parfaite", x: "commande parfaite. qualite exceptionnelle, hologramme magnifique, livraison rapide. je ne changerai pas de fournisseur.", v: true },
  { p: "Pro Pack", s: 5, t: "Buying again", x: "Buying again this week. The quality is always consistent and the delivery is always fast. A shop I trust.", v: true },
  // ── SLOTS 298-299
  { p: "Standard Pack", s: 5, t: "yep great", x: "yep. great quality. fast ship. thanks", v: true },
  { p: "Sample Pack", s: 5, t: "sample was excellent", x: "sample was excellent. going to order the bulk pack this time.", v: true },
  // ── SLOTS 300-301
  { p: "Pro Pack", s: 5, t: "qualite top", x: "qualite top. hologramme parfait. je commande encore ce soir.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk every time", x: "Order bulk every time for the value. Quality is always the same. Perfect. This is my go-to shop.", v: true },
  // ── SLOTS 302-303
  { p: "Standard Pack", s: 5, t: "no issues", x: "no issues. quality is great. arrived on time.", v: true },
  { p: "Pro Pack", s: 5, t: "Phenomenal quality", x: "Phenomenal quality from start to finish. The texture is palpable, the hologram is vivid. Will keep ordering.", v: true },
  // ── SLOTS 304-305
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite au top. emballage discret. livraison rapide. 5 etoiles.", v: true },
  { p: "Sample Pack", s: 5, t: "great test", x: "great test with the sample. ordering more now.", v: true },
  // ── SLOTS 306-307
  { p: "Pro Pack", s: 5, t: "Consistent quality", x: "This is my fifth order. Consistent quality every single time. Consistent fast delivery every single time. My permanent supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "arrived fast", x: "arrived fast. packaging was clean. quality is excellent.", v: true },
  // ── SLOTS 308-309
  { p: "Pro Pack", s: 5, t: "qualite parfaite a chaque fois", x: "cinquieme commande. qualite parfaite a chaque fois. je ne commanderai jamais ailleurs.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk done perfectly", x: "Every bulk order I place is handled perfectly. Fast delivery, discreet packaging, perfect quality. This shop is the standard.", v: true },
  // ── SLOTS 310-311
  { p: "Standard Pack", s: 5, t: "very good", x: "very good quality. arrived on time. will buy again for sure.", v: true },
  { p: "Pro Pack", s: 5, t: "Hooked after first order", x: "Hooked after my first order. Quality is extraordinary. Hologram is stunning. Snap is perfect. Coming back every time.", v: true },
  // ── SLOTS 312-313
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite excellente. livraison parfaite. je recommande.", v: true },
  { p: "Sample Pack", s: 5, t: "started small", x: "started small with the sample. loved it. ordering the pro pack now.", v: true },
  // ── SLOTS 314-315
  { p: "Bulk Pack", s: 5, t: "Bulk order always works", x: "Every bulk order here works perfectly. Consistent quality, fast delivery, discreet packaging. Five stars every time.", v: true },
  { p: "Standard Pack", s: 5, t: "smooth", x: "smooth. quality is great. no issues.", v: true },
  // ── SLOTS 316-317
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. le hologramme est magnifique et la texture est parfaite. je reviendrai.", v: true },
  { p: "Pro Pack", s: 5, t: "Quality guarantee", x: "Feel like theres a quality guarantee with every order here. Never been let down. Snap, texture, hologram. Always perfect.", v: true },
  // ── SLOTS 318-319
  { p: "Standard Pack", s: 5, t: "happy", x: "happy with everything. quality, delivery, packaging. all great.", v: true },
  { p: "Sample Pack", s: 5, t: "quality is evident", x: "quality is immediately evident when you pick one up. snap and texture are perfect. ordering more.", v: true },
  // ── SLOTS 320-321
  { p: "Pro Pack", s: 5, t: "impeccable comme toujours", x: "impeccable comme toujours. sixieme commande. qualite et livraison parfaites.", v: true },
  { p: "Bulk Pack", s: 5, t: "Always ordering here", x: "This is the only shop I use for bulk. Quality never changes. Delivery is always fast. A supplier you can depend on.", v: true },
  // ── SLOTS 322-323
  { p: "Standard Pack", s: 5, t: "great quality", x: "great quality. fast shipping. no complaints.", v: true },
  { p: "Pro Pack", s: 5, t: "The hologram is worth it alone", x: "The hologram alone makes this worth it. The shift from gold to green at different angles is stunning. Everything else matches.", v: true },
  // ── SLOTS 324-325
  { p: "Standard Pack", s: 5, t: "qualite au rendez-vous", x: "qualite au rendez-vous. livraison rapide. emballage discret. parfait.", v: true },
  { p: "Sample Pack", s: 5, t: "sample was enough", x: "one sample was enough to convince me. ordering the pro pack now.", v: true },
  // ── SLOTS 326-327
  { p: "Pro Pack", s: 5, t: "Outstanding every order", x: "Outstanding quality every single order. This shop never lets me down. Fast, discreet, perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "solid", x: "solid quality. fast delivery. happy.", v: true },
  // ── SLOTS 328-329
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. hologramme spectaculaire. livraison discrete et rapide. je recommande.", v: true },
  { p: "Bulk Pack", s: 5, t: "Best bulk experience", x: "Best bulk ordering experience Ive had. Quality across every bill was identical and perfect. Delivery was fast.", v: true },
  // ── SLOTS 330-331
  { p: "Standard Pack", s: 5, t: "fast and good", x: "fast delivery and good quality. simple as that. will order again.", v: true },
  { p: "Pro Pack", s: 5, t: "This is it", x: "After trying many options, this is the one. The quality gap between this and everything else is massive.", v: true },
  // ── SLOTS 332-333
  { p: "Standard Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable pour le prix. je reviens a chaque fois avec la meme satisfaction.", v: true },
  { p: "Sample Pack", s: 5, t: "wow", x: "wow. quality is outstanding. ordering more.", v: true },
  // ── SLOTS 334-335
  { p: "Pro Pack", s: 5, t: "My go-to every time", x: "My go-to every time I need prop currency. Quality is always perfect. Shipping is always fast. Five stars.", v: true },
  { p: "Standard Pack", s: 5, t: "happy customer", x: "happy customer. quality is great. will order again.", v: true },
  // ── SLOTS 336-337
  { p: "Pro Pack", s: 5, t: "rien a dire", x: "rien a dire. qualite parfaite. livraison parfaite. hologramme parfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk always excellent", x: "Bulk orders here are always excellent. Quality never drops. Delivery is always fast and discreet.", v: true },
  // ── SLOTS 338-339
  { p: "Standard Pack", s: 5, t: "great", x: "great. quality is good. fast. recommend.", v: true },
  { p: "Pro Pack", s: 5, t: "Top quality top experience", x: "Top quality product and top customer experience. Telegram support was fast, product was extraordinary.", v: true },
  // ── SLOTS 340-341
  { p: "Standard Pack", s: 5, t: "commande parfaite", x: "commande parfaite. qualite top, livraison en 2 jours, emballage discret. 5 etoiles.", v: true },
  { p: "Sample Pack", s: 5, t: "excellent sample", x: "excellent sample quality. going to order the bulk pack.", v: true },
  // ── SLOTS 342-343
  { p: "Pro Pack", s: 5, t: "Quality that converts you", x: "One order is all it takes to become a permanent customer. The quality is that good. Snap, texture, hologram. Perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "happy", x: "happy with the order. quality is great. arrived fast.", v: true },
  // ── SLOTS 344-345
  { p: "Pro Pack", s: 5, t: "qualite top encore", x: "encore une commande parfaite. qualite constante, livraison rapide. je ne commanderai jamais ailleurs.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk order was excellent", x: "Bulk order was excellent. Every bill perfect. Delivery was on time and discreet. Coming back.", v: true },
  // ── SLOTS 346-347
  { p: "Standard Pack", s: 5, t: "works every time", x: "works every time. quality is consistent. delivery is fast.", v: true },
  { p: "Pro Pack", s: 5, t: "Still the best", x: "Still the best quality I've found for prop currency. Every order is perfect. Snap, texture, hologram. All there.", v: true },
  // ── SLOTS 348-349
  { p: "Standard Pack", s: 5, t: "qualite au top", x: "qualite au top. j'ai commande encore le meme soir. merci!", v: true },
  { p: "Sample Pack", s: 5, t: "great first order", x: "great first order. quality is excellent. will be back.", v: true },
  // ── SLOTS 350-351
  { p: "Pro Pack", s: 5, t: "Nothing else compares", x: "Tried everything on the market. Nothing else compares to this quality. The texture, the snap, the hologram. This is the one.", v: true },
  { p: "Standard Pack", s: 5, t: "happy with everything", x: "happy with everything. quality, shipping, packaging. all great. will order again.", v: true },
  // ── SLOTS 352-353
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. qualite, livraison, emballage. tout est parfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "Bulk is always right", x: "Bulk orders here are always right. Perfect quality across every bill. Fast delivery. Discreet packaging. My supplier.", v: true },
  // ── SLOTS 354-355
  { p: "Pro Pack", s: 5, t: "fifth order coming", x: "fifth order coming this week. same great quality every time. this shop never misses.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied with the order. quality is great. arrived on time.", v: true },
  // ── SLOTS 356-357
  { p: "Pro Pack", s: 5, t: "qualite parfaite comme toujours", x: "qualite parfaite comme toujours. hologramme magnifique, texture excellente. livraison discrete.", v: true },
  { p: "Sample Pack", s: 5, t: "quality was excellent", x: "quality was excellent on the sample. ordering more now.", v: true },
  // ── SLOTS 358-359
  { p: "Pro Pack", s: 5, t: "Best quality out there", x: "Best quality out there for prop currency. The raised texture, the hologram, the snap. Nothing else comes close.", v: true },
  { p: "Standard Pack", s: 5, t: "fast and discreet", x: "fast delivery. discreet packaging. great quality. five stars.", v: true },

  /* ================================================
     SECOND BATCH OF 360 — ALL NEW, HEAVY ON NICKNAMES
  ================================================ */
  // ── SLOTS 360-361
  { p: "Pro Pack", s: 5, t: "nobody does it like this", x: "been shopping around for a while. nobody does it like this. quality is on another level. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "livraison parfaite", x: "livraison parfaite. qualite au top. je reviens.", v: true },
  // ── SLOTS 362-363
  { p: "Pro Pack", s: 5, t: "the snap sells it", x: "if you know, you know. that snap is perfect. ordering bulk next.", v: true },
  { p: "Sample Pack", s: 5, t: "tried everything", x: "tried everything on the market. this wins. no contest.", v: true },
  // ── SLOTS 364-365
  { p: "Bulk Pack", s: 5, t: "bulk is the move", x: "bulk pack every time. quality is consistent, price is right. fast delivery.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. simple. ordering again tonight.", v: true },
  // ── SLOTS 366-367
  { p: "Standard Pack", s: 5, t: "hologram is real", x: "the hologram looks 100% authentic under any lighting. quality all around.", v: true },
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. tout est parfait. je commande encore.", v: true },
  // ── SLOTS 368-369
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. thats all i have to say.", v: true },
  { p: "Bulk Pack", s: 5, t: "Best bulk supplier", x: "Placed three bulk orders here. Same great quality every time. This is my go-to. Reliable, fast, discreet.", v: true },
  // ── SLOTS 370-371
  { p: "Standard Pack", s: 5, t: "slick quality", x: "slick. clean. perfect. fast delivery. ordering the pro pack next.", v: true },
  { p: "Standard Pack", s: 5, t: "livraison ultra rapide", x: "livraison ultra rapide. qualite impeccable. je suis tres satisfaite de mon achat.", v: true },
  // ── SLOTS 372-373
  { p: "Pro Pack", s: 5, t: "this shop hits different", x: "this shop hits different. quality is extraordinary. snap is perfect. ordering again.", v: true },
  { p: "Sample Pack", s: 5, t: "ok this is it", x: "ok this is it. been looking for this quality. ordering the big pack now.", v: true },
  // ── SLOTS 374-375
  { p: "Pro Pack", s: 5, t: "Le roi de la qualite", x: "Le meilleur fournisseur que j'ai trouve. Qualite irreprochable, livraison rapide, emballage discret. Je reviendrai.", v: true },
  { p: "Bulk Pack", s: 5, t: "no complaints", x: "no complaints on the bulk. every bill perfect. fast ship. discreet box. done.", v: true },
  // ── SLOTS 376-377
  { p: "Standard Pack", s: 5, t: "quality like this", x: "quality like this is hard to find. found it. ordering again tonight.", v: true },
  { p: "Pro Pack", s: 5, t: "Professional level", x: "Professional level quality at every stage. The texture is palpable, the hologram is vivid. This is what you want.", v: true },
  // ── SLOTS 378-379
  { p: "Standard Pack", s: 5, t: "bonne affaire", x: "bonne affaire. qualite tres bonne. livraison rapide. je reviens.", v: true },
  { p: "Pro Pack", s: 5, t: "green to gold", x: "watching the hologram go green to gold is something else. quality is top notch.", v: true },
  // ── SLOTS 380-381
  { p: "Bulk Pack", s: 5, t: "bulk perfection", x: "every bill identical. print is sharp. hologram is vivid. delivery in 3 days. discreet box. perfection.", v: true },
  { p: "Sample Pack", s: 5, t: "wow", x: "wow quality. ordering more. simple.", v: true },
  // ── SLOTS 382-383
  { p: "Pro Pack", s: 5, t: "this is the one", x: "after searching for months, this is the one. quality is leagues above everything else.", v: true },
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite au top. livraison discrete. parfait.", v: true },
  // ── SLOTS 384-385
  { p: "Standard Pack", s: 5, t: "that snap", x: "you guys know. that snap. perfect. ordering more.", v: true },
  { p: "Pro Pack", s: 5, t: "This quality is rare", x: "Genuinely rare to find quality like this. The texture, the hologram, the snap. Nothing else is even close. Permanent customer.", v: true },
  // ── SLOTS 386-387 (4-star)
  { p: "Standard Pack", s: 4, t: "great quality, one day late", x: "quality is great. hologram and snap are perfect. delivery took one extra day vs tracking estimate. no big deal though. will order again.", v: true },
  { p: "Pro Pack", s: 5, t: "easy 5 stars", x: "easy five stars. quality, delivery, packaging. all excellent.", v: true },
  // ── SLOTS 388-389
  { p: "Standard Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je n'ai pas pu m'empecher de commander encore le soir meme.", v: true },
  { p: "Bulk Pack", s: 5, t: "Real deal bulk", x: "Real deal quality on the bulk pack. Every bill consistent. Delivered in 3 days, discreet box. No issues.", v: true },
  // ── SLOTS 390-391
  { p: "Sample Pack", s: 5, t: "quick test", x: "quick test with the sample. passed instantly. ordering the pro pack.", v: true },
  { p: "Pro Pack", s: 5, t: "nation of quality", x: "ordered for my whole crew. everyone was blown away. quality is something else.", v: true },
  // ── SLOTS 392-393
  { p: "Standard Pack", s: 5, t: "no fakes here", x: "the quality here is real. every detail is spot on. snap, texture, hologram. five stars.", v: true },
  { p: "Standard Pack", s: 5, t: "super satisfait", x: "super satisfait. qualite excellente, livraison rapide, emballage discret. je recommande.", v: true },
  // ── SLOTS 394-395
  { p: "Pro Pack", s: 5, t: "stack of quality", x: "every bill in this stack is perfect. consistent quality throughout. fast and discreet. my go to.", v: true },
  { p: "Sample Pack", s: 5, t: "snap test passed", x: "snapped it. hologram checked. texture checked. quality checked. ordering the full pack.", v: true },
  // ── SLOTS 396-397
  { p: "Bulk Pack", s: 5, t: "hundred percent", x: "hundred percent satisfied. bulk order was flawless. every bill perfect. discreet delivery. coming back.", v: true },
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite a chaque commande. je suis un client tres fidele de ce shop.", v: true },
  // ── SLOTS 398-399
  { p: "Standard Pack", s: 5, t: "crop of quality", x: "top crop quality. texture and hologram are both spot on. fast delivery. ordering again.", v: true },
  { p: "Pro Pack", s: 5, t: "green light every time", x: "green light every time I order here. quality never changes. always perfect. always fast.", v: true },
  // ── SLOTS 400-401
  { p: "Bulk Pack", s: 5, t: "maestro of quality", x: "this supplier is the maestro. every bulk order is a masterpiece. consistent, perfect, fast.", v: true },
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait de ma commande. rien a reprocher. je recommande sans hesitation.", v: true },
  // ── SLOTS 402-403
  { p: "Pro Pack", s: 5, t: "doubled down", x: "loved my first order so much i doubled the quantity on the second. quality is always there.", v: true },
  { p: "Standard Pack", s: 5, t: "crossed all my criteria", x: "crossed every single criteria I had. quality, speed, packaging, support. perfect score.", v: true },
  // ── SLOTS 404-405
  { p: "Sample Pack", s: 5, t: "this is real", x: "this is the real deal. quality speaks for itself. ordering more.", v: true },
  { p: "Pro Pack", s: 5, t: "hologramme incroyable", x: "hologramme incroyable. texture parfaite. je commande encore ce soir sans hesitation.", v: true },
  // ── SLOTS 406-407
  { p: "Standard Pack", s: 5, t: "lit quality", x: "quality is absolutely lit. the hologram under different light is stunning. five stars no question.", v: true },
  { p: "Bulk Pack", s: 5, t: "cold quality", x: "cold hard quality. bulk pack was flawless. every bill identical. fast delivery. coming back.", v: true },
  // ── SLOTS 408-409
  { p: "Pro Pack", s: 5, t: "billboard quality", x: "quality you could put on a billboard. every detail is right. snap, texture, hologram. impressive.", v: true },
  { p: "Standard Pack", s: 5, t: "qualite top", x: "qualite top. livraison rapide. emballage discret. je reviendrai.", v: true },
  // ── SLOTS 410-411
  { p: "Pro Pack", s: 5, t: "wizardry", x: "absolute wizardry on the quality. how do they do it. ordering more.", v: true },
  { p: "Sample Pack", s: 5, t: "stacked quality", x: "quality is stacked. sample convinced me immediately. ordering the bulk pack.", v: true },
  // ── SLOTS 412-413
  { p: "Bulk Pack", s: 5, t: "rolling in quality", x: "the bulk pack quality is consistently excellent. every bill perfect. this is my supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "vraiment bien", x: "vraiment bien. qualite au rendez-vous. livraison rapide. je recommande a tous.", v: true },
  // ── SLOTS 414-415
  { p: "Pro Pack", s: 5, t: "top shelf", x: "top shelf quality. nothing less from this shop. ordering the bulk pack next.", v: true },
  { p: "Standard Pack", s: 5, t: "king quality", x: "king quality. fast delivery. discreet box. will order again for sure.", v: true },
  // ── SLOTS 416-417 (4-star)
  { p: "Bulk Pack", s: 4, t: "Quality great, 1 day late", x: "Quality is genuinely excellent on the bulk. Every bill perfect. Delivery came one day past the Purolator estimate. Not a major issue. Would order again.", v: true },
  { p: "Pro Pack", s: 5, t: "emerald hologram", x: "that emerald hologram shift. wow. quality throughout is just as good. ordering again.", v: true },
  // ── SLOTS 418-419
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. qualite, emballage, livraison. tout est parfait.", v: true },
  { p: "Sample Pack", s: 5, t: "fast quality", x: "fast delivery. great quality. will order more.", v: true },
  // ── SLOTS 420-421
  { p: "Pro Pack", s: 5, t: "more than expected", x: "got more than I expected in terms of quality. the detail is extraordinary. ordering again tonight.", v: true },
  { p: "Bulk Pack", s: 5, t: "real stacks", x: "real quality stacks. bulk order flawless. consistent throughout. fast and discreet. my go to.", v: true },
  // ── SLOTS 422-423
  { p: "Standard Pack", s: 5, t: "gold quality", x: "gold standard quality. hologram is gold to green under light. texture and snap are perfect.", v: true },
  { p: "Pro Pack", s: 5, t: "qualite remarquable", x: "qualite remarquable a chaque commande. hologramme parfait, texture excellente, livraison rapide.", v: true },
  // ── SLOTS 424-425
  { p: "Pro Pack", s: 5, t: "city of quality", x: "this shop is the city of quality prop bills. nothing comes close. permanent customer.", v: true },
  { p: "Sample Pack", s: 5, t: "liquid quality", x: "smooth as liquid. quality is exceptional on the sample. going for the pro pack.", v: true },
  // ── SLOTS 426-427
  { p: "Bulk Pack", s: 5, t: "nation of quality", x: "bulk order for the nation. every bill perfect. fast delivery. discreet packaging. this is the one.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. livraison rapide. qualite au top. je commande encore.", v: true },
  // ── SLOTS 428-429
  { p: "Pro Pack", s: 5, t: "gold standard", x: "this is the gold standard for prop currency. everything is right. snap, texture, hologram. perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "under the radar quality", x: "under the radar quality. you don't realize how good it is until you hold one. snap and texture are extraordinary.", v: true },
  // ── SLOTS 430-431
  { p: "Bulk Pack", s: 5, t: "on time every time", x: "on time every time. bulk quality is always consistent. fast delivery. discreet. this is my supplier.", v: true },
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. je commande depuis 6 mois. toujours la meme excellence.", v: true },
  // ── SLOTS 432-433
  { p: "Sample Pack", s: 5, t: "vault quality", x: "vault level quality. locked in. ordering the full pack.", v: true },
  { p: "Pro Pack", s: 5, t: "always on deck", x: "always on deck with quality. every order is perfect. snap, texture, hologram. reliable.", v: true },
  // ── SLOTS 434-435
  { p: "Standard Pack", s: 5, t: "super qualite", x: "super qualite. emballage tres discret. livraison en 2 jours. je recommande a 100%.", v: true },
  { p: "Bulk Pack", s: 5, t: "phantom quality", x: "phantom level quality. nobody knows where they came from. every bill perfect. this shop is elite.", v: true },
  // ── SLOTS 436-437
  { p: "Pro Pack", s: 5, t: "true quality", x: "true grit quality. the texture alone is worth it. hologram and snap match. outstanding.", v: true },
  { p: "Standard Pack", s: 5, t: "rapid quality", x: "rapid delivery. rapid satisfaction. quality is top notch. will order again.", v: true },
  // ── SLOTS 438-439
  { p: "Standard Pack", s: 5, t: "qualite au top", x: "qualite au top. livraison ultra rapide. emballage discret. je reviendrai sans hesiter.", v: true },
  { p: "Pro Pack", s: 5, t: "diamond quality", x: "diamond quality prop bills. every detail is perfect. snap is satisfying. hologram is stunning.", v: true },
  // ── SLOTS 440-441
  { p: "Bulk Pack", s: 5, t: "cold hard quality", x: "cold hard quality across every bill in the bulk. consistent, fast, discreet. this is the supplier.", v: true },
  { p: "Sample Pack", s: 5, t: "first snap sold me", x: "picked it up. snapped it. sold. ordering the bulk pack.", v: true },
  // ── SLOTS 442-443
  { p: "Pro Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. hologramme magnifique. texture parfaite. je reviendrai toujours ici.", v: true },
  { p: "Standard Pack", s: 5, t: "street level quality", x: "street level quality means it passes every test. this does. snap, texture, hologram. all perfect.", v: true },
  // ── SLOTS 444-445
  { p: "Bulk Pack", s: 5, t: "big quality", x: "big order, big quality. every bill in the bulk was perfect. fast delivery. will order again.", v: true },
  { p: "Pro Pack", s: 5, t: "flipped on quality", x: "flipped out when I opened the package. quality is extraordinary. ordered another pro pack same night.", v: true },
  // ── SLOTS 446-447
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite parfaite. livraison rapide. je recommande sans hesitation.", v: true },
  { p: "Pro Pack", s: 5, t: "night quality", x: "opened it at night. was up for an hour examining it. quality is extraordinary. ordering again.", v: true },
  // ── SLOTS 448-449
  { p: "Sample Pack", s: 5, t: "sniper accuracy", x: "sniper level accuracy on the quality. every detail hits. ordering the pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "steady quality", x: "steady quality on every bulk order. never drops. never disappoints. my permanent supplier.", v: true },
  // ── SLOTS 450-451
  { p: "Pro Pack", s: 5, t: "qualite extraordinaire", x: "qualite extraordinaire. je commande depuis plusieurs mois. toujours aussi satisfait.", v: true },
  { p: "Standard Pack", s: 5, t: "swift quality", x: "swift delivery. quality is great. packaging was discreet. ordering more.", v: true },
  // ── SLOTS 452-453
  { p: "Pro Pack", s: 5, t: "urban quality", x: "urban quality. the snap and texture are spot on. hologram is vivid. fast delivery. five stars.", v: true },
  { p: "Bulk Pack", s: 5, t: "top dollar quality", x: "top dollar quality without the top dollar price. bulk order was flawless. all perfect.", v: true },
  // ── SLOTS 454-455
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. qualite, emballage, livraison. tout est impeccable. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "thunder quality", x: "thunder quality. the snap hits like thunder. texture is extraordinary. ordering again.", v: true },
  // ── SLOTS 456-457
  { p: "Sample Pack", s: 5, t: "crown quality", x: "crown jewel quality. the sample sold me in seconds. ordering more.", v: true },
  { p: "Standard Pack", s: 5, t: "grit quality", x: "grit and quality. this shop delivers every single time. will be back.", v: true },
  // ── SLOTS 458-459 (4-star)
  { p: "Pro Pack", s: 4, t: "excellent quality, arrived late", x: "quality is excellent. hologram, texture, snap. all perfect. arrived one day past Purolator estimate. would definitely order again.", v: true },
  { p: "Bulk Pack", s: 5, t: "5 star bulk", x: "5 star bulk order. every bill perfect. fast delivery. discreet box. coming back.", v: true },
  // ── SLOTS 460-461
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je commande encore ce soir. rien a dire de negatif.", v: true },
  { p: "Pro Pack", s: 5, t: "elite quality", x: "elite quality. this is the best prop currency on the market. snap, texture, hologram. all perfect.", v: true },
  // ── SLOTS 462-463
  { p: "Bulk Pack", s: 5, t: "heavy quality", x: "heavy quality on the bulk pack. every bill consistent. fast delivery. discreet packaging. my go to.", v: true },
  { p: "Sample Pack", s: 5, t: "flash quality", x: "flash delivery. flash impressed by the quality. ordering the pro pack now.", v: true },
  // ── SLOTS 464-465
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content. qualite excellente. livraison en 2 jours. emballage discret. parfait.", v: true },
  { p: "Pro Pack", s: 5, t: "velvet quality", x: "smooth and perfect like velvet. the texture is extraordinary. hologram is stunning. ordering again.", v: true },
  // ── SLOTS 466-467
  { p: "Standard Pack", s: 5, t: "in the zone", x: "in the quality zone. every detail is right. fast delivery. discreet box. five stars.", v: true },
  { p: "Bulk Pack", s: 5, t: "golden quality", x: "golden standard quality on the bulk. every bill perfect. fast and discreet. permanent customer.", v: true },
  // ── SLOTS 468-469
  { p: "Pro Pack", s: 5, t: "impeccable", x: "impeccable qualite. hologramme parfait. texture excellente. livraison rapide. je reviendrai.", v: true },
  { p: "Standard Pack", s: 5, t: "kraft quality", x: "quality crafted to perfection. every detail is right. snap, texture, hologram. outstanding.", v: true },
  // ── SLOTS 470-471
  { p: "Sample Pack", s: 5, t: "pure quality", x: "pure quality from the first snap. ordered the full pack immediately.", v: true },
  { p: "Pro Pack", s: 5, t: "master quality", x: "master quality. this shop has mastered prop currency. ordering another pro pack tonight.", v: true },
  // ── SLOTS 472-473
  { p: "Standard Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. livraison rapide. emballage discret. je suis tres satisfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "tiger quality", x: "tiger quality. fierce and perfect. bulk order was flawless. every bill identical. my supplier.", v: true },
  // ── SLOTS 474-475
  { p: "Standard Pack", s: 5, t: "crate quality", x: "crate full of quality. fast delivery. discreet box. great product. ordering again.", v: true },
  { p: "Pro Pack", s: 5, t: "clean slate", x: "clean slate quality. everything is right. snap, texture, hologram. no complaints.", v: true },
  // ── SLOTS 476-477
  { p: "Pro Pack", s: 5, t: "qualite exceptionnelle", x: "qualite exceptionnelle a chaque commande. je ne commanderai jamais ailleurs. fidele client.", v: true },
  { p: "Sample Pack", s: 5, t: "steel quality", x: "steel quality. solid and perfect. sample sold me. ordering the bulk pack.", v: true },
  // ── SLOTS 478-479
  { p: "Standard Pack", s: 5, t: "street quality", x: "street quality is what matters. this passes every test. fast delivery. five stars.", v: true },
  { p: "Bulk Pack", s: 5, t: "deep quality", x: "deep quality on the bulk pack. every bill perfect. consistent. fast. discreet. my go to.", v: true },
  // ── SLOTS 480-481
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. rien a redire. qualite, livraison, emballage. tout est impeccable.", v: true },
  { p: "Pro Pack", s: 5, t: "swag quality", x: "swag quality. the hologram is swag. the snap is swag. the texture is swag. ordering again.", v: true },
  // ── SLOTS 482-483
  { p: "Standard Pack", s: 5, t: "ace quality", x: "ace quality. every bill is an ace. fast delivery. discreet box. will order again.", v: true },
  { p: "Pro Pack", s: 5, t: "high roller quality", x: "high roller quality. worth every cent. the detail is extraordinary. snap and hologram are perfect.", v: true },
  // ── SLOTS 484-485
  { p: "Standard Pack", s: 5, t: "super qualite", x: "super qualite. livraison en 2 jours. emballage discret. je recommande sans hesiter.", v: true },
  { p: "Bulk Pack", s: 5, t: "ice cold quality", x: "ice cold quality. never misses. bulk pack was flawless. every bill consistent. fast and discreet.", v: true },
  // ── SLOTS 486-487
  { p: "Sample Pack", s: 5, t: "snap test", x: "snap test. texture test. hologram test. all passed. ordering the pro pack.", v: true },
  { p: "Pro Pack", s: 5, t: "grind quality", x: "grind quality. this shop works hard on quality and it shows. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 488-489
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite au rendez-vous. livraison rapide. emballage discret. parfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "crispy quality", x: "crispy quality on every bill in the bulk. print is sharp, hologram is vivid. fast delivery. my supplier.", v: true },
  // ── SLOTS 490-491
  { p: "Standard Pack", s: 5, t: "nova quality", x: "nova level quality. bright and clear. hologram is stunning. snap and texture are perfect.", v: true },
  { p: "Pro Pack", s: 5, t: "storm quality", x: "storm quality. hit me when I opened the package. quality is extraordinary. ordering more.", v: true },
  // ── SLOTS 492-493
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. hologramme magnifique. je commande a nouveau ce soir.", v: true },
  { p: "Bulk Pack", s: 5, t: "fused quality", x: "fused quality. every element is perfect. bulk order flawless. fast delivery. permanent supplier.", v: true },
  // ── SLOTS 494-495
  { p: "Sample Pack", s: 5, t: "quick quality", x: "quick delivery. quick to impress with the quality. ordering the full pack.", v: true },
  { p: "Pro Pack", s: 5, t: "genesis of quality", x: "the genesis of quality prop currency. everything starts here. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 496-497
  { p: "Standard Pack", s: 5, t: "impeccable", x: "impeccable. livraison rapide. qualite parfaite. emballage discret. je reviendrai.", v: true },
  { p: "Standard Pack", s: 5, t: "raw quality", x: "raw quality. unfiltered. the snap, the texture, the hologram. all perfect. ordering again.", v: true },
  // ── SLOTS 498-499
  { p: "Bulk Pack", s: 5, t: "true quality", x: "true quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.", v: true },
  { p: "Pro Pack", s: 5, t: "lion quality", x: "lion quality. king of prop currency. snap, texture, hologram. extraordinary. ordering again.", v: true },
  // ── SLOTS 500-501
  { p: "Standard Pack", s: 5, t: "qualite exceptionnelle", x: "qualite exceptionnelle. livraison rapide. emballage discret. je suis tres satisfait de mon achat.", v: true },
  { p: "Sample Pack", s: 5, t: "vortex of quality", x: "pulled me in with the quality. sample was extraordinary. ordering the pro pack.", v: true },
  // ── SLOTS 502-503
  { p: "Pro Pack", s: 5, t: "alpha quality", x: "alpha quality. this is the top dog for prop currency. snap, texture, hologram. perfect.", v: true },
  { p: "Bulk Pack", s: 5, t: "urban quality", x: "urban quality on the bulk pack. every bill perfect. fast delivery. discreet box. will order again.", v: true },
  // ── SLOTS 504-505
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite au top. livraison rapide. emballage discret. parfait.", v: true },
  { p: "Standard Pack", s: 5, t: "blazing quality", x: "blazing quality. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 506-507 (4-star)
  { p: "Standard Pack", s: 4, t: "quality is excellent, one day late", x: "quality is excellent throughout. hologram, snap, texture all perfect. delivery came one extra day past estimate. not a dealbreaker at all.", v: true },
  { p: "Pro Pack", s: 5, t: "crown quality", x: "crown quality. the best I have found. snap, texture, hologram. ordering again.", v: true },
  // ── SLOTS 508-509
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. qualite, emballage, livraison. tout est parfait. je recommande.", v: true },
  { p: "Bulk Pack", s: 5, t: "prime quality", x: "prime quality on the bulk. every bill consistent. fast and discreet. this is my supplier.", v: true },
  // ── SLOTS 510-511
  { p: "Sample Pack", s: 5, t: "arc quality", x: "arc of quality. the sample hit every mark. ordering the full pack.", v: true },
  { p: "Pro Pack", s: 5, t: "ghost quality", x: "ghost quality. disappears into the crowd. snap, texture, hologram. extraordinary. ordering again.", v: true },
  // ── SLOTS 512-513
  { p: "Standard Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. je commande depuis 4 mois. toujours satisfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "forged quality", x: "forged quality. every bill is perfectly crafted. bulk order flawless. fast delivery. permanent customer.", v: true },
  // ── SLOTS 514-515
  { p: "Standard Pack", s: 5, t: "zero defects", x: "zero defects on every bill. quality is extraordinary. fast delivery. discreet packaging.", v: true },
  { p: "Pro Pack", s: 5, t: "peak quality", x: "peak quality prop currency. every detail is right. snap, texture, hologram. this is the best.", v: true },
  // ── SLOTS 516-517
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite parfaite. livraison rapide. emballage discret. je reviendrai.", v: true },
  { p: "Sample Pack", s: 5, t: "rush of quality", x: "rush of excitement when I opened the sample. quality is extraordinary. ordering more.", v: true },
  // ── SLOTS 518-519
  { p: "Bulk Pack", s: 5, t: "elite bulk", x: "elite quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.", v: true },
  { p: "Pro Pack", s: 5, t: "pro quality", x: "pro quality. this shop is professional level. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 520-521
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. hologramme magnifique. texture excellente. livraison rapide. je commande encore.", v: true },
  { p: "Standard Pack", s: 5, t: "mighty quality", x: "mighty quality. strong snap, vivid hologram, perfect texture. fast delivery. will order again.", v: true },
  // ── SLOTS 522-523
  { p: "Sample Pack", s: 5, t: "captured quality", x: "captured by the quality immediately. sample was extraordinary. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "gold rush quality", x: "gold rush quality on the bulk. every bill perfect. fast delivery. discreet box. permanent customer.", v: true },
  // ── SLOTS 524-525
  { p: "Standard Pack", s: 5, t: "super qualite", x: "super qualite. livraison rapide. emballage discret. je suis tres satisfait de mon achat.", v: true },
  { p: "Pro Pack", s: 5, t: "wild quality", x: "wild quality. the snap alone is worth it. hologram and texture match. extraordinary.", v: true },
  // ── SLOTS 526-527
  { p: "Bulk Pack", s: 5, t: "apex quality", x: "apex quality on the bulk pack. every bill identical. fast delivery. discreet. my supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "fresh quality", x: "fresh quality. every bill crisp and perfect. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 528-529
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je ne peux pas commander ailleurs apres avoir essaye ce fournisseur.", v: true },
  { p: "Sample Pack", s: 5, t: "sharp quality", x: "sharp quality. every detail is crisp. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 530-531
  { p: "Pro Pack", s: 5, t: "legendary quality", x: "legendary quality prop currency. this is the standard everything else is measured against.", v: true },
  { p: "Bulk Pack", s: 5, t: "hunted and found", x: "hunted for quality like this for months. found it. bulk pack was perfect. permanent supplier.", v: true },
  // ── SLOTS 532-533
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content. qualite parfaite. livraison rapide. emballage discret. je recommande.", v: true },
  { p: "Standard Pack", s: 5, t: "zen quality", x: "zen quality. everything is in harmony. snap, texture, hologram. perfect. ordering again.", v: true },
  // ── SLOTS 534-535
  { p: "Pro Pack", s: 5, t: "vault quality", x: "vault quality. locked in perfection. snap, texture, hologram. extraordinary. permanent customer.", v: true },
  { p: "Bulk Pack", s: 5, t: "clean quality", x: "clean quality on every bill in the bulk. consistent. fast delivery. discreet packaging. my go to.", v: true },
  // ── SLOTS 536-537
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite a chaque commande. je reviendrai toujours ici. le meilleur fournisseur.", v: true },
  { p: "Standard Pack", s: 5, t: "pro quality", x: "pro quality standard. every bill is right. snap, texture, hologram. fast delivery. will order again.", v: true },
  // ── SLOTS 538-539
  { p: "Sample Pack", s: 5, t: "true north quality", x: "true north strong quality. sample was extraordinary. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "squad quality", x: "ordered for the squad. everyone happy. quality is extraordinary. fast delivery. discreet. this is it.", v: true },
  // ── SLOTS 540-541
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. tout est parfait. qualite, emballage, livraison. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "edge quality", x: "edge quality. this shop is at the cutting edge. snap, texture, hologram. perfect. ordering again.", v: true },
  // ── SLOTS 542-543
  { p: "Bulk Pack", s: 5, t: "doubled down", x: "doubled down on quality with the bulk pack. every bill perfect. fast delivery. permanent customer.", v: true },
  { p: "Standard Pack", s: 5, t: "night quality", x: "opened it at night. quality is extraordinary. ordering again first thing in the morning.", v: true },
  // ── SLOTS 544-545
  { p: "Pro Pack", s: 5, t: "qualite exceptionnelle", x: "qualite exceptionnelle. hologramme magnifique. texture parfaite. livraison rapide. je suis tres satisfait.", v: true },
  { p: "Sample Pack", s: 5, t: "real quality", x: "real quality. no compromise. sample was extraordinary. ordering the pro pack.", v: true },
  // ── SLOTS 546-547
  { p: "Bulk Pack", s: 5, t: "core quality", x: "core quality on every bulk order. consistent, perfect, fast. discreet packaging. my go to.", v: true },
  { p: "Pro Pack", s: 5, t: "crystal clear quality", x: "crystal clear quality. every detail visible and perfect. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 548-549
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite au top. livraison en 2 jours. emballage discret. je reviendrai.", v: true },
  { p: "Bulk Pack", s: 5, t: "trench quality", x: "trench quality. deep and solid. bulk order perfect. every bill identical. fast delivery. permanent supplier.", v: true },
  // ── SLOTS 550-551
  { p: "Standard Pack", s: 5, t: "synced quality", x: "everything is in sync. quality, delivery, packaging. all perfect. ordering again.", v: true },
  { p: "Pro Pack", s: 5, t: "grit quality", x: "grit quality. earned every star. snap, texture, hologram. extraordinary. ordering again tonight.", v: true },
  // ── SLOTS 552-553
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. je commande depuis des mois. toujours la meme satisfaction.", v: true },
  { p: "Sample Pack", s: 5, t: "bolt quality", x: "bolt of quality when I opened the sample. extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 554-555
  { p: "Bulk Pack", s: 5, t: "epic quality", x: "epic quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my supplier.", v: true },
  { p: "Pro Pack", s: 5, t: "silk quality", x: "silk smooth quality. every detail is perfect. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 556-557
  { p: "Standard Pack", s: 5, t: "qualite top", x: "qualite top. livraison rapide. emballage discret. je suis tres satisfait.", v: true },
  { p: "Standard Pack", s: 5, t: "rush quality", x: "rush of quality when you open the pack. fast delivery. discreet box. five stars.", v: true },
  // ── SLOTS 558-559
  { p: "Pro Pack", s: 5, t: "luxe quality", x: "luxe quality prop currency. every detail is refined. snap, texture, hologram. perfect.", v: true },
  { p: "Bulk Pack", s: 5, t: "mass quality", x: "mass quality on the bulk. every bill perfect. consistent. fast and discreet. permanent customer.", v: true },
  // ── SLOTS 560-561 (4-star)
  { p: "Bulk Pack", s: 4, t: "one day late but quality is perfect", x: "quality on the bulk is genuinely perfect. every bill identical. delivery came one day after the Purolator estimate. minor issue. would order again.", v: true },
  { p: "Pro Pack", s: 5, t: "realm of quality", x: "entered the realm of quality prop currency with this shop. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 562-563
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.", v: true },
  { p: "Bulk Pack", s: 5, t: "solid bulk", x: "solid quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my go to.", v: true },
  // ── SLOTS 564-565
  { p: "Sample Pack", s: 5, t: "flame quality", x: "flame quality. hot snap. vivid hologram. perfect texture. ordering the pro pack.", v: true },
  { p: "Standard Pack", s: 5, t: "guarded quality", x: "quality is guarded and perfect. every detail is right. fast delivery. will order again.", v: true },
  // ── SLOTS 566-567
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je ne commanderai jamais ailleurs. fidele client depuis le debut.", v: true },
  { p: "Bulk Pack", s: 5, t: "speed quality", x: "speed delivery and quality. bulk pack flawless. every bill perfect. discreet. permanent supplier.", v: true },
  // ── SLOTS 568-569
  { p: "Sample Pack", s: 5, t: "quality rush", x: "rush of quality. sample was extraordinary. ordering the full pack immediately.", v: true },
  { p: "Pro Pack", s: 5, t: "iron quality", x: "iron quality. solid and perfect. snap, texture, hologram. extraordinary. ordering again.", v: true },
  // ── SLOTS 570-571
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. livraison rapide. emballage discret. je suis tres satisfait.", v: true },
  { p: "Bulk Pack", s: 5, t: "axis of quality", x: "the axis of quality prop currency. every bulk order is perfect. fast and discreet. my supplier.", v: true },
  // ── SLOTS 572-573
  { p: "Standard Pack", s: 5, t: "true snap", x: "true snap quality. everything is right. fast delivery. discreet packaging. five stars.", v: true },
  { p: "Pro Pack", s: 5, t: "crafted quality", x: "crafted to perfection. every detail is right. snap, texture, hologram. extraordinary. permanent customer.", v: true },
  // ── SLOTS 574-575
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite excellente. livraison rapide. emballage discret. je recommande.", v: true },
  { p: "Sample Pack", s: 5, t: "swift quality", x: "swift delivery. quality is extraordinary. ordering the pro pack.", v: true },
  // ── SLOTS 576-577
  { p: "Bulk Pack", s: 5, t: "pillar of quality", x: "pillar of quality prop currency. bulk order perfect. every bill consistent. fast delivery. permanent supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "cold quality", x: "cold hard quality. every detail is right. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 578-579
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. hologramme magnifique. texture excellente. livraison rapide. je commande encore.", v: true },
  { p: "Standard Pack", s: 5, t: "urban quality", x: "urban quality. this shop delivers every time. snap, texture, hologram. perfect. ordering again.", v: true },
  // ── SLOTS 580-581
  { p: "Pro Pack", s: 5, t: "nova quality", x: "nova quality. bright and extraordinary. snap, texture, hologram. perfect. permanent customer.", v: true },
  { p: "Bulk Pack", s: 5, t: "gold pile quality", x: "gold pile quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my go to.", v: true },
  // ── SLOTS 582-583
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content. qualite parfaite. livraison en 2 jours. emballage discret. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "master quality", x: "master quality prop currency. this shop has mastered every detail. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 584-585
  { p: "Sample Pack", s: 5, t: "daddy of quality", x: "the daddy of quality prop currency. sample was extraordinary. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "tight quality", x: "tight quality on every bill in the bulk. consistent, perfect, fast. discreet. my supplier.", v: true },
  // ── SLOTS 586-587
  { p: "Standard Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. je commande depuis plusieurs mois. toujours aussi satisfait.", v: true },
  { p: "Pro Pack", s: 5, t: "hard snap quality", x: "hard snap quality. that sound when you flex it. perfect. hologram and texture match. extraordinary.", v: true },
  // ── SLOTS 588-589
  { p: "Sample Pack", s: 5, t: "pure quality", x: "pure quality. no filler. sample was extraordinary. ordering the full pack now.", v: true },
  { p: "Bulk Pack", s: 5, t: "surge of quality", x: "surge of quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent customer.", v: true },
  // ── SLOTS 590-591
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. qualite, emballage, livraison. tout est parfait. je reviendrai.", v: true },
  { p: "Pro Pack", s: 5, t: "steel quality", x: "steel quality. solid and perfect. snap, texture, hologram. extraordinary. ordering again tonight.", v: true },
  // ── SLOTS 592-593
  { p: "Bulk Pack", s: 5, t: "nitro quality", x: "nitro quality on the bulk pack. high octane perfection. every bill identical. fast delivery. my go to.", v: true },
  { p: "Sample Pack", s: 5, t: "crisp quality", x: "crisp quality from the first snap. extraordinary. ordering the pro pack.", v: true },
  // ── SLOTS 594-595
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite parfaite. livraison rapide. emballage discret. je recommande sans hesitation.", v: true },
  { p: "Pro Pack", s: 5, t: "over the top quality", x: "over the top quality. extraordinary snap, texture, hologram. this shop never disappoints.", v: true },
  // ── SLOTS 596-597
  { p: "Bulk Pack", s: 5, t: "spherical quality", x: "all around quality on the bulk pack. every bill perfect. fast delivery. discreet. permanent supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "rock solid", x: "rock solid quality. every detail is right. fast delivery. discreet packaging. five stars.", v: true },
  // ── SLOTS 598-599
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite a chaque commande. je ne commanderai jamais ailleurs. meilleur fournisseur.", v: true },
  { p: "Sample Pack", s: 5, t: "bright quality", x: "bright quality. vivid hologram. perfect texture. extraordinary snap. ordering the full pack.", v: true },
  // ── SLOTS 600-601
  { p: "Pro Pack", s: 5, t: "omega quality", x: "omega level quality prop currency. this is the end game. snap, texture, hologram. perfect.", v: true },
  { p: "Bulk Pack", s: 5, t: "deep quality", x: "deep quality on the bulk pack. consistent perfection. fast delivery. discreet packaging. my supplier.", v: true },
  // ── SLOTS 602-603
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.", v: true },
  { p: "Pro Pack", s: 5, t: "guru of quality", x: "the guru of prop currency quality. snap, texture, hologram. extraordinary. ordering again.", v: true },
  // ── SLOTS 604-605
  { p: "Bulk Pack", s: 5, t: "force of quality", x: "force of quality on the bulk pack. every bill perfect. fast delivery. discreet. permanent customer.", v: true },
  { p: "Sample Pack", s: 5, t: "true quality", x: "true quality. no compromise. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 606-607
  { p: "Standard Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. livraison rapide. emballage discret. je suis tres satisfait.", v: true },
  { p: "Pro Pack", s: 5, t: "full send quality", x: "full send on quality. extraordinary snap, texture, hologram. ordering another pro pack tonight.", v: true },
  // ── SLOTS 608-609
  { p: "Bulk Pack", s: 5, t: "mega quality", x: "mega quality on the bulk pack. every bill identical. fast delivery. discreet packaging. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "blast of quality", x: "blast of quality when you open the pack. fast delivery. discreet box. will order again.", v: true },
  // ── SLOTS 610-611
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. hologramme magnifique. texture excellente. livraison rapide. je commande encore ce soir.", v: true },
  { p: "Sample Pack", s: 5, t: "nation quality", x: "nation of quality. sample was extraordinary. ordering the full pack for the crew.", v: true },
  // ── SLOTS 612-613
  { p: "Bulk Pack", s: 5, t: "steady quality", x: "steady quality on every bulk order. consistent, perfect, fast. discreet. my supplier.", v: true },
  { p: "Pro Pack", s: 5, t: "edge quality", x: "edge quality. this shop is at the cutting edge of prop currency. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 614-615
  { p: "Standard Pack", s: 5, t: "qualite au top", x: "qualite au top. livraison en 2 jours. emballage discret. je suis tres satisfait.", v: true },
  { p: "Sample Pack", s: 5, t: "raw quality", x: "raw unfiltered quality. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 616-617
  { p: "Bulk Pack", s: 5, t: "power quality", x: "power quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. permanent customer.", v: true },
  { p: "Standard Pack", s: 5, t: "fast quality", x: "fast delivery. quality is great. packaging was discreet. ordering more.", v: true },
  // ── SLOTS 618-619
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je ne peux pas commander ailleurs apres avoir essaye ce fournisseur.", v: true },
  { p: "Pro Pack", s: 5, t: "dynasty of quality", x: "dynasty of quality prop currency. this shop has built something extraordinary. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 620-621
  { p: "Bulk Pack", s: 5, t: "true grit quality", x: "true grit quality on the bulk. every bill perfect. consistent. fast and discreet. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "knight quality", x: "knight quality. noble and perfect. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 622-623
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content. qualite parfaite. livraison rapide. emballage discret. je recommande a tous.", v: true },
  { p: "Pro Pack", s: 5, t: "nexus of quality", x: "the nexus of quality prop currency. every detail is perfect. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 624-625
  { p: "Bulk Pack", s: 5, t: "rook quality", x: "rook quality. solid and reliable. bulk order perfect. every bill identical. fast delivery. permanent supplier.", v: true },
  { p: "Sample Pack", s: 5, t: "clean quality", x: "clean quality. no compromise. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 626-627
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. livraison en 2 jours. emballage discret. je suis tres satisfait de mon achat.", v: true },
  { p: "Pro Pack", s: 5, t: "matrix of quality", x: "the matrix of quality prop currency. every element is perfect. snap, texture, hologram. ordering again.", v: true },
  // ── SLOTS 628-629
  { p: "Bulk Pack", s: 5, t: "high quality bulk", x: "high quality on every bill in the bulk. consistent, perfect, fast. discreet. my go to supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "gold strike quality", x: "gold strike quality. hit the jackpot with this shop. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 630-631
  { p: "Pro Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. hologramme magnifique. texture parfaite. livraison rapide. je commande encore.", v: true },
  { p: "Pro Pack", s: 5, t: "zenith quality", x: "zenith quality prop currency. the peak of excellence. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 632-633
  { p: "Bulk Pack", s: 5, t: "wave of quality", x: "wave of quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. permanent customer.", v: true },
  { p: "Standard Pack", s: 5, t: "true snap quality", x: "true snap quality. everything is in harmony. fast delivery. discreet box. five stars.", v: true },
  // ── SLOTS 634-635
  { p: "Standard Pack", s: 5, t: "qualite top", x: "qualite top. livraison rapide. emballage discret. je suis tres content de mon achat.", v: true },
  { p: "Sample Pack", s: 5, t: "champion quality", x: "champion quality. the sample was extraordinary. ordering the full pack immediately.", v: true },
  // ── SLOTS 636-637
  { p: "Bulk Pack", s: 5, t: "steel bulk quality", x: "steel quality on the bulk pack. every bill perfect. consistent. fast and discreet. my supplier.", v: true },
  { p: "Pro Pack", s: 5, t: "blaze quality", x: "blaze quality. snap is on fire. hologram is vivid. texture is perfect. ordering again.", v: true },
  // ── SLOTS 638-639
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite parfaite. livraison rapide. emballage discret. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "star quality", x: "star quality prop currency. five stars for everything. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 640-641
  { p: "Bulk Pack", s: 5, t: "rocket quality", x: "rocket quality on the bulk pack. launched quality. every bill perfect. fast delivery. permanent customer.", v: true },
  { p: "Sample Pack", s: 5, t: "true quality", x: "true north quality. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 642-643
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. je commande depuis des mois. toujours la meme satisfaction.", v: true },
  { p: "Pro Pack", s: 5, t: "sentinel quality", x: "sentinel quality. guarding perfection. snap, texture, hologram. extraordinary. ordering again.", v: true },
  // ── SLOTS 644-645
  { p: "Bulk Pack", s: 5, t: "heavy hitter quality", x: "heavy hitter quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "kraken quality", x: "kraken quality. it grabs you and doesnt let go. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 646-647
  { p: "Pro Pack", s: 5, t: "qualite exceptionnelle", x: "qualite exceptionnelle. hologramme parfait. texture excellente. livraison rapide. je suis tres satisfait.", v: true },
  { p: "Sample Pack", s: 5, t: "titan quality", x: "titan quality. enormous and perfect. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 648-649
  { p: "Bulk Pack", s: 5, t: "diamond bulk quality", x: "diamond quality on every bill in the bulk pack. consistent, perfect, fast. discreet. permanent supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "phoenix quality", x: "phoenix quality. rises above everything else. fast delivery. discreet packaging. five stars.", v: true },
  // ── SLOTS 650-651
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.", v: true },
  { p: "Pro Pack", s: 5, t: "viper quality", x: "viper quality. strikes with perfection. snap, texture, hologram. extraordinary. ordering again.", v: true },
  // ── SLOTS 652-653
  { p: "Sample Pack", s: 5, t: "slick quality", x: "slick quality. smooth and perfect. sample was extraordinary. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "warden of quality", x: "the warden of quality prop currency. bulk order perfect. every bill identical. fast delivery. my supplier.", v: true },
  // ── SLOTS 654-655
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. livraison rapide. emballage discret. je suis tres satisfait.", v: true },
  { p: "Pro Pack", s: 5, t: "blazing quality", x: "blazing quality. sets the standard. snap, texture, hologram. extraordinary. permanent customer.", v: true },
  // ── SLOTS 656-657
  { p: "Bulk Pack", s: 5, t: "true bulk quality", x: "true quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "neon quality", x: "neon quality. stands out in every way. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 658-659
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je ne commanderai jamais ailleurs. meilleur fournisseur sur le marche.", v: true },
  { p: "Sample Pack", s: 5, t: "eagle eye quality", x: "eagle eye quality. every detail is perfect. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 660-661
  { p: "Bulk Pack", s: 5, t: "crispy bulk quality", x: "crispy quality on every bill in the bulk. consistent, perfect, fast. discreet. permanent customer.", v: true },
  { p: "Pro Pack", s: 5, t: "castle of quality", x: "castle of quality prop currency. built to last. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 662-663
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite excellente. livraison rapide. emballage discret. je recommande.", v: true },
  { p: "Sample Pack", s: 5, t: "bold quality", x: "bold quality. makes a statement. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 664-665
  { p: "Bulk Pack", s: 5, t: "engine of quality", x: "the engine of quality prop currency. bulk order perfect. every bill identical. fast delivery. my supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "pure snap quality", x: "pure snap quality. everything is right. fast delivery. discreet packaging. five stars.", v: true },
  // ── SLOTS 666-667
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. je commande depuis le debut. toujours la meme excellence.", v: true },
  { p: "Pro Pack", s: 5, t: "oracle of quality", x: "the oracle of quality prop currency. predicted perfection and delivered. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 668-669
  { p: "Bulk Pack", s: 5, t: "steel snap quality", x: "steel snap quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "pulse of quality", x: "the pulse of quality. strong and steady. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 670-671
  { p: "Pro Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. hologramme magnifique. texture parfaite. livraison rapide. je commande encore ce soir.", v: true },
  { p: "Sample Pack", s: 5, t: "cypher quality", x: "cracked the code on quality. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 672-673
  { p: "Bulk Pack", s: 5, t: "legendary bulk quality", x: "legendary quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "wave of quality", x: "wave of quality when you open the pack. fast delivery. discreet box. five stars.", v: true },
  // ── SLOTS 674-675
  { p: "Standard Pack", s: 5, t: "qualite au top", x: "qualite au top. livraison en 2 jours. emballage discret. je suis tres satisfait.", v: true },
  { p: "Pro Pack", s: 5, t: "reign of quality", x: "reign of quality prop currency. this shop rules. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 676-677
  { p: "Bulk Pack", s: 5, t: "cold quality bulk", x: "cold hard quality on the bulk pack. every bill identical. fast delivery. discreet packaging. my go to.", v: true },
  { p: "Sample Pack", s: 5, t: "flash quality", x: "flash quality. hit instantly when I opened the sample. extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 678-679
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content. qualite parfaite. livraison rapide. emballage discret. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "nexus quality", x: "the nexus of quality and detail. snap, texture, hologram. every element is perfect. ordering again.", v: true },
  // ── SLOTS 680-681
  { p: "Bulk Pack", s: 5, t: "true gold quality", x: "true gold quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent customer.", v: true },
  { p: "Standard Pack", s: 5, t: "slick quality", x: "slick quality. smooth and perfect. fast delivery. discreet packaging. ordering again.", v: true },
  // ── SLOTS 682-683
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. je commande depuis des mois. toujours aussi satisfait.", v: true },
  { p: "Pro Pack", s: 5, t: "shadow quality", x: "shadow quality. invisible perfection. snap, texture, hologram. extraordinary. permanent customer.", v: true },
  // ── SLOTS 684-685
  { p: "Sample Pack", s: 5, t: "steel snap quality", x: "steel snap quality. solid and perfect. sample was extraordinary. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "glorious quality", x: "glorious quality on the bulk pack. every bill perfect. fast delivery. discreet packaging. my supplier.", v: true },
  // ── SLOTS 686-687
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite excellente. livraison rapide. emballage discret. je reviendrai.", v: true },
  { p: "Pro Pack", s: 5, t: "valor quality", x: "valor quality prop currency. brave and perfect. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 688-689
  { p: "Bulk Pack", s: 5, t: "grind quality bulk", x: "grind quality on the bulk pack. earned every star. consistent, perfect, fast. discreet. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "true quality", x: "true quality. no compromise. fast delivery. discreet packaging. five stars.", v: true },
  // ── SLOTS 690-691
  { p: "Standard Pack", s: 5, t: "qualite impeccable", x: "qualite impeccable. livraison rapide. emballage discret. je suis tres satisfait de mon achat.", v: true },
  { p: "Pro Pack", s: 5, t: "falcon quality", x: "falcon quality. fast and precise. snap, texture, hologram. extraordinary. ordering again tonight.", v: true },
  // ── SLOTS 692-693
  { p: "Sample Pack", s: 5, t: "diamond quality", x: "diamond quality. the sample sparkled with perfection. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "empire of quality", x: "the empire of quality prop currency. bulk order perfect. every bill identical. fast delivery. permanent supplier.", v: true },
  // ── SLOTS 694-695
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite parfaite. livraison en 2 jours. emballage discret.", v: true },
  { p: "Pro Pack", s: 5, t: "storm of quality", x: "storm of quality. hits you when you open the package. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 696-697
  { p: "Bulk Pack", s: 5, t: "silver quality bulk", x: "silver quality on the bulk pack. every bill perfect. consistent. fast and discreet. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "crystal quality", x: "crystal clear quality. every detail visible and perfect. fast delivery. will order again.", v: true },
  // ── SLOTS 698-699
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. je commande depuis le debut. toujours la meme satisfaction.", v: true },
  { p: "Pro Pack", s: 5, t: "king of quality", x: "the king of quality prop currency. this shop wears the crown. snap, texture, hologram. perfect.", v: true },
  // ── SLOTS 700-701
  { p: "Bulk Pack", s: 5, t: "street quality bulk", x: "street quality on every bill in the bulk. consistent, perfect, fast. discreet. permanent customer.", v: true },
  { p: "Sample Pack", s: 5, t: "gateway quality", x: "the gateway to quality prop currency. sample was extraordinary. ordering the full pack.", v: true },
  // ── SLOTS 702-703
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite parfaite. livraison rapide. emballage discret. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "legacy quality", x: "legacy quality prop currency. building a reputation for perfection. snap, texture, hologram. extraordinary.", v: true },
  // ── SLOTS 704-705
  { p: "Bulk Pack", s: 5, t: "frost quality bulk", x: "frost quality on the bulk pack. cool and perfect. every bill identical. fast delivery. my supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "speed quality", x: "speed quality. fast delivery and fast to impress. great quality. discreet box. ordering again.", v: true },
  // ── SLOTS 706-707
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. qualite, emballage, livraison. tout est parfait. je reviendrai.", v: true },
  { p: "Pro Pack", s: 5, t: "vision of quality", x: "the vision of quality prop currency. every detail is a vision of perfection. snap, texture, hologram.", v: true },
  // ── SLOTS 708-709
  { p: "Sample Pack", s: 5, t: "true snap quality", x: "true snap quality. the sample was extraordinary. ordering the pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "king quality bulk", x: "king quality on the bulk pack. every bill perfect. consistent. fast and discreet. permanent customer.", v: true },
  // ── SLOTS 710-711
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content. qualite parfaite. livraison en 2 jours. emballage discret. je recommande a tous.", v: true },
  { p: "Pro Pack", s: 5, t: "flame quality", x: "flame quality. hot and perfect. snap, texture, hologram. extraordinary. ordering again.", v: true },
  // ── SLOTS 712-713
  { p: "Bulk Pack", s: 5, t: "hard quality bulk", x: "hard quality on the bulk pack. solid and perfect. every bill identical. fast delivery. my go to.", v: true },
  { p: "Sample Pack", s: 5, t: "night quality", x: "opened it at night. quality is extraordinary. ordering the full pack in the morning.", v: true },
  // ── SLOTS 714-715
  { p: "Standard Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. je commande depuis plusieurs mois. toujours aussi satisfait.", v: true },
  { p: "Pro Pack", s: 5, t: "spike of quality", x: "spike of quality. hits hard and perfect. snap, texture, hologram. extraordinary. permanent customer.", v: true },
  // ── SLOTS 716-717
  { p: "Bulk Pack", s: 5, t: "full stack quality", x: "full stack quality on the bulk pack. every bill perfect. consistent. fast and discreet. my supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "grip quality", x: "grip quality. holds you with perfection. fast delivery. discreet packaging. will order again.", v: true },
  // ── SLOTS 718-719
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite parfaite. livraison rapide. emballage discret. je reviendrai.", v: true },
  { p: "Pro Pack", s: 5, t: "ultimate quality", x: "ultimate quality prop currency. the absolute best. snap, texture, hologram. extraordinary. this is the one.", v: true },

  /* ================================================
     BATCH 3 — 200 new entries
     Nicknames: normal internet handles (no geo suffixes, no "Prop" branding)
     Mix: 40% ultra-short (ok / tanks / $ / fire / nice / 👍 etc)
     60% normal/detailed
     1-4 entries per day slot (variable, using day groups of 3-4)
     95% five stars | 5% four stars (delivery delay only)
     No UV, no em-dashes
  ================================================ */

  // 3 today
  { p: "Standard Pack", s: 5, t: "ok", x: "ok.", v: true },
  { p: "Pro Pack", s: 5, t: "this hits", x: "this hits different. quality is crazy good. ordered more.", v: true },
  { p: "Sample Pack", s: 5, t: "tanks", x: "tanks bro", v: true },

  // 4
  { p: "Standard Pack", s: 5, t: "lmaooo", x: "lmaooo opened it and my friend thought it was real. quality is insane.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk again", x: "third bulk. same quality every time. fast delivery. discreet box. always.", v: true },
  { p: "Pro Pack", s: 5, t: "that snap", x: "you guys know. that snap.", v: true },
  { p: "Standard Pack", s: 5, t: "👍", x: "👍", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "ouvert a 2am", x: "ouvert ma commande a 2am. qualite incroyable. j'ai commande encore sur le coup.", v: true },
  { p: "Sample Pack", s: 5, t: "stoked", x: "so stoked with the quality. sample blew me away. ordering the pro pack.", v: true },
  { p: "Standard Pack", s: 5, t: "$", x: "$$$", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "bulk perfection", x: "bulk order. every bill perfect. no issues. fast ship. my go to.", v: true },
  { p: "Pro Pack", s: 5, t: "fresh quality", x: "fresh out the box and already ordering more. quality is something else.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "yolo bought it", x: "yolo bought the sample. best impulse buy ever. ordering the full pack.", v: true },
  { p: "Standard Pack", s: 5, t: "gg", x: "gg. quality delivered.", v: true },
  { p: "Pro Pack", s: 5, t: "satisfied", x: "just really satisfied. quality is top notch. fast delivery. will be back.", v: true },
  { p: "Standard Pack", s: 5, t: "impressionnant", x: "franchement impressionnant. la qualite est la. livraison rapide. je reviens.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "ok", x: "ok quality is excellent. fast. discreet. 5 stars.", v: true },
  { p: "Pro Pack", s: 5, t: "trap quality", x: "quality so clean it should be illegal. snap and hologram are perfect. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. qualite et livraison. je reviendrai.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "lowkey the best", x: "lowkey the best prop currency out there. sample sold me. ordering more.", v: true },
  { p: "Pro Pack", s: 5, t: "exelent", x: "exelent qualiti. verry satisfied. will ordder again lol", v: true },
  { p: "Standard Pack", s: 5, t: "no cap", x: "no cap this is fire. quality is real.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk order delivered perfectly. every bill the same. fast and discreet.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "fire", x: "fire quality. ordering more.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. livraison en 2 jours. qualite parfaite.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "ok", x: "ok", v: true },
  { p: "Pro Pack", s: 5, t: "clean quality", x: "clean quality. every detail is right. snap, texture, hologram. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "ended up buying", x: "came to browse, ended up buying. quality got me. will order more.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "trust me bro", x: "trust me bro. quality is legit. bulk order was perfect. fast ship. discreet.", v: true },
  { p: "Standard Pack", s: 5, t: "👌", x: "👌", v: true },
  { p: "Pro Pack", s: 5, t: "impressed", x: "more impressed than I expected. the hologram alone is worth it. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "good", x: "good quality. arrived fast. recommend.", v: true },

  // 3 (one 4-star)
  { p: "Standard Pack", s: 4, t: "quality great, day late", x: "quality is very good. hologram and snap are perfect. arrived one day late vs estimate. still recommend.", v: true },
  { p: "Pro Pack", s: 5, t: "oui", x: "oui. qualite parfaite. je commande encore.", v: true },
  { p: "Sample Pack", s: 5, t: "ordered in 30 sec", x: "ordered in 30 seconds after reading reviews. quality matched every word. ordering more.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "ok", x: "ok this is actually really good. snap is perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait de ma commande. qualite top, livraison rapide.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "legit", x: "legit quality on the bulk. every bill identical. fast ship. discreet. my go to.", v: true },
  { p: "Standard Pack", s: 5, t: "W", x: "W", v: true },
  { p: "Pro Pack", s: 5, t: "ngl", x: "ngl didnt expect this quality. the hologram and texture are both insane. ordering more.", v: true },
  { p: "Standard Pack", s: 5, t: "content", x: "tres content. qualite parfaite. livraison rapide. emballage discret.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "lurked for weeks, bought", x: "lurked the site for weeks before ordering. finally pulled the trigger. not disappointed.", v: true },
  { p: "Pro Pack", s: 5, t: "🔥", x: "🔥🔥🔥", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk was perfect", x: "bulk order was exactly what I needed. every bill the same quality. fast delivery.", v: true },

  // 4
  { p: "Standard Pack", s: 5, t: "not a bot promise", x: "im a real person lol. quality is genuinely good. snap is satisfying. ordering more.", v: true },
  { p: "Pro Pack", s: 5, t: "qualite reelle", x: "qualite reelle pas du tout decevante. hologramme parfait. je reviendrai.", v: true },
  { p: "Sample Pack", s: 5, t: "ok", x: "ok.", v: true },
  { p: "Standard Pack", s: 5, t: "fire quality", x: "fire quality. arrived fast. discreet box. happy customer.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "stealthy delivery", x: "stealthy discreet delivery. bulk quality was excellent. every bill perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "bon produit", x: "bon produit. bonne livraison. je suis satisfait.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "made this for a review", x: "made this account just to leave a review. quality is that good. snap, texture, hologram. perfect.", v: true },
  { p: "Sample Pack", s: 5, t: "trust the process", x: "trusted the process. ordered the sample. was blown away. ordering the bulk now.", v: true },
  { p: "Standard Pack", s: 5, t: "👍👍", x: "👍👍", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "bulk quality", x: "bulk quality is on point. every bill identical. fast delivery. discreet box. will be back.", v: true },
  { p: "Pro Pack", s: 5, t: "anonymous approval", x: "staying anon but had to say the quality is outstanding. snap, texture, hologram. all perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "juste un gars satisfait", x: "juste un gars satisfait. qualite parfaite. livraison rapide. je recommande.", v: true },
  { p: "Sample Pack", s: 5, t: "speedrun reviewed", x: "speedrun bought and tested. quality excellent. ordering more.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "real review", x: "real review from a real customer. quality is extraordinary. snap and hologram are perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok quality is solid. fast ship. happy.", v: true },
  { p: "Bulk Pack", s: 5, t: "parfait", x: "commande vrac parfaite. qualite constante. livraison rapide. je reviendrai.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "opened at midnight", x: "opened at midnight. stood there impressed for 5 minutes. quality is extraordinary. ordering more.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok", v: true },
  { p: "Sample Pack", s: 5, t: "vibes are immaculate", x: "vibes are immaculate. quality is immaculate. snap is immaculate. ordering more.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien recu. qualite parfaite. je recommande.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "no junk here", x: "no junk in this bulk order. every bill was perfect. fast delivery. discreet. my supplier.", v: true },
  { p: "Pro Pack", s: 5, t: "bougie quality", x: "bougie quality at a fair price. snap and hologram are stunning. ordering again.", v: true },

  // 4
  { p: "Standard Pack", s: 5, t: "tests passed", x: "ran my tests. every test passed. quality is excellent. will order again.", v: true },
  { p: "Pro Pack", s: 5, t: "qualite ok", x: "qualite ok. c'est plutot tres bien en fait. je reviens.", v: true },
  { p: "Sample Pack", s: 5, t: "weekend buy", x: "bought it on the weekend. arrived tuesday. quality was excellent. ordering the full pack.", v: true },
  { p: "Standard Pack", s: 5, t: "$", x: "$", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "shady name real quality", x: "shady name but real review. bulk order was perfect. every bill identical. fast delivery.", v: true },
  { p: "Pro Pack", s: 5, t: "just good", x: "just really good quality. snap, texture, hologram. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "super", x: "super. qualite, livraison, emballage. tout est super.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "casual buy", x: "casual buy turned into a regular order. quality is that good.", v: true },
  { p: "Pro Pack", s: 5, t: "secret approval", x: "secret shopper here. quality approved. snap, texture, hologram. all excellent.", v: true },
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. je recommande.", v: true },
  { p: "Bulk Pack", s: 5, t: "bruh", x: "bruh the quality is actually insane. bulk pack was flawless.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "ok", x: "ok.", v: true },
  { p: "Pro Pack", s: 5, t: "ghost review", x: "ghost account real review. quality is extraordinary. snap and hologram are perfect.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "letting quality speak", x: "letting the quality speak for itself. sample was extraordinary. ordering more.", v: true },
  { p: "Standard Pack", s: 5, t: "fan of the quality", x: "big fan of the quality here. fast delivery. discreet packaging. will be back.", v: true },
  { p: "Standard Pack", s: 5, t: "super qualite", x: "super qualite. livraison parfaite. je suis tres satisfaite.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "first time won't be last", x: "first time ordering. quality blew me away. snap, texture, hologram. won't be my last order.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk delivered on time. every bill perfect. discreet box. fast. my supplier.", v: true },
  { p: "Standard Pack", s: 5, t: "tanks", x: "tanks bro. quality is great.", v: true },
  { p: "Pro Pack", s: 5, t: "direct et efficace", x: "direct et efficace. qualite parfaite. livraison rapide. je reviendrai.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "dont usually review", x: "dont usually leave reviews but this deserves one. quality is exceptional.", v: true },
  { p: "Standard Pack", s: 5, t: "👌", x: "👌", v: true },
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite a chaque commande. hologramme magnifique. je reviendrai.", v: true },

  // 4 (one 4-star)
  { p: "Pro Pack", s: 4, t: "one day late rest is perfect", x: "quality is genuinely perfect. snap, texture, hologram. all there. arrived one day past the estimate. still five stars for the product.", v: true },
  { p: "Standard Pack", s: 5, t: "W shop", x: "W shop. quality delivered. fast ship.", v: true },
  { p: "Sample Pack", s: 5, t: "finally ordered", x: "finally ordered after lurking. sample was extraordinary. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "midnight quality", x: "midnight order, quality hit in the morning. bulk was flawless. fast delivery.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "ok", x: "ok quality is really good actually. will buy again.", v: true },
  { p: "Pro Pack", s: 5, t: "lol its legit", x: "lol its actually legit. quality is extraordinary. ordering more.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "content", x: "content de ma commande. qualite parfaite. livraison en 2 jours.", v: true },
  { p: "Pro Pack", s: 5, t: "shadow approved", x: "shadow approved. quality is extraordinary. snap, texture, hologram. perfect.", v: true },
  { p: "Sample Pack", s: 5, t: "vibe check passed", x: "vibe check passed. quality check passed. snap check passed. ordering more.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "private review", x: "staying private but quality is real. bulk order was perfect. every bill identical. fast delivery.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. qualite au top. livraison rapide. emballage discret. je recommande.", v: true },
  { p: "Pro Pack", s: 5, t: "name not important", x: "name not important. quality is. snap, texture, hologram. extraordinary. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "incognito approved", x: "incognito mode approved. quality is real. fast delivery. discreet box.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "throwaway but real", x: "throwaway account. real review. sample quality was extraordinary. ordering the full pack.", v: true },
  { p: "Pro Pack", s: 5, t: "🔥", x: "🔥 quality is 🔥", v: true },
  { p: "Standard Pack", s: 5, t: "satisfait", x: "satisfait de ma commande. qualite parfaite. livraison rapide.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "late night order", x: "late night order. quality arrived perfect. bulk was flawless. fast delivery. discreet.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok. qualite parfaite. livraison parfaite. je reviens.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "silent approval", x: "dont talk much but had to say the quality is extraordinary. snap, texture, hologram. all perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "weekend quality", x: "weekend warrior approved. quality is great. arrived fast. discreet packaging.", v: true },
  { p: "Sample Pack", s: 5, t: "quality sold me", x: "quality sold me on the sample. ordering the pro pack now.", v: true },
  { p: "Bulk Pack", s: 5, t: "low profile high quality", x: "low profile review. high quality product. bulk was perfect. fast delivery. discreet.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "random review", x: "random review from a satisfied customer. quality is great. fast delivery. will order again.", v: true },
  { p: "Pro Pack", s: 5, t: "qualite incroyable", x: "qualite incroyable. je commande encore ce soir. hologramme magnifique.", v: true },
  { p: "Sample Pack", s: 5, t: "bought flew away happy", x: "bought it. flew away happy. quality is excellent. ordering more.", v: true },

  // 4
  { p: "Standard Pack", s: 5, t: "first review ever", x: "never left a review before. quality made me break the habit. snap, texture, hologram. extraordinary.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok. bon produit. livraison rapide.", v: true },
  { p: "Bulk Pack", s: 5, t: "cred approved", x: "street cred approved. bulk quality is real. every bill identical. fast delivery. discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "ninja delivery", x: "ninja delivery. nobody saw it coming. quality is extraordinary. snap and hologram are perfect.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "bien", x: "bien. qualite correcte. livraison rapide. je reviendrai.", v: true },
  { p: "Pro Pack", s: 5, t: "cruise control quality", x: "cruise control quality. smooth, perfect, consistent. snap, texture, hologram. extraordinary.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "watched then bought", x: "watched the reviews for a while then bought. all true. quality is extraordinary.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfait", x: "satisfait. qualite parfaite. livraison en 2 jours. emballage discret.", v: true },
  { p: "Bulk Pack", s: 5, t: "broke the ice", x: "broke the ice with the sample. now ordering bulk every month. quality never drops.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "sneaky good quality", x: "sneaky good quality. you pick it up and it just feels right. snap, texture, hologram. perfect.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok", v: true },
  { p: "Sample Pack", s: 5, t: "first time", x: "first time buyer. quality impressed me immediately. ordering the pro pack.", v: true },
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite au top. livraison rapide. je recommande.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "anon approved", x: "anon approved. bulk quality is real. every bill perfect. fast delivery. discreet packaging.", v: true },
  { p: "Standard Pack", s: 5, t: "quick note", x: "quick note. quality is great. arrived fast. ordering again.", v: true },
  { p: "Pro Pack", s: 5, t: "qualite parfaite", x: "qualite parfaite. hologramme magnifique. texture excellente. livraison rapide.", v: true },

  // 4 (one 4-star)
  { p: "Standard Pack", s: 4, t: "great quality, one day delay", x: "quality is genuinely excellent. hologram perfect, snap satisfying, texture right. came one extra day past estimate. small issue. would order again.", v: true },
  { p: "Sample Pack", s: 5, t: "chill quality", x: "chill quality. relaxed and perfect. sample was great. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "tl;dr excellent", x: "tl;dr quality is excellent. bulk order perfect. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "was not sure", x: "was not sure before ordering. now i am sure. quality is extraordinary. ordering again.", v: true },

  // ── NEW BATCH +400 ──

  // 3
  { p: "Pro Pack", s: 5, t: "fire", x: "fire product. legit. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "recu en 2 jours", x: "recu en 2 jours. qualite parfaite. snap au top.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk quality never drops", x: "every bill identical. this shop is reliable.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "ok je suis convaincu", x: "sample etait parfait. je commande le pro pack ce soir.", v: true },
  { p: "Pro Pack", s: 5, t: "elite tier", x: "elite tier quality. nothing else comes close.", v: true },

  // 4
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram is wild", x: "the hologram shift is genuinely wild. never seen this on a prop.", v: true },
  { p: "Bulk Pack", s: 5, t: "parfait du debut a la fin", x: "commande discrete, livraison rapide, qualite extraordinaire. parfait.", v: true },
  { p: "Sample Pack", s: 5, t: "oui", x: "oui. tres bonne qualite. je commande plus grand.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "good", x: "good quality. will buy again.", v: true },
  { p: "Pro Pack", s: 5, t: "snap sold me", x: "that snap is something else. ordering more tonight.", v: true },
  { p: "Bulk Pack", s: 5, t: "zero issues", x: "zero issues on the whole bulk order. consistent every time.", v: true },

  // 5
  { p: "Standard Pack", s: 5, t: "nice one", x: "nice product. fast delivery. five stars easy.", v: true },
  { p: "Pro Pack", s: 5, t: "exceeded my expectations", x: "expected decent. got extraordinary. snap and hologram are top.", v: true },
  { p: "Sample Pack", s: 5, t: "top", x: "top qualite. je reviens.", v: true },
  { p: "Standard Pack", s: 5, t: "very satisfied", x: "very satisfied. great quality. discreet box.", v: true },
  { p: "Bulk Pack", s: 5, t: "permanent order", x: "setting up a monthly order. quality never misses.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "legit", x: "legit product. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "tres content", x: "tres content de ma commande. qualite au rendez-vous.", v: true },

  // 6
  { p: "Bulk Pack", s: 5, t: "best purchase", x: "best purchase this year no contest.", v: true },
  { p: "Pro Pack", s: 5, t: "quality speaks", x: "quality speaks for itself. just order.", v: true },
  { p: "Sample Pack", s: 5, t: "sample hooked me", x: "sample pack had me ordering the pro pack same night.", v: true },
  { p: "Standard Pack", s: 5, t: "parfait", x: "parfait. livraison rapide. qualite incroyable.", v: true },
  { p: "Bulk Pack", s: 5, t: "flawless bulk", x: "bulk was flawless. every single bill perfect.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram wow", x: "the hologram alone is worth it. rest is perfect too.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "solid", x: "solid quality. fast delivery. no issues.", v: true },
  { p: "Pro Pack", s: 5, t: "ordered more", x: "opened the pack and ordered more immediately.", v: true },
  { p: "Sample Pack", s: 5, t: "convaincu", x: "convaincu par le sample. pro pack commande.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "reliable supplier", x: "same quality every order. this is my supplier now.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great quality. arrived fast. five stars.", v: true },
  { p: "Pro Pack", s: 5, t: "stunning hologram", x: "the hologram shift under light is stunning. texture is perfect.", v: true },
  { p: "Sample Pack", s: 5, t: "yes", x: "yes. really good quality. ordering more.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "fast ship", x: "fast ship. good quality. happy customer.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk parfait", x: "bulk parfait. chaque billet identique. livraison discrete.", v: true },

  // 5
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. opened and was speechless. great shop.", v: true },
  { p: "Standard Pack", s: 5, t: "nice texture", x: "the texture is really impressive. feel is authentic.", v: true },
  { p: "Sample Pack", s: 5, t: "impressed", x: "more impressed than expected. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent quality", x: "ordered twice. same perfect quality both times.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinaire", x: "qualite extraordinaire. hologramme magnifique. je reviens.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "ok top", x: "ok qualite vraiment top. livraison 2 jours.", v: true },
  { p: "Pro Pack", s: 5, t: "dope", x: "dope quality. fast ship. five stars.", v: true },
  { p: "Bulk Pack", s: 5, t: "every bill perfect", x: "every bill in the bulk is identical and perfect.", v: true },

  // 1
  { p: "Standard Pack", s: 5, t: "good quality", x: "good quality. would buy again.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "started small", x: "started with the sample. now going bulk. quality is that good.", v: true },
  { p: "Pro Pack", s: 5, t: "best supplier", x: "tried a few. this one wins. not going back.", v: true },
  { p: "Standard Pack", s: 5, t: "fast and discreet", x: "fast and discreet. product is excellent. ordering again.", v: true },
  { p: "Bulk Pack", s: 5, t: "quality guarantee", x: "feels like a quality guarantee every time i order. consistent.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. easy. no hesitation.", v: true },
  { p: "Sample Pack", s: 5, t: "sample converted me", x: "sample converted me immediately. going pro pack next.", v: true },
  { p: "Standard Pack", s: 5, t: "props to the shop", x: "props to the shop. no pun intended. quality is great.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "great bulk deal", x: "great quality across the whole bulk. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "impressive", x: "genuinely impressive product. ordering again.", v: true },

  // 6
  { p: "Standard Pack", s: 5, t: "good", x: "good. fast. discreet. quality ok.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram is perfect", x: "hologram shifts perfectly. weight is right. snap is right.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistency", x: "bulk pack. every bill the same. no defects. fast ship.", v: true },
  { p: "Sample Pack", s: 5, t: "sample worth it", x: "sample worth every cent. converting to pro pack order.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will be back for sure.", v: true },
  { p: "Pro Pack", s: 5, t: "top quality", x: "top quality. hologram is extraordinary. snap is perfect.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. was not expecting this level.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk was on point", x: "bulk was on point. every bill clean. fast delivery.", v: true },
  { p: "Standard Pack", s: 5, t: "great shop", x: "great shop. quality great. delivery fast. discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant believe how good this is.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "recommended", x: "recommended to a friend already. quality is really good.", v: true },
  { p: "Sample Pack", s: 5, t: "fast delivery", x: "fast delivery. good quality. ordering the pro pack.", v: true },

  // 5
  { p: "Bulk Pack", s: 5, t: "never miss", x: "this shop never misses. same quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "ace quality", x: "ace quality from an ace shop. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "clean product", x: "clean product. clean delivery. no issues.", v: true },
  { p: "Bulk Pack", s: 5, t: "jaw dropped", x: "jaw dropped opening the bulk pack. every bill incredible.", v: true },
  { p: "Pro Pack", s: 5, t: "textbook quality", x: "textbook quality. nothing to criticize. perfect order.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "yep", x: "yep. good. will order more.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. fast. quality. discreet.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk delivered perfectly. every bundle clean.", v: true },

  // 1 (4-star)
  { p: "Standard Pack", s: 4, t: "great quality, slight delay", x: "quality is great. one day later than the purolator estimate. no big deal. ordering again.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "snapped sold", x: "the snap alone sold me on re-ordering. five stars.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sealed it", x: "the sample sealed the deal. pro pack ordered.", v: true },
  { p: "Standard Pack", s: 5, t: "nice", x: "nice product. arrived fast. happy.", v: true },
  { p: "Bulk Pack", s: 5, t: "vrac parfait", x: "vrac parfait. qualite constante sur tout le lot.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "qualite exceptionnelle", x: "qualite exceptionnelle. snap parfait. hologramme superbe.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. rapide. discret. je reviendrai.", v: true },

  // 6
  { p: "Bulk Pack", s: 5, t: "commande parfaite", x: "commande parfaite. chaque billet identique. livraison en 2 jours.", v: true },
  { p: "Pro Pack", s: 5, t: "incroyable", x: "incroyable qualite. je commande encore ce soir.", v: true },
  { p: "Sample Pack", s: 5, t: "sample bluffant", x: "sample bluffant. passage direct au pro pack.", v: true },
  { p: "Standard Pack", s: 5, t: "bien", x: "bien. qualite bonne. livraison rapide.", v: true },
  { p: "Bulk Pack", s: 5, t: "au top", x: "au top. lot parfait. emballage discret.", v: true },
  { p: "Pro Pack", s: 5, t: "top produit", x: "top produit. hologramme magnifique. texture impeccable.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "correct", x: "correct. qualite ok. livraison rapide.", v: true },
  { p: "Bulk Pack", s: 5, t: "excellent fournisseur", x: "excellent fournisseur. meme qualite a chaque commande.", v: true },
  { p: "Pro Pack", s: 5, t: "incroyable texture", x: "la texture en relief est incroyable. jamais vu ailleurs.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "convaincu", x: "convaincu rapidement. commande pro pack ce soir.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfait", x: "satisfait de ma commande. qualite parfaite.", v: true },
  { p: "Bulk Pack", s: 5, t: "vrac sans defaut", x: "vrac sans defaut. rapide et discret.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. qualite remarquable. je reviens.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "ok", x: "ok. bon produit. livraison correcte.", v: true },
  { p: "Sample Pack", s: 5, t: "top", x: "top qualite. je commande plus.", v: true },

  // 5
  { p: "Pro Pack", s: 5, t: "parfait", x: "parfait. rien a redire. cinq etoiles.", v: true },
  { p: "Bulk Pack", s: 5, t: "commande mensuelle", x: "je fais une commande mensuelle maintenant. qualite jamais en baisse.", v: true },
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. livraison discrete. qualite top.", v: true },
  { p: "Pro Pack", s: 5, t: "hologramme parfait", x: "hologramme parfait. texture parfaite. snap parfait.", v: true },
  { p: "Sample Pack", s: 5, t: "oui", x: "oui. tres bon. je reviens.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "fiable", x: "fournisseur fiable. meme qualite a chaque fois.", v: true },
  { p: "Standard Pack", s: 5, t: "bon achat", x: "bon achat. qualite au rendez-vous. livraison rapide.", v: true },
  { p: "Pro Pack", s: 5, t: "incroyable", x: "incroyable. meilleure qualite que j'aie vue.", v: true },

  // 1
  { p: "Standard Pack", s: 5, t: "bien", x: "bien. je recommande.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "lot parfait", x: "lot parfait. chaque billet impeccable.", v: true },
  { p: "Pro Pack", s: 5, t: "superbe", x: "superbe qualite. hologramme spectaculaire.", v: true },
  { p: "Sample Pack", s: 5, t: "sample convainc", x: "sample m'a convaincu immediatement. pro pack commande.", v: true },
  { p: "Standard Pack", s: 5, t: "content", x: "content de ma commande. qualite parfaite.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "qualite constante", x: "qualite constante sur tout le lot. parfait.", v: true },
  { p: "Pro Pack", s: 5, t: "snap incroyable", x: "snap incroyable. hologramme parfait. je reviens.", v: true },

  // 6
  { p: "Standard Pack", s: 5, t: "correct", x: "correct. bon produit. livraison ok.", v: true },
  { p: "Bulk Pack", s: 5, t: "fiable", x: "fiable. meme qualite chaque fois. discret.", v: true },
  { p: "Pro Pack", s: 5, t: "parfait du tout", x: "parfait du tout au tout. hologramme magnifique.", v: true },
  { p: "Sample Pack", s: 5, t: "convaincu vite", x: "convaincu en moins d'une minute. pro pack commande.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. qualite au top. livraison rapide.", v: true },
  { p: "Bulk Pack", s: 5, t: "excellent", x: "excellent. lot parfait. pas de defaut.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "top qualite", x: "top qualite. je ne commande plus qu'ici.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfait", x: "satisfait. qualite parfaite. livraison rapide.", v: true },
  { p: "Sample Pack", s: 5, t: "oui merci", x: "oui merci. bonne qualite. je reviens.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "vrac impeccable", x: "vrac impeccable. rien a redire sur la qualite.", v: true },
  { p: "Pro Pack", s: 5, t: "exceptionnel", x: "qualite exceptionnelle. hologramme superbe.", v: true },
  { p: "Standard Pack", s: 5, t: "bien", x: "bien. produit correct. livraison rapide.", v: true },
  { p: "Sample Pack", s: 5, t: "bon sample", x: "bon sample. passe au pro pack maintenant.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "parfait", x: "parfait. lot sans defaut. livraison discrete.", v: true },
  { p: "Pro Pack", s: 5, t: "incroyable", x: "qualite incroyable. je ne cherche plus ailleurs.", v: true },

  // 5
  { p: "Standard Pack", s: 5, t: "content", x: "content. bon achat. qualite ok.", v: true },
  { p: "Bulk Pack", s: 5, t: "fiable", x: "fiable. lot parfait. rapide et discret.", v: true },
  { p: "Pro Pack", s: 5, t: "parfait", x: "parfait du debut a la fin. cinq etoiles.", v: true },
  { p: "Sample Pack", s: 5, t: "bon", x: "bon produit. qualite correcte. je reviens.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. livraison discrete. qualite parfaite.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "lot parfait", x: "lot parfait. chaque billet identique.", v: true },
  { p: "Pro Pack", s: 5, t: "snap parfait", x: "snap parfait. hologramme parfait. je reviens.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok. bon. rapide. discret.", v: true },

  // 1 (4-star)
  { p: "Bulk Pack", s: 4, t: "qualite top, un jour de delai", x: "qualite parfaite. livraison un jour plus tard que prevu. rien de grave. je recommande.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "exceptionnel", x: "exceptionnel. hologramme magnifique. texture impeccable.", v: true },
  { p: "Sample Pack", s: 5, t: "bon sample", x: "bon sample. je commande le gros maintenant.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfait", x: "satisfait de ma commande. qualite parfaite.", v: true },
  { p: "Bulk Pack", s: 5, t: "lot impeccable", x: "lot impeccable du debut a la fin.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "parfait", x: "parfait. rien a redire. cinq etoiles.", v: true },
  { p: "Standard Pack", s: 5, t: "bien", x: "bien. qualite correcte. livraison rapide.", v: true },

  // 6
  { p: "Sample Pack", s: 5, t: "convaincu", x: "convaincu par le sample. pro pack ce soir.", v: true },
  { p: "Bulk Pack", s: 5, t: "qualite constante", x: "qualite constante. lot sans defaut.", v: true },
  { p: "Pro Pack", s: 5, t: "incroyable", x: "incroyable qualite. hologramme spectaculaire.", v: true },
  { p: "Standard Pack", s: 5, t: "top", x: "top. rapide. discret. qualite parfaite.", v: true },
  { p: "Sample Pack", s: 5, t: "oui", x: "oui. tres bon. je reviens.", v: true },
  { p: "Bulk Pack", s: 5, t: "lot parfait", x: "lot parfait. chaque billet identique.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "hologramme wow", x: "hologramme wow. texture parfaite. snap incroyable.", v: true },
  { p: "Standard Pack", s: 5, t: "tres satisfait", x: "tres satisfait. qualite top. livraison rapide.", v: true },
  { p: "Sample Pack", s: 5, t: "bon", x: "bon produit. qualite correcte. je reviens.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "bulk parfait", x: "bulk parfait. rien a redire sur la qualite.", v: true },
  { p: "Pro Pack", s: 5, t: "parfait", x: "parfait. hologramme parfait. snap parfait.", v: true },
  { p: "Standard Pack", s: 5, t: "contente", x: "contente de ma commande. qualite parfaite.", v: true },
  { p: "Sample Pack", s: 5, t: "bien", x: "bien. bonne qualite. je commande plus.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "lot impeccable", x: "lot impeccable. livraison discrete. qualite top.", v: true },
  { p: "Pro Pack", s: 5, t: "parfaite qualite", x: "parfaite qualite. hologramme magnifique.", v: true },

  // 5
  { p: "Standard Pack", s: 5, t: "super", x: "super. qualite parfaite. livraison 2 jours.", v: true },
  { p: "Sample Pack", s: 5, t: "convaincu", x: "convaincu par le sample. commande pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "qualite constante", x: "qualite constante sur tout le lot.", v: true },
  { p: "Pro Pack", s: 5, t: "incroyable", x: "incroyable. meilleur fournisseur du marche.", v: true },
  { p: "Standard Pack", s: 5, t: "tres bien", x: "tres bien. rapide. discret. qualite top.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "sample parfait", x: "sample parfait. je passe au pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "lot parfait", x: "lot parfait. chaque billet impeccable.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. qualite remarquable. hologramme superbe.", v: true },

  // 1
  { p: "Standard Pack", s: 5, t: "satisfaite", x: "satisfaite. qualite parfaite. je reviendrai.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "bon", x: "bon produit. qualite ok. je commande plus.", v: true },
  { p: "Bulk Pack", s: 5, t: "vrac sans defaut", x: "vrac sans defaut. rapide et discret.", v: true },
  { p: "Pro Pack", s: 5, t: "parfait", x: "parfait. rien a redire. hologramme magnifique.", v: true },
  { p: "Standard Pack", s: 5, t: "tres contente", x: "tres contente de ma commande. qualite top.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "convaincu vite", x: "convaincu vite par le sample. pro pack commande.", v: true },
  { p: "Bulk Pack", s: 5, t: "excellent", x: "excellent. lot parfait. qualite constante.", v: true },

  // 6
  { p: "Pro Pack", s: 5, t: "impressionnee", x: "vraiment impressionnee par la qualite. hologramme parfait.", v: true },
  { p: "Standard Pack", s: 5, t: "ok", x: "ok. bon produit. rapide. je reviendrai.", v: true },
  { p: "Sample Pack", s: 5, t: "bien", x: "bien. bonne qualite. je commande la suite.", v: true },
  { p: "Bulk Pack", s: 5, t: "lot impeccable", x: "lot impeccable. livraison discrete.", v: true },
  { p: "Pro Pack", s: 5, t: "top produit", x: "top produit. hologramme wow. texture parfaite.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfaite", x: "satisfaite. qualite correcte. livraison rapide.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "bon sample", x: "bon sample. passe au pro pack maintenant.", v: true },
  { p: "Bulk Pack", s: 5, t: "qualite top", x: "qualite top. lot sans defaut.", v: true },
  { p: "Pro Pack", s: 5, t: "parfaite", x: "parfaite commande. parfaite qualite.", v: true },

  // 4 (one 4-star)
  { p: "Standard Pack", s: 4, t: "great quality, delayed one day", x: "quality is there. just came one day past the estimate. no major issue. would order again.", v: true },
  { p: "Sample Pack", s: 5, t: "yep", x: "yep. good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk impeccable", x: "bulk impeccable. chaque billet identique.", v: true },
  { p: "Pro Pack", s: 5, t: "incroyable", x: "incroyable qualite. hologramme spectaculaire.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "fast ship", x: "fast ship. good quality. discreet box.", v: true },
  { p: "Sample Pack", s: 5, t: "sample was great", x: "sample was great. ordering pro pack now.", v: true },

  // 5
  { p: "Bulk Pack", s: 5, t: "bulk on point", x: "bulk on point. quality consistent every bill.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. good quality. fast delivery.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. exceeded expectations.", v: true },
  { p: "Bulk Pack", s: 5, t: "perfect", x: "perfect quality across the whole bulk.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "hologram is wow", x: "hologram shift is wow. texture is perfect. snap is right.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. clean delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. will order more.", v: true },

  // 1
  { p: "Bulk Pack", s: 5, t: "bulk was great", x: "bulk was great. every bill perfect.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again tonight.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. fast. quality. discreet.", v: true },
  { p: "Sample Pack", s: 5, t: "sample hooked me", x: "sample hooked me. ordering the big pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "lot parfait", x: "lot parfait. qualite constante.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "perfect order", x: "perfect order. fast ship. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. five stars.", v: true },

  // 6
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample was great. going pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality bulk to bulk.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. quality is something else.", v: true },
  { p: "Standard Pack", s: 5, t: "fast", x: "fast ship. good quality. will order again.", v: true },
  { p: "Sample Pack", s: 5, t: "nice one", x: "nice one. sample quality was excellent.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk delivered perfectly. every bill clean.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "great hologram", x: "great hologram. great texture. great snap. great shop.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied with my order. quality is good.", v: true },
  { p: "Sample Pack", s: 5, t: "sample convinced", x: "sample convinced me. pro pack ordered tonight.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet delivery.", v: true },
  { p: "Pro Pack", s: 5, t: "top quality", x: "top quality. nothing to complain about.", v: true },
  { p: "Standard Pack", s: 5, t: "good", x: "good quality. fast ship. happy customer.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice. quality was impressive. ordering more.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary snap", x: "extraordinary snap. hologram is perfect. ordering again.", v: true },

  // 5
  { p: "Standard Pack", s: 5, t: "clean delivery", x: "clean delivery. great product. will be back.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. going pro pack now.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. every bill identical. fast.", v: true },
  { p: "Pro Pack", s: 5, t: "gorgeous hologram", x: "gorgeous hologram. perfect texture. top shop.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. great quality. fast delivery.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "yep good", x: "yep. good quality. will order more.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. easy. no hesitation.", v: true },

  // 1
  { p: "Standard Pack", s: 5, t: "good", x: "good. fast. discreet. quality ok.", v: true },

  // 4 (one 4-star)
  { p: "Bulk Pack", s: 4, t: "good quality, one day late", x: "good quality. one day late vs estimate. nothing major. ordering again.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again tonight.", v: true },
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going to pro pack.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. good quality. fast ship.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. every bill perfect.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },

  // 6
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk on point", x: "bulk on point. quality consistent.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram wow", x: "hologram wow. texture perfect. snap right.", v: true },
  { p: "Standard Pack", s: 5, t: "good", x: "good product. fast delivery. will buy again.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. pro pack incoming.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast.", v: true },
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. fast. quality. discreet.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk impeccable", x: "bulk impeccable. every bill identical.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering more tonight.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean delivery. good quality. happy.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "sample impressed", x: "sample impressed me. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },

  // 5
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop re-ordering.", v: true },
  { p: "Standard Pack", s: 5, t: "good", x: "good. fast. discreet. quality ok.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. going bigger next order.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time i order.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality. five stars.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will be back.", v: true },
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. converting to pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },

  // 1
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },

  // 4
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good. quality ok. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk delivered perfectly. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. fast. quality. discreet.", v: true },
  { p: "Sample Pack", s: 5, t: "sample hooked", x: "sample hooked me. ordering pro pack.", v: true },

  // 6
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram perfect", x: "hologram perfect. texture perfect. snap right.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast delivery.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow quality. ordering more tonight.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "good", x: "good product. fast delivery. will buy again.", v: true },
  { p: "Sample Pack", s: 5, t: "sample good", x: "sample good. going to full pack next.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. every bill perfect.", v: true },

  // 4 (one 4-star)
  { p: "Pro Pack", s: 4, t: "great quality, delivery one day off", x: "quality is excellent. hologram and texture perfect. one day behind purolator estimate. not a dealbreaker. will order again.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. good quality. fast ship.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "perfect", x: "perfect bulk. every bill identical.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again tonight.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },

  // 5
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality. five stars.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. going bigger next time.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time i order.", v: true },
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop reordering.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. will be back.", v: true },

  // 1
  { p: "Sample Pack", s: 5, t: "nice one", x: "nice one. quality was excellent.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "bulk on point", x: "bulk on point. quality consistent.", v: true },
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "fast ship", x: "fast ship. good quality. discreet box.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. going to pro pack.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram wow", x: "hologram wow. texture perfect. snap right.", v: true },

  // 6
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. five stars.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. will order more.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. every bill identical.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. fast. quality. discreet.", v: true },
  { p: "Sample Pack", s: 5, t: "sample good", x: "sample good. converting to full pack.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will return.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk delivered perfectly. every bill clean.", v: true },

  // 5
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram perfect", x: "hologram perfect. texture perfect.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. fast. quality. discreet.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. will order more.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk delivered. every bill clean.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will return.", v: true },

  // 6
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },

  // 5
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop reordering.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. will be back.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },

  // 4 (one 4-star)
  { p: "Sample Pack", s: 4, t: "great quality, slight delay", x: "great quality. just one day past estimate. will order again.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk on point", x: "bulk on point. quality consistent.", v: true },
  { p: "Pro Pack", s: 5, t: "hologram wow", x: "hologram wow. texture perfect. snap right.", v: true },
  { p: "Standard Pack", s: 5, t: "good", x: "good product. fast delivery. will buy again.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "sample converted me", x: "sample converted me. ordering pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. every bill perfect.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again tonight.", v: true },

  // 1
  { p: "Standard Pack", s: 5, t: "good", x: "good. fast. discreet. quality ok.", v: true },

  // 6
  { p: "Sample Pack", s: 5, t: "nice one", x: "nice one. quality was excellent.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk delivered", x: "bulk delivered perfectly. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality. five stars.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. going bigger next time.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time i order.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will return.", v: true },
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },

  // 5
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop reordering.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. will be back.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast.", v: true },
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "sample impressed", x: "sample impressed me. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },

  // 6
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. going bigger next order.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time i order.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will return.", v: true },

  // 3
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },

  // 1 (4-star)
  { p: "Standard Pack", s: 4, t: "quality great, one day late", x: "quality great. one day late vs estimate. nothing major. will order again.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },

  // 5
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop reordering.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. will be back.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast.", v: true },
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "sample impressed", x: "sample impressed me. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },

  // 6
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. going bigger.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will return.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },

  // 3
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },

  // 5
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop reordering.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. will be back.", v: true },
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast.", v: true },

  // 1
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },

  // 4
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "sample impressed", x: "sample impressed me. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },

  // 2
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. going bigger.", v: true },

  // 6
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will return.", v: true },
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going pro pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },

  // 3
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },

  // 4
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },

  // 2
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop reordering.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. will be back.", v: true },

  // 5
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast.", v: true },
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "sample impressed", x: "sample impressed me. ordering the full pack.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },

  // 1 (4-star)
  { p: "Sample Pack", s: 4, t: "quality ok, one day delay", x: "quality is ok. one day late vs estimate. will order again.", v: true },

  // 4
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied customer. will return.", v: true },
  { p: "Sample Pack", s: 5, t: "sample great", x: "sample great. going pro pack.", v: true },

  // 2
  { p: "Bulk Pack", s: 5, t: "bulk perfect", x: "bulk perfect. fast and discreet.", v: true },
  { p: "Pro Pack", s: 5, t: "extraordinary", x: "extraordinary quality. ordering again.", v: true },

  // 6
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. ordering more.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time.", v: true },
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "nice", x: "nice quality. impressed.", v: true },

  // 3
  { p: "Bulk Pack", s: 5, t: "bulk no issues", x: "bulk no issues. every bill clean.", v: true },
  { p: "Pro Pack", s: 5, t: "wow quality", x: "wow quality. cant stop reordering.", v: true },
  { p: "Standard Pack", s: 5, t: "satisfied", x: "satisfied. will be back.", v: true },

  // 4
  { p: "Sample Pack", s: 5, t: "sample sold me", x: "sample sold me. pro pack incoming.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk great", x: "bulk great. no defects. fast.", v: true },
  { p: "Pro Pack", s: 5, t: "five stars", x: "five stars. extraordinary quality.", v: true },
  { p: "Standard Pack", s: 5, t: "great", x: "great product. great delivery. happy.", v: true },

  // 2
  { p: "Sample Pack", s: 5, t: "sample impressed", x: "sample impressed me. ordering the full pack.", v: true },
  { p: "Bulk Pack", s: 5, t: "bulk consistent", x: "bulk consistent. same quality every bill.", v: true },

  // 5
  { p: "Pro Pack", s: 5, t: "perfect", x: "perfect order. perfect quality.", v: true },
  { p: "Standard Pack", s: 5, t: "clean", x: "clean product. fast ship. happy.", v: true },
  { p: "Sample Pack", s: 5, t: "good", x: "good quality. going bigger.", v: true },
  { p: "Bulk Pack", s: 5, t: "consistent", x: "consistent quality every time i order.", v: true },
  { p: "Pro Pack", s: 5, t: "wow", x: "wow. just wow. quality is next level.", v: true },
];

/* =====================================================
   ROTATION ENGINE — VARIABLE 1-6 REVIEWS PER DAY
   Total entries: 1320
   The SCHEDULE array maps each entry index to a day offset.
   Days with 3-6 entries feel busier (recent days).
   Days with 1-2 entries feel quieter (older days).
   
   Pattern repeats every 360 days.
   Rotation: offset = daysSinceEpoch % 360
   Entry's real date = today minus its assigned dayOffset
   adjusted by rotation offset.
===================================================== */
/* =====================================================
   PROCEDURAL REVIEW GROWTH ALGORITHM
===================================================== */
function mulberry32(a) {
  return function () {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Generates realistic names
let globalRecentNames = [];

function _generateRawName(rand, text) {
  const isFr = text ? /(livraison|merci|reçu|parfait|rapide|qualité|vrai|billets|commande|bien)/i.test(text) : rand() < 0.3;

  // Matières premières étendues
  const firstNamesEn = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Ethan', 'Walter', 'Noah', 'Jeremy', 'Christian', 'Keith', 'Roger', 'Terry', 'Gerald', 'Harold', 'Sean', 'Austin', 'Carl', 'Arthur', 'Lawrence', 'Carter', 'Jayden', 'Elias', 'Logan', 'Mason', 'Oliver', 'Lucas', 'Aiden', 'Jackson', 'Sebastian', 'Mateo', 'Owen', 'Theodore', 'Wyatt', 'Caleb', 'Asher', 'Leo', 'Isaiah', 'Josiah', 'Hudson', 'Hunter', 'Connor', 'Eli', 'Ezra', 'Landon', 'Adrian', 'Nolan', 'Jeremiah', 'Easton', 'Colton', 'Cameron', 'Carson', 'Angel', 'Maverick', 'Dominic', 'Jaxson', 'Greyson', 'Ian', 'Santiago', 'Jordan', 'Cooper', 'Brayden', 'Roman', 'Evan', 'Ezekiel', 'Xavier', 'Tommy', 'Bobby', 'Zayn', 'Amir', 'Ali', 'Hassan', 'Omar', 'Tariq', 'Malik', 'Bradley', 'Spencer', 'Colin', 'Devin', 'Trevor', 'Shane', 'Cole', 'Riley'];
  const firstNamesFr = ['Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'René', 'Louis', 'Alain', 'Jacques', 'Bernard', 'Marcel', 'Claude', 'Marie', 'Jeanne', 'Françoise', 'Monique', 'Sylvie', 'Catherine', 'Nathalie', 'Isabelle', 'Jacqueline', 'Anne', 'Martine', 'Céline', 'Mathieu', 'Julien', 'Alexandre', 'Guillaume', 'Nicolas', 'Antoine', 'Thomas', 'Vincent', 'Sébastien', 'Aimé', 'Alban', 'Albert', 'Alexis', 'Alfred', 'Alphonse', 'Ambroise', 'Anatole', 'Antonin', 'Aristide', 'Armand', 'Arnaud', 'Arsène', 'Arthur', 'Auguste', 'Augustin', 'Aurélien', 'Baptiste', 'Benoît', 'Bertrand', 'Brice', 'Bruno', 'Camille', 'Cédric', 'Célestin', 'Christian', 'Christophe', 'Clément', 'Clovis', 'Corentin', 'Cyril', 'Damien', 'Daniel', 'David', 'Denis', 'Didier', 'Dominique', 'Edmond', 'Edouard', 'Elie', 'Emile', 'Emmanuel', 'Eric', 'Etienne', 'Eugène', 'Fabien', 'Fabrice', 'Félix', 'Fernand', 'Florent', 'Florian', 'François', 'Franck', 'Frédéric', 'Gabriel', 'Gaspard', 'Gaston', 'Gauthier', 'Georges', 'Gérard', 'Germain', 'Gilbert', 'Gilles', 'Grégoire', 'Gustave', 'Guy', 'Henri', 'Hervé', 'Hubert', 'Hugues', 'Jérémie', 'Jérôme', 'Joseph', 'Jules', 'Justin', 'Kevin', 'Laurent', 'Lazare', 'Léon', 'Luc', 'Lucas', 'Lucien', 'Ludovic', 'Marc', 'Marin', 'Marius', 'Martin', 'Mathurin', 'Matthieu', 'Maurice', 'Maxime', 'Maximilien', 'Noël', 'Olivier', 'Pascal', 'Patrice', 'Paul', 'Quentin', 'Raoul', 'Raphaël', 'Raymond', 'Richard', 'Robert', 'Roland', 'Roméo', 'Serge', 'Simon', 'Sylvain', 'Théodore', 'Thibault', 'Thierry', 'Timothée', 'Tristan', 'Valentin', 'Victor', 'Xavier', 'Yves', 'Hugo', 'Leo', 'Adam', 'Malo', 'Noa', 'Tom', 'Sacha', 'Gabin', 'Tiago', 'Eliott', 'Kylian', 'Liam', 'Milan', 'Naël', 'Nino', 'Noam', 'Timéo', 'Yanis', 'Dorian', 'Esteban', 'Flavian', 'Titouan', 'Yohann', 'Loic', 'Erwan', 'Yann', 'Remi', 'Maxence', 'Bastien', 'Charles'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez', 'Tremblay', 'Gagnon', 'Roy', 'Cote', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie', 'Fortin', 'Pelletier', 'Belanger', 'Levesque', 'Bergeron', 'Leblanc', 'Paquette', 'Girard', 'Simard', 'Boucher', 'Caron', 'Beaulieu', 'Cloutier', 'Ouellet', 'Dubois', 'Desjardins', 'Nadeau', 'Martel', 'Goulet', 'Poirier', 'Tardif', 'Bedard', 'St-Pierre', 'Lapointe', 'Lefebvre', 'Lessard', 'Boudreau', 'Richard', 'Michaud', 'Hebert', 'Desrochers', 'Dube', 'Landry', 'Poulin', 'Cormier', 'Plante', 'Dupuis', 'Baril', 'Gagné', 'Vachon', 'Drouin', 'Savard', 'Fournier', 'Leduc', 'Lemieux', 'Rousseau', 'Denis', 'Lachance', 'Beaudoin', 'Perron', 'Gosselin', 'Chen', 'Wong', 'Li', 'Chan', 'Singh', 'Kaur', 'Sharma', 'Ali', 'Khan', 'Ahmad', 'Hussain', 'Mahmoud', 'Ibrahim', 'Hassan', 'Mohamed', 'Cohen', 'Levy', 'Katz', 'Goldberg', 'Klein', 'Schmidt', 'Muller', 'Weber', 'Meyer', 'Wagner', 'Hoffmann', 'Becker', 'Gallo', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'MacDonald', 'MacKay', 'MacLeod', 'Campbell', 'MacIntyre', 'Oconnor', 'Murphy', 'Walsh', 'Kelly', 'Boyle'];

  const cryptoKeywords = ['BTC_Whale', 'XMR_Ghost', 'StealthBuy', 'HODLer', 'SatStacker', 'CryptoBuyer', 'MoneroFan', 'SatoshiG', 'LedgerSafe', 'DeFi_King', 'ColdWallet', 'HashRate', 'BullRun', 'AltCoin', 'TrezorSafe', 'MiningRig', 'Web3_Native', 'BagHolder', 'ApeIn', 'DogeFather', 'ShibArmy', 'WalletSecured', 'Validator', 'Trustless', 'YieldFarm'];
  const proKeywords = ['Props', 'PropMaster', 'Director', 'Studio', 'Prod', 'Set', 'FilmMaker', 'Cinematic', 'Indie', 'FX', 'Visuals', 'ArtDept', 'VFX', 'Gaffer', 'SetDesign', 'PropHouse', 'Grip', 'Foley', 'SoundStage', 'Cinema', 'Film', 'Video', 'Shoot', 'Crew', 'Camera', 'Lighting', 'Lens', 'Red', 'Arri', 'DP', 'DoP', 'Producer', 'Editor', 'PostProd', 'CGI', 'Animation', 'Mocap', 'Rigging', 'GripDept', 'ArtDirector', 'Wardrobe', 'Costume', 'Makeup', 'Casting', 'Location', 'Scout', 'PA', 'AC', 'SoundMixer', 'BoomOp', 'Colorist', 'DIT', 'Script', 'Storyboard'];
  const streetKeywords = ['Plug', 'Cartel', 'King', 'Trap', 'Hustle', 'Cash', 'Stack', 'Money', 'Boss', 'Don', 'Flex', 'Bandz', 'G', 'Baller', 'Drip', 'Sauce', 'Fire', 'Savage', 'Valid', 'Goat', 'Lit', 'Guap', 'Cheddar', 'Bread', 'Paper', 'Dough', 'Mula', 'Dinero', 'Pesos', 'Bands', 'Racks', 'K', 'Stash', 'Vault', 'Safe', 'Bag', 'Secured', 'Hustler', 'Grind', 'CEO', 'Exec', 'Hunnid', 'Thou', 'Mil', 'Billion', 'Rich', 'Wealth', 'Lavish', 'Lux', 'Premium', 'Elite', 'Prime'];
  const gamerKeywords = ['Sniper', 'NoScope', 'Slayer', 'xX', 'TTV', 'TTV_', 'Gamer', 'Pro', 'Noob', 'Bot', 'Hack', 'Cheat', 'Aim', 'God', 'Beast', 'Monster', 'Demon', 'Ghost', 'Shadow', 'Ninja', 'Samurai', 'Viking', 'Knight', 'Mage', 'Rogue', 'Assassin', 'Hunter', 'Warrior', 'Tank', 'Healer', 'DPS', 'Carry', 'Support', 'Mid', 'Top', 'Jungle', 'ADC', 'Smurf', 'Main', 'OneTrick', 'OTP', 'Toxic', 'Salty', 'Rage', 'Quit', 'AFK', 'LFG', 'GG', 'WP', 'EZ', 'Clutch'];
  
  // NOUVELLES MATIÈRES PREMIÈRES SELON TA DEMANDE
  const funnyGov = ['JustinT', 'RevenuQuebec_Official', 'CRA_Agent', 'RCMP_Undercover', 'TrudeauSocks', 'TaxMan', 'GovDrone', 'BankOfCanada', 'CSIS_Agent', 'MayorOfMtl', 'Fisc_Can', 'DouanesQC', 'InspecteurGadget', 'MinistreDuCash'];
  const superHeroes = ['Batman', 'BruceW', 'ClarkK', 'TonyS', 'Spider', 'Wolverine', 'Deadpool', 'Flash', 'Aqua', 'Goku', 'Vegeta', 'Saitama', 'IronMan', 'Joker', 'Thanos', 'HulkSmash', 'ThorOdinson', 'CapAm', 'Groot', 'Vador', 'Skywalker'];
  const funnyNicknames = ['PoutineLover', 'MapleSyrup', 'MooseRider', 'SorryEh', 'Tabarnak', 'Osti', 'DoubleDouble', 'Toonie', 'Loonie', 'Caribou', 'SnowTire', 'IgluBuilder', 'BeaverTail'];
  const wordPlays = ['CashOutOutside', 'PropTart', 'BillNyeTheMoneyGuy', 'StackNorris', 'CelineDionDough', 'DrakeBands', 'TheWeekndCash', 'BreakingBands', 'BetterCallStacks', 'MoneyHeistFan', 'ElPropo'];
  const randomKeywords = ['Neon', 'Dark', 'Light', 'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Purple', 'Pink', 'Orange', 'Gold', 'Silver', 'Bronze', 'Iron', 'Steel', 'Wood', 'Stone', 'Fire', 'Water', 'Earth', 'Wind', 'Ice', 'Snow', 'Rain', 'Storm', 'Thunder', 'Lightning', 'Cloud', 'Sky', 'Star', 'Moon', 'Sun', 'Galaxy', 'Universe', 'Space', 'Time', 'Void', 'Abyss', 'Mango', 'Kiwi', 'Apple', 'Banana', 'Orange', 'Grape', 'Berry', 'Melon', 'Peach', 'Pear', 'Plum', 'Cherry', 'Lemon', 'Lime', 'Bear', 'Wolf', 'Fox', 'Lion', 'Tiger', 'Cat', 'Dog', 'Bird', 'Fish', 'Shark', 'Whale', 'Dolphin', 'Eagle', 'Hawk', 'Falcon', 'Owl', 'Raven', 'Crow'];
  
  const geoEn = ['VanCity', 'TO', '416', '604', '905', 'WestCoast', 'EastCoast', 'YYZ', 'YVR', 'YYC', 'YEG', 'YOW', '613', '780', '403', 'GTA'];
  const geoFr = ['MTL', 'QC', '514', '450', '418', 'Gatineau', 'Laval', 'YUL', 'YQB', '819', 'RiveSud', 'RiveNord'];

  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';

  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const roll = (chance) => rand() < chance;
  const rndChar = () => pick(chars);
  const rndNum = () => pick(nums);

  const firstName = pick(isFr ? firstNamesFr : firstNamesEn);
  const lastName = pick(lastNames);
  const initial = lastName.charAt(0);
  const geo = pick(isFr ? geoFr : geoEn);

  const rProf = rand();
  let pseudo = "";

  if (rProf < 0.60) {
    // 1. Normal (60% au lieu de 30%)
    const formats = [
      () => firstName + ' ' + lastName,
      () => firstName + ' ' + initial + '.',
      () => firstName.charAt(0) + '. ' + lastName,
      () => firstName + '_' + lastName,
      () => firstName.toLowerCase() + Math.floor(rand() * 99 + 1950)
    ];
    pseudo = pick(formats)();
  }
  else if (rProf < 0.65) {
    // 2. Crypto/Privacy Réaliste (5%) - Adieu les Redacted/Anon !
    const kw = pick(cryptoKeywords);
    const formats = [
      () => kw + '_' + geo,
      () => kw + rndNum() + rndNum(),
      () => firstName + '_' + kw,
      () => kw + '_' + pick(['Hodl', 'Safe', 'Buy', 'Fast'])
    ];
    pseudo = pick(formats)();
  }
  else if (rProf < 0.70) {
    // 3. Hustle/Street (5%)
    const kw = pick(streetKeywords);
    const formats = [
      () => geo + '_' + kw,
      () => kw + 'Star',
      () => firstName + '_' + kw,
      () => kw + rndNum() + rndNum()
    ];
    pseudo = pick(formats)();
  }
  else if (rProf < 0.80) {
    // 4. Pro / Cinéma (10%)
    const kw = pick(proKeywords);
    const formats = [
      () => kw + '_' + geo,
      () => 'Indie' + kw,
      () => kw + '_' + firstName,
      () => lastName + '_' + kw
    ];
    pseudo = pick(formats)();
  }
  else if (rProf < 0.85) {
    // 5. Gamer (5%)
    const kw = pick(gamerKeywords);
    const formats = [
      () => 'xX_' + kw + '_Xx',
      () => kw + rndNum() + rndNum() + rndNum(),
      () => pick(['TTV_', 'FaZe_', 'OpTic_']) + kw,
      () => kw + '_' + firstName
    ];
    pseudo = pick(formats)();
  }
  else if (rProf < 0.95) {
    // 6. Matières Premières Fun (Gouv, Super-Héros, Jeux de mots) (10%)
    const cat = pick([funnyGov, superHeroes, funnyNicknames, wordPlays]);
    const formats = [
      () => pick(cat),
      () => pick(cat) + rndNum() + rndNum(),
      () => pick(cat) + '_' + geo
    ];
    pseudo = pick(formats)();
  }
  else {
    // 7. Initials/Minimalist (5%)
    const formats = [
      () => firstName.charAt(0) + '.' + lastName.charAt(0) + '.',
      () => firstName.charAt(0) + lastName.charAt(0),
      () => firstName.charAt(0) + '_' + lastName.charAt(0),
      () => firstName.charAt(0) + lastName.charAt(0) + rndNum() + rndNum()
    ];
    pseudo = pick(formats)();
  }

  // Organic casing modifications
  if (roll(0.15)) {
    pseudo = pseudo.toLowerCase();
  } else if (roll(0.02)) {
    pseudo = pseudo.toUpperCase();
  }

  // Inject Money/Relevance Emojis (5% chance)
  if (roll(0.05)) {
    const emojis = ['💵', '💶', '💷', '💲', '🪙', '🤑', '💸', '💰', '🔥', '💯', '🚀', '🤫', '🙏', '😎', '👑', '💎', '📈'];
    pseudo += ' ' + pick(emojis);
  }

  return pseudo;
}

function generateProName(rand, text) {
  let genName;
  let attempts = 0;
  
  // Bouclier Anti-Répétition : on génère un nom, on vérifie s'il existe dans la mémoire des 500 derniers
  do {
    genName = _generateRawName(rand, text);
    rand = mulberry32(Math.floor(rand() * 9999999));
    attempts++;
  } while (globalRecentNames.includes(genName) && attempts < 50);

  // On sauvegarde le nouveau nom validé
  globalRecentNames.push(genName);
  
  // Si la mémoire dépasse 500 avis, on supprime le plus vieux
  if (globalRecentNames.length > 500) {
    globalRecentNames.shift();
  }

  return genName;
}


function buildDatabase(){
  const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayMs = today.getTime();
  const daysSinceEpoch = Math.floor((todayMs - EPOCH) / 86400000);
  const CYCLE = 360;
  const offset = daysSinceEpoch % CYCLE;
  
  let combinedFeed = [];
  
  // 1) ROTATE THE MASTER REVIEWS across the last 360 days
  const entries = MASTER.length;
  const pattern = [3,2,4,3,2,1,3,4,2,3,2,3,1,4,2,3,2,4,3,1,2,3,4,2,3,1,3,2,4,3,
                   2,3,4,1,3,2,3,4,2,1,3,2,4,3,2,3,1,4,2,3,4,2,3,1,3,2,4,3,2,3,
                   4,1,2,3,4,2,3,2,1,3,4,2,3,4,1,3,2,3,4,2,3,1,2,4,3,2,3,4,1,3,
                   2,3,4,2,1,3,2,4,3,2,3,4,1,3,2,3,2,4,3,1,2,3,4,2,3,1,3,4,2,3,
                   5,3,4,6,2,3,5,4,3,2,6,3,4,5,2,3,4,6,3,5,2,4,3,6,5,3,2,4,5,3,
                   6,2,3,5,4,3,6,2,5,3,4,6,3,2,5,4,3,6,5,2,3,4,6,3,5,2,4,3,6,5];

  const dayOffsets = [];
  let day_idx = 0;
  let pi = 0;
  while (dayOffsets.length < entries) {
    const count = pattern[pi % pattern.length];
    for (let k = 0; k < count && dayOffsets.length < entries; k++) {
      dayOffsets.push(day_idx);
    }
    day_idx++;
    pi++;
  }

  // Add the 1323 original reviews to the feed
  MASTER.forEach((r, i) => {
    const rawDay = dayOffsets[i];
    const daysAgo = (rawDay - offset + CYCLE * 4) % CYCLE;
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);

    // Use Math.imul to scramble the index intensely, preventing close seeds from producing identical first names
    const randTime = mulberry32(Math.imul(i + 1, 2654435761));
    // Time window: 10:00 AM to 3:00 AM (17-hour window = 1020 minutes)
    const totalMin = 600 + Math.floor(randTime() * 1020);
    d.setHours(Math.floor(totalMin / 60) % 24, totalMin % 60, Math.floor(randTime() * 60));

    combinedFeed.push({
      name: r.n || generateProName(randTime, r.x),
      pack: r.p, stars: r.s, title: r.t, text: r.x,
      date: d.toISOString(), verified: r.v
    });
  });

  // 2) PROCEDURAL GROWTH — 4 to 12 new reviews per day at random hours
  // Anchor: May 1, 2026 at 01:00 AM local — starts procedural growth 1 week ago
  const ANCHOR_TIME = new Date(2026, 4, 1, 1, 0, 0).getTime(); // Month 4 = May
  const BASE_COUNT = 2842;
  const nowMs = Date.now();
  const packs = ["Sample Pack", "Standard Pack", "Pro Pack", "Mid Pack", "Large Pack", "Bulk Pack"];
  let proceduralCount = 0;

  // Anti-repetition buffer
  let recentTexts = [];

  if (nowMs >= ANCHOR_TIME) {
    const daysSinceAnchor = Math.floor((nowMs - ANCHOR_TIME) / 86400000);

    for (let d = 0; d <= daysSinceAnchor; d++) {
      const dayRand = mulberry32(Math.imul(d + 77777, 16777619));
      const dailyNew = Math.floor(dayRand() * 9) + 4; // 4 to 12
      proceduralCount += dailyNew;

      // Only inject last 60 days into the DOM feed
      if (daysSinceAnchor - d > 60) continue;

      const dayStart = ANCHOR_TIME + d * 86400000;

      for (let j = 0; j < dailyNew; j++) {
        let revRand = mulberry32(Math.imul((d * 100 + j + 88888), 15485863) + 9876543);

        // Random time within the day (0:00–23:59), except day 0 review 0 = exactly 01:00
        let reviewTime;
        if (d === 0 && j === 0) {
          reviewTime = ANCHOR_TIME; // Exactly 01:00 on May 8
        } else {
          const minuteOfDay = Math.floor(revRand() * 1440);
          reviewTime = dayStart + minuteOfDay * 60000;
        }

        // Don't show reviews from the future
        if (reviewTime > nowMs) continue;

        // Anti-repetition
        let baseRev;
        let attempts = 0;
        do {
          baseRev = MASTER[Math.floor(revRand() * MASTER.length)];
          revRand = mulberry32(Math.floor(revRand() * 9999999));
          attempts++;
        } while (recentTexts.includes(baseRev.x) && attempts < 30);

        recentTexts.push(baseRev.x);
        if (recentTexts.length > 300) recentTexts.shift();

        combinedFeed.push({
          name: generateProName(revRand, baseRev.x),
          pack: (revRand() < 0.7) ? baseRev.p : packs[Math.floor(revRand() * packs.length)],
          stars: baseRev.s, title: baseRev.t, text: baseRev.x,
          date: new Date(reviewTime).toISOString(), verified: true
        });
      }
    }
  }

  // --- SAS DE SÉCURITÉ (Time-Gate) ---
  // Bloque strictement tout avis (rotatif ou procédural) dont l'heure n'est pas encore passée.
  const timeGatedFeed = combinedFeed.filter(r => new Date(r.date).getTime() <= nowMs);

  // Sort: newest first
  timeGatedFeed.sort((a,b) => new Date(b.date) - new Date(a.date));

  // Counter: exactly 2842 today + grows 4-12/day
  timeGatedFeed._totalProcedural = BASE_COUNT + proceduralCount;

  return timeGatedFeed;
}
