(function () {
        'use strict';

        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* AOS Init (com fallback próprio se o CDN falhar) */
        if (window.AOS) {
            AOS.init({ duration: 800, once: true, offset: 100, disable: prefersReduced });
        } else {
            document.documentElement.classList.add('aos-off');
            var aosEls = document.querySelectorAll('[data-aos]');
            if (prefersReduced || !('IntersectionObserver' in window)) {
                aosEls.forEach(function (el) { el.classList.add('aos-in'); });
            } else {
                var aosObs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var el = entry.target;
                            el.style.transitionDelay = (el.getAttribute('data-aos-delay') || 0) + 'ms';
                            el.classList.add('aos-in');
                            aosObs.unobserve(el);
                        }
                    });
                }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
                aosEls.forEach(function (el) { aosObs.observe(el); });
            }
        }

        /* Mobile Menu (com aria-expanded, fechar por Esc e clique fora) */
        var menuBtn = document.getElementById('mobileMenuBtn');
        var navLinks = document.getElementById('navLinks');

        function setMenu(open) {
            navLinks.classList.toggle('active', open);
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
            menuBtn.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
        }
        menuBtn.addEventListener('click', function () {
            setMenu(!navLinks.classList.contains('active'));
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) setMenu(false);
        });
        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
        });
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });

        /* Header Scroll */
        var header = document.getElementById('header');
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        /* Stats Counter
           CORREÇÃO: threshold 0.5 nunca disparava em seções mais altas que a metade
           da tela; agora usa rootMargin e tem fallback sem IntersectionObserver. */
        var counters = document.querySelectorAll('.stat-number');

        function runCounter(counter) {
            var target = +counter.getAttribute('data-count');
            if (prefersReduced) { counter.textContent = target + '+'; return; }
            var duration = 2000;
            var step = target / (duration / 16);
            var current = 0;
            var update = function () {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + '+';
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + '+';
                }
            };
            update();
        }

        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
            counters.forEach(function (c) { counterObserver.observe(c); });
        } else {
            counters.forEach(runCounter);
        }

        /* Gallery Filter
           CORREÇÃO: animação via classes CSS (.is-fading/.is-hidden) em vez de
           styles inline injetados pelo JS. */
        var filterBtns = document.querySelectorAll('.filter-btn');
        var galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                var filter = btn.getAttribute('data-filter');

                galleryItems.forEach(function (item) {
                    var show = filter === 'all' || item.getAttribute('data-category') === filter;
                    if (show) {
                        item.classList.remove('is-hidden');
                        requestAnimationFrame(function () {
                            requestAnimationFrame(function () { item.classList.remove('is-fading'); });
                        });
                    } else {
                        item.classList.add('is-fading');
                        setTimeout(function () {
                            if (item.classList.contains('is-fading')) item.classList.add('is-hidden');
                        }, 300);
                    }
                });
            });
        });

        /* FAQ Toggle
           CORREÇÃO: <button> acessível + altura dinâmica (sem corte em 300px). */
        document.querySelectorAll('.faq-question').forEach(function (question) {
            question.addEventListener('click', function () {
                var item = question.parentElement;
                var answer = item.querySelector('.faq-answer');
                var wasActive = item.classList.contains('active');

                document.querySelectorAll('.faq-item.active').forEach(function (i) {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                if (!wasActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
                }
            });
        });

        /* Lightbox Functionality
           CORREÇÃO: fade de abertura/fechamento funcionando (visibility + opacity). */
        var lightbox = document.getElementById('lightbox');
        var lightboxImg = document.getElementById('lightbox-img');
        var lightboxTitle = document.getElementById('lightbox-title');
        var lightboxCategory = document.getElementById('lightbox-category');
        var lightboxClose = document.querySelector('.lightbox-close');
        var lightboxPrev = document.querySelector('.lightbox-prev');
        var lightboxNext = document.querySelector('.lightbox-next');
        var currentLightboxIndex = 0;
        var visibleGalleryItems = [];
        var lastFocused = null;

        function getVisibleItems() {
            return Array.from(galleryItems).filter(function (item) {
                return !item.classList.contains('is-hidden');
            });
        }

        function updateLightboxContent() {
            var item = visibleGalleryItems[currentLightboxIndex];
            if (!item) return;
            var img = item.querySelector('img');
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = item.getAttribute('data-title');
            lightboxCategory.textContent = item.getAttribute('data-cat-label');
        }

        function openLightbox(index) {
            visibleGalleryItems = getVisibleItems();
            if (!visibleGalleryItems.length) return;
            currentLightboxIndex = Math.max(0, index);
            lastFocused = document.activeElement;
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            lightboxClose.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            if (lastFocused) lastFocused.focus();
        }

        function nextImage() {
            if (!visibleGalleryItems.length) return;
            currentLightboxIndex = (currentLightboxIndex + 1) % visibleGalleryItems.length;
            updateLightboxContent();
        }

        function prevImage() {
            if (!visibleGalleryItems.length) return;
            currentLightboxIndex = (currentLightboxIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
            updateLightboxContent();
        }

        galleryItems.forEach(function (item) {
            function open() {
                openLightbox(getVisibleItems().indexOf(item));
            }
            item.addEventListener('click', open);
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); nextImage(); });
        lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); prevImage(); });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });

        /* Ano do rodapé sempre atualizado */
        document.getElementById('year').textContent = new Date().getFullYear();

        /* Fallback de ícones: se o Font Awesome não carregar, troca por glifos nativos */
        function fontAwesomeLoaded() {
            var probe = document.createElement('i');
            probe.className = 'fas fa-phone';
            probe.style.position = 'absolute';
            probe.style.left = '-9999px';
            document.body.appendChild(probe);
            var family = getComputedStyle(probe).fontFamily || '';
            var ok = family.indexOf('Font Awesome') !== -1;
            if (ok && document.fonts && document.fonts.check) {
                try { ok = document.fonts.check('900 1em "Font Awesome 6 Free"'); } catch (e) { /* ignora */ }
            }
            probe.remove();
            return ok;
        }

        function applyIconFallback() {
            var map = {
                'fa-phone': '☎\uFE0E', 'fa-clock': '⏱\uFE0E', 'fa-map-marker-alt': '📍',
                'fa-facebook-f': 'f', 'fa-instagram': '📷', 'fa-whatsapp': '💬',
                'fa-paint-roller': '🖌', 'fa-bars': '☰', 'fa-times': '✕', 'fa-award': '🏅',
                'fa-arrow-right': '→', 'fa-check': '✔\uFE0E', 'fa-check-circle': '✔\uFE0E',
                'fa-home': '🏠', 'fa-building': '🏢', 'fa-store': '🏬', 'fa-industry': '🏭',
                'fa-medal': '🏅', 'fa-shield-alt': '🛡', 'fa-users': '👥',
                'fa-hand-holding-usd': '💰', 'fa-broom': '🧹', 'fa-search-plus': '🔍',
                'fa-quote-right': '”', 'fa-star': '★', 'fa-chevron-down': '▾',
                'fa-chevron-right': '›', 'fa-chevron-left': '‹', 'fa-envelope': '✉\uFE0E',
                'fa-linkedin-in': 'in'
            };
            document.querySelectorAll('i[class*="fa-"]').forEach(function (el) {
                for (var cls in map) {
                    if (el.classList.contains(cls)) {
                        el.textContent = map[cls];
                        el.classList.add('icon-fb');
                        break;
                    }
                }
            });
        }

        window.addEventListener('load', function () {
            setTimeout(function () {
                if (!fontAwesomeLoaded()) applyIconFallback();
            }, 300);
        });
    })();

