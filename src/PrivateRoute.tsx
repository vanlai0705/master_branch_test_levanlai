import React from 'react';
import AppLayout from './components/layout';
import { useAuth } from './hooks/useAuth';
import PageNotPermission from './PageNotPermission';
import HomePage from './pages/home/HomePage';

type Props = {
  children: React.ReactNode
}

const PrivateRoute = (props: Props) => {
  const { children } = props;
  const { pathname } = window.location

  const { user } = useAuth()
  if (user.data?.accessToken) {
    return children;

  }

  if (pathname === "/home" || pathname === "/") {
    return <AppLayout isOutlet={false}><HomePage /></AppLayout>
  }

  return <AppLayout isOutlet={false}><PageNotPermission /></AppLayout>
};

export default PrivateRoute;
