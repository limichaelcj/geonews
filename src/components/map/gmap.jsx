import React from 'react';
import GmapCSS from './gmap.css';

const API_KEY = process.env.GMAP_API_KEY;
const endpoint = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;

const GoogleMap = (props) => {

    const [state, setState] = React.useState({
        gmap: null,
        userLocation: null,
    });
    const mapRef = React.useRef();

    const getUserLocation = function(){
        if (state.gmap && 'navigator' in window && window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(centerToUserLocation, errorAlert)
        }
    }

    // center map to user location
    const centerToUserLocation = function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        state.gmap.setCenter({ lat, lng });
    }

    // catch errors
    const errorAlert = function(error) {
        alert(error);
    }

    // initialize gmap api
    React.useEffect(() => {
        const script = document.createElement('script');
        script.onload = () => {
            const gmap = new window.google.maps.Map(
                mapRef.current,
                { zoom: 12 }
            );
            setState(s => ({
                ...s,
                gmap,
            }));
        };
        script.src = endpoint;
        document.getElementsByTagName('head')[0].appendChild(script);
    }, []);

    // get user location when map is initiated
    React.useEffect(getUserLocation, [state.gmap]);
    
    return (
        <GmapCSS ref={mapRef} />
    );
}

export default GoogleMap;