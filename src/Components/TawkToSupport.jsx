import React, { useEffect } from 'react';

const TawkToSupport = () => {
  useEffect(() => {
    const s0 = document.getElementsByTagName('script')[0];
    const s1 = document.createElement('script');

    s1.async = true;
    s1.src = 'https://embed.tawk.to/64e23766cc26a871b03054a8/1hmmmt15j';
    // s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    s0.parentNode.insertBefore(s1, s0);

    return () => {
      s1.parentNode.removeChild(s1);
    };
  }, []);

  return <div id="tawk_64e23766cc26a871b03054a8" />;
};

export default TawkToSupport;
