'use client';

import * as React from 'react';

export function useTrackedRect(nodeId: string | null, enabled: boolean) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    if (!enabled || !nodeId) {
      const frame = requestAnimationFrame(() => setRect(null));
      return () => cancelAnimationFrame(frame);
    }

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = window.document.querySelector(`[data-node-id="${nodeId}"]`);
        setRect(el ? el.getBoundingClientRect() : null);
      });
    };

    measure();
    const el = window.document.querySelector(`[data-node-id="${nodeId}"]`);
    const observer = el ? new ResizeObserver(measure) : null;
    if (el && observer) observer.observe(el);
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [nodeId, enabled]);

  return rect;
}
