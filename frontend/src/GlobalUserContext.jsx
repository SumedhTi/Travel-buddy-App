import React, { createContext, useReducer, useContext } from 'react';

const UserContext = createContext(null); // explicitly set null for clarity

const initialState = {
  user: JSON.parse(localStorage.getItem('userData')) || null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  React.useEffect(() => {
    if (state.user) {
      localStorage.setItem('userData', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [state.user]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook with a safety check
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
