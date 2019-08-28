import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { SteedosClient } from '../steedos-client'

const SteedosLogout = ({ history }: RouteComponentProps<{}>) => {
  useEffect(() => {
    logout();
  }, []);

  const logout = async () => {
    await SteedosClient.logout();
    history.push('/login');
  };

  return (
    <div></div>
  );
};

export default SteedosLogout;
