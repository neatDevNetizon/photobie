import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function LocationSearchInput(props) {
  const [addressText, setAddressText] = React.useState('');
  const { valueAddress, onChangeAddress } = props;
  React.useEffect(()=>{
    setAddressText(valueAddress);
  },[props]);
  const handleChange = address => {
    setAddressText(address)
  };

 const handleSelect = address => {
    onChangeAddress(address);
    geocodeByAddress(address)
      .then(response => response)
      .then(response => {
      })
      .catch(error => console.error('Error', error));
      setAddressText(address)
  };
  return (
    <div>
      <div>
        <PlacesAutocomplete
          value={addressText}
          onChange={handleChange}
          onSelect={handleSelect}
        >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
                disabled={props.disabled}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  const style = suggestion.active
                    ? { backgroundColor: '#bcbcbc', cursor: 'pointer', innerWidth:'90%' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer', innerWidth:'90%' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    </div>

  );
}

export default LocationSearchInput;