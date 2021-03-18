import React from 'react';

import Menu from 'containers/menu';

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden" {...rest}>
      <Menu />
      <div className="w-full overflow-x-hidden overflow-y-auto">{children}</div>
    </div>
  );
};

export default MainLayout;
