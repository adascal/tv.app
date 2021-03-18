import cx from 'classnames';

type Props = {
  className?: string;
};

const Spinner: React.FC<Props> = ({ className, children }) => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center flex-col">
      <i className={cx('animate-spin w-10 h-10 rounded-full border-t-4', className)} />
      {children}
    </div>
  );
};

export default Spinner;
