import React from 'react';

const GmapContext = React.createContext(null);

export const GmapProvider = ({ children }) => {

    const value = useGmapProvider();

    return (
        <GmapContext.Provider value={value}>
            {children}
        </GmapContext.Provider>
    );
}

export const useGmap = () => {
    return React.useContext(GmapContext);
}

const API_KEY = process.env.GATSBY_GMAP_API_KEY;
const googleScriptEndpoint = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;

function useGmapProvider() {
    
    // ref to Google map element
    const mapRef = React.useRef();
    // ref to track when script is attached -> only allow once
    const scriptAttached = React.useRef(false);

    const [state, setState] = React.useState({
        google: null,
        map: null,
        placesApi: null,
        places: null,
        geocoder: null,
        autocomplete: null,
        error: null,
    });

    // inject google maps service in window/document
    const init = () => {
        if (!scriptAttached.current) {
            try {
                const script = document.createElement('script');
                script.src = googleScriptEndpoint;
                script.defer = true;
                window.initMap = initService;
                document.head.appendChild(script);
                scriptAttached.current = true;
            } catch (error) {
                console.error(error);
    
                setState(prevState => ({
                    ...prevState,
                    error,
                }));
            }
        }
    }

    // initialize google maps to state
    const initService = () => {

        if (!mapRef.current) {
            return;
        }

        const google = window.google;
        const map = new google.maps.Map(
            mapRef.current,
            {
                center: { lat: 51.4934, lng: 0.0098 },
                zoom: 4,
                mapTypeId: 'roadmap',
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            }
        );

        const placesApi = google.maps.places;
        const places = new google.maps.places.PlacesService(map);
        const geocoder = new google.maps.Geocoder();
        const autocomplete = new google.maps.places.AutocompleteService();

        setState(prevState => ({
            ...prevState,
            google,
            map,
            placesApi,
            places,
            geocoder,
            autocomplete,
        }));        
    }

    // return the context provider's value object
    return {
        ...state,
        mapRef,
        init,
        initService,
    }
}