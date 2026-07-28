document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gold-dust");
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];

  // Redimensionnement du canvas
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener("resize", resize);
  resize();

  // Classe Particule (Poussière d'Or)
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5; // Taille très petite
      this.speedX = (Math.random() - 0.5) * 0.3; // Mouvement lent
      this.speedY = (Math.random() - 0.5) * 0.3 - 0.2; // Légère tendance à monter
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = (Math.random() - 0.5) * 0.01;

      // Couleurs dorées
      const colors = [
        'rgba(212, 175, 55, OPA)', // Gold
        'rgba(255, 215, 0, OPA)', // Bright Gold
        'rgba(253, 245, 230, OPA)' // Old Lace (très clair)
      ];
      this.colorTemplate = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Effet de scintillement
      this.opacity += this.fadeSpeed;
      if (this.opacity >= 0.8 || this.opacity <= 0.1) {
        this.fadeSpeed *= -1;
      }

      // Réinitialiser si hors écran
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
        // Si la particule sort par le haut, on la replace en bas
        if (this.y < 0) {
          this.y = height;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorTemplate.replace('OPA', this.opacity.toFixed(2));
      ctx.fill();

      // Halo lumineux (Glow effect) pour quelques particules
      if (this.size > 1.2) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      } else {
        ctx.shadowBlur = 0;
      }
    }
  }

  // Initialisation des particules
  function init() {
    particles = [];
    const numberOfParticles = (width * height) / 10000; // Densité adaptative
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  // Boucle d'animation
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  init();
  animate();

  // Changement de la navbar au scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(5, 5, 5, 0.9)';
      navbar.style.borderBottom = '1px solid rgba(212, 175, 55, 0.5)';
      navbar.style.padding = '1rem 5%';
    } else {
      navbar.style.background = 'rgba(10, 10, 10, 0.6)';
      navbar.style.borderBottom = '1px solid rgba(212, 175, 55, 0.2)';
      navbar.style.padding = '1.5rem 5%';
    }
  });
});


/* ── ANCIEN SITE LOGIC ── */

/* ── CONFIG ── */
const WH = atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTUzMTQ0ODM1ODUyOTQwMDk1Mi80ZGU0cWxpbmEwRnN4Um9sYW5qTW52S0xTX2ZVNXBJWFhSV2xqQTM3WWVtZVFTMGIwVEJwRUtBLUVwUnhtd29LOU5nZA==");
const BTC = "bc1qg5u6nq8hwgkseychphcw5652le6gvz930pxuh2";
const ZEC = "u1c9h9cswer89qaqwtlw6js86mec79lva6yszg0yfs006nd5l7phfk2q5lu9eg62cz78kt0d8nz5azvmvrrqndstncv54p5fegh8mk6nc2jn68l4keu40k5n8yxyyrgpzn7qd4ttum20la2n2nqhv02dtrjj5ux5w54pk257nmh8zuh0yxsfkq806eeaqudee74gae84j8fm8y7gtdfjw";
const INT = "ghostlimon2@outlook.com";

const PACKS = [
  { id: 's', size: 150, bundles: 3, price: 120, star: false, en: "Sample Pack", fr: "Pack Découverte" },
  { id: 'm', size: 400, bundles: 8, price: 210, star: false, en: "Standard Pack", fr: "Pack Standard" },
  { id: 'l', size: 800, bundles: 16, price: 350, star: false, en: "Mid Pack", fr: "Pack Mid" },
  { id: 'md', size: 1250, bundles: 25, price: 520, star: true, en: "Pro Pack", fr: "Pack Pro" },
  { id: 'lg', size: 2000, bundles: 40, price: 760, star: false, en: "Large Pack", fr: "Pack Large" },
  { id: 'x', size: 3000, bundles: 60, price: 1050, star: false, en: "Bulk Pack", fr: "Pack Vrac" }
];

/* ── STATE ── */
let lang = 'en', payM = null, cart = [], build = null, freeC = 0, freeS = { 20: 0, 50: 0, 100: 0 };

/* ── HELPERS ── */
const G = id => document.getElementById(id);
const TT = (id, v) => { const e = G(id); if (e) e.textContent = v; };
const TH = (id, v) => { const e = G(id); if (e) e.innerHTML = v; };
const L = () => T[lang];

