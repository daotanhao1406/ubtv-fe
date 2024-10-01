import { NextUIProvider } from '@nextui-org/react';
import React, { PropsWithChildren } from 'react';

const AppProvider = ({ children }: PropsWithChildren) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export default AppProvider;
