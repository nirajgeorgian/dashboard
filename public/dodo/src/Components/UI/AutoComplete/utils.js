export const geocodeByAddress = (address, callback) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        // TODO: Remove callback support in the next major version.
        if (callback) {
          /* eslint-disable no-console */
          console.warn(
            'Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyaddress-api"'
          );
          /* eslint-enable no-console */
          callback({ status }, null, results);
          return;
        }

        reject(status);
      }

      // TODO: Remove callback support in the next major version.
      if (callback) {
        const latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        /* eslint-disable no-console */
        console.warn(
          'Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyaddress-api"'
        );
        /* eslint-enable no-console */
        callback(null, latLng, results);
      }

      resolve(results);
    });
  });
};

export const getLatLng = result => {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      };
      resolve(latLng);
    } catch (e) {
      reject(e);
    }
  });
};

async function simplifyData(results, state){
  var result = {};
   for(var i = 0,len = results.length;i < len; ++i){
      if(results[i].partial_match == true){
        for(var j = 0,len1 = results[i].address_components.length;j < len1;++j){
          var address = results[i].address_components[j]
          if(address.types[0] == "administrative_area_level_1")
            if(address.long_name == state)
              result = results[i]
        }
      }
  }
  return result
}

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}

// function matchData(results, state) {
//   var result = {};
//   for(var i = 0,len = results.length;i < len; ++i) {
//     for(var j = 0,len1 = results[i].address_components.length;j < len1;++j){
//       var address = results[i].address_components[j]
//       if(address.types[0] == "locality")
//         if(address.long_name == state)
//           result = results[i]
//     }
//   }
//   return result
// }

export const getDetails = (results, state) => {
  return new Promise(async (resolve, reject) => {
    var result = {};
    try {
      if(results.length > 1){
        const data = await simplifyData(results,state).then(res => {
          result = res
        })
      } else {
        result = results[0]
      }
      //get all data from the selected place or object
      const data = {}
      const address_components = result.address_components
      for(var i = 0,len = address_components.length;i < len; ++i) {
        data[address_components[i].types[0]] = address_components[i].long_name
      }
      if(hasWhiteSpace(data['country'])){
        var a = data['country'].split(" ")
        data['country'] = String(a[0].charAt(0) + a[1].charAt(0))
      }
      data['lat'] = result.geometry.location.lat();
      data['lng'] = result.geometry.location.lng();
      resolve(data)
    } catch(e) {
      reject(e);
    }

  });
}

export const geocodeByPlaceId = (placeId, callback) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        // TODO: Remove callback support in the next major version.
        if (callback) {
          /* eslint-disable no-console */
          console.warn(
            'Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyplaceid-api"'
          );
          /* eslint-enable no-console */
          callback({ status }, null, results);
          return;
        }

        reject(status);
      }

      // TODO: Remove callback support in the next major version.
      if (callback) {
        const latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        /* eslint-disable no-console */
        console.warn(
          'Deprecated: Passing a callback to geocodeByPlaceId is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyplaceid-api"'
        );
        /* eslint-enable no-console */
        callback(null, latLng, results);
      }

      resolve(results);
    });
  });
};
