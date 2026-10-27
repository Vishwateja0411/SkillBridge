import React from 'react';
import { AuthBladePage } from './AuthBladePage';

export const RegisterPage: React.FC = () => {
  return <AuthBladePage initialMode="signup" />;
};

export default RegisterPage;