/* ── TRANSLATIONS ── */
const T = {
  en: {
    logoName: "PROP CANADA", logoSub: "Premium Custom Currency",
    an1: "Discreet packaging guaranteed", an2: "1 free bundle per $100 with crypto",
    an3: "Shipped with Purolator", anTg: "Telegram: @propbillsofficial1",
    ht1: "Secure Checkout", ht2: "Discreet Shipping", ht3: "Satisfaction Guaranteed",
    heroBadge: "Premium Prop Currency",
    heroSubtitle: "The secret to your financial success starts here.",
    heroEliteCta: "Discover the Elite",
    collectionTitle: "Our Premium Collection",
    hl1: "The Finest", hl2: " Prop Bills", hl3: " On The Market.",
    heroDesc: "Custom $20, $50 and $100 denomination packs. You choose the exact mix. Shipped discreetly via Purolator.",
    heroCta: "Shop Now", heroTg: "Telegram",
    hcLbl: "Why Buyers Choose Us",
    hcn1: "Discreet Packaging", hcs1: "Plain unmarked box — nothing visible outside.",
    hcn2: "2 Payment Methods", hcs2: "Bitcoin or Interac - your choice.",
    hcn3: "Fully Custom Mix", hcs3: "Full control over every $20/$50/$100 ratio.",
    hcn4: "Purolator Delivery", hcs4: "Reliable carrier, tracked delivery.",
    st1h: "Choose your pack", st1s: "4 sizes available",
    st2h: "Build your mix", st2s: "$20 / $50 / $100 split",
    st3h: "Pay securely", st3s: "BTC • Interac",
    st4h: "We ship fast", st4s: "via Purolator",
    se: "Available Packs", sti: "Choose Your Pack Size",
    sd: "Each pack is fully customizable — assign a denomination ($20, $50 or $100) to each 50-bill bundle. No restrictions.",
    cartTitle: "Your Order", totalLbl: "Order Total",
    ckTxt: "Proceed to Checkout", hCartLbl: "Order",
    cartEmpty: "No items yet — choose a pack above.",
    starLbl: "Most Popular", perBill: "per bill",
    buildBtn: "Build My Mix",
    mbEye: "Step 2 — Denomination Builder",
    mbTitle: n => `Build Your Mix: ${n}`,
    mbLbl: "Assign a denomination to each bundle",
    btbLbl: "Bundles assigned",
    pbCnt: (n, t) => `${n} / ${t}`,
    pbOver: t => `Max ${t} bundles — please reduce.`,
    addBtn: "Add to Order",
    mpEye: "Step 3 — Payment", mpTitle: "Choose a Payment Method",
    bonusLbl: "🎁 Crypto Bonus:", bonusTxt: " Pay in Bitcoin and get 1 free 50-bill bundle for every $100 spent. Choose its denomination in the next step.",
    psBtc: "Maximum privacy · Crypto bonus",
    psZec: "Shielded transactions · Crypto bonus",
    psIntH: "Interac e-Transfer", psInt: "Canadian customers · Instant",
    moEye: "Step 4 — Confirm", moTitle: "Contact & Shipping",
    fslC: "Contact Info", fslS: "Shipping Address", fslP: "Payment Instructions",
    lbExpress: "Express Shipping with Purolator (+$10 CAD)", lbName: "Full Name", lbEmail: "Email", lbTg: "Telegram",
    lbPhone: "Phone Number",
    lbApt: "Apartment / Unit", lbAptOpt: "(optional)",
    lbAddr: "Street Address", lbCity: "City", lbProv: "Province / State",
    lbPost: "Postal Code", lbCtry: "Country", lbNotes: "Notes",
    lbSignature: "Require Signature Upon Delivery",
    tipSigTitle: "Signature Required",
    tipSigBody: "Check this box if you want to personally sign for your package when it arrives. This ensures no one else can receive it in your place. Note: you must be home or available at the time of delivery.",
    lbDefer: "Schedule a Specific Delivery Date",
    tipDeferTitle: "Deferred Delivery",
    tipDeferBody: "If you'd like your order held and delivered on a specific date, check this box and enter the date below. Leave unchecked for the earliest possible delivery.",
    lbDeferDate: "Desired Delivery Date",
    tipCidTitle: "What is a Client ID?",
    tipCidBody: "Enter your client ID so we can link your order to your file without any error. If you don't have one yet, you'll receive one automatically right after your payment.",
    tipTgTitle: "Why your Telegram?",
    tipTgBody: "Share your Telegram username so we can add you to our exclusive private client group. You'll receive:",
    tipTgLi1: "Exclusive information",
    tipTgLi2: "Useful tips & advice",
    tipTgLi3: "Priority updates",
    tipTgLi4: "Direct access to our team",
    tipPhoneTitle: "Confidentiality",
    tipPhoneBody: "Your phone number is used only to receive your Purolator tracking SMS. If you prefer not to share your real number, you can use a free app number from TextNow (textnow.com) or TextMe (textmeapp.com).",
    tipExpressTitle: "Express Shipping",
    tipExpressBody: "Your order will be shipped via Purolator Express — next business day delivery, priority processing, full tracking. A $10 CAD surcharge is added to your total.",
    tipNotesTitle: "Order Notes",
    tipNotesBody: "Use this field for any special delivery instructions, e.g. 'leave at the door', preferred time, or any other details for our team.",
    tipPromoTitle: "Promo Code",
    tipPromoBody: "Promo codes are issued after a completed order or shared in our private Telegram group. Format: PBS10-XXXX. A valid code gives you 10% off.",
    lbPromo: "Promo Code", lbPromoOpt: "(optional)",
    promoValid: "✓ Valid promo code — noted!",
    promoInvalid: "Code not recognized — your order still goes through.",
    phoneTip: "Your phone number is used only to receive your Purolator tracking SMS. If you prefer not to share your real number, you can use a free app number from TextNow (textnow.com) or TextMe (textmeapp.com).",
    privacyNotice: "Your information is sent to an encrypted ProtonMail inbox and is strictly confidential. It is used solely for processing and delivering your order and will never be shared with anyone.",
    intlWarnTitle: "International Order?",
    intlWarnText: " International shipping is handled via FedEx. Rates vary by region — some destinations ship at no extra cost. Please contact us on Telegram before placing your order so we can confirm availability and any applicable fees.",
    heroProdBtn: "Product Info", heroDelivBtn: "Delivery Info",
    placeTxt: "Place Order",
    shipBadge: "Shipping Partner",
    shipSub: "Every order is shipped via Purolator — fully tracked, discreet, and delivered to your door.",
    shh1: "Plain Packaging", shs1: "Neutral box, no visible branding.",
    shh2: "Delivery Guaranteed", shs2: "We guarantee your package is delivered. If it isn't, we reship at no cost.",
    shh3: "No Signature Required", shs3: "Package left at your door — no need to be home.",
    guar1: "100% Delivery Guarantee — we reship if your package doesn't arrive",
    guar2: "No signature required — left at door",
    guar3: "Same-day dispatch after payment confirmation",
    fName: "PROP CANADA",
    fDesc: "Premium custom prop currency. Your exact mix, shipped discreetly via Purolator.",
    fc1: "Payments", fInt: "Interac e-Transfer (CA)",
    fc2: "Packs", fp1: "Sample — 150 bills", fp2: "Standard — 400 bills", fp3: "Mid — 800 bills", fp4: "Pro — 1 250 bills", fp5: "Large — 2 000 bills", fp6: "Bulk — 3 000 bills",
    fc3: "Contact", fc3n: "Send payment proof via Telegram", fCopy: "© 2025 PROP CANADA",
    cryptoAddrLbl: s => `${s} Address:`,
    cryptoSend: (s, t) => `Send exactly $${t} CAD in ${s}:`,
    liveRateLbl: "Live Rate · CoinGecko",
    convSend: (s, t) => `For $${t} CAD, send:`,
    interacTo: "Send your Interac e-Transfer to:",
    interacPwd: "Security answer / password:", interacFill: "Type Canada in all empty character fields (mandatory)",
    interacLeave: "Leave blank any field that doesn't require info",
    freeTitleFn: n => `🎁 ${n} Free Bundle${n > 1 ? 's' : ''} — Crypto Bonus`,
    freeSubFn: n => `Assign your ${n} free bundle${n > 1 ? 's' : ''} below:`,
    bundleWord: "bundles", billsWord: "bills", bundleOf: "1 bundle = 50 bills",
    sTitle: "Order Received!", sDesc: "Your order and shipping address have been sent to our team.<br>We'll dispatch via Purolator once your payment is confirmed.",
    sTgLbl: "Send your payment proof to:", restartBtn: "Start New Order",
    addrPh: "123 Main St, Apt 4B", cityPh: "Montreal", provPh: "QC", postalPh: "H3A 1A1",
    mbSummary: (name, bundles, size, price) => `You have selected the <strong>${name}</strong>. This configuration includes <strong>${bundles} bundles</strong> (a total of <strong>${size} individual bills</strong>). Total order value: <strong>$${price} CAD</strong>.<br><br>Please use the allocation module below to assign each 50-bill bundle to your preferred denominations ($20, $50, or $100) and finalize your custom mix.`,
    addBtnTxt: "Add to Order",
    payNowTxt: "Pay Now",
    guideToggleTitle: "New to crypto? Read our beginner's guide first",
    guideToggleSub: "Step-by-step: how to pay in BTC quickly, safely and cheaply",
    guideS1Title: "⚠️ Common Mistakes to Avoid",
    guideS2Title: "✅ Easiest Ways to Buy & Send Crypto",
    guideS3Title: "💡 Pro Tips for a Smooth Payment",
    guideWarning1: "Do NOT sign up for major exchanges like Coinbase or Binance just to make a one-time payment — your funds can be locked for days during identity verification.",
    guideWarning2: "Do NOT send from an exchange directly if you're a new user — many exchanges freeze withdrawals on new accounts.",
    guideTip1: "Use a peer-to-peer or instant-buy app that doesn't require lengthy ID verification for small amounts.",
    guideTip2: "Always double-check the address before confirming. Copy-paste — never type it manually.",
    guideStep1Title: "Use a fast, no-frills app",
    guideStep1Desc: "For small purchases, the easiest method is a Bitcoin ATM (find one at coinatmradar.com), or apps like Shakepay (Canada), Bull Bitcoin, or Strike. These allow you to buy and send crypto directly without a long verification wait.",
    guideStep2Title: "Buy only what you need",
    guideStep2Desc: "Check the live converter below to see exactly how much BTC to buy. Buy just a little extra (e.g. $5-10) to cover network fees.",
    guideStep3Title: "Copy the address carefully",
    guideStep3Desc: "Copy our payment address using the copy button. Open your wallet app, select 'Send', paste the address, enter the amount, and confirm. That's it — no account setup needed on our end.",
    guideStep4Title: "Wait for confirmation",
    guideStep4Desc: "Bitcoin transactions usually confirm within 10-30 minutes. Once sent, take a screenshot of the confirmation screen (or transaction hash) and send it to us on Telegram. We will instantly verify and process your order.",
    spGuideTitle: "Highly Recommended: Pay with Shakepay",
    spGuideSub: "Fast, simple, and secure Canadian platform",
    spIntro: "Hello! Thank you for your order. To finalize your purchase, I accept Bitcoin payments via Shakepay. It is a secure, Canadian-based platform that makes the process fast and simple. Please follow these steps to complete your payment:",
    spS1Title: "1. Registration (One-time Setup)",
    spS1Desc: "• <strong>Download:</strong> Get the Shakepay app from the App Store or Google Play, or visit shakepay.com.<br>• <strong>Sign Up:</strong> Create your account using your phone number or email address.<br>• <strong>Verification (KYC):</strong> As a Canadian platform, Shakepay is required to verify your identity. Follow the prompts to take a photo of your ID (driver's license or passport) and a quick selfie. Approval usually takes less than 5 minutes.",
    spS2Title: "2. Add Funds (Canadian Dollars)",
    spS2Desc: "• Once your account is verified, tap \"Add funds\" on the home screen.<br>• Select \"Interac e-Transfer\".<br>• Shakepay will provide you with a specific email address and payment details.<br>• <strong>Go to your banking app:</strong> Send an Interac e-Transfer for the exact invoice amount using the details provided by Shakepay.",
    spS3Title: "3. Buy Bitcoin",
    spS3Desc: "• Once the funds arrive in your Shakepay balance (you will receive a notification), return to the app home screen.<br>• Tap the blue circular button with two arrows at the bottom center.<br>• Choose to buy Bitcoin with your CAD balance. Enter the amount required for your invoice and confirm.",
    spS4Title: "4. Send Payment",
    spS4Desc: "• On the home screen, tap \"Send\" in the top right corner.<br>• In the search bar, paste my Bitcoin address exactly:<br><strong style='color:#10b981;word-break:break-all;'>bc1q49x7p5h5te83q0j96rthjxkua8tgsw47qzc3me</strong><br>• Enter the exact Bitcoin amount required.<br>• Tap \"Continue\" and confirm the transaction.",
    spWarnTitle: "⚠️ Important Tips for a Smooth Transaction",
    spWarn1: "<strong>The Name Match Rule:</strong> The Interac e-Transfer must come from a bank account held in your personal name. If the name on your bank account does not match the name on your Shakepay account, the transaction will be blocked by security.",
    spWarn2: "<strong>Bank Security:</strong> If it is your first time sending an Interac e-Transfer to a crypto platform, your bank may flag it for your protection. If the funds do not appear in Shakepay after 30 minutes, check your email or text messages—your bank likely sent a request for you to authorize the transfer.",
    spOutro: "<strong>Next Steps:</strong> Once the transfer is sent, please let me know. I will mark your order as \"Paid,\" invite you to our private group, and your package will be dropped off at Purolator tomorrow around 2:00 PM. I will send you your tracking number immediately afterward!",
    guideStep4Tag: "Usually 10–30 min"
  },
  fr: {
    logoName: "PROP CANADA", logoSub: "Billets Personnalisés Premium",
    an1: "Emballage discret garanti", an2: "1 liasse gratuite par 100 $ en crypto",
    an3: "Expédié avec Purolator", anTg: "Telegram : @propbillsofficial1",
    ht1: "Paiement sécurisé", ht2: "Livraison discrète", ht3: "Qualité garantie",
    heroBadge: "Billets de Prop Premium",
    heroSubtitle: "Le secret de votre réussite financière commence ici.",
    heroEliteCta: "Découvrir l'Élite",
    collectionTitle: "Notre Collection Premium",
    hl1: "Les Meilleurs", hl2: " Prop Bills", hl3: " Du Marché.",
    heroDesc: "Packs de billets $20, $50 et $100 entièrement personnalisables. Vous choisissez la répartition exacte. Livré discrètement via Purolator.",
    heroCta: "Commander", heroTg: "Telegram",
    hcLbl: "Pourquoi nous choisir",
    hcn1: "Emballage discret", hcs1: "Boîte neutre, rien de visible à l'extérieur.",
    hcn2: "2 moyens de paiement", hcs2: "Bitcoin ou Interac - votre choix.",
    hcn3: "Mix sur mesure", hcs3: "Contrôle total sur la répartition $20/$50/$100.",
    hcn4: "Purolator", hcs4: "Transporteur fiable, livraison suivie.",
    st1h: "Choisissez votre pack", st1s: "4 tailles disponibles",
    st2h: "Construisez votre mix", st2s: "Répartissez $20 / $50 / $100",
    st3h: "Payez en sécurité", st3s: "BTC • Interac",
    st4h: "On expédie vite", st4s: "via Purolator",
    se: "Packs disponibles", sti: "Choisissez votre pack",
    sd: "Chaque pack est entièrement personnalisable — attribuez une coupure ($20, $50 ou $100) à chaque liasse de 50 billets.",
    cartTitle: "Votre commande", totalLbl: "Total de la commande",
    ckTxt: "Passer à la caisse", hCartLbl: "Commande",
    cartEmpty: "Aucun article — choisissez un pack ci-dessus.",
    starLbl: "Le Plus Populaire", perBill: "par billet",
    buildBtn: "Configurer mon mix",
    mbEye: "Étape 2 — Répartition des coupures",
    mbTitle: n => `Configurer : ${n}`,
    mbLbl: "Attribuez une coupure à chaque liasse",
    btbLbl: "Liasses attribuées",
    pbCnt: (n, t) => `${n} / ${t}`,
    pbOver: t => `Maximum ${t} liasses — veuillez réduire.`,
    addBtn: "Ajouter à la commande",
    mpEye: "Étape 3 — Paiement", mpTitle: "Choisir un mode de paiement",
    bonusLbl: "🎁 Bonus crypto :", bonusTxt: " Payez en Bitcoin et recevez 1 liasse gratuite de 50 billets pour chaque 100 $ dépensé. Choisissez sa valeur à l'étape suivante.",
    psBtc: "Confidentialité max · Bonus crypto",
    psZec: "Transactions protégées · Bonus crypto",
    psIntH: "Interac Virement", psInt: "Clients canadiens · Instantané",
    moEye: "Étape 4 — Confirmer", moTitle: "Coordonnées et livraison",
    fslC: "Vos coordonnées", fslS: "Adresse de livraison", fslP: "Instructions de paiement",
    lbExpress: "Expédition Express Purolator (+10 $ CAD)", lbName: "Nom complet", lbEmail: "Courriel", lbTg: "Telegram",
    lbPhone: "Numéro de téléphone",
    lbApt: "Appartement / Unité", lbAptOpt: "(optionnel)",
    lbAddr: "Adresse (rue et numéro)", lbCity: "Ville", lbProv: "Province / État",
    lbPost: "Code postal", lbCtry: "Pays", lbNotes: "Notes",
    lbSignature: "Exiger une signature à la livraison",
    tipSigTitle: "Signature requise",
    tipSigBody: "Cochez cette case si vous souhaitez signer personnellement pour votre colis à la livraison. Cela garantit que personne d'autre ne peut le recevoir à votre place. Note : vous devez être disponible au moment de la livraison.",
    lbDefer: "Planifier une date de livraison précise",
    tipDeferTitle: "Livraison différée",
    tipDeferBody: "Si vous souhaitez que votre commande soit retenue et livrée à une date précise, cochez cette case et entrez la date ci-dessous. Laissez décoché pour la livraison au plus tôt.",
    lbDeferDate: "Date de livraison souhaitée",
    lbPromo: "Code promo", lbPromoOpt: "(optionnel)",
    tipCidTitle: "À quoi sert votre identifiant ?",
    tipCidBody: "Entrez votre identifiant de client afin que nous puissions associer votre commande à votre dossier sans erreur. Si vous n'en avez pas encore, vous en recevrez un automatiquement après votre paiement.",
    tipTgTitle: "Pourquoi votre Telegram ?",
    tipTgBody: "Indiquez votre identifiant Telegram pour que nous puissions vous ajouter à notre groupe privé clients. Vous y recevrez :",
    tipTgLi1: "Des informations exclusives",
    tipTgLi2: "Des conseils utiles",
    tipTgLi3: "Des mises à jour prioritaires",
    tipTgLi4: "Un accès direct à l'équipe",
    tipPhoneTitle: "Confidentialité",
    tipPhoneBody: "Votre numéro est utilisé uniquement pour recevoir votre notification de suivi Purolator par SMS. Si vous préférez ne pas partager votre vrai numéro, utilisez un numéro d'application comme TextNow ou TextMe.",
    tipExpressTitle: "Expédition Express",
    tipExpressBody: "Votre commande sera expédiée via Purolator Express — livraison le prochain jour ouvrable, traitement prioritaire, suivi complet. Un supplément de 10 $ CAD est ajouté à votre total.",
    tipNotesTitle: "Notes de commande",
    tipNotesBody: "Utilisez ce champ pour toute instruction de livraison spéciale, ex. : 'laisser à la porte', heure préférée, ou tout autre détail pour notre équipe.",
    tipPromoTitle: "Code promo",
    tipPromoBody: "Les codes promo sont attribués après une commande complétée ou partagés dans notre groupe Telegram privé. Format : PBS10-XXXX. Un code valide vous donne 10 % de réduction.",
    promoValid: "✓ Code promo valide — noté !",
    promoInvalid: "Code non reconnu — votre commande passe quand même.",
    phoneTip: "Votre numéro de téléphone sert uniquement à recevoir les notifications de suivi Purolator par SMS. Si vous préférez ne pas partager votre vrai numéro, vous pouvez utiliser un numéro d'application gratuit via TextNow (textnow.com) ou TextMe (textmeapp.com).",
    privacyNotice: "Vos informations sont envoyées à une boîte ProtonMail chiffrée et sont strictement confidentielles. Elles sont utilisées uniquement pour traiter et livrer votre commande et ne seront jamais partagées.",
    intlWarnTitle: "Commande internationale ?",
    intlWarnText: " La livraison internationale s'effectue via FedEx. Les tarifs varient selon la région — certaines destinations sont sans frais supplémentaires. Veuillez nous contacter sur Telegram avant de passer commande pour confirmer la disponibilité et les éventuels frais applicables.",
    heroProdBtn: "Infos Produit", heroDelivBtn: "Infos Livraison",
    placeTxt: "Confirmer la commande",
    shipBadge: "Transporteur",
    shipSub: "Chaque commande est expédiée via Purolator — suivi complet, livraison discrète à votre porte.",
    shh1: "Emballage neutre", shs1: "Boîte sans marquage ni marque visible.",
    shh2: "Livraison garantie", shs2: "Nous garantissons la livraison de votre colis. Sinon, nous le réexpédions sans frais.",
    shh3: "Sans signature requise", shs3: "Le colis est laissé à la porte — pas besoin d'être présent.",
    guar1: "Garantie de livraison 100 % — réexpédition gratuite si votre colis n'arrive pas",
    guar2: "Sans signature requise — laissé à la porte",
    guar3: "Expédition le jour même après confirmation du paiement",
    fName: "PROP CANADA",
    fDesc: "Billets de prop premium entièrement personnalisables. Livrés discrètement via Purolator.",
    fc1: "Paiements", fInt: "Interac Virement (CA)",
    fc2: "Packs", fp1: "Découverte — 150 billets", fp2: "Standard — 400 billets", fp3: "Mid — 800 billets", fp4: "Pro — 1 250 billets", fp5: "Large — 2 000 billets", fp6: "Vrac — 3 000 billets",
    fc3: "Contact", fc3n: "Envoyez votre preuve de paiement via Telegram", fCopy: "© 2025 PROP CANADA",
    cryptoAddrLbl: s => `Adresse ${s} :`,
    cryptoSend: (s, t) => `Envoyez exactement $${t} CAD en ${s} :`,
    liveRateLbl: "Taux en temps réel · CoinGecko",
    convSend: (s, t) => `Pour $${t} CAD, envoyez :`,
    interacTo: "Envoyez votre virement Interac à :",
    interacPwd: "Mot de passe de sécurité :", interacFill: "Écrire Canada dans tous les champs de caractères vides (obligatoire)",
    interacLeave: "Laisser vide tout champ ne nécessitant pas d'information",
    freeTitleFn: n => `🎁 ${n} Liasse${n > 1 ? 's' : ''} Gratuite${n > 1 ? 's' : ''} — Bonus crypto`,
    freeSubFn: n => `Attribuez vos ${n} liasse${n > 1 ? 's' : ''} gratuites ci-dessous :`,
    bundleWord: "liasses", billsWord: "billets", bundleOf: "1 liasse = 50 billets",
    sTitle: "Commande reçue !", sDesc: "Votre commande et adresse de livraison ont été envoyées à notre équipe.<br>Nous expédierons via Purolator dès confirmation de votre paiement.",
    sTgLbl: "Envoyez votre preuve de paiement à :", restartBtn: "Nouvelle commande",
    addrPh: "123 rue Principale, App. 2", cityPh: "Montréal", provPh: "QC", postalPh: "H3A 1A1",
    mbSummary: (name, bundles, size, price) => `Vous avez sélectionné le <strong>${name}</strong>. Cette configuration comprend <strong>${bundles} liasses</strong> (soit un total de <strong>${size} billets individuels</strong>). Valeur totale de la commande : <strong>${price} $ CAD</strong>.<br><br>Veuillez utiliser le module de configuration ci-dessous pour assigner chaque liasse de 50 billets aux coupures de votre choix (20 $, 50 $ ou 100 $) afin de finaliser votre mix personnalisé.`,
    addBtnTxt: "Ajouter à la commande",
    payNowTxt: "Payer maintenant",
    guideToggleTitle: "Nouveau en crypto ? Lisez notre guide avant de payer",
    guideToggleSub: "Étape par étape : comment payer en BTC rapidement, en toute sécurité et à moindres frais",
    guideS1Title: "⚠️ Erreurs courantes à éviter",
    guideS2Title: "✅ Les moyens les plus simples d'acheter et d'envoyer des cryptos",
    guideS3Title: "💡 Conseils pour un paiement sans accroc",
    guideWarning1: "N'ouvrez PAS un compte sur de grands échanges comme Coinbase ou Binance juste pour un paiement unique — vos fonds peuvent être bloqués plusieurs jours pendant la vérification d'identité.",
    guideWarning2: "N'envoyez PAS depuis un échange si vous êtes un nouvel utilisateur — beaucoup bloquent les retraits sur les nouveaux comptes.",
    guideTip1: "Utilisez une application d'achat instantané ou pair à pair qui ne nécessite pas de vérification d'identité longue pour de petits montants.",
    guideTip2: "Vérifiez toujours l'adresse avant de confirmer. Copiez-collez — ne tapez jamais manuellement.",
    guideStep1Title: "Utilisez une app rapide et sans prise de tête",
    guideStep1Desc: "Pour les petits achats, le moyen le plus simple est un guichet Bitcoin (trouvez-en un sur coinatmradar.com), ou des apps comme Shakepay (Canada), Bull Bitcoin ou Strike. Elles permettent d'acheter et d'envoyer des cryptos directement, sans longue attente de vérification.",
    guideStep2Title: "Achetez seulement ce qu'il vous faut",
    guideStep2Desc: "Consultez le convertisseur en temps réel ci-dessous pour savoir exactement combien de BTC acheter. Achetez un peu plus (ex: 5-10$) pour couvrir les frais de réseau.",
    guideStep3Title: "Copiez l'adresse avec soin",
    guideStep3Desc: "Copiez notre adresse de paiement. Ouvrez votre application de portefeuille, sélectionnez « Envoyer », collez l'adresse, entrez le montant et confirmez. C'est tout — aucune configuration de compte requise de notre côté.",
    guideStep4Title: "Attendez la confirmation",
    guideStep4Desc: "Les transactions Bitcoin se confirment généralement en 10 à 30 minutes. Une fois envoyé, prenez une capture d'écran (ou le hash de transaction) et envoyez-la sur Telegram. Nous validerons instantanément la commande.",
    spGuideTitle: "Fortement conseillé : Payer avec Shakepay",
    spGuideSub: "Plateforme canadienne rapide, simple et sécurisée",
    spIntro: "Bonjour ! Merci pour votre commande. Pour finaliser votre achat, j'accepte les paiements Bitcoin via Shakepay. C'est une plateforme canadienne sécurisée qui rend le processus rapide et simple. Veuillez suivre ces étapes pour effectuer votre paiement :",
    spS1Title: "1. Inscription (Configuration unique)",
    spS1Desc: "• <strong>Télécharger :</strong> Obtenez l'application Shakepay sur l'App Store ou Google Play, ou visitez shakepay.com.<br>• <strong>S'inscrire :</strong> Créez votre compte avec votre numéro de téléphone ou adresse courriel.<br>• <strong>Vérification (KYC) :</strong> En tant que plateforme canadienne, Shakepay doit vérifier votre identité. Prenez en photo votre pièce d'identité (permis ou passeport) et un selfie. L'approbation prend généralement moins de 5 minutes.",
    spS2Title: "2. Ajouter des fonds (Dollars Canadiens)",
    spS2Desc: "• Une fois vérifié, appuyez sur \"Add funds\" (Ajouter des fonds) sur l'écran d'accueil.<br>• Sélectionnez \"Interac e-Transfer\".<br>• Shakepay vous fournira une adresse courriel spécifique et les détails de paiement.<br>• <strong>Allez sur votre application bancaire :</strong> Envoyez un Virement Interac pour le montant exact de la facture en utilisant les détails fournis par Shakepay.",
    spS3Title: "3. Acheter du Bitcoin",
    spS3Desc: "• Une fois les fonds arrivés sur votre solde Shakepay, retournez à l'accueil.<br>• Appuyez sur le bouton bleu circulaire avec deux flèches au centre en bas.<br>• Choisissez d'acheter du Bitcoin avec votre solde CAD. Entrez le montant requis et confirmez.",
    spS4Title: "4. Envoyer le paiement",
    spS4Desc: "• Sur l'accueil, appuyez sur \"Send\" (Envoyer) en haut à droite.<br>• Dans la barre de recherche, collez exactement mon adresse Bitcoin :<br><strong style='color:#10b981;word-break:break-all;'>bc1q49x7p5h5te83q0j96rthjxkua8tgsw47qzc3me</strong><br>• Entrez le montant exact de Bitcoin requis.<br>• Appuyez sur \"Continue\" et confirmez.",
    spWarnTitle: "⚠️ Conseils Importants pour une transaction sans accroc",
    spWarn1: "<strong>Concordance des noms :</strong> Le Virement Interac doit provenir d'un compte bancaire à votre nom personnel. Si les noms ne correspondent pas, la transaction sera bloquée par mesure de sécurité.",
    spWarn2: "<strong>Sécurité bancaire :</strong> Si c'est votre premier virement vers une plateforme crypto, votre banque pourrait le retenir. Si les fonds n'apparaissent pas après 30 minutes, vérifiez vos courriels ou textos pour autoriser le transfert.",
    spOutro: "<strong>Prochaines étapes :</strong> Une fois le transfert envoyé, faites-le moi savoir. Je marquerai votre commande comme \"Payée\", je vous inviterai dans notre groupe privé, et votre paquet sera déposé chez Purolator demain vers 14h00. Je vous enverrai votre numéro de suivi immédiatement après !",
    guideStep4Tag: "Généralement 10–30 min"
  }
};

