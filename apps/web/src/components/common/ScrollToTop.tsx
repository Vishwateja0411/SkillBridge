import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop component
 *
 * Responsibilities:
 * 1. Immediate instant scroll to top (0, 0) on pathname transitions (new navigations).
 * 2. Smoothly scroll to anchor elements when a hash (e.g. /#how-it-works) is present,
 *    retrying across animation frames until the target element renders in the DOM.
 * 3. Preserve browser back/forward history scroll restoration (POP navigation).
 * 4. Ignore query string (search params) updates on the same page.
 * 5. Respect prefers-reduced-motion (instant vs smooth).
 * 6. Reset scrolling on any overflow containers if present.
 */
export const ScrollToTop: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType();

  // Keep track of scroll positions per location key for back/forward restoration
  const scrollPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const prevLocationRef = useRef<{ pathname: string; search: string; hash: string; key: string }>({
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    key: location.key,
  });

  // Enable manual scroll restoration so browser doesn't fight our programmatic handler
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      const original = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = original;
      };
    }
  }, []);

  // Record scroll position continuously so back/forward knows where to return
  useEffect(() => {
    const recordPosition = () => {
      const key = location.key || `${location.pathname}${location.search}`;
      scrollPositionsRef.current.set(key, {
        x: window.scrollX || document.documentElement.scrollLeft || 0,
        y: window.scrollY || document.documentElement.scrollTop || 0,
      });
    };

    window.addEventListener('scroll', recordPosition, { passive: true });
    return () => {
      recordPosition();
      window.removeEventListener('scroll', recordPosition);
    };
  }, [location.key, location.pathname, location.search]);

  // Main scroll handler on navigation
  useEffect(() => {
    const prev = prevLocationRef.current;
    const current = location;

    const pathnameChanged = prev.pathname !== current.pathname;
    const hashChanged = prev.hash !== current.hash;
    const searchChanged = prev.search !== current.search;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper to reset any potential scroll containers
    const resetScrollContainers = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      } catch {
        window.scrollTo(0, 0);
      }

      // Check for any layout containers with custom overflow
      const customContainers = document.querySelectorAll<HTMLElement>(
        '[data-scroll-container], .scrollable-container'
      );
      customContainers.forEach((container) => {
        try {
          container.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        } catch {
          container.scrollTop = 0;
        }
      });
    };

    // Case 1: Browser Back / Forward Navigation (POP)
    if (navType === 'POP') {
      const saved = scrollPositionsRef.current.get(current.key || `${current.pathname}${current.search}`);
      if (saved) {
        requestAnimationFrame(() => {
          try {
            window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' as ScrollBehavior });
          } catch {
            window.scrollTo(saved.x, saved.y);
          }
        });
        prevLocationRef.current = {
          pathname: current.pathname,
          search: current.search,
          hash: current.hash,
          key: current.key,
        };
        return;
      }
    }

    // Case 2: Query-only parameter change on the same page (e.g. search filters or tabs)
    // Do NOT scroll to top when only query string changes.
    if (!pathnameChanged && !hashChanged && searchChanged) {
      prevLocationRef.current = {
        pathname: current.pathname,
        search: current.search,
        hash: current.hash,
        key: current.key,
      };
      return;
    }

    // Case 3: Navigation with Hash (e.g. /#how-it-works or /projects#faqs)
    if (current.hash) {
      const targetId = decodeURIComponent(current.hash.replace(/^#/, ''));
      let attempts = 0;
      const maxAttempts = 20; // check for up to ~500ms
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      let frameId: number | undefined;
      let isCancelled = false;

      const scrollToElement = () => {
        if (isCancelled) return;
        const targetElement =
          document.getElementById(targetId) ||
          document.querySelector(`[name="${targetId}"]`) ||
          document.querySelector(current.hash);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: prefersReducedMotion ? ('instant' as ScrollBehavior) : 'smooth',
            block: 'start',
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          timeoutId = setTimeout(() => {
            frameId = requestAnimationFrame(scrollToElement);
          }, 30);
        } else {
          // Fallback if hash target not found
          resetScrollContainers();
        }
      };

      frameId = requestAnimationFrame(scrollToElement);

      prevLocationRef.current = {
        pathname: current.pathname,
        search: current.search,
        hash: current.hash,
        key: current.key,
      };

      return () => {
        isCancelled = true;
        if (timeoutId) clearTimeout(timeoutId);
        if (frameId) cancelAnimationFrame(frameId);
      };
    }

    // Case 4: Standard new page navigation (pathname changed or new navigation)
    // Instant scroll to top (0, 0)
    resetScrollContainers();

    prevLocationRef.current = {
      pathname: current.pathname,
      search: current.search,
      hash: current.hash,
      key: current.key,
    };
  }, [location, navType]);

  return null;
};

export default ScrollToTop;
