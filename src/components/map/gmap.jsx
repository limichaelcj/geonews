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
        /*
         * before accessing browser navigation, check:
         * - no user location in component state
         * - google map instance is saved in state
         * - navigator exists in window
         * - navigator has location
         */
        if (!state.userLocation && state.gmap && 'navigator' in window && window.navigator.geolocation) {
            // first callback is given a position argument from .getCurrentPosition()
            navigator.geolocation.getCurrentPosition(centerToUserLocation, errorAlert)
        } else {
          // use saved location
          centerToUserLocation();
        }

    }

    // center map to user location
    const centerToUserLocation = function (position = null) {
        // get position data from arg or state
        const positionRef = position ? position : state.userLocation;

        // positionRef exists
        if (positionRef) {
          // set new coordsinates for map instance
          const lat = positionRef.coords.latitude;
          const lng = positionRef.coords.longitude;
          state.gmap.setCenter({ lat, lng });
        }

        // set state if new geolocation position was given
        if (position) {
          setState(s => ({
            ...s,
            userLocation: position
          }))
        }
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