/* ── LANGUAGE ── */
function setLang(l) { lang = l; G('lang-en').classList.toggle('active', l === 'en'); G('lang-fr').classList.toggle('active', l === 'fr'); applyLang(); renderPacks(); renderCart(); }

function applyLang() {
  const v = L();
  TT('h-logo-name', v.logoName); TT('h-logo-sub', v.logoSub);
  ['', '-dup', '-trip', '-quad'].forEach(s => {
    TT('an1' + s, v.an1); TT('an2' + s, v.an2); TT('an3' + s, v.an3); TT('an-tg' + s, v.anTg);
  });
  TT('ht1', v.ht1); TT('ht2', v.ht2); TT('ht3', v.ht3);
  TT('hero-badge', v.heroBadge); TT('hl1', v.hl1); TT('hl2', v.hl2); TT('hl3', v.hl3);
  TT('hero-desc', v.heroDesc); TT('hero-cta', v.heroCta); TT('hero-tg', v.heroTg);
  TT('hero-subtitle', v.heroSubtitle); TT('hero-cta-btn', v.heroEliteCta); TT('collection-title', v.collectionTitle);
  TT('hc-lbl', v.hcLbl);
  ['hcn1', 'hcs1', 'hcn2', 'hcs2', 'hcn3', 'hcs3', 'hcn4', 'hcs4'].forEach(k => TT(k, v[k]));
  ['st1h', 'st1s', 'st2h', 'st2s', 'st3h', 'st3s', 'st4h', 'st4s'].forEach(k => TT(k, v[k]));
  TT('se', v.se); TT('sti', v.sti); TT('sd', v.sd);
  TT('cart-title', v.cartTitle); TT('total-lbl', v.totalLbl);
  TT('btn-ck-txt', v.ckTxt); TT('h-cart-lbl', v.hCartLbl);
  TT('ship-badge', v.shipBadge); TT('ship-sub', v.shipSub);
  ['shh1', 'shs1', 'shh2', 'shs2', 'shh3', 'shs3'].forEach(k => TT(k, v[k]));
  TT('guar1', v.guar1); TT('guar2', v.guar2); TT('guar3', v.guar3);
  TT('f-name', v.fName); TT('f-desc', v.fDesc);
  TT('fc1', v.fc1); TT('f-int', v.fInt); TT('fc2', v.fc2);
  TT('fp1', v.fp1); TT('fp2', v.fp2); TT('fp3', v.fp3); TT('fp4', v.fp4); TT('fp5', v.fp5); TT('fp6', v.fp6);
  TT('fc3', v.fc3); TT('fc3n', v.fc3n); TT('f-copy', v.fCopy);
  TT('mb-eye', v.mbEye); TT('mb-lbl', v.mbLbl); TT('btb-lbl', v.btbLbl);
  TT('btn-add', v.addBtnTxt); TT('btn-pay-now', v.payNowTxt);
  TT('mp-eye', v.mpEye); TT('mp-title', v.mpTitle);
  TT('bonus-lbl', v.bonusLbl); TT('bonus-txt', v.bonusTxt);
  TT('ps-btc', v.psBtc); TT('ps-zec', v.psZec);
  TT('ps-int-h', v.psIntH); TT('ps-int', v.psInt);
  TT('mo-eye', v.moEye); TT('mo-title', v.moTitle);
  TT('fsl-c', v.fslC); TT('fsl-s', v.fslS); TT('fsl-p', v.fslP);
  TT('lb-express', v.lbExpress); TT('lb-name', v.lbName); TT('lb-email', v.lbEmail); TT('lb-tg', v.lbTg);
  TT('lb-addr', v.lbAddr); TT('lb-city', v.lbCity); TT('lb-prov', v.lbProv);
  TT('lb-post', v.lbPost); TT('lb-ctry', v.lbCtry); TT('lb-notes', v.lbNotes);
  TT('lb-phone', v.lbPhone); TT('lb-apt', v.lbApt); TT('lb-apt-opt', v.lbAptOpt);
  TT('lb-promo', v.lbPromo); TT('lb-promo-opt', v.lbPromoOpt);
  TT('lb-signature', v.lbSignature);
  TT('lb-defer', v.lbDefer);
  TT('lb-defer-date', v.lbDeferDate);
  TT('tip-sig-title', v.tipSigTitle);
  TT('tip-sig-body', v.tipSigBody);
  TT('tip-defer-title', v.tipDeferTitle);
  TT('tip-defer-body', v.tipDeferBody);
  // Tooltip content — bilingual
  TT('tip-cid-title', v.tipCidTitle); TT('tip-cid-body', v.tipCidBody);
  TT('tip-tg-title', v.tipTgTitle); TT('tip-tg-body', v.tipTgBody);
  TT('tip-tg-li1', v.tipTgLi1); TT('tip-tg-li2', v.tipTgLi2);
  TT('tip-tg-li3', v.tipTgLi3); TT('tip-tg-li4', v.tipTgLi4);
  TT('tip-phone-title', v.tipPhoneTitle); TT('tip-phone-body', v.tipPhoneBody);
  TT('tip-express-title', v.tipExpressTitle); TT('tip-express-body', v.tipExpressBody);
  TT('tip-notes-title', v.tipNotesTitle); TT('tip-notes-body', v.tipNotesBody);
  TT('tip-promo-title', v.tipPromoTitle); TT('tip-promo-body', v.tipPromoBody);
  const promoInput = G('f-promo'); if (promoInput) promoInput.placeholder = 'PBS10-XXXX';
  validatePromoDisplay();
  TT('privacy-notice', v.privacyNotice);
  TT('intl-warn-title', v.intlWarnTitle); TT('intl-warn-text', v.intlWarnText);
  TT('hero-product-lbl', v.heroProdBtn); TT('hero-delivery-lbl', v.heroDelivBtn);
  const tipEl = G('tip-phone'); if (tipEl) tipEl.textContent = v.phoneTip;
  buildProvinceSelect();
  TT('btn-place', v.placeTxt);
  TT('s-title', v.sTitle); TH('s-desc', v.sDesc); TT('s-tg-lbl', v.sTgLbl); TT('btn-restart', v.restartBtn);
  const ph = [['f-addr', v.addrPh], ['f-city', v.cityPh], ['f-prov', v.provPh], ['f-post', v.postalPh]];
  ph.forEach(([id, p]) => { const e = G(id); if (e) e.placeholder = p; });
}

