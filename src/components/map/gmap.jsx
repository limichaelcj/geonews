import React from 'react';
import MapContainer from './container.css';

const API_KEY = process.env.GMAP_API_KEY;
const endpoint = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;

const GoogleMap = (props) => {

    /*
     *  State and ref declaration
     */

    const [state, setState] = React.useState({
        gmap: null,
        center: { lat: 30.5928, lng: 114.3055 },
        userLocation: null,
    });
    const mapRef = React.useRef();

    /*
     *  Functions
     */

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

    // center map to geolocation
    const centerToUserLocation = function (geolocation = null) {
        // get position data from arg or state
        const position = geolocation ? geolocation : state.userLocation;
        
        // if geolocation data exists
        if (position) {
            // set new coordsinates for map instance
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const coords = { lat, lng };

            // update center and user geolocation
            setState(s => ({
                ...s,
                center: {...coords},
                userLocation: position,
            }));
        }
    }

    // catch errors
    const errorAlert = function(error) {
        alert(error);
    }

    /*
     *  React Effects
     */

    // initialize gmap api
    React.useEffect(() => {
        const script = document.createElement('script');
        script.onload = () => {
            const gmap = new window.google.maps.Map(
                mapRef.current,
                { center: state.center , zoom: 12 }
            );
            // assign gmap instance to state
            setState(s => ({
                ...s,
                gmap,
            }));
        };
        script.src = endpoint;
        document.getElementsByTagName('head')[0].appendChild(script);
    }, []);

    // get user location after map is initiated
    React.useEffect(getUserLocation, [state.gmap]);

    // update center upon state change
    React.useEffect(() => {
        if (state.gmap) {
            state.gmap.setCenter(state.center);
        }
    }, [state.center]);

    return (
        <MapContainer ref={mapRef}>
        </MapContainer>
    );
}

export default GoogleMap;
