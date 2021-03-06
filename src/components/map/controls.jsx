import React from 'react';
import MapButton from './button.css';
import SearchBox from './searchBox.css';
import Control from './control.css';
import { useGeolocation } from '../context/geolocation';
import { useGmap } from '../context/gmap';
import { useAppState } from '../context/appState';

const GmapControls = () => {

    // refs
    const searchBoxRef = React.useRef();
    const controlRef = React.useRef();

    // geolocation context
    const geo = useGeolocation();
    const { userLocation } = geo;

    // gmap context
    const gmap = useGmap();
    const { google, map, placesApi, places, geocoder, autocomplete } = gmap;

    // app state context
    const [state, setState] = useAppState();
    const { searchBox, markers } = state;
    
    /*
     *  State handlers
     */

    const setSearchBox = (searchBox) => {
        setState(prevState => ({
            ...prevState,
            searchBox,
        }));
    }

    const setMarkers = (markers) => {
        setState(prevState => ({
            ...prevState,
            markers,
        }));
    }

    // function builder for onclick event
    const selectLocale = (localeName) => () => {
        setState(prevState => ({
            ...prevState,
            localeSelected: localeName === prevState.localeSelected
                ? null
                : localeName,
        }));
    }

    /*
     *  Functions
     */

    // center map to geolocation
    const centerToPosition = (latlng) => {
        if (!latlng || !latlng.lat || !latlng.lng) return null;

        // move map center
        map.setCenter(latlng);
        map.setZoom(12);
    }
    
    // get most relevant google place based on text input
    const getFirstPlacePrediction = (placeName, callback) => {
        const request = {
            input: placeName,
            types: ['(regions)'],
            fields: ['name', 'geometry'],
        }
        // get prediction
        autocomplete.getPlacePredictions(request, function (results, status) {
            if (status === placesApi.PlacesServiceStatus.OK && callback) {
                // center map to first result
                callback(results[0]);
            }   
        });
    }

    // geocode by id
    const geocodeById = (placeId, callback) => {
        geocoder.geocode({ placeId }, function(results, status) {
            if (status !== 'OK') return window.alert('Geocoder has failed due to:', status);
            
            const place = results[0];
            if (!place) return window.alert('No results found');
            if (!place.geometry) return window.alert('No geometry found');

            if (callback) {
                callback(place);
            }
        });
    }

    // use places service to find nearby localities
    const getNearbyLocales = (latlng, callback) => {
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
                if (status === placesApi.PlacesServiceStatus.OK) {
                    // get first locale only
                    locales.push(results[0].name);
                }

                // defer to callback
                if (callback) {
                    callback(locales);
                }
            }
        );
    }

    // use geocoder service to find place by ID and fit map to geometry bounds
    const seekPlaceById = (placeId) => {
        geocodeById(placeId, (place) => {
            // fit map bounds
            map.fitBounds(place.geometry.bounds);
            // get latlng literal
            const latlng = getLatLngLiteralFromLocation(place.geometry.location);
            // update state with nearby locales for article filtering
            getNearbyLocales(latlng, (locales) => {
                setState(prevState => ({
                    ...prevState,
                    locales,
                    localeSelected: null,
                }));
            });
        });
    }
    
    /*
     *  Handlers
     */

    // click handler for centering on user location
    const handleUpdateOnUserLocation = () => {        
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
            setState(prevState => ({
                ...prevState,
                locales,
                localeSelected: null,
            }));
        });
    }

    // handle search box entry
    const handlePlaceChanged = () => {
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
    }

    // update locale news for current viewport center location
    const handleUpdateOnMapCenter = function() {
        const center = map.getCenter();
        const latlng = getLatLngLiteralFromLocation(center);
        map.setZoom(11);
        getNearbyLocales(latlng, (locales) => {
            setState(prevState => ({
                ...prevState,
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
        setSearchBox(new placesApi.Autocomplete(searchBoxRef.current, {
            types: ['(regions)']
        }));
    }, []);

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
    }, [searchBox]);

    // add markers on localeWeight change
    React.useEffect(() => {
        // only update if state allows
        if (!state.updateMarkers) {
            return;
        }
        // clear map markers
        markers.forEach(m => m.setMap(null));

        if (Object.keys(state.localeWeight).length < 1) {
            return setMarkers([]);
        }
            
        // make new markers based on localeWeight
        Promise.all(Object.entries(state.localeWeight).map(([localeName, weight]) => {
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

    }, [state.localeWeight]);

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
    }, [markers]);

    return (
      <Control ref={controlRef}>
        <MapButton onClick={handleUpdateOnUserLocation} title="Get news near me" disabled={state.loadingArticles}>
          <i className="material-icons">my_location</i>
        </MapButton>
        <SearchBox ref={searchBoxRef} placeholder="Search a location" disabled={state.loadingArticles} />
        <MapButton onClick={handleUpdateOnMapCenter} title="Get news at this location" disabled={state.loadingArticles}>
          <i className="material-icons">pin_drop</i>
        </MapButton>
      </Control>
    )
}

// helpers

// get latlng literal
const getLatLngLiteralFromLocation = function (location) {
    return {
        lat: location.lat(),
        lng: location.lng(),
    }
}

export default GmapControls;