/* ── SCRUBBING GALLERY LOGIC ── */
const GALLERY_IMAGES = [
  'image/prod/prop (1).jpg',
  'image/prod/prop (1).webp',
  'image/prod/prop (2).jpg',
  'image/prod/prop (2).webp',
  'image/prod/prop (3).jpg',
  'image/prod/prop (3).webp'
];

function handleScrub(e, el) {
  const rect = el.getBoundingClientRect();
  const x = e.type.includes('mouse') ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
  const pct = Math.max(0, Math.min(1, x / rect.width));
  const imgs = el.querySelectorAll('.scrub-img');
  const bars = el.querySelectorAll('.scrub-bar');
  if (!imgs.length) return;
  const idx = Math.min(imgs.length - 1, Math.floor(pct * imgs.length));

  imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
  bars.forEach((bar, i) => bar.classList.toggle('active', i === idx));
}

function resetScrub(el) {
  const imgs = el.querySelectorAll('.scrub-img');
  const bars = el.querySelectorAll('.scrub-bar');
  imgs.forEach((img, i) => img.classList.toggle('active', i === 0));
  bars.forEach((bar, i) => bar.classList.toggle('active', i === 0));
}

/* ── RENDER PACKS ── */
function renderPacks() {
  const v = L();
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];
  G('packs-grid').innerHTML = PACKS.map((p, i) => {
    const name = lang === 'en' ? p.en : p.fr;
    const perB = (p.price / p.size).toFixed(3);
    const fvMin = p.size * 20;
    const fvMax = p.size * 100;
    const fvLabel = lang === 'en'
      ? `Face value: $${fvMin.toLocaleString()} - $${fvMax.toLocaleString()}`
      : `Valeur nominale : ${fvMin.toLocaleString()} $ - ${fvMax.toLocaleString()} $`;
    const perBLabel = lang === 'en'
      ? `≈ $${perB} ${v.perBill}`
      : `≈ ${perB} $ ${v.perBill}`;
    const roman = romanNumerals[i] || "X";

    // Create an ordered array of images starting at an offset based on the card index
    const images = [];
    for (let j = 0; j < GALLERY_IMAGES.length; j++) {
      images.push(GALLERY_IMAGES[(i + j) % GALLERY_IMAGES.length]);
    }

    const galleryHtml = `
      <div class="scrub-gallery" onmousemove="handleScrub(event, this)" ontouchmove="handleScrub(event, this)" onmouseleave="resetScrub(this)">
        ${images.map((src, idx) => `<img src="${src}" class="scrub-img ${idx === 0 ? 'active' : ''}">`).join('')}
        <div class="scrub-indicator">
          ${images.map((_, idx) => `<div class="scrub-bar ${idx === 0 ? 'active' : ''}"></div>`).join('')}
        </div>
      </div>
    `;

    return `<article class="product-card fu d${i + 1}">
        <div class="card-image-wrapper">
            ${galleryHtml}
            <div class="glow-effect"></div>
            <div class="roman-overlay" style="position: absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; z-index:10; pointer-events:none;">
                <div class="logo-mark">${roman}</div>
            </div>
            ${p.star ? `<div class="pop-tag" style="position:absolute;top:10px;right:10px;z-index:10;background:var(--gold-primary);color:#000;padding:4px 10px;font-size:0.7rem;font-weight:bold;border-radius:2px;text-transform:uppercase;">${v.starLbl}</div>` : ''}
        </div>
        <div class="card-content">
            <h3>${name}</h3>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:10px;">${p.bundles} ${v.bundleWord} × 50 ${v.billsWord}</p>
            <p class="price">$${p.price} CAD</p>
            <div class="value-lines" style="font-size:0.8rem;color:var(--text-muted);margin-bottom:15px;">
                <div>${perBLabel}</div>
                <div style="color:var(--gold-primary);font-weight:600;">${fvLabel}</div>
            </div>
            <button class="buy-button" onclick="openBuild('${p.id}')">${v.buildBtn}</button>
        </div>
    </article>`;
  }).join('');
}

/* ── BUILDER (STEPPER) ── */
function openBuild(packId) {
  const p = PACKS.find(x => x.id === packId); if (!p) return;
  build = { ...p, sel: { 20: 0, 50: 0, 100: 0 } };
  const v = L(), name = lang === 'en' ? p.en : p.fr;
  TT('mb-title', name);
  // Contextual eyebrow with pack details
  const eyeTxt = lang === 'en'
    ? `Step 2 of 4 — ${p.bundles} bundle${p.bundles > 1 ? 's' : ''} to assign · ${p.size} bills · $${p.price} CAD`
    : `Étape 2 sur 4 — ${p.bundles} liasse${p.bundles > 1 ? 's' : ''} à attribuer · ${p.size} billets · ${p.price} $ CAD`;
  TT('mb-eye', eyeTxt);
  // Instructional summary banner
  TH('mb-summary', v.mbSummary(name, p.bundles, p.size, p.price));
  // Build stepper rows
  G('bundle-rows').innerHTML = [20, 50, 100].map(f => `
    <div class="bundle-row" id="brow${f}">
      <div class="bundle-denom">
        <div class="bundle-denom-main">$${f} PROP</div>
        <div class="bundle-denom-sub">${v.bundleOf}</div>
      </div>
      <div class="bundle-stepper">
        <button class="step-btn minus" id="bminus${f}" onclick="stepBundle(${f},-1)" disabled title="${lang === 'en' ? 'Remove one bundle' : 'Retirer une liasse'}">−</button>
        <div class="step-divider"></div>
        <div class="step-val" id="bval${f}">0</div>
        <div class="step-divider"></div>
        <button class="step-btn plus" id="bplus${f}" onclick="stepBundle(${f},1)" title="${lang === 'en' ? 'Add one bundle' : 'Ajouter une liasse'}">+</button>
      </div>
    </div>`).join('');
  syncBuilder();
  G('btn-add').disabled = true;
  G('btn-pay-now').disabled = true;
  TT('btn-add', v.addBtnTxt);
  TH('btn-pay-now', `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg> ${v.payNowTxt}`);
  G('m-build').classList.add('open');
}

function stepBundle(face, delta) {
  if (!build) return;
  const newVal = Math.max(0, (build.sel[face] || 0) + delta);
  build.sel[face] = newVal;
  syncBuilder();
}

function syncBuilder() {
  if (!build) return;
  const v = L(); let total = 0;
  [20, 50, 100].forEach(f => { total += build.sel[f] || 0; });
  const need = build.bundles, pct = Math.min(total / need * 100, 100), over = total > need, done = total === need;
  [20, 50, 100].forEach(f => {
    const val = build.sel[f] || 0;
    const vEl = G('bval' + f); if (vEl) { vEl.textContent = val; vEl.className = 'step-val' + (val > 0 ? ' active' : ''); }
    const mBtn = G('bminus' + f); if (mBtn) mBtn.disabled = val <= 0;
    const pBtn = G('bplus' + f); if (pBtn) pBtn.disabled = total >= need;
  });
  const bar = G('bp-fill');
  if (bar) { bar.style.width = pct + '%'; bar.className = 'bp-fill' + (over ? ' over' : ''); }
  TH('mb-hcount', `<strong>${total}</strong> / ${need}`);
  const tNum = G('btb-num');
  if (tNum) { tNum.textContent = `${total} / ${need}`; tNum.className = 'btb-num' + (done ? ' complete' : over ? ' over' : ''); }
  TT('b-warn', over ? v.pbOver(need) : '');
  G('btn-add').disabled = !done;
  G('btn-pay-now').disabled = !done;

  // Live face value in builder
  const fvEl = G('btb-face-value');
  if (fvEl) {
    const faceTotal = [20, 50, 100].reduce((s, f) => s + (build.sel[f] || 0) * 50 * f, 0);
    const label = lang === 'en'
      ? `Face value of your mix: $${faceTotal.toLocaleString()}`
      : `Valeur nominale de votre mix : ${faceTotal.toLocaleString()} $`;
    fvEl.textContent = label;
    fvEl.style.display = 'block';
  }
}

