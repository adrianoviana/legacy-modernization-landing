/**
 * LegacyModern Landing Page — Interactive JavaScript
 * Handles: mobile nav, form submission, smooth scroll, animations
 */

(function() {
  'use strict';

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkElements = document.querySelectorAll('.nav-link');
  const header = document.querySelector('.header');
  const diagnosticForm = document.getElementById('diagnostic-form');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================
  function initMobileNav() {
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close nav when clicking a link
    navLinkElements.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close nav on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close nav on click outside
    document.addEventListener('click', function(e) {
      if (navLinks.classList.contains('open') && 
          !navLinks.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================
  function initHeaderScroll() {
    if (!header) return;

    let lastScroll = 0;
    const threshold = 100;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > threshold) {
        header.style.boxShadow = 'var(--shadow-md)';
        header.style.borderBottomColor = 'var(--color-border-light)';
      } else {
        header.style.boxShadow = 'none';
        header.style.borderBottomColor = 'var(--color-border)';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jump
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // ==========================================================================
  // Form Handling
  // ==========================================================================
  function initForm() {
    if (!diagnosticForm) return;

    diagnosticForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate required fields
      const requiredFields = diagnosticForm.querySelectorAll('[required]');
      let isValid = true;

      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--color-danger)';
          field.addEventListener('input', function clearError() {
            field.style.borderColor = '';
            field.removeEventListener('input', clearError);
          }, { once: true });
        }
      });

      if (!isValid) {
        showFormError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Email validation
      const emailField = document.getElementById('email');
      if (emailField && !isValidEmail(emailField.value)) {
        showFormError('Por favor, insira um e-mail válido.');
        emailField.style.borderColor = 'var(--color-danger)';
        return;
      }

      // Submit form
      submitForm();
    });

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function submitForm() {
      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Collect form data
      const formData = new FormData(diagnosticForm);
      const data = Object.fromEntries(formData.entries());

      // Since we don't have a real Formspree endpoint configured,
      // we'll simulate the submission and show success
      // In production, replace this with actual fetch to your Formspree endpoint
      
      // Simulate network request
      setTimeout(function() {
        // For demo purposes, always succeed
        // In production: fetch(form.action, { method: 'POST', body: formData })
        //   .then(response => response.ok ? showSuccess() : showError())
        //   .catch(showError);
        
        showSuccess(data);
      }, 1500);
    }

    function showSuccess(data) {
      submitBtn.classList.remove('loading');
      diagnosticForm.hidden = true;
      formError.hidden = true;
      formSuccess.hidden = false;
      
      // Track conversion (placeholder for analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'diagnostic_requested', {
          event_category: 'conversion',
          event_label: data.empresa || 'unknown'
        });
      }
      
      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showFormError(message) {
      formError.querySelector('p').textContent = message || 'Erro ao enviar. Tente novamente.';
      diagnosticForm.hidden = true;
      formSuccess.hidden = true;
      formError.hidden = false;
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Reset form function (exposed globally for error retry button)
    window.resetForm = function() {
      diagnosticForm.reset();
      diagnosticForm.hidden = false;
      formSuccess.hidden = true;
      formError.hidden = true;
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    };
  }

  // ==========================================================================
  // Intersection Observer for Animations
  // ==========================================================================
  function initScrollAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const animatedElements = document.querySelectorAll(
      '.problem-card, .pillar, .step, .comparison-card, .faq-item, .trust-item'
    );

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // ==========================================================================
  // FAQ Accordion Enhancement
  // ==========================================================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
      const summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function(e) {
        // Allow default behavior but add smooth height animation
        if (item.open) {
          // Closing - let browser handle
          return;
        }
        
        // Opening - force open for animation
        item.open = true;
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
          answer.style.overflow = 'hidden';
          answer.style.transition = 'max-height 0.3s ease, opacity 0.2s ease';
          
          requestAnimationFrame(function() {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
          });
          
          answer.addEventListener('transitionend', function handler() {
            answer.style.maxHeight = 'none';
            answer.removeEventListener('transitionend', handler);
          });
        }
      });
    });
  }

  // ==========================================================================
  // Active Nav Link on Scroll
  // ==========================================================================
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksMap = {};

    navLinkElements.forEach(function(link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        navLinksMap[href.slice(1)] = link;
      }
    });

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        const id = entry.target.id;
        const link = navLinksMap[id];
        
        if (link) {
          if (entry.isIntersecting) {
            navLinkElements.forEach(function(l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1
    });

    sections.forEach(function(section) {
      observer.observe(section);
    });
  }

  // ==========================================================================
  // Number Counter Animation for Trust Items
  // ==========================================================================
  function initCounterAnimation() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const counters = document.querySelectorAll('.trust-number');
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
      observer.observe(counter);
    });

    function animateCounter(element) {
      const text = element.textContent.trim();
      const match = text.match(/^([\d.]+)([+\/%]?)(.*)$/);
      if (!match) return;

      const target = parseFloat(match[1]);
      const suffix = match[2] + match[3];
      const duration = 1500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.floor(target * eased);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
  }

  // ==========================================================================
  // Visual Code Typing Effect (Optional Enhancement)
  // ==========================================================================
  function initCodeTyping() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const codeElement = document.querySelector('.visual-code code');
    if (!codeElement) return;

    const originalHTML = codeElement.innerHTML;
    const lines = codeElement.querySelectorAll('div') || Array.from(codeElement.childNodes);
    
    // Only run if IntersectionObserver is supported and element is visible
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Add a subtle entrance animation
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateX(-20px)';
          entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          
          requestAnimationFrame(function() {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(codeElement.parentElement);
  }

  // ==========================================================================
  // Initialize All
  // ==========================================================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    initForm();
    initScrollAnimations();
    initFAQ();
    initActiveNav();
    initCounterAnimation();
    initCodeTyping();

    // Add active state styles for nav links
    const style = document.createElement('style');
    style.textContent = `
      .nav-link.active {
        color: var(--color-primary) !important;
      }
      .nav-link.active::after {
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Start initialization
  init();

  // ==========================================================================
  // Expose utilities globally if needed
  // ==========================================================================
  window.LegacyModern = {
    resetForm: window.resetForm
  };
})();