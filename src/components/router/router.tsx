import { MemoryRouter, MemoryRouterProps } from 'react-router';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';

import { IS_WEB } from 'utils/enviroment';

export type RouterProps = BrowserRouterProps | MemoryRouterProps;

const Router: React.FC<RouterProps> = (props) => {
  if (IS_WEB) {
    return <BrowserRouter {...props} />;
  }

  return <MemoryRouter {...props} />;
};

export default Router;
