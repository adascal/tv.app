import { useCallback, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';

type Props = {
  onEnterViewport?: () => void;
  onLeaveViewport?: () => void;
};

const useInViewport = (
  target: React.MutableRefObject<React.ReactInstance | null | undefined>,
  props: Props,
  options?: IntersectionObserverInit,
  config = { disconnectOnLeave: false },
) => {
  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState();

  const observerRef = useRef<IntersectionObserver | null>(null);

  const activeRef = useRef(false);
  const inViewportRef = useRef(false);
  const intersected = useRef(false);

  const enterCountRef = useRef(0);
  const leaveCountRef = useRef(0);

  const startObserver = useCallback(() => {
    if (target.current && observerRef.current) {
      const node = findDOMNode(target.current) as Element;
      if (node) {
        activeRef.current = true;
        observerRef.current.observe(node);
      }
    }
  }, [target, observerRef]);

  const stopObserver = useCallback(() => {
    activeRef.current = false;
    if (target.current && observerRef.current) {
      const node = findDOMNode(target.current) as Element;
      if (node) {
        observerRef.current.unobserve(node);
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }
  }, [target, observerRef]);

  const handleIntersection = useCallback(
    (entries) => {
      if (!activeRef.current) {
        return;
      }

      const entry = entries[0] || {};
      const { isIntersecting, intersectionRatio } = entry;
      const isInViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0;

      // enter
      if (!intersected.current && isInViewport) {
        intersected.current = true;

        onEnterViewport?.();

        enterCountRef.current += 1;
        inViewportRef.current = isInViewport;

        forceUpdate(isInViewport);

        return;
      }

      // leave
      if (intersected.current && !isInViewport) {
        intersected.current = false;

        onLeaveViewport?.();

        if (config.disconnectOnLeave && observerRef.current) {
          // disconnect obsever on leave
          observerRef.current.disconnect();
        }

        leaveCountRef.current += 1;
        inViewportRef.current = isInViewport;

        forceUpdate(isInViewport);
      }
    },
    [observerRef, config.disconnectOnLeave, onEnterViewport, onLeaveViewport],
  );

  const initIntersectionObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, options);
    }
  }, [observerRef, options, handleIntersection]);

  useEffect(() => {
    initIntersectionObserver();
    startObserver();

    return () => {
      stopObserver();
    };
  }, [initIntersectionObserver, startObserver, stopObserver]);

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current,
  };
};

export default useInViewport;
