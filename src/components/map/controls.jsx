import React from 'react';
import MapButton from './button.css';
import SearchBox from './searchBox.css';

const GmapControls = ({ google, gmap, geocoder, autocomplete, mapRef }) => {

    const [searchBox, setSearchBox] = React.useState(null);

    const myLocationButtonRef = React.useRef();
    const searchBoxRef = React.useRef();

    /*
     *  Functions
     */

    // retrieve user location from browser's navigator
    const getUserLocation = function () {
        if (gmap && 'navigator' in window && window.navigator.geolocation) {
            // first callback is given a position argument from .getCurrentPosition()
            navigator.geolocation.getCurrentPosition(centerToPosition, (err) => alert(err));
        }
    }

    // center map to geolocation
    const centerToPosition = function(position) {
        if (!position) return null;

        // set new coordsinates for map instance
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const coords = { lat, lng };

        // move map center
        gmap.setCenter(coords);
        gmap.setZoom(12);
    }

    const centerToPlaceById = function(placeId) {
        geocoder.geocode({ placeId }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    gmap.setZoom(11);
                    gmap.setCenter(results[0].geometry.location);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    /*
     *  Listeners
     */

    const handlePlaceChanged = function() {
        const place = searchBox.getPlace();
        // check for data
        if (!place) return;

        // searched place was selected from autocomplete
        if (place.geometry) {
            // move viewport to place
            gmap.setCenter(place.geometry.location);
        }

        // text was submitted without autocomplete
        else {
            // use places service to query text
            const request = {
                input: place.name,
                types: ['(regions)'],
                fields: ['name', 'geometry'],
            }
            // get prediction
            autocomplete.getPlacePredictions(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    // center map to first result
                    centerToPlaceById(results[0].place_id);
                }   
            });
        }

    }

    /*
     *  React effects
     */

    // init search box after component mount
    React.useEffect(() => {
        setSearchBox(new google.maps.places.Autocomplete(searchBoxRef.current, {
            types: ['(regions)']
        }));
    }, []);

    // init after search box mount
    React.useEffect(() => {
        if (searchBox) {
            // attach controls to map
            gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(myLocationButtonRef.current);
            gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);
            // set data fields to return when user selects place
            searchBox.setFields(['address_components', 'geometry', 'icon', 'name']);
            // set search box listener
            searchBox.addListener('place_changed', handlePlaceChanged);

            // get user location after all configurations
            getUserLocation();
        }
    }, [searchBox]);


    return (
        <>
            <MapButton ref={myLocationButtonRef} onClick={getUserLocation}>
                <i className="material-icons">
                    my_location
                </i>
            </MapButton>
            <SearchBox ref={searchBoxRef} placeholder="Search a location" />
        </>
    );
}

export default GmapControls;