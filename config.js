/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              PROP CANADA — FICHIER DE CONFIGURATION          ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  Modifiez CE FICHIER pour changer :                          ║
 * ║    • Le lien Telegram                                        ║
 * ║    • Les adresses crypto (BTC, ZEC)                          ║
 * ║    • Les QR codes de paiement                                ║
 * ║    • L'email Interac                                         ║
 * ║    • Le webhook Discord                                      ║
 * ║                                                              ║
 * ║  Ce fichier est chargé AVANT script.js. Toutes les pages     ║
 * ║  lisent automatiquement depuis window.PBS_CONFIG.            ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

window.PBS_CONFIG = {

  /* ── SECURITE ── */
  ENABLE_ANTI_COPY: true,

  /* ────────────────────────────────────────────────────────────
     TELEGRAM
     Exemple : 'propbillsofficial1'  →  lien = t.me/propbillsofficial1
  ──────────────────────────────────────────────────────────────*/
  TELEGRAM: 'propbillsofficial1',

  /* ────────────────────────────────────────────────────────────
     ADRESSES CRYPTO
     Collez simplement la nouvelle adresse ici.
  ──────────────────────────────────────────────────────────────*/
  BTC_ADDRESS: 'bc1qg5u6nq8hwgkseychphcw5652le6gvz930pxuh2',
  ZEC_ADDRESS: 'u1c9h9cswer89qaqwtlw6js86mec79lva6yszg0yfs006nd5l7phfk2q5lu9eg62cz78kt0d8nz5azvmvrrqndstncv54p5fegh8mk6nc2jn68l4keu40k5n8yxyyrgpzn7qd4ttum20la2n2nqhv02dtrjj5ux5w54pk257nmh8zuh0yxsfkq806eeaqudee74gae84j8fm8y7gtdfjw',

  /* ────────────────────────────────────────────────────────────
     QR CODES (chemins relatifs depuis la racine du site)
     Pour changer un QR : remplacez le fichier image ET mettez
     son nom ici. Ex : 'assets/images/mon-nouveau-qr-btc.png'
  ──────────────────────────────────────────────────────────────*/
  BTC_QR: 'assets/images/crypto/qr-btc.png',
  ZEC_QR: 'assets/images/crypto/qr-zec.png',

  /* ────────────────────────────────────────────────────────────
     EMAIL INTERAC
  ──────────────────────────────────────────────────────────────*/
  INTERAC_EMAIL: 'RASPLIMON@gmail.com',

  /* ────────────────────────────────────────────────────────────
     WEBHOOK DISCORD (notifications de commandes)
     Laissez vide '' pour désactiver.
  ──────────────────────────────────────────────────────────────*/
  DISCORD_WEBHOOK: atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQ5NTU2ODA5OTI3NjIyNjU3MC9VcVNkRmJVbXEwUUtHN3o3V24xNFd3VmVOOXl3akptLThOcU9wdnJRb0hNeFNvSlEtLV9wa0tEX0liUmRYcFpudER3dQ=='),

};

/* ── Alias pratiques (lisibles directement par script.js) ── */
window.PBS_WEBHOOK = window.PBS_CONFIG.DISCORD_WEBHOOK;

/* ── Injection automatique des liens Telegram dans les sous-pages ──
   Les pages product-info, delivery-info, reviews ont des liens
   Telegram hardcodés. Ce script les met à jour au chargement.     */
document.addEventListener('DOMContentLoaded', function () {
  const tg = window.PBS_CONFIG.TELEGRAM;
  const fullUrl = 'https://t.me/' + tg;

  // Met à jour tous les href="https://t.me/..." dans la page
  document.querySelectorAll('a[href^="https://t.me/"]').forEach(function (a) {
    a.href = fullUrl;
    // Si le texte visible est un username (@...), le mettre à jour aussi
    if (a.textContent.trim().startsWith('@')) {
      a.textContent = '@' + tg;
    }
  });

  // Met à jour les spans/divs contenant le texte @propbillsofficial1
  document.querySelectorAll('[id^="an-tg"], [id^="mcp-tg"]').forEach(function (el) {
    if (el.tagName === 'A') {
      el.href = fullUrl;
    }
  });
});
