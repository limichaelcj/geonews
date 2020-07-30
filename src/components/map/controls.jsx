import React from 'react';
import MapButton from './button.css';
import SearchBox from './searchBox.css';
import Control from './control.css';
import { useGeolocation } from '../context/geolocation';
import { useGmap } from '../context/gmap';

const GmapControls = ({ setStateIndex, localeWeight, selectLocale, updateMarkers }) => {

    const geo = useGeolocation();
    const { userLocation } = geo;

    const gmap = useGmap();
    const { google, map, places, geocoder, autocomplete } = gmap;

    const [searchBox, setSearchBox] = React.useState(null);
    const [markers, setMarkers] = React.useState([]);

    const searchBoxRef = React.useRef();
    const controlRef = React.useRef();

    /*
     *  Functions
     */

    // center map to geolocation
    const centerToPosition = React.useCallback((latlng) => {
        if (!latlng || !latlng.lat || !latlng.lng) return null;

        // move map center
        map.setCenter(latlng);
        map.setZoom(12);
    }, [map]);

    // get latlng literal
    const getLatLngLiteralFromLocation = function(location) {
        return {
            lat: location.lat(),
            lng: location.lng(),
        }
    }
    
    // get most relevant google place based on text input
    const getFirstPlacePrediction = React.useCallback((placeName, callback) => {
        const request = {
            input: placeName,
            types: ['(regions)'],
            fields: ['name', 'geometry'],
        }
        // get prediction
        autocomplete.getPlacePredictions(request, function (results, status) {
            if (status === places.PlacesServiceStatus.OK && callback) {
                // center map to first result
                callback(results[0]);
            }   
        });
    }, [autocomplete, places.PlacesServiceStatus.OK]);

    // geocode by id
    const geocodeById = React.useCallback((placeId, callback) => {
        geocoder.geocode({ placeId }, function(results, status) {
            if (status !== 'OK') return window.alert('Geocoder has failed due to:', status);
            
            const place = results[0];
            if (!place) return window.alert('No results found');
            if (!place.geometry) return window.alert('No geometry found');

            if (callback) {
                callback(place);
            }
        });
    }, [geocoder]);

    // use places service to find nearby localities
    const getNearbyLocales = React.useCallback((latlng, callback) => {
        places.nearbySearch(
            {
                fields: ["name"],
                location: latlng,
                radius: 20000,
                type: 'locality',
                rankby: 'distance',
            },
            (results, status) => {
                const locales = []
                if (status === places.PlacesServiceStatus.OK) {
                    // get first locale only
                    locales.push(results[0].name);
                }

                // defer to callback
                if (callback) {
                    callback(locales);
                }
            }
        );
    }, [places]);

    // use geocoder service to find place by ID and fit map to geometry bounds
    const seekPlaceById = React.useCallback((placeId) => {
        geocodeById(placeId, (place) => {
            // fit map bounds
            map.fitBounds(place.geometry.bounds);
            // get latlng literal
            const latlng = getLatLngLiteralFromLocation(place.geometry.location);
            // update state with nearby locales for article filtering
            getNearbyLocales(latlng, (locales) => {
                setStateIndex(s => ({
                    ...s,
                    locales,
                    localeSelected: null,
                }));
            });
        });
    }, [getNearbyLocales, geocodeById, map, setStateIndex]);
    
    /*
     *  Handlers
     */

    // click handler for centering on user location
    const handleUpdateOnUserLocation = React.useCallback(() => {        
        if (!userLocation) {
            console.error('No user location')
            return;
        }

        const latlng = {
            lat: userLocation.coords.latitude,
            lng: userLocation.coords.longitude,
        }

        centerToPosition(latlng);

        getNearbyLocales(latlng, (locales) => {
            setStateIndex(s => ({
                ...s,
                locales,
                localeSelected: null,
            }));
        });
    }, [userLocation, centerToPosition, getNearbyLocales, setStateIndex]);

    // handle search box entry
    const handlePlaceChanged = React.useCallback(() => {
        const place = searchBox.getPlace();
        // check for data
        if (!place) return;

        // searched place was selected from autocomplete
        if (place.geometry) {
            // since bounds is not included in autocomplete's geometry response,
            // we must use geocoder service to find geometry bounds to fit map
            seekPlaceById(place.place_id);
        }

        // text was submitted without autocomplete
        else {
            // use autocomplete service to get most relevant place and seek it by id
            getFirstPlacePrediction(place.name, (prediction) => {
                seekPlaceById(prediction.place_id);
            });
        }
    }, [getFirstPlacePrediction, seekPlaceById, searchBox]);

    // update locale news for current viewport center location
    const handleUpdateOnMapCenter = function() {
        const center = map.getCenter();
        const latlng = getLatLngLiteralFromLocation(center);
        map.setZoom(11);
        getNearbyLocales(latlng, (locales) => {
            setStateIndex(s => ({
                ...s,
                locales,
                localeSelected: null,
            }));
        });
    }

    /*
     *  React effects
     */

    // init search box after component mount
    React.useEffect(() => {
        setSearchBox(new places.Autocomplete(searchBoxRef.current, {
            types: ['(regions)']
        }));
    }, [places]);

    // init after search box mount
    React.useEffect(() => {
        if (searchBox) {
            // attach controls to map
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlRef.current);
            // set data fields to return when user selects place
            searchBox.setFields(['name', 'geometry', 'place_id']);
            // set search box listener
            searchBox.addListener('place_changed', handlePlaceChanged);

            // get user location after all configurations
            handleUpdateOnUserLocation();
        }
    }, [searchBox, google.maps.ControlPosition.TOP_LEFT, map.controls, handlePlaceChanged, handleUpdateOnUserLocation]);

    // add markers on localeWeight change
    React.useEffect(() => {
        // only update if state allows
        if (!updateMarkers) {
            return;
        }
        // clear map markers
        markers.forEach(m => m.setMap(null));

        if (Object.keys(localeWeight).length < 1) {
            return setMarkers([]);
        }
            
        // make new markers based on localeWeight
        Promise.all(Object.entries(localeWeight).map(([localeName, weight]) => {
            return new Promise((resolve, reject) => {
                getFirstPlacePrediction(localeName, (prediction) => {
                    geocodeById(prediction.place_id, (place) => {
                        // get latlng literal
                        const latlng = getLatLngLiteralFromLocation(place.geometry.location);
                        // resolve promise with marker data
                        resolve({
                            coords: latlng,
                            weight,
                            localeName,
                        });
                    });
                });
            });
        })).then(markerData => {
            // update marker state
            setMarkers(markerData);
        });

    }, [localeWeight, geocodeById, getFirstPlacePrediction, markers, updateMarkers]);

    // render markers on marker state change
    React.useEffect(() => {
        // draw markers
        markers.forEach(m => {
            const marker = new google.maps.Marker({
                position: m.coords,
                // label: m.weight.toString(),
                title: m.localeName,
            });
            marker.addListener('click', selectLocale(m.localeName));
            marker.setMap(map);
        });
    }, [markers, google.maps.Marker, map, selectLocale]);

    return (
      <Control ref={controlRef}>
        <MapButton onClick={handleUpdateOnUserLocation} title="Get news near me">
          <i className="material-icons">my_location</i>
        </MapButton>
        <SearchBox ref={searchBoxRef} placeholder="Search a location" />
        <MapButton onClick={handleUpdateOnMapCenter} title="Get news at this location">
          <i className="material-icons">pin_drop</i>
        </MapButton>
      </Control>
    )
}

export default GmapControls;