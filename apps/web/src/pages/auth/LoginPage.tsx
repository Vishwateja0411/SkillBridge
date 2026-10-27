import React from 'react';
import { AuthBladePage } from './AuthBladePage';

export const LoginPage: React.FC = () => {
  return <AuthBladePage initialMode="signin" />;
};

export default LoginPage;
