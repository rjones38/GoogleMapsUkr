import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import GoogleMapReact from 'google-map-react'
import Geocode from "react-geocode"
import { json } from 'stream/consumers';
import Marker from './components/Marker.jsx'
import { render } from '@testing-library/react';

Geocode.setApiKey("");
Geocode.setLanguage("en");
Geocode.setRegion("es");
Geocode.setLocationType("ROOFTOP");
Geocode.enableDebug();


const distanceToMouse = (pt, mp) => {
  if (pt && mp) {
    // return distance between the marker and mouse pointer
    return Math.sqrt(
      (pt.x - mp.x) * (pt.x - mp.x) + (pt.y - mp.y) * (pt.y - mp.y)
    );
  }
};
//const Marker = ({ lat, lng, text }) => (
//  
//  <div style={{
//    color: 'white', 
//    background: 'red',
//    padding: '15px 10px',
//    display: 'inline-flex',
//    textAlign: 'center',
//    alignItems: 'center',
//    justifyContent: 'center',
//    borderRadius: '100%',
//    transform: 'translate(-50%, -50%)'
//    
//  }
//  }>
//    {text}
//  </div>
//  
//);

const defaultProps = {
  center: {
    //kiev
    lat: 50.4501,
    lng: 30.5234
  },
  zoom: 6
};

interface Places{
  id: number
  lat: number;
  lng: number;
  descr: string;
}

interface Pin {
  cityEn: string;
  descr: string;
}
interface CityJson
{
  json: string;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<Places[]>([])
  const [pins, setPins] = useState<Pin[]>([])
  const [renderReady, setRenderReady] = useState(false);
  useEffect(() => {
    // adding event listeners on mount here
    if(loading === false)
      {
        let id = 0
        for(var json in pins)
        { 

          //alert(json);
          let obj = pins[json]
          const description = obj["Description"]
          Geocode.fromAddress(obj["City"]).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              //setPlaces([...places, {id: key, lat, lng, descr: place.Description}])
              //console.log(lat, lng);
              //places.push({id: i, lat, lng, descr: obj.Description})
              //console.log(places)
              console.log(pins)
              console.log(pins[json]["Description"])
              places.push({id: id, lat, lng, descr: description})
              id = id+1 
              //return {key, lat, lng, descr: place.Description}
            },
            (error) => {
              console.error(error);
            }
          )
          console.log(renderReady)
        }
        
        if(places.length > 0){
          console.log("hello??"); setRenderReady(true)
        }
      }
 }, [loading, setLoading]);
  useEffect(() => {
    const getPins = async () => {
      const result = await fetch("http://localhost:8080/myapp", {mode: 'no-cors'});
      const json = await result.json()
      //console.log(json)
      setPins(json)
      setLoading(false)
    }
      //const res = JSON.parse(json)
      
      
      
    //this.forceUpdate()
    if (pins.length === 0) getPins()
  }, [setPins, pins])
  return (
    
    <div style={{ height: '100vh', width: '200vh', visibility: 'visible'}}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
      >
        
        {renderReady && places.map((place) => (
          
          <Marker
            key={place.id}  
            $hover={distanceToMouse}
            lat={place.lat}
            lng={place.lng}
            text={"!!!!!!!!!"}
            tooltip={place.descr}
          />
        ))}
        
        </GoogleMapReact>
    </div>
  );
}

export default App;
