import React, { createContext, useContext } from 'react';
import { AppAbility, defaultAbility } from './ability';

// Create the ability context
export const AbilityContext = createContext<AppAbility>(defaultAbility);

// Hook to use the ability context
export const useAbility = () => useContext(AbilityContext);

// Provider component
interface AbilityProviderProps {
  ability: AppAbility;
  children: React.ReactNode;
}

export const AbilityProvider: React.FC<AbilityProviderProps> = ({ ability, children }) => {
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};