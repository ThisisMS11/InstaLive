'use client';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import React, { ReactNode } from 'react';
import { store, persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';

interface Props {
  children: ReactNode;
}

const Providers = (props: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider>{props.children}</SessionProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
