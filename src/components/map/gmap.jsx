import React from 'react';
import MapContainer from './container.css';
import MapButton from './button.css';
import SearchBox from './searchBox.css';

const API_KEY = process.env.GMAP_API_KEY;
const endpoint = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

const GoogleMap = (props) => {

    /*
     *  State and ref declaration
     */

    const [state, setState] = React.useState({
        gmap: null,
        searchBox: null,
        markers: [],
        center: { lat: 30.5928, lng: 114.3055 },
        userLocation: null,
    });
    const mapRef = React.useRef();
    const myLocationButtonRef = React.useRef();
    const searchBoxRef = React.useRef();

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
                {
                    center: state.center,
                    zoom: 12,
                    mapTypeId: 'roadmap',
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                }
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

    // initialize map elements after api load
    React.useEffect(() => {
        if ('google' in window && state.gmap) {
            // insert search box
            setState(s => ({
                ...s,
                searchBox: new window.google.maps.places.SearchBox(searchBoxRef.current)
            }));
        }
    }, [state.gmap]);

    // initialize search box properties
    React.useEffect(() => {
        if ('google' in window && state.gmap && state.searchBox) {
            state.gmap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(myLocationButtonRef.current);
            state.gmap.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);

            // bias searchBox results toward current map position
            state.gmap.addListener('bounds_changed', function() {
                state.searchBox.setBounds(state.gmap.getBounds());
            });

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            state.searchBox.addListener('places_changed', function() {
                const places = state.searchBox.getPlaces();

                if (places.length < 1) {
                    return;
                }

                // clear old markers
                state.markers.forEach(m => m.setMap(null));

                // hydrate new markers
                const markers = [];

                // for each place, get icon, name, and location
                const bounds = new window.google.maps.LatLngBounds();
                places.forEach(place => {
                    // check invalid data
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    // define icon
                    const icon = {
                        url: place.icon,
                        size: new window.google.maps.Size(71, 71),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(17, 34),
                        scaledSize: new window.google.maps.Size(25, 25)
                    };
                    // create marker for place
                    markers.push(new window.google.maps.Marker({
                        map: state.gmap,
                        icon,
                        title: place.name,
                        position: place.geometry.location,
                    }));
                    // sync viewport bounds
                    if (place.geometry.viewport) {
                        // only geocodes have viewport
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });

                // update map bounds
                state.gmap.fitBounds(bounds);
                setState(s => ({
                    ...s,
                    markers,
                }));
            })

        }

        // finish by retrieving user location
        getUserLocation();            

    }, [state.searchBox])

    // update center upon state change
    React.useEffect(() => {
        if (state.gmap) {
            state.gmap.setCenter(state.center);
        }
    }, [state.center]);

    return (
        <MapContainer ref={mapRef}>
            <MapButton ref={myLocationButtonRef} onClick={getUserLocation}>
                <i class="material-icons">
                    my_location
                </i>
            </MapButton>
            <SearchBox ref={searchBoxRef} placeholder="Search a location" />
        </MapContainer>
    );
}

export default GoogleMap;
