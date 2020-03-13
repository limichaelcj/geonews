import React from 'react';
import MapButton from './button.css';
import SearchBox from './searchBox.css';

const GmapControls = ({ google, gmap, mapRef }) => {

    const [searchBox, setSearchBox] = React.useState(null);
    const [markers, setMarkers] = React.useState([]);

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

    // initialize search box
    const initializeSearchBox = function() {
        setSearchBox(new google.maps.places.SearchBox(searchBoxRef.current));
    }

    // attach controls
    const attachMapControls = function() {
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(myLocationButtonRef.current);
        gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);
    }

    const biasSearchBox = function() {
        // bias searchBox results toward current map position
        gmap.addListener('bounds_changed', function () {
            searchBox.setBounds(gmap.getBounds());
        });
    }

    const initSearchListener = function() {
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            const places = searchBox.getPlaces();

            if (places.length < 1) {
                return;
            }

            // clear old markers
            markers.forEach(m => m.setMap(null));

            // hydrate new markers
            const nextMarkers = [];

            // for each place, get icon, name, and location
            const bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
                // check invalid data
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                // define icon
                const icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                // create marker for place
                markers.push(new google.maps.Marker({
                    map: gmap,
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
            gmap.fitBounds(bounds);
            setMarkers(nextMarkers);
        });
    }

    /*
     *  React effects
     */

    // init after component mount
    React.useEffect(() => {
        initializeSearchBox();
    }, []);

    // init after search box mount
    React.useEffect(() => {
        if (searchBox) {
            attachMapControls();
            getUserLocation();
            biasSearchBox();
            initSearchListener();
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