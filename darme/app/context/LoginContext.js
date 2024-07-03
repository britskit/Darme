import React, { createContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    surName: '',
    phoneNumber: '',
    photo: '',
    // Add other default values if necessary
  });

  return (
    <LoginContext.Provider value={{ login, setLogin, user, setUser }}>
      {children}
    </LoginContext.Provider>
  );
};
