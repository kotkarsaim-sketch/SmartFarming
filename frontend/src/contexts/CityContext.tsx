import { createContext, useContext, useState, ReactNode } from 'react';

export interface CityInfo {
  name: string;
  state: string;
}

const AVAILABLE_CITIES: CityInfo[] = [
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Solapur', state: 'Maharashtra' },
  { name: 'Kolhapur', state: 'Maharashtra' },
];

interface CityContextType {
  selectedCity: CityInfo;
  setSelectedCity: (city: CityInfo) => void;
  availableCities: CityInfo[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setSelectedCity] = useState<CityInfo>(AVAILABLE_CITIES[0]); // Default: Pune

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, availableCities: AVAILABLE_CITIES }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
};
