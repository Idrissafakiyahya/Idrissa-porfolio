import { useState, useEffect } from 'react';

export const useTypeScript = (text, speed = 90, deleteSpeed = 45, pauseDelay = 1400) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      return;
    }

    let isMounted = true;
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const tick = () => {
      if (!isMounted) return;

      if (!isDeleting && currentIndex < text.length) {
        currentIndex += 1;
        setDisplayedText(text.slice(0, currentIndex));
        timeoutId = setTimeout(tick, speed);
        return;
      }

      if (!isDeleting && currentIndex === text.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          tick();
        }, pauseDelay);
        return;
      }

      if (isDeleting && currentIndex > 0) {
        currentIndex -= 1;
        setDisplayedText(text.slice(0, currentIndex));
        timeoutId = setTimeout(tick, deleteSpeed);
        return;
      }

      if (isDeleting && currentIndex === 0) {
        isDeleting = false;
        timeoutId = setTimeout(tick, 300);
      }
    };

    setDisplayedText('');
    currentIndex = 0;
    isDeleting = false;
    tick();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [text, speed, deleteSpeed, pauseDelay]);

  return { displayedText };
};
