import React from 'react';
import MapButton from './button.css';
import SearchBox from './searchBox.css';
import Control from './control.css';

const GmapControls = ({ google, gmap, service, mapRef, userLocation, getUserLocation, setStateIndex, localeWeight, selectLocale }) => {

    const [searchBox, setSearchBox] = React.useState(null);
    const [markers, setMarkers] = React.useState([]);

    const searchBoxRef = React.useRef();
    const controlRef = React.useRef();

    /*
     *  Functions
     */

    // center map to geolocation
    const centerToPosition = function(latlng) {
        if (!latlng || !latlng.lat || !latlng.lng) return null;

        // move map center
        gmap.setCenter(latlng);
        gmap.setZoom(12);
    }

    // get latlng literal
    const getLatLngLiteralFromLocation = function(location) {
        return {
            lat: location.lat(),
            lng: location.lng(),
        }
    }
    
    // get most relevant google place based on text input
    const getFirstPlacePrediction = function(placeName, callback) {
        const request = {
            input: placeName,
            types: ['(regions)'],
            fields: ['name', 'geometry'],
        }
        // get prediction
        service.autocomplete.getPlacePredictions(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK && callback) {
                // center map to first result
                callback(results[0]);
            }   
        });
    } 

    // geocode by id
    const geocodeById = function(placeId, callback) {
        service.geocoder.geocode({ placeId }, function(results, status) {
            if (status !== 'OK') return window.alert('Geocoder has failed due to:', status);
            
            const place = results[0];
            if (!place) return window.alert('No results found');
            if (!place.geometry) return window.alert('No geometry found');

            if (callback) {
                callback(place);
            }
        });
    }


    // use geocoder service to find place by ID and fit map to geometry bounds
    const seekPlaceById = function(placeId) {
        geocodeById(placeId, (place) => {
            // fit map bounds
            gmap.fitBounds(place.geometry.bounds);
            // get latlng literal
            const latlng = getLatLngLiteralFromLocation(place.geometry.location);
            // update state with nearby locales for article filtering
            getNearbyLocales(latlng, (_, locales) => {
                setStateIndex(s => ({
                    ...s,
                    locales,
                    localeSelected: null,
                }));
            });
        });
    }

    // use places service to find nearby localities
    const getNearbyLocales = function(latlng, callback) {

        service.places.nearbySearch(
          {
            fields: ["name"],
            location: latlng,
            radius: 20000,
            type: 'locality',
          },
          (results, status) => {
            const locales = []
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              results.forEach(r => {
                locales.push(r.name);
              })
            }

            // defer to callback
            if (callback) {
                callback(latlng, locales);
            }
          }
        );
    }

    /*
     *  Handlers
     */

    // click handler for centering on user location
    const handleUpdateOnUserLocation = function() {        
        getUserLocation((geolocation) => {
            if (!geolocation) {
                return;
            }

            const latlng = {
                lat: geolocation.coords.latitude,
                lng: geolocation.coords.longitude,
            }

            getNearbyLocales(latlng, (location, locales) => {
                setStateIndex(s => ({
                    ...s,
                    userLocation: location,
                    locales,
                    localeSelected: null,
                }))
            });
        });
    }

    // handle search box entry
    const handlePlaceChanged = function() {
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
        const center = gmap.getCenter();
        const latlng = getLatLngLiteralFromLocation(center);
        gmap.setZoom(11);
        getNearbyLocales(latlng, (_, locales) => {
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
        setSearchBox(new google.maps.places.Autocomplete(searchBoxRef.current, {
            types: ['(regions)']
        }));
    }, []);

    // init after search box mount
    React.useEffect(() => {
        if (searchBox) {
            // attach controls to map
            gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(controlRef.current);
            // set data fields to return when user selects place
            searchBox.setFields(['name', 'geometry', 'place_id']);
            // set search box listener
            searchBox.addListener('place_changed', handlePlaceChanged);

            // get user location after all configurations
            handleUpdateOnUserLocation();
        }
    }, [searchBox]);

    // update map on user location change
    React.useEffect(() => {
        centerToPosition(userLocation);
    }, [userLocation]);

    // add markers on localeWeight change
    React.useEffect(() => {
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
            const markerInstances = [];
            // render markers
            markerData.forEach(m => {
                // add new marker
                const marker = new google.maps.Marker({
                    position: m.coords,
                    label: m.weight.toString(),
                    title: m.localeName,
                });
                marker.addListener('click', selectLocale(m.localeName));
                marker.setMap(gmap);
                markerInstances.push(marker);
            });
            // update marker state
            setMarkers(markerInstances);
        });

    }, [localeWeight]);

    // render markers on marker state change
    React.useEffect(() => {
    }, [markers])

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