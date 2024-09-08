import { icons } from "@/constants";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { mockDrivers } from "@/mocks/driver";
import { useLocationStore, useDriverStore } from "@/store";
import { MarkerData } from "@/types/type";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const {drivers, selectedDriver,setDrivers} = useDriverStore();

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude
  });

  const [markers, setMarkers] = useState<MarkerData[]>([])

  useEffect(() => {
    if(Array.isArray(drivers)) {
      
      if(!userLatitude || !userLongitude)
        return;

      const newMarkers = generateMarkersFromData({
        data: mockDrivers,
        userLatitude,
        userLongitude
      });
      
      setDrivers(newMarkers);
      
    }
  },[mockDrivers])


  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {drivers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        >

        </Marker>
      ))}

    </MapView>
  );
};

export default Map;
