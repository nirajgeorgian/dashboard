import React from 'react'

const BusinessList = props => {
  if(!Object.keys(props.data).length){
    return ( <div> Fetching Data</div>);
  }
  else {
    var new_object = Object.keys(props.data).map(function(key){
      return props.data[key];
    });

    const listItems = new_object.map((business) => {

      return (<li key={business.businessId}>
                {business.business_name}
              </li>)
    });
    return (
      <div>
        <h2>Business Lists</h2>
        <ul>{listItems}</ul>
      </div>
    );
  }
}

export default BusinessList
