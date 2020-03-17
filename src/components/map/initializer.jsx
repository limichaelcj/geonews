import React from 'react';
import MapContainer from './container.css';
import GmapControls from './controls';
import Async from '../util/async';

const API_KEY = process.env.GMAP_API_KEY;
const endpoint = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

const GmapInitializer = ({ userLocation, getUserLocation, setStateIndex }) => {

    // google object attached to window object
    const [state, setState] = React.useState({
        google: null,
        gmap: null,
        geocoder: null,
        autocomplete: null,
    });
    // ref element to hold google map
    const mapRef = React.useRef();

    // add google api script after component load
    React.useEffect(() => {
        const script = document.createElement('script');
        script.onload = () => {
            const gmap = new window.google.maps.Map(
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
            // create new places services
            // const places = new window.google.maps.places.PlacesService(gmap);
            const geocoder = new window.google.maps.Geocoder();
            const autocomplete = new window.google.maps.places.AutocompleteService();
            // assign gmap instance to state
            setState({
                google: window.google,
                gmap,
                geocoder,
                autocomplete,
            });
        };
        script.src = endpoint;
        document.getElementsByTagName('head')[0].appendChild(script);
    }, []);

    return (
        <MapContainer ref={mapRef}>
            <Async watch={state.google && state.gmap}>
                <GmapControls 
                    google={state.google} 
                    gmap={state.gmap} 
                    geocoder={state.geocoder} 
                    autocomplete={state.autocomplete} 
                    mapRef={mapRef}
                    userLocation={userLocation}
                    getUserLocation={getUserLocation}
                    setStateIndex={setStateIndex}
                />
            </Async>
        </MapContainer>
    );
}

export default GmapInitializer;