/* =====================================================================
   Contatos dinâmicos — lê do Supabase (tabela `contatos`) se configurado,
   senão usa o fallback de assets/js/config.js.
   Elementos controlados no HTML:
     [data-contato="whatsapp"]        → href do botão/link de WhatsApp
     [data-contato="telefone"]        → href tel:
     [data-contato="email"]           → href mailto:
     [data-contato-texto="telefone"]  → texto exibido (ex.: (31) 98376-0208)
     [data-contato-texto="whatsapp"]  → texto exibido no rodapé
     [data-contato-texto="email"]     → texto exibido
   ===================================================================== */
(function () {
    'use strict';

    function linkWhatsapp(numeroOuLink, msg) {
        var base = /^https?:\/\//.test(numeroOuLink)
            ? numeroOuLink
            : 'https://wa.me/' + numeroOuLink.replace(/\D/g, '');
        return base + '?text=' + encodeURIComponent(msg || '');
    }

    function aplicarContatos(d) {
        document.querySelectorAll('[data-contato="whatsapp"]').forEach(function (a) {
            a.href = linkWhatsapp(d.whatsappLink, d.whatsappMsg);
        });
        document.querySelectorAll('[data-contato="telefone"]').forEach(function (a) {
            a.href = d.telefoneLink;
        });
        document.querySelectorAll('[data-contato="email"]').forEach(function (a) {
            a.href = 'mailto:' + d.email;
        });
        document.querySelectorAll('[data-contato-texto="telefone"]').forEach(function (el) {
            el.textContent = d.telefoneDisplay;
        });
        document.querySelectorAll('[data-contato-texto="whatsapp"]').forEach(function (el) {
            el.textContent = d.whatsappDisplay;
        });
        document.querySelectorAll('[data-contato-texto="email"]').forEach(function (el) {
            el.textContent = d.email;
        });
    }

    async function carregarContatos() {
        var cfg = window.MR_CONFIG || {};
        var fb = cfg.fallback || {};
        var dados = {
            whatsappLink: 'https://wa.me/' + (fb.whatsappNumero || '').replace(/\D/g, ''),
            whatsappMsg: fb.whatsappMsg || '',
            whatsappDisplay: fb.telefoneDisplay || '',
            telefoneDisplay: fb.telefoneDisplay || '',
            telefoneLink: 'tel:+' + (fb.whatsappNumero || '').replace(/\D/g, ''),
            email: fb.email || ''
        };

        var sb = cfg.supabase || {};
        if (sb.url && sb.anonKey) {
            try {
                var modulo = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
                var supabase = modulo.createClient(sb.url, sb.anonKey);
                var res = await supabase
                    .from('contatos')
                    .select('tipo, valor, link, mensagem_padrao')
                    .eq('ativo', true)
                    .order('ordem', { ascending: true });

                if (!res.error && Array.isArray(res.data)) {
                    res.data.forEach(function (row) {
                        if (row.tipo === 'whatsapp') {
                            if (row.link) dados.whatsappLink = row.link;
                            if (row.mensagem_padrao) dados.whatsappMsg = row.mensagem_padrao;
                            if (row.valor) { dados.whatsappDisplay = row.valor; dados.telefoneDisplay = row.valor; }
                            if (row.valor) dados.telefoneLink = 'tel:+55' + row.valor.replace(/\D/g, '');
                        } else if (row.tipo === 'telefone') {
                            if (row.valor) dados.telefoneDisplay = row.valor;
                            if (row.link) dados.telefoneLink = row.link;
                        } else if (row.tipo === 'email') {
                            if (row.valor) dados.email = row.valor;
                        }
                    });
                    console.info('[MR Pinturas] Contatos carregados do Supabase.');
                }
            } catch (e) {
                console.info('[MR Pinturas] Supabase indisponível, usando contatos do config.js.', e);
            }
        }
        aplicarContatos(dados);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', carregarContatos);
    } else {
        carregarContatos();
    }
})();
