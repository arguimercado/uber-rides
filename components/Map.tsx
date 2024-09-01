import { icons } from "@/constants";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { drivers } from "@/mocks/driver";
import { useLocationStore, userDriverStore } from "@/store";
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

  const {selectedDriver,setDrivers} = userDriverStore();

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
        data: drivers,
        userLatitude,
        userLongitude
      });

      setMarkers(newMarkers);
    }
  },[drivers])

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
      {markers.map((marker) => (
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