function copyCryptoAddr(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  const addr = document.getElementById('crypto-addr-val').innerText;
  navigator.clipboard.writeText(addr).then(() => {
    const btn = document.getElementById('btn-copy-addr');
    const oldHtml = btn.innerHTML;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ${lang === 'fr' ? 'Copié !' : 'Copied!'}`;
    btn.style.transform = 'scale(1.05)';
    setTimeout(() => {
      btn.innerHTML = oldHtml;
      btn.style.transform = 'scale(1)';
    }, 2000);
  });
}

function openQR(src, e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  const lb = document.createElement('div');
  lb.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(5,5,5,0.85); backdrop-filter:blur(10px); z-index:9999999; display:flex; align-items:center; justify-content:center; cursor:zoom-out;';
  lb.innerHTML = `<img src="${src}" style="max-width:90vw; max-height:80vh; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,0.8); border:2px solid var(--gold-primary); pointer-events:auto;" onclick="event.stopPropagation()">`;
  lb.onclick = (event) => { event.stopPropagation(); lb.remove(); };
  document.body.appendChild(lb);
}

function addToCart() {
  if (!build || G('btn-add').disabled) return;
  _pushToCart(); closeBuild(); renderCart();
}

function addToCartAndPay() {
  if (!build || G('btn-pay-now').disabled) return;
  _pushToCart(); closeBuild(); renderCart(); showPayChoice();
}

function _pushToCart() {
  const v = L(), name = lang === 'en' ? build.en : build.fr;
  const parts = [20, 50, 100].filter(f => build.sel[f] > 0).map(f => `${build.sel[f]}×$${f}`).join(' + ');
  cart.push({ id: Date.now(), name, desc: `${parts} (${build.size} bills)`, price: build.price });
  const n = G('h-cart-n'); if (n) { n.style.animation = 'none'; n.offsetHeight; n.style.animation = 'bumpN .4s ease'; }
}

function closeBuild() { G('m-build').classList.remove('open'); build = null; }

/* ── CART ── */
function renderCart() {
  const v = L(), total = cart.reduce((s, i) => s + i.price, 0), n = cart.length;
  TT('cart-top-n', n || '0'); TT('h-cart-n', n || '0');
  if (!n) {
    G('cart-bd').innerHTML = `<div class="cart-empty"><div class="cart-empty-ico">◻</div><div class="cart-empty-txt">${v.cartEmpty}</div></div>`;
    TT('total-amt', '$0'); G('btn-checkout').disabled = true; return;
  }
  G('cart-bd').innerHTML = cart.map(i => `<div class="cart-row">
    <div class="cr-l"><div class="cr-name">${i.name}</div><div class="cr-desc">${i.desc}</div></div>
    <div class="cr-r">
      <div class="cr-price">$${i.price}</div>
      <button class="cr-del" onclick="removeFromCart(${i.id})" title="Remove">×</button>
    </div>
  </div>`).join('');
  TT('total-amt', '$' + total);
  G('btn-checkout').disabled = false;
  TT('btn-ck-txt', v.ckTxt);
}

function removeFromCart(id) { cart = cart.filter(i => i.id !== id); renderCart(); }
function scrollCart() { G('cart-sidebar').scrollIntoView({ behavior: 'smooth', block: 'center' }); }

/* ── PAYMENT CHOICE ── */
function showPayChoice() { G('m-pay').classList.add('open'); }
function closePayChoice() { G('m-pay').classList.remove('open'); }
function pickPay(m) {
  payM = m; closePayChoice(); buildPaySection(); G('m-order').classList.add('open'); buildProvinceSelect();

  // Dev Auto-fill
  if (localStorage.getItem('pbs_dev_autofill') === 'true') {
    if (G('f-client-id')) G('f-client-id').value = 'C-TEST99';
    if (G('f-name')) G('f-name').value = 'Test User';
    if (G('f-email')) G('f-email').value = 'test@example.com';
    if (G('f-tg')) G('f-tg').value = '@testuser';
    if (G('f-phone')) G('f-phone').value = '555-0199';
    if (G('f-addr')) G('f-addr').value = '123 Test Street';
    if (G('f-city')) G('f-city').value = 'Test City';
    if (G('f-post')) G('f-post').value = 'H0H 0H0';
    if (G('f-notes')) G('f-notes').value = 'Test order generated automatically.';
    if (G('f-defer-date')) G('f-defer-date').value = '2026-06-15';
  }
}

/* ── CRYPTO GUIDE TOGGLE ── */

function toggleDeferDate() {
  const cb = document.getElementById('f-defer-check');
  const wrap = document.getElementById('defer-date-wrap');
  if (wrap) wrap.style.display = cb && cb.checked ? 'block' : 'none';
}

function toggleGuide() {
  const body = G('guide-body'), arrow = G('guide-arrow');
  const open = body.classList.contains('open');
  body.classList.toggle('open', !open);
  if (arrow) arrow.classList.toggle('open', !open);
}

function toggleShakepayGuide() {
  const body = G('shakepay-guide-body'), arrow = G('shakepay-guide-arrow');
  if (!body) return;
  const open = body.classList.contains('open');
  body.classList.toggle('open', !open);
  if (arrow) arrow.classList.toggle('open', !open);
}

/* ── ZCASH LOCK ── */
function openZcashLock() {
  const enDesc = document.getElementById('zcash-lock-desc-en');
  const frDesc = document.getElementById('zcash-lock-desc-fr');
  if (enDesc) enDesc.style.display = lang === 'en' ? 'block' : 'none';
  if (frDesc) frDesc.style.display = lang === 'fr' ? 'block' : 'none';
  const inp = document.getElementById('zcash-pwd-input');
  const err = document.getElementById('zcash-pwd-error');
  if (inp) inp.value = '';
  if (err) err.style.display = 'none';
  document.getElementById('m-zcash-lock').classList.add('open');
}
function closeZcashLock() {
  document.getElementById('m-zcash-lock').classList.remove('open');
}
function submitZcashPassword() {
  const inp = document.getElementById('zcash-pwd-input');
  const err = document.getElementById('zcash-pwd-error');
  if ((inp?.value || '').trim().toLowerCase() === 'admin') {
    closeZcashLock();
    closePayChoice();
    pickPay('zcash');
  } else {
    if (err) err.style.display = 'block';
    if (inp) { inp.value = ''; inp.focus(); }
  }
}


/* ── CONVERTER ── */
async function fetchPrice(id) { try { const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=cad`); return (await r.json())[id]?.cad ?? null; } catch (e) { return null; } }

async function renderConv(cid, sym, total) {
  const el = G('live-rate'); if (!el) return;
  TH('live-rate', `<em style="color:var(--ink3)">Loading rate…</em>`);
  const price = await fetchPrice(cid); const v = L();
  if (!price) { TH('live-rate', `⚠️ Rate unavailable — <a href="https://www.coingecko.com" target="_blank">CoinGecko</a>`); return; }
  const amt = (total / price).toFixed(8);
  TH('live-rate', `
    <div style="text-align:center; font-size:.85rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--ink3); margin-bottom:8px;">${v.liveRateLbl}</div>
    <div style="text-align:center; font-size:1.1rem; color:var(--ink2); margin-bottom:10px;">1 ${sym} = <strong style="color:var(--ink)">${price.toFixed(2)} CAD</strong></div>
    <div style="text-align:center; font-size:1.1rem; color:var(--ink3); margin-bottom:5px;">${v.convSend(sym, total)}</div>
    <div class="conv-amt" style="text-align:center; font-size:2rem; font-weight:bold; color:var(--gold-primary); margin-bottom:10px;">${amt} ${sym}</div>
    <div style="text-align:center; margin-top:10px; font-size:.85rem;"><a href="https://www.coingecko.com/en/coins/${cid}" target="_blank">${v.liveRateLbl}</a></div>`);
}

