import React, { Suspense, useMemo } from 'react';

import Spinner from 'components/spinner';
import FillLayout from 'layouts/fill';
import MainLayout from 'layouts/main';

export type ViewProps = {
  component: React.ComponentType;
  layout?: 'main' | 'fill';
};

const View: React.VFC<ViewProps> = ({ component: Component, layout }) => {
  const Layout = useMemo(() => {
    if (layout === 'fill') {
      return FillLayout;
    }

    return MainLayout;
  }, [layout]);

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Component />
      </Suspense>
    </Layout>
  );
};

export default View;
