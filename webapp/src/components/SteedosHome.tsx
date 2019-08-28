import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { SteedosClient } from '../steedos-client'

const SteedosHome = ({ history }: RouteComponentProps<{}>) => {
  const [user] = useState();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const tokens: any = await SteedosClient.validateToken();
    if (!tokens.ok) {
      history.push('/login');
      return;
    }
    window.location.href = "/"
  };

  if (!user) {
    return null;
  }
  return (
    <div></div>
  );
};

export default SteedosHome;
