import { Helmet, HelmetProps } from 'react-helmet';

import { APP_TITLE } from 'utils/app';

type Props = {} & HelmetProps;

const Seo: React.FC<Props> = (props) => {
  return <Helmet defaultTitle="Unknown" titleTemplate={`%s | ${APP_TITLE}`} {...props} />;
};

export default Seo;
