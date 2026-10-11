import { useCallback, useEffect, useRef } from "react";

/**
 * Pointer drag + momentum for a horizontally paged container.
 * Calls onPageSettle(page) after the user releases or uses the wheel.
 */
export function useDragScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  pageCount: number,
  currentPage: number,
  onPageSettle: (page: number) => void,
) {
  const state = useRef({ down: false, startX: 0, startScroll: 0, lastX: 0, lastT: 0, v: 0, moved: false });
  const wheelLock = useRef(0);

  const scrollToPage = useCallback(
    (page: number) => {
      const el = ref.current;
      if (!el) return;
      const p = Math.max(0, Math.min(pageCount - 1, page));
      const from = el.scrollLeft;
      const to = p * el.clientWidth;
      const start = performance.now();
      const dur = 300;
      el.style.scrollSnapType = "none";
      const step = (t: number) => {
        const k = Math.min(1, (t - start) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        el.scrollLeft = from + (to - from) * e;
        if (k < 1) requestAnimationFrame(step);
        else el.style.scrollSnapType = "";
      };
      requestAnimationFrame(step);
    },
    [ref, pageCount],
  );

  useEffect(() => {
    scrollToPage(currentPage);
  }, [currentPage, scrollToPage]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const s = state.current;
    s.down = true;
    s.moved = false;
    s.startX = s.lastX = e.clientX;
    s.startScroll = el.scrollLeft;
    s.lastT = performance.now();
    s.v = 0;
    el.style.scrollSnapType = "none";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    const s = state.current;
    if (!el || !s.down) return;
    const scale = el.getBoundingClientRect().width / el.clientWidth || 1;
    const dx = (e.clientX - s.startX) / scale;
    if (Math.abs(dx) > 4 && !s.moved) {
      s.moved = true;
      el.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    s.v = ((e.clientX - s.lastX) / scale) / Math.max(1, now - s.lastT);
    s.lastX = e.clientX;
    s.lastT = now;
    el.scrollLeft = s.startScroll - dx;
  };

  const onPointerUp = () => {
    const el = ref.current;
    const s = state.current;
    if (!el || !s.down) return;
    s.down = false;
    const w = el.clientWidth;
    let target = Math.round(el.scrollLeft / w);
    if (s.v < -0.3) target = Math.ceil(el.scrollLeft / w);
    else if (s.v > 0.3) target = Math.floor(el.scrollLeft / w);
    target = Math.max(0, Math.min(pageCount - 1, target));
    if (target === currentPage) scrollToPage(target);
    else onPageSettle(target);
  };

  const onWheel = (e: React.WheelEvent) => {
    const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(d) < 8) return;
    const now = performance.now();
    if (now - wheelLock.current < 350) return;
    wheelLock.current = now;
    const t = Math.max(0, Math.min(pageCount - 1, currentPage + (d > 0 ? 1 : -1)));
    if (t !== currentPage) onPageSettle(t);
  };

  const onScroll = () => {
    // Touch swipes use native snap — sync page when settled.
    const el = ref.current;
    if (!el || state.current.down) return;
    const p = Math.round(el.scrollLeft / el.clientWidth);
    if (Math.abs(el.scrollLeft - p * el.clientWidth) < 2 && p !== currentPage && el.style.scrollSnapType === "") {
      onPageSettle(p);
    }
  };

  const wasDrag = () => state.current.moved;

  return { handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onWheel, onScroll }, wasDrag };
}
