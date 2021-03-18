import cx from 'classnames';

import Image from 'components/image';
import Spottable from 'components/spottable';

type Props = {
  className?: string;
  wrapperClassName?: string;
  source?: string;
  caption?: string;
  alt?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const ImageItem: React.FC<Props> = ({ className, wrapperClassName, source, caption, alt, children, ...props }) => {
  return (
    <Spottable {...props} className={cx('rounded-xl w-1/2 sm:w-1/3 lg:w-1/4 2xl:w-1/5 flex-shrink-0 cursor-pointer', wrapperClassName)}>
      <div className={cx('h-40 m-1 flex flex-col relative', className)}>
        <Image className="w-full h-full text-center bg-gray-700 border-2 border-gray-700 rounded-xl" src={source} alt={alt || caption} />

        {children}
      </div>
      {caption && (
        <div className="px-2">
          <p className="overflow-hidden text-sm text-center text-gray-200 overflow-ellipsis whitespace-nowrap">{caption}</p>
        </div>
      )}
    </Spottable>
  );
};

export default ImageItem;
