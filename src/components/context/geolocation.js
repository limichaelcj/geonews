import React from 'react';

const GeolocationContext = React.createContext(null);

// Provider component
export const GeolocationProvider = ({ children }) => {

    const value = useGeolocationProvider();

    return (
        <GeolocationContext.Provider value={value}>
            {children}
        </GeolocationContext.Provider>
    );
}

// Hook within component
export const useGeolocation = () => {
    return React.useContext(GeolocationContext);
}

// Provider's hook that returns the context value
function useGeolocationProvider() {

    const [state, setState] = React.useState({
        userLocation: null,
        error: null,
    });

    const updateLocation = (userLocation) => {
        setState(prevState => ({
            ...prevState,
            userLocation,
        }));
    }

    const detectUserLocation = () => {
        if ('navigator' in window && window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                updateLocation,
                (error) => {
                    console.error(error);
                    setState(prevState => ({
                        ...prevState,
                        error,
                    }))
                }
            )
        } else {
            setState(prevState => ({
                ...prevState,
                error: 'Browser does not support geolocation tracking',
            }))
        }
    }
    
    return {
        ...state,
        detectUserLocation,
    }
}