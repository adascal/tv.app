import { forwardRef, useCallback, useState } from 'react';
import cx from 'classnames';

import { fixProtocol } from 'utils/url';

type ImageProps = {} & React.ImgHTMLAttributes<HTMLImageElement>;

const Image = forwardRef<HTMLImageElement, ImageProps>(({ src, alt, className, ...props }, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleOnLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={cx('relative overflow-hidden', className)}>
      <img
        {...props}
        ref={ref}
        alt={alt}
        loading="lazy"
        src={fixProtocol(src)}
        onLoad={handleOnLoad}
        className={cx('object-cover', { invisible: !isLoaded }, className)}
      />
      {!isLoaded && <span className="absolute top-0 left-0 flex items-center justify-center w-full h-full p-4 text-center">{alt}</span>}
    </div>
  );
});

export default Image;
