import { useCallback } from 'react';

import Button from 'components/button';
import Icon from 'components/icon';
import Text from 'components/text';
import useChangebleState from 'hooks/useChangebleState';

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  open?: boolean;
  disabled?: boolean;
  onToggle?: (open: boolean) => void;
};

const Accordion: React.FC<Props> = ({ open, onToggle, title, subtitle, className, children, disabled }) => {
  const [visible, setVisible] = useChangebleState(open);

  const handleClick = useCallback(() => {
    if (!disabled) {
      const newVisible = !visible;
      onToggle?.(newVisible);
      setVisible(newVisible);
    }
  }, [disabled, visible, setVisible, onToggle]);

  return (
    <div className="flex flex-col w-full">
      <Button onClick={handleClick} className={className} disabled={disabled}>
        <div className="flex flex-col w-full">
          <div className="flex items-center">
            <Text className="overflow-hidden">{title}</Text>

            {!disabled && <Icon name={visible ? 'expand_less' : 'expand_more'} />}
          </div>
          {!visible && subtitle && <Text className="mt-2">{subtitle}</Text>}
        </div>
      </Button>
      {visible && children}
    </div>
  );
};

export default Accordion;