/* ── BUILD PAYMENT SECTION ── */
function buildPaySection() {
  const baseTotal = cart.reduce((s, i) => s + i.price, 0);
  const expAdd = document.getElementById('f-express')?.checked ? 10 : 0;
  const v = L(), total = baseTotal + expAdd;

  const fc = Math.floor(baseTotal / 100); freeC = fc; freeS = { 20: 0, 50: 0, 100: 0 };
  let html = '';
  if (payM === 'bitcoin' || payM === 'zcash') {
    const isBTC = payM === 'bitcoin', sym = isBTC ? 'BTC' : 'ZEC';
    const addr = isBTC ? BTC : ZEC, qr = isBTC ? 'assets/images/Screenshot_20260419-204609.png' : 'assets/images/zcash-qr.png';
    // SHAKEPAY GUIDE
    html = `
    <button class="shakepay-guide-toggle" onclick="toggleShakepayGuide()" type="button">
      <div class="cgt-left">
        <div class="cgt-ico">⚡</div>
        <div>
          <div class="cgt-title">${v.spGuideTitle}</div>
          <div class="cgt-sub">${v.spGuideSub}</div>
        </div>
      </div>
      <div class="cgt-arrow" id="shakepay-guide-arrow">▾</div>
    </button>
    <div class="shakepay-guide-body" id="shakepay-guide-body">
      <div style="margin-bottom:15px; font-size:0.9rem; color:#e0e0e0;">${v.spIntro}</div>
      <div class="guide-section">
        <div class="guide-step">
          <div class="gs-num" style="background:#10b981; color:#000;">1</div>
          <div class="gs-body">
            <div class="gs-title">${v.spS1Title}</div>
            <div class="gs-desc">${v.spS1Desc}</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="gs-num" style="background:#10b981; color:#000;">2</div>
          <div class="gs-body">
            <div class="gs-title">${v.spS2Title}</div>
            <div class="gs-desc">${v.spS2Desc}</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="gs-num" style="background:#10b981; color:#000;">3</div>
          <div class="gs-body">
            <div class="gs-title">${v.spS3Title}</div>
            <div class="gs-desc">${v.spS3Desc}</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="gs-num" style="background:#10b981; color:#000;">4</div>
          <div class="gs-body">
            <div class="gs-title">${v.spS4Title}</div>
            <div class="gs-desc">${v.spS4Desc}</div>
          </div>
        </div>
      </div>
      <div class="guide-section">
        <div class="guide-section-title" style="color:#10b981;">${v.spWarnTitle}</div>
        <div class="gs-warning" style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2);">
          <svg width="14" height="14" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div class="gs-warning-text" style="color:#6ee7b7;">${v.spWarn1}</div>
        </div>
        <div class="gs-warning" style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2);">
          <svg width="14" height="14" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div class="gs-warning-text" style="color:#6ee7b7;">${v.spWarn2}</div>
        </div>
      </div>
      <div style="margin-top:15px; font-size:0.9rem; color:#e0e0e0; line-height: 1.5;">${v.spOutro}</div>
    </div>
    ` + `
    <button class="crypto-guide-toggle" onclick="toggleGuide()" type="button">
      <div class="cgt-left">
        <div class="cgt-ico">🔰</div>
        <div>
          <div class="cgt-title" id="cgt-title-txt">${v.guideToggleTitle}</div>
          <div class="cgt-sub" id="cgt-sub-txt">${v.guideToggleSub}</div>
        </div>
      </div>
      <div class="cgt-arrow" id="guide-arrow">▾</div>
    </button>
    <div class="crypto-guide-body" id="guide-body">
      <div class="guide-section">
        <div class="guide-section-title">${v.guideS1Title}</div>
        <div class="gs-warning">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div class="gs-warning-text">${v.guideWarning1}</div>
        </div>
        <div class="gs-warning">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div class="gs-warning-text">${v.guideWarning2}</div>
        </div>
      </div>
      <div class="guide-section">
        <div class="guide-section-title">${v.guideS2Title}</div>
        <div class="guide-step">
          <div class="gs-num">1</div>
          <div class="gs-body">
            <div class="gs-title">${v.guideStep1Title}</div>
            <div class="gs-desc">${v.guideStep1Desc}</div>
            <div class="gs-tip">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div class="gs-tip-text">${v.guideTip1}</div>
            </div>
          </div>
        </div>
        <div class="guide-step">
          <div class="gs-num">2</div>
          <div class="gs-body">
            <div class="gs-title">${v.guideStep2Title}</div>
            <div class="gs-desc">${v.guideStep2Desc}</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="gs-num">3</div>
          <div class="gs-body">
            <div class="gs-title">${v.guideStep3Title}</div>
            <div class="gs-desc">${v.guideStep3Desc}</div>
            <div class="gs-tip">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div class="gs-tip-text">${v.guideTip2}</div>
            </div>
          </div>
        </div>
        <div class="guide-step">
          <div class="gs-num">4</div>
          <div class="gs-body">
            <div class="gs-title">${v.guideStep4Title}</div>
            <div class="gs-desc">${v.guideStep4Desc}</div>
            <div class="gs-tag">⏱ ${v.guideStep4Tag}</div>
          </div>
        </div>
      </div>
      <div style="padding: 12px 16px 16px; border-top: 1px solid var(--border, rgba(255,255,255,0.08));">
        <a href="pages/crypto-payment.html" target="_blank" rel="noopener"
          style="display:flex; align-items:center; justify-content:center; gap:8px; width:100%;
                 background:linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.06));
                 border:1px solid rgba(212,175,55,0.35); border-radius:8px;
                 padding:11px 16px; color:var(--gold-primary,#d4af37);
                 font-size:0.84rem; font-weight:600; text-decoration:none;
                 transition:background 0.2s, border-color 0.2s;"
          onmouseover="this.style.background='linear-gradient(135deg,rgba(212,175,55,0.22),rgba(212,175,55,0.12))';this.style.borderColor='rgba(212,175,55,0.6)'"
          onmouseout="this.style.background='linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.06))';this.style.borderColor='rgba(212,175,55,0.35)'">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ${lang === 'fr'
            ? 'Informations supplémentaires pour les paiements en cryptomonnaie ↗'
            : 'Additional information on cryptocurrency payments ↗'}
        </a>
      </div>
    </div>
    <div style="margin-top:14px;"></div>
    <div class="cbox">
      <div class="cbox-lbl" style="text-align:center; font-size:1.3rem; font-weight:bold; margin-bottom:10px;">${v.cryptoAddrLbl(sym)}</div>
      <div style="text-align:center; font-size:1.2rem; font-weight:600; color:var(--ink2); margin-bottom:15px;">${v.cryptoSend(sym, total)}</div>
      <div style="display:flex; gap:10px; justify-content:center; align-items:center; margin:10px 0;">
        <div class="caddr allow-copy" id="crypto-addr-val" style="margin:0;">${addr}</div>
        <button type="button" onclick="copyCryptoAddr(event)" id="btn-copy-addr" style="background:var(--gold-gradient); color:#000; border:none; padding:10px 15px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:5px; box-shadow:0 0 10px rgba(212,175,55,0.4); transition:transform 0.2s;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          ${lang === 'fr' ? 'Copier' : 'Copy'}
        </button>
      </div>
      <div class="qrwrap"><img src="${qr}" alt="${sym} QR Code" class="allow-copy" onclick="openQR('${qr}', event)" style="cursor:zoom-in;" title="${lang === 'fr' ? 'Cliquez pour agrandir' : 'Click to enlarge'}"></div>
    </div>
    <div class="convbox"><div id="live-rate"></div></div>`;
    if (fc > 0) {
      html += `<div class="freebox">
        <div class="freebox-title">${v.freeTitleFn(fc)}</div>
        <div class="freebox-sub">${v.freeSubFn(fc)}</div>
        <div id="free-rows"></div>
        <div class="face-value-builder" id="fb-face-value" style="padding:5px 14px 2px; font-weight: 600; color: var(--gold-primary); text-align: center;"></div>
        <div class="ptrack"><div class="pfill" id="fb-fill"></div></div>
        <div class="pcnt" id="fb-cnt">${v.pbCnt(0, fc)}</div>
      </div>`;
    }
  } else {
    html = `<div class="intbox">
      <div class="cbox-lbl">${v.interacTo}</div>
      <div style="font-size:.83rem;color:var(--ink2);margin-bottom:4px;">${lang === 'en' ? 'Amount to send:' : 'Montant à envoyer :'} <strong style="color:var(--ink)">$${total} CAD</strong></div>
      <div class="int-email allow-copy">${INT}</div>
      <div style="margin-top:10px;">
        <div style="font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:8px;">${lang === 'en' ? 'How to fill out the transfer:' : 'Comment remplir le virement :'}</div>
        <div class="int-info">
          <strong>${lang === 'en' ? 'Security answer:' : 'Réponse de sécurité :'}</strong> <code style="background:rgba(5,150,105,.1);padding:1px 6px;border-radius:4px;font-family:monospace;">Canada</code><br>
          <strong>${lang === 'en' ? 'For required character fields:' : 'Pour les champs de caractères obligatoires :'}</strong><br>
          &nbsp;&nbsp;${lang === 'en' ? '→ Type' : '→ Entrez'} <code style="background:rgba(5,150,105,.1);padding:1px 6px;border-radius:4px;font-family:monospace;">Canada</code> ${lang === 'en' ? 'in every field marked as mandatory' : 'dans chaque champ marqué comme obligatoire'}<br>
          <strong>${lang === 'en' ? 'For optional fields:' : 'Pour les champs optionnels :'}</strong><br>
          &nbsp;&nbsp;${lang === 'en' ? '→ Leave them blank — do not fill them in' : '→ Laissez-les vides — ne les remplissez pas'}
        </div>
      </div>
    </div>`;
  }
  G('pay-dyn').innerHTML = html;
  if (payM === 'bitcoin' || payM === 'zcash') {
    renderConv(payM === 'bitcoin' ? 'bitcoin' : 'zcash', payM === 'bitcoin' ? 'BTC' : 'ZEC', total);
    if (fc > 0) {
      const v2 = L();
      G('free-rows').innerHTML = [20, 50, 100].map(f => `
        <div class="brow" style="background:var(--ap);border-color:var(--ab);">
          <div class="blbl"><div class="blbl-main">$${f} PROP</div><div class="blbl-sub">50 ${v2.billsWord}</div></div>
          <div class="bundle-stepper" style="border-left:1px solid var(--ab);">
            <button type="button" class="step-btn minus" id="fminus${f}" onclick="stepFree(${f},-1)" disabled style="height:48px;">−</button>
            <div class="step-divider"></div>
            <div class="step-val" id="fval${f}" style="min-width:44px;">0</div>
            <div class="step-divider"></div>
            <button type="button" class="step-btn plus" id="fplus${f}" onclick="stepFree(${f},1)" style="height:48px;">+</button>
          </div>
        </div>`).join('');
      syncFree();
    }
  }
}

function stepFree(f, delta) {
  const newVal = Math.max(0, (freeS[f] || 0) + delta);
  freeS[f] = newVal;
  syncFree();
}

function syncFree() {
  const v = L(); let total = 0;
  [20, 50, 100].forEach(f => { total += freeS[f] || 0; });
  const faceTotal = [20, 50, 100].reduce((s, f) => s + (freeS[f] || 0) * 50 * f, 0);
  const fvEl = G('fb-face-value');
  if (fvEl) {
    fvEl.textContent = lang === 'en'
      ? `Face value of your mix: $${faceTotal.toLocaleString()}`
      : `Valeur nominale de votre mix : ${faceTotal.toLocaleString()} $`;
  }
  [20, 50, 100].forEach(f => {
    const val = freeS[f] || 0;
    const vEl = G('fval' + f); if (vEl) { vEl.textContent = val; vEl.className = 'step-val' + (val > 0 ? ' active' : ''); }
    const mBtn = G('fminus' + f); if (mBtn) mBtn.disabled = val <= 0;
    const pBtn = G('fplus' + f); if (pBtn) pBtn.disabled = total >= freeC;
  });
  const bar = G('fb-fill'); if (bar) { bar.style.width = Math.min(total / freeC * 100, 100) + '%'; bar.className = 'pfill' + (total > freeC ? ' over' : ''); }
  const cnt = G('fb-cnt'); if (cnt) cnt.textContent = v.pbCnt(total, freeC);
}

function updateExpressShipping() {
  renderCart();
  if (payM) buildPaySection();
}
function closeOrder() { G('m-order').classList.remove('open'); payM = null; }
function goBackToPayChoice() { G('m-order').classList.remove('open'); G('m-pay').classList.add('open'); }
function goBackToOrder() { G('m-payment-proof').classList.remove('open'); G('m-order').classList.add('open'); }

/* ── QR LIGHTBOX ── */


/* ── TOOLTIP TOGGLE ── */
function toggleTip(id) {
  document.querySelectorAll('.tooltip-popup').forEach(el => { if (el.id !== id) el.classList.remove('open'); });
  const el = G(id); if (el) el.classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.tooltip-wrap')) document.querySelectorAll('.tooltip-popup').forEach(el => el.classList.remove('open'));
});

