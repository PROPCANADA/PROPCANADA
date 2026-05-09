// --- GLOBAL MOBILE MENU BEHAVIOR ---

function toggleMobileMenu() {
    const menu = document.getElementById("navMenu");
    const btn  = document.querySelector(".mobile-menu-btn");
    const overlay = document.getElementById("mobileOverlay");
    if (menu)    menu.classList.toggle("open");
    if (btn)     btn.classList.toggle("open");
    if (overlay) overlay.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {

    // ── Close nav when a link is clicked ──
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById("navMenu");
            if (menu && menu.classList.contains("open")) toggleMobileMenu();
        });
    });

    // ════════════════════════════════════════════════════════════════
    //  UNIVERSAL TOOLTIP SYSTEM
    //  Works on desktop (hover) AND mobile (tap).
    //  The tooltip lives in <body> with position:fixed — it CANNOT
    //  be clipped by any parent overflow or stacking context.
    // ════════════════════════════════════════════════════════════════

    // ── 1. Build the floating tooltip element once ──
    const tip = document.createElement('div');
    tip.id = 'smart-tooltip';
    Object.assign(tip.style, {
        display:          'none',
        position:         'fixed',
        width:            '260px',
        background:       'rgba(15,15,15,0.98)',
        backdropFilter:   'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:           '1px solid #D4AF37',
        borderRadius:     '10px',
        padding:          '14px',
        color:            '#f5f5f5',
        fontSize:         '0.88rem',
        lineHeight:       '1.6',
        zIndex:           '9999999',
        boxShadow:        '0 15px 40px rgba(0,0,0,0.9)',
        fontFamily:       "'Inter',sans-serif",
        pointerEvents:    'auto',
        transition:       'opacity 0.15s ease',
        opacity:          '0'
    });
    document.body.appendChild(tip);

    // ── Mobile backdrop ──
    const backdrop = document.createElement('div');
    backdrop.id = 'smart-tooltip-backdrop';
    Object.assign(backdrop.style, {
        display:    'none',
        position:   'fixed',
        inset:      '0',
        zIndex:     '9999998',
        background: 'rgba(0,0,0,0.5)'
    });
    document.body.appendChild(backdrop);

    let hideTimer = null;

    function showTip(html, anchorEl) {
        clearTimeout(hideTimer);
        tip.innerHTML = html;

        const isMobile = window.innerWidth <= 850;

        if (isMobile) {
            // ── MOBILE: center on screen ──
            Object.assign(tip.style, {
                width:     '88vw',
                maxWidth:  '360px',
                top:       '50%',
                left:      '50%',
                transform: 'translate(-50%,-50%)'
            });
            backdrop.style.display = 'block';

            // Add close button
            const x = document.createElement('button');
            x.textContent = '✕';
            Object.assign(x.style, {
                position:     'absolute',
                top:          '10px',
                right:        '12px',
                background:   'transparent',
                border:       'none',
                color:        '#aaa',
                fontSize:     '1.1rem',
                cursor:       'pointer',
                lineHeight:   '1',
                padding:      '0'
            });
            x.addEventListener('click', hideTip);
            tip.appendChild(x);
        } else {
            // ── DESKTOP: position near the icon ──
            tip.style.width    = '260px';
            tip.style.maxWidth = '260px';
            tip.style.transform = '';
            backdrop.style.display = 'none';

            const rect = anchorEl.getBoundingClientRect();
            const vw   = window.innerWidth;
            const vh   = window.innerHeight;
            const TIP_W = 260;
            const TIP_H = 160; // approximate

            // Prefer below, fallback to above
            let top  = rect.bottom + 10;
            let left = rect.left + rect.width / 2 - TIP_W / 2;

            // Don't go above viewport
            if (top + TIP_H > vh) top = rect.top - TIP_H - 10;

            // Clamp horizontally
            if (left < 8)            left = 8;
            if (left + TIP_W > vw - 8) left = vw - TIP_W - 8;

            tip.style.top  = top  + 'px';
            tip.style.left = left + 'px';
        }

        tip.style.display = 'block';
        requestAnimationFrame(() => { tip.style.opacity = '1'; });
    }

    function hideTip() {
        tip.style.opacity = '0';
        backdrop.style.display = 'none';
        hideTimer = setTimeout(() => { tip.style.display = 'none'; tip.innerHTML = ''; }, 150);
    }

    backdrop.addEventListener('click', hideTip);

    // ── 2. DESKTOP — hover via event delegation ──
    document.addEventListener('mouseover', (e) => {
        if (window.innerWidth <= 850) return;
        const icon = e.target.closest('.info-icon');
        if (icon) {
            const box = icon.closest('.tooltip-container')?.querySelector('.tooltip-box');
            if (box) showTip(box.innerHTML, icon);
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (window.innerWidth <= 850) return;
        const leaving = e.target.closest('.tooltip-container');
        const entering = e.relatedTarget?.closest?.('.tooltip-container, #smart-tooltip');
        if (leaving && !entering) hideTip();
    });

    tip.addEventListener('mouseleave', hideTip);

    // ── 3. MOBILE — tap via event delegation ──
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 850) return;
        const icon = e.target.closest('.info-icon');
        if (icon) {
            e.preventDefault();
            e.stopPropagation();
            const box = icon.closest('.tooltip-container')?.querySelector('.tooltip-box');
            if (box) {
                const isVisible = tip.style.display === 'block' && tip.style.opacity === '1';
                if (isVisible) { hideTip(); return; }
                showTip(box.innerHTML, icon);
            }
        } else if (!e.target.closest('#smart-tooltip')) {
            hideTip();
        }
    });
});



/* ==========================================================================
   SECURITY: ANTI-COPY & ANTI-THEFT LOGIC
   ========================================================================== */
function applyAntiCopySecurity() {
    if (typeof window.PBS_CONFIG !== 'undefined' && window.PBS_CONFIG.ENABLE_ANTI_COPY !== false) {
        document.body.classList.add('secure-mode');
        
        // Bloquer le clic droit (sauf sur les éléments autorisés)
        document.addEventListener('contextmenu', (e) => {
            if (!e.target.closest('.allow-copy') && !e.target.closest('input') && !e.target.closest('textarea')) {
                e.preventDefault();
            }
        }, true); // Use capture phase to be first

        // Bloquer les raccourcis clavier de copie (Ctrl+C, Ctrl+X)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const node = selection.getRangeAt(0).commonAncestorContainer;
                    const parent = node.nodeType === 3 ? node.parentNode : node;
                    if (!parent.closest('.allow-copy') && !parent.closest('input') && !parent.closest('textarea')) {
                        e.preventDefault();
                    }
                } else {
                    e.preventDefault();
                }
            }
        }, true);
        
        // Bloquer le drag and drop des images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG' && !e.target.closest('.allow-copy')) {
                e.preventDefault();
            }
        }, true);
    }
}

// Run immediately if body is ready, or on DOMContentLoaded
if (document.body) {
    applyAntiCopySecurity();
} else {
    document.addEventListener('DOMContentLoaded', applyAntiCopySecurity);
}
