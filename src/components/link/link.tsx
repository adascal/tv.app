import { useCallback } from 'react';
import cx from 'classnames';

import Icon from 'components/icon';
import Spottable from 'components/spottable';
import useNavigate from 'hooks/useNavigate';

type Props = {
  href?: string;
  icon?: string;
  iconOnly?: boolean;
  replace?: boolean;
  active?: boolean;
  state?: any;
  className?: string;
  onClick?: () => void;
};

const Link: React.FC<Props> = ({ href, state, children, icon, iconOnly = !children, replace, active, className, onClick, ...props }) => {
  const navigate = useNavigate();
  const handleOnClick = useCallback(() => {
    if (href) {
      navigate(href, { state, replace });
    }
    onClick?.();
  }, [href, state, replace, onClick, navigate]);

  return (
    <Spottable
      {...props}
      className={cx(
        'whitespace-nowrap rounded cursor-pointer px-2 py-1',
        {
          'text-gray-200': !active,
          'text-red-600': active,
        },
        className,
      )}
      onClick={handleOnClick}
      role="button"
    >
      <div className="flex items-center ">
        {icon && <Icon className={cx({ 'mr-2': !iconOnly })} name={icon} />}
        {!iconOnly && <span className="overflow-ellipsis">{children}</span>}
      </div>
    </Spottable>
  );
};

export default Link;