/* ── PROVINCE DROPDOWN ── */
const CA_PROVINCES = [
  { code: 'AB', en: 'Alberta', fr: 'Alberta' },
  { code: 'BC', en: 'British Columbia', fr: 'Colombie-Britannique' },
  { code: 'MB', en: 'Manitoba', fr: 'Manitoba' },
  { code: 'NB', en: 'New Brunswick', fr: 'Nouveau-Brunswick' },
  { code: 'NL', en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador' },
  { code: 'NS', en: 'Nova Scotia', fr: 'Nouvelle-Écosse' },
  { code: 'NT', en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest' },
  { code: 'NU', en: 'Nunavut', fr: 'Nunavut' },
  { code: 'ON', en: 'Ontario', fr: 'Ontario' },
  { code: 'PE', en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard' },
  { code: 'QC', en: 'Quebec', fr: 'Québec' },
  { code: 'SK', en: 'Saskatchewan', fr: 'Saskatchewan' },
  { code: 'YT', en: 'Yukon', fr: 'Yukon' }
];

function buildProvinceSelect() {
  const sel = G('f-prov'); if (!sel) return;
  const cur = sel.value || '';
  const placeholder = lang === 'en' ? 'Select province / state' : 'Choisir province / état';
  sel.innerHTML = `<option value="" disabled${!cur ? ' selected' : ''} hidden>${placeholder}</option>`
    + CA_PROVINCES.map(p => `<option value="${p.code}"${p.code === cur ? ' selected' : ''}>${lang === 'en' ? p.en : p.fr} (${p.code})</option>`).join('')
    + `<option value="OTHER"${cur === 'OTHER' ? ' selected' : ''}>— ${lang === 'en' ? 'Other (US/International)' : 'Autre (É.-U./International)'}</option>`;
}

function onProvChange() {
  const v = G('f-prov').value;
  if (v === 'OTHER') onCountryChange('Other');
  else onCountryChange('Canada');
}

function onCountryChange(val) {
  const isCA = /^canada$/i.test((val || '').trim());
  const warn = G('intl-warning');
  if (warn) { warn.classList.toggle('show', !isCA && (val || '').trim().length > 2); }
}

/* ── RATE LIMITING (10 submissions per day, min 5 min between each) ── */
function checkRateLimit() {
  if (localStorage.getItem('pbs_dev_autofill') === 'true') return { ok: true }; // BYPASS FOR DEV
  const key = 'pbs_submissions';
  const now = Date.now();
  const day = 86400000;    // 24h
  const cooldown = 300000; // 5 minutes
  let log = [];
  try { log = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { }
  log = log.filter(t => now - t < day); // garder seulement les 24 dernières heures
  if (log.length >= 10) return { ok: false, reason: 'daily' };
  if (log.length > 0 && now - log[log.length - 1] < cooldown) {
    const remaining = Math.ceil((cooldown - (now - log[log.length - 1])) / 60000);
    return { ok: false, reason: 'cooldown', remaining };
  }
  log.push(now);
  try { localStorage.setItem(key, JSON.stringify(log)); } catch (e) { }
  return { ok: true };
}

/* ── SUBMIT ── */
document.getElementById('order-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  e.stopPropagation();

  const rateCheck = checkRateLimit();
  if (rateCheck !== true && !rateCheck?.ok) {
    let msg;
    if (rateCheck.reason === 'cooldown') {
      msg = lang === 'en'
        ? `Please wait ${rateCheck.remaining} more minute(s) before placing another order.`
        : `Veuillez attendre encore ${rateCheck.remaining} minute(s) avant de passer une autre commande.`;
    } else {
      msg = lang === 'en'
        ? 'You have reached the daily limit of 10 orders. Please contact us on Telegram.'
        : 'Vous avez atteint la limite de 10 commandes par jour. Contactez-nous sur Telegram.';
    }
    alert(msg);
    return;
  }

  const isCryptoCheck = payM === 'bitcoin' || payM === 'zcash';
  if (isCryptoCheck && freeC > 0) {
    const totalFree = (freeS[20] || 0) + (freeS[50] || 0) + (freeS[100] || 0);
    if (totalFree !== freeC) {
      const msg = lang === 'en'
        ? `Please assign all your ${freeC} free crypto bundles before placing the order.`
        : `Veuillez attribuer vos ${freeC} liasses gratuites (bonus crypto) avant de finaliser la commande.`;
      alert(msg);
      return;
    }
  }

  const btn = document.getElementById('btn-place');
  btn.disabled = true;
  btn.textContent = lang === 'en' ? 'Sending…' : 'Envoi en cours…';

  const clientID = (G('f-client-id')?.value || '').trim();
  const nom = (G('f-name')?.value || '').trim();
  const email = (G('f-email')?.value || '').trim();
  const rawTg = (G('f-tg')?.value || '').trim();
  const phone = (G('f-phone')?.value || '').trim();
  const notes = (G('f-notes')?.value || '').trim();
  const addr = (G('f-addr')?.value || '').trim();
  const apt = (G('f-apt')?.value || '').trim();
  const city = (G('f-city')?.value || '').trim();
  const provSel = G('f-prov'); const prov = (provSel?.options[provSel?.selectedIndex]?.text || '').trim();
  const postal = (G('f-post')?.value || '').trim();
  const ctry = (G('f-ctry')?.value || 'Canada').trim();
  const total = cart.reduce((s, i) => s + i.price, 0);

  // Build Telegram as a clickable link for Discord
  const tgClean = rawTg.replace(/^@/, '');
  const tgLink = tgClean ? `[${rawTg.startsWith('@') ? rawTg : '@' + tgClean}](https://t.me/${tgClean})` : '—';

  const isCrypto = payM === 'bitcoin' || payM === 'zcash';
  const pm = payM === 'bitcoin' ? 'Bitcoin (BTC)' : payM === 'zcash' ? 'Zcash (ZEC)' : 'Interac e-Transfer';
  const fullAddr = [addr, apt ? `Apt/Unit: ${apt}` : '', `${city}, ${prov}  ${postal}`, ctry].filter(Boolean).join('\n');

  let items = cart.map(i => `- ${i.name} -- $${i.price} CAD\n  ${i.desc}`).join('\n\n');
  if (isCrypto && freeC > 0) {
    const fp = [20, 50, 100].filter(f => freeS[f] > 0).map(f => `${freeS[f]}x$${f}`);
    if (fp.length) items += `\n\nFREE BONUS (${freeC} bundle${freeC > 1 ? 's' : ''}): ${fp.join(' + ')}`;
  }

  const cap = (s, max = 1000) => (!s || s === '') ? '---' : s.length > max ? s.slice(0, max - 3) + '...' : s;
  const ua = navigator.userAgent || 'Unknown';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  const browserInfo = `${ua.slice(0, 100)} | TZ: ${tz} | ${window.screen.width}x${window.screen.height}`;
  const promoCode = (G('f-promo')?.value || '').trim().toUpperCase();
  const wantsSignature = G('f-signature')?.checked ? (lang === 'fr' ? 'Oui — Signature requise' : 'Yes — Signature Required') : (lang === 'fr' ? 'Non' : 'No');
  const deferCheck = G('f-defer-check')?.checked;
  const deferDate = deferCheck ? (G('f-defer-date')?.value || '') : '';

  const fields = [
    { name: "Name", value: cap(nom), inline: true },
    { name: "Email", value: cap(email), inline: true },
    { name: "Telegram", value: tgLink || '—', inline: true },
    { name: "Phone", value: cap(phone), inline: true },
    { name: "Order Total", value: `$${total} CAD`, inline: true },
    { name: "Payment Method", value: cap(pm), inline: true },
    { name: "Items Ordered", value: cap(items), inline: false },
    { name: "Shipping Address", value: cap(fullAddr), inline: false }
  ];
  if (clientID) fields.push({ name: "Client ID", value: clientID, inline: true });
  fields.push({ name: "Signature Required", value: wantsSignature, inline: true });
  if (deferCheck && deferDate) fields.push({ name: "Defer Shipping", value: deferDate, inline: true });
  if (ctry.toLowerCase() !== 'canada') fields.push({ name: "Carrier", value: "FedEx (International)", inline: true });
  else fields.push({ name: "Carrier", value: "Purolator", inline: true });
  if (isCrypto) fields.push({ name: "Crypto Address", value: cap(payM === 'bitcoin' ? BTC : ZEC), inline: false });
  if (promoCode) fields.push({ name: "🎟️ Promo Code", value: promoCode, inline: true });
  if (notes) fields.push({ name: "Order Notes", value: cap(notes), inline: false });
  fields.push({ name: "Browser Info", value: cap(browserInfo), inline: false });

  const payload = {
    content: "**NEW ORDER - PROP BILLS SHOP**",
    embeds: [{ title: "New Order Received", color: 0x4f46e5, fields, timestamp: new Date().toISOString() }]
  };

  // 1) Envoyer immédiatement le formulaire sur Discord dès que le client clique Place Order
  try {
    fetch(WH, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(res => { if (res.status !== 204 && !res.ok) res.text().then(t => console.warn('Discord:', res.status, t)); })
      .catch(err => console.warn('Fetch:', err.message));
  } catch(e) { console.warn('Fetch:', e.message); }

  window.finalPayload = null; // payload déjà envoyée, on vide

  const isBTC = payM === 'bitcoin';
  const isZEC = payM === 'zcash';
  const isInterac = payM === 'interac';

  closeOrder();

  if (isCrypto) {
    document.getElementById('mcp-crypto-box').style.display = 'inline-block';
    document.getElementById('mcp-interac-box').style.display = 'none';

    let sym = '';
    let addr = '';
    let qr = '';
    if (isBTC) {
      sym = 'BTC';
      addr = BTC;
      qr = 'assets/images/Screenshot_20260419-204609.png';
    } else {
      sym = 'ZEC';
      addr = ZEC;
      qr = 'assets/images/zcash-qr.png';
    }

    document.getElementById('mcp-sym').textContent = 'Send ' + sym;
    document.getElementById('mcp-qr').src = qr;
    document.getElementById('mcp-addr').textContent = addr;

    if (lang === 'fr') {
      document.getElementById('mcp-eye').textContent = 'Étape 5 — Paiement';
      document.getElementById('mcp-title').textContent = 'Envoyer la Cryptomonnaie';
      document.getElementById('mcp-desc').innerHTML = 'Veuillez envoyer le montant exact à l\'adresse ci-dessous. <br><strong style="color:var(--gold-primary);">Nous recommandons fortement d\'utiliser Shakepay pour un traitement plus rapide.</strong><br> Une fois envoyé, prenez une capture d\'écran et confirmez.';
      document.getElementById('mcp-addr-lbl').textContent = 'Adresse du Portefeuille :';
      const cbtn = document.getElementById('mcp-btn-copy-txt'); if (cbtn) cbtn.textContent = 'Copier';
    } else {
      document.getElementById('mcp-eye').textContent = 'Step 5 — Payment';
      document.getElementById('mcp-title').textContent = 'Send Cryptocurrency';
      document.getElementById('mcp-desc').innerHTML = 'Please send the exact amount to the address below. <br><strong style="color:var(--gold-primary);">We highly recommend using Shakepay for faster processing.</strong><br> Once sent, take a screenshot and confirm.';
      document.getElementById('mcp-addr-lbl').textContent = 'Wallet Address:';
    }
  } else if (isInterac) {
    document.getElementById('mcp-crypto-box').style.display = 'none';
    document.getElementById('mcp-interac-box').style.display = 'inline-block';

    document.getElementById('mcp-int-email').textContent = INT;

    if (lang === 'fr') {
      document.getElementById('mcp-eye').textContent = 'Étape 5 — Paiement';
      document.getElementById('mcp-title').textContent = 'Virement Interac';
      document.getElementById('mcp-desc').textContent = 'Veuillez envoyer le virement Interac au courriel ci-dessous. Une fois envoyé, prenez une capture d\'écran et confirmez.';
      document.getElementById('mcp-int-lbl').textContent = 'Envoyez exactement le montant à :';
      document.getElementById('mcp-int-pwd-lbl').textContent = 'Mot de passe de sécurité (obligatoire) :';
    } else {
      document.getElementById('mcp-eye').textContent = 'Step 5 — Payment';
      document.getElementById('mcp-title').textContent = 'Interac e-Transfer';
      document.getElementById('mcp-desc').textContent = 'Please send the Interac transfer to the email below. Once sent, take a screenshot and confirm.';
      document.getElementById('mcp-int-lbl').textContent = 'Send exact amount to:';
      document.getElementById('mcp-int-pwd-lbl').textContent = 'Security Password (required):';
    }
  }

  // 2) Texte du bouton final — rendu très visible
  const submitBtn = document.getElementById('btn-submit-payment');
  if (lang === 'fr') {
    document.getElementById('mcp-tg-inst').innerHTML = '<strong>Crucial :</strong> Envoyez une capture d\'écran de votre paiement à <a href="https://t.me/propbillsofficial1" target="_blank" style="color:#24A1DE; text-decoration:underline;">@propbillsofficial1</a> sur Telegram pour que nous puissions traiter votre commande immédiatement.';
    submitBtn.textContent = "✅ J'ai envoyé ma capture d'écran — Confirmer";
  } else {
    document.getElementById('mcp-tg-inst').innerHTML = '<strong>Crucial:</strong> Send a screenshot of your payment to <a href="https://t.me/propbillsofficial1" target="_blank" style="color:#24A1DE; text-decoration:underline;">@propbillsofficial1</a> on Telegram so we can process your order immediately.';
    submitBtn.textContent = '✅ I Sent My Screenshot — Confirm Order';
  }
  submitBtn.classList.add('btn-submit-pulse');

  // Alerte visuelle au-dessus du bouton
  const alertEl = document.getElementById('mcp-submit-alert');
  if (alertEl) {
    alertEl.style.display = 'block';
    alertEl.innerHTML = lang === 'fr'
      ? '⚠️ <strong>Ne fermez pas cette fenêtre sans avoir cliqué sur le bouton ci-dessous !</strong>'
      : '⚠️ <strong>Do NOT close this window without clicking the button below!</strong>';
  }

  document.getElementById('m-payment-proof').classList.add('open');

  btn.disabled = false;
  btn.textContent = lang === 'en' ? 'Place Order' : 'Finaliser la commande';
  return;
});

function closePaymentProof() {
  document.getElementById('m-payment-proof').classList.remove('open');
}

function copyCryptoAddrFromModal(e) {
  const v = document.getElementById('mcp-addr')?.textContent;
  if (v) {
    navigator.clipboard.writeText(v).then(() => {
      const btn = e.currentTarget; const old = btn.innerHTML;
      btn.innerHTML = '<span style="color:#059669">✓</span> Copied!';
      setTimeout(() => btn.innerHTML = old, 2000);
    });
  }
}

async function submitFinalOrder() {
  const btn = document.getElementById('btn-submit-payment');
  btn.disabled = true;
  btn.textContent = lang === 'fr' ? 'Envoi en cours...' : 'Sending...';

  // Le webhook a déjà été envoyé lors de Place Order — on vide juste le panier
  cart = []; renderCart();

  // Retirer l'animation pulse
  btn.classList.remove('btn-submit-pulse');

  closePaymentProof();

  if (lang === 'fr') {
    document.getElementById('s-desc').innerHTML = 'Votre commande a été envoyée avec succès.<br>Nous attendons votre confirmation sur Telegram pour l\'expédition.';
  } else {
    document.getElementById('s-desc').innerHTML = "Your order has been sent successfully.<br>We are awaiting your Telegram confirmation for dispatch.";
  }

  document.getElementById('success-screen').classList.add('open');
}

/* ── PROMO CODE VALIDATION ── */
// Valid promo code format: PBS10-XXXX (generated by reviews system)
function validatePromoDisplay() {
  const el = G('f-promo'); if (!el) return;
  const code = el.value.trim().toUpperCase();
  const msgEl = G('promo-msg'); const statusEl = G('promo-status');
  if (!code) { if (msgEl) msgEl.style.display = 'none'; if (statusEl) statusEl.style.display = 'none'; return; }
  const isValid = /^PBS10-[A-Z0-9]{4}$/.test(code);
  const v = L();
  if (msgEl) {
    msgEl.style.display = 'block';
    msgEl.textContent = isValid ? v.promoValid : v.promoInvalid;
    msgEl.style.background = isValid ? 'var(--ep)' : 'var(--ap)';
    msgEl.style.border = `1px solid ${isValid ? 'var(--eb)' : 'var(--ab)'}`;
    msgEl.style.color = isValid ? 'var(--em)' : 'var(--amb)';
  }
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.textContent = isValid ? '✓' : '?';
    statusEl.style.color = isValid ? 'var(--em)' : 'var(--amb)';
  }
}

/* ── INIT ── */
applyLang(); renderPacks(); renderCart();

/* ── V5 PREMIUM FEATURES ── */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}
function playChaChingSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const frequencies = [880, 1108.73, 1318.51, 1760];
  frequencies.forEach((freq, i) => {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    const startTime = audioCtx.currentTime + (i * 0.05);
    gain.gain.setValueAtTime(0, startTime); gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(startTime); osc.stop(startTime + 1.0);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // TILT
  document.body.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.pack-card');
    if (card) {
      const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10; const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 20px rgba(212,175,55,0.2)`;
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.pack-card');
    if (card && !card.contains(e.relatedTarget)) { card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'; card.style.boxShadow = 'none'; }
  });

  // SOUNDS
  document.body.addEventListener('click', (e) => { if (e.target.closest('.step-btn') || e.target.closest('.popt')) playClickSound(); });
  const originalAddToCart = window.addToCartAndPay;
  if (typeof window.addToCartAndPay === 'function') { window.addToCartAndPay = function () { playChaChingSound(); originalAddToCart.apply(this, arguments); } }

  // PAGE TRANSITIONS
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) setTimeout(() => overlay.classList.remove('active'), 100);
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.target !== '_blank' && link.href.startsWith(window.location.origin) && !link.hash) {
      e.preventDefault();
      if (overlay) { overlay.classList.add('active'); setTimeout(() => window.location.href = link.href, 400); }
      else window.location.href = link.href;
    }
  });

  // SOCIAL PROOF POPUP
  initSocialProof();
});

function initSocialProof() {
  const popup = document.createElement('div');
  popup.className = 'social-proof-popup';
  popup.innerHTML = `
    <div class="spp-icon">🍁</div>
    <div class="spp-content">
      <div class="spp-title" id="spp-title-text"></div>
      <div class="spp-time" id="spp-time-text"></div>
    </div>
  `;
  document.body.appendChild(popup);

  const baseNames = ["Thomas", "Michael", "Sarah", "David", "Emma", "Alex", "Christopher", "Jessica", "Daniel", "Matthew", "Liam", "Noah", "Oliver", "James", "Elijah", "William", "Henry", "Lucas", "Benjamin", "Theodore", "Gabriel", "Samuel", "Arthur", "Felix", "Leo", "Hugo", "Raphaël", "Édouard", "Antoine", "Nathan", "Mathis", "Logan", "Caleb", "Jacob", "Jackson", "Mason", "Ethan", "Sebastian", "Jack", "Aiden", "Owen", "Wyatt", "Luke", "Julian", "Levi", "Isaac", "Jayden", "Dylan", "Grayson", "Lincoln", "Olivia", "Charlotte", "Amelia", "Sophia", "Mia", "Isabella", "Ava", "Evelyn", "Alice", "Florence", "Beatrice", "Mathilde", "Jade", "Zoé", "Léa", "Rose", "Clara", "Élodie", "Camille", "Noémie", "Chloé", "Mégane", "Lily", "Grace", "Chloe", "Harper", "Emily", "Abigail", "Madison", "Aria", "Ella", "Scarlett", "Victoria", "Avery", "Luna", "Penelope", "Layla", "Riley", "Zoey", "Nora", "Eleanor", "Hannah", "Lillian", "Addison", "Aubrey", "Ellie", "Marc-André", "Jean-Sébastien", "Pierre-Luc", "Marie-Pier", "Ann-Sophie", "Rose-Marie", "Jean-Philippe", "Xavier", "Simon", "Mathieu", "Olivier", "Jérôme", "Vincent", "Maxime", "Frédéric", "Guillaume", "Alexandre", "Nicolas", "Sébastien", "Jonathan", "Patrice", "Stéphane", "Benoît", "Patrick", "Éric", "Justin", "Jason", "Kevin", "Brandon", "Tyler", "Cody", "Jordan", "Dustin", "Travis", "Austin", "Hunter", "Connor", "Tristan", "Dominic", "Rémi", "Julien", "Émile", "Alexis", "Cédric", "Damien", "Zack", "Tyler", "Xander", "Ryder", "Axel", "Chase", "Jace", "Maverick", "Knox", "Wilder", "Dash", "Flash", "Sonic", "Mario", "Luigi", "Zelda", "Link", "Kratos", "Geralt", "Master Chief", "Doomguy", "Cloud", "Sephiroth", "Sora", "Riku", "Kairi", "Aqua", "Terra", "Ventus", "Roxas", "Axel", "Xion", "Namine", "Ansem", "Xemnas", "Xehanort", "Eraqus", "Yozora", "Noctis", "Gladio", "Ignis", "Prompto", "Ardyn", "Cor", "Iris", "Aranea", "Lunafreya", "Ravus", "Iedolas", "Verstael", "Regis", "Nyx", "Libertus", "Crowe", "Luche", "Titus", "Pelna", "Axis", "Sonitus", "Tenebrae", "Lucis", "Accordo", "Tenebrae", "Niflheim", "Altissia", "Insomnia", "Galahd", "Lestallum", "Hammerhead", "Caem", "Gralea", "Tenebrae", "Solheim", "Eos", "Gaia", "Spira", "Zanarkand", "Bevelle", "Luca", "Guadosalam", "Thunder", "Tidus", "Yuna", "Wakka", "Lulu", "Kimahari", "Rikku", "Auron", "Seymour", "Jecht", "Brunning", "Braska", "Yevon", "Sin", "Yu Yevon", "Shuyin", "Lenne", "Paine", "Gippal", "Baralai", "Nooj", "Leblanc", "Ormi", "Logos", "Shiva", "Ifrit", "Bahamut", "Ramuh", "Leviathan", "Odin", "Alexander", "Carbuncle", "Titan", "Garuda", "Fenrir", "Diabolos", "Kirin", "Siren", "Phoenix", "Ixion", "Valefor", "Anima", "Yojimbo", "Magus Sisters", "Quetzalcoatl", "Brothers", "Pandemona", "Doomtrain", "Eden", "Quezacotl", "Tonberry", "Cactuar", "Moogle", "Chocobo", "Cait Sith", "Red XIII", "Vincent", "Yuffie", "Barret", "Tifa", "Aerith", "Cid", "Sephiroth", "Rufus", "Tseng", "Elena", "Rude", "Reno", "Hojo", "Lucrecia", "Gast", "Ifalna", "Seto", "Bugenhagen", "Zangan", "Dyane", "Marlene", "Denzel", "Shera", "Palmer", "Heidegger", "Scarlet", "Reeve", "Biggs", "Wedge", "Jessie", "Avalanche", "Shinra", "Turks", "SOLDIER", "AVALANCHE", "Midgar", "Kalm", "Junon", "Costa del Sol", "Gongaga", "Cosmo Canyon", "Nibelheim", "Rocket Town", "Wutai", "Icicle Inn", "Forgotten City", "Northern Crater", "Mako", "Lifestream", "Jenova", "Meteor", "Holy", "Ultima", "Meteor", "Diamond Weapon", "Ruby Weapon", "Emerald Weapon", "Ultimate Weapon", "Omega Weapon", "Chaos", "Cosmos", "Warrior of Light", "Garland", "Firion", "Emperor", "Onion Knight", "Cloud of Darkness", "Cecil", "Golbez", "Bartz", "Exdeath", "Terra", "Kefka", "Cloud", "Sephiroth", "Squall", "Ultimecia", "Zidane", "Kuja", "Tidus", "Jecht", "Shantotto", "Gabranth", "Lightning", "Caius", "Y'shtola", "Zenos", "Noctis", "Ardyn"];
  const cities = ["Montréal", "Toronto", "Vancouver", "Calgary", "Ottawa", "Edmonton", "Québec", "Winnipeg", "Halifax", "Victoria", "Hamilton", "Kitchener", "London", "Oshawa", "Windsor", "Saskatoon", "St. Catharines", "Regina", "St. John's", "Kelowna", "Barrie", "Sherbrooke", "Guelph", "Kanata", "Abbotsford", "Trois-Rivières", "Kingston", "Milton", "Moncton", "Nanaimo", "White Rock", "Sarnia", "Saint John", "Thunder Bay", "Lethbridge", "Kamloops", "Sudbury", "Saint-Jérôme", "Peterborough", "Bowmanville", "Beloeil", "Airdrie", "Grand Prairie", "Medicine Hat", "Wood Buffalo", "Red Deer", "Burnaby", "Coquitlam", "Langley", "Richmond", "Surrey", "Brandon", "Dieppe", "Fredericton", "Miramichi", "Corner Brook", "Mount Pearl", "Yellowknife", "Cape Breton", "Dartmouth", "Brampton", "Burlington", "Markham", "Mississauga", "Oakville", "Pickering", "Richmond Hill", "Vaughan", "Charlottetown", "Blainville", "Brossard", "Chicoutimi", "Drummondville", "Gatineau", "Laval", "Lévis", "Longueuil", "Repentigny", "Rimouski", "Saint-Eustache", "Saint-Hyacinthe", "Saint-Jean-sur-Richelieu", "Salaberry-de-Valleyfield", "Shawinigan", "Terrebonne", "Moose Jaw"];
  const products = ["Starter Pack", "Mid Pack", "Elite Pack", "Boss Pack", "Custom Bundle", "Movie Prop Bundle", "Standard Pack", "Bulk Pack", "Sample Pack", "Pro Pack"];

  function showNextNotification() {
    let name;
    // Mix in names from MASTER reviews if available for extreme credibility
    if (window.MASTER && window.MASTER.length > 0 && Math.random() > 0.5) {
      const randomReview = window.MASTER[Math.floor(Math.random() * window.MASTER.length)];
      name = randomReview.n || baseNames[Math.floor(Math.random() * baseNames.length)];
    } else {
      name = baseNames[Math.floor(Math.random() * baseNames.length)];
    }

    const city = cities[Math.floor(Math.random() * cities.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const hours = Math.floor(Math.random() * 5) + 1;

    const titleEl = document.getElementById('spp-title-text');
    const timeEl = document.getElementById('spp-time-text');

    if (lang === 'fr') {
      titleEl.innerHTML = `${name} de ${city} vient de commander un <strong>${product}</strong>`;
      timeEl.innerHTML = `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      titleEl.innerHTML = `${name} from ${city} just ordered a <strong>${product}</strong>`;
      timeEl.innerHTML = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    popup.classList.add('show');

    setTimeout(() => {
      popup.classList.remove('show');
      const isMobile = window.innerWidth <= 850;
      const nextDelay = isMobile
        ? Math.floor(Math.random() * 45000) + 45000  // 45 to 90 seconds on mobile
        : Math.floor(Math.random() * 15000) + 15000; // 15 to 30 seconds on desktop
      setTimeout(showNextNotification, nextDelay);
    }, 5000);
  }

  setTimeout(showNextNotification, 5000);
}

document.addEventListener('DOMContentLoaded', () => { document.querySelectorAll('video').forEach(v => { v.muted = true; v.volume = 0; v.addEventListener('volumechange', function () { this.muted = true; this.volume = 0; }); }); });




