var React = require('react');
import { GoogleMap, withGoogleMap } from 'react-google-maps';

export const GoogleMapContainer = withGoogleMap(props => {
    return (
        <GoogleMap {...props} ref={props.refProp}>
            {props.children}
        </GoogleMap>
);
});