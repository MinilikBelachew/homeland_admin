import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const MapOne: React.FC = () => {
  const mapPosition: [number, number] = [8.4746, 38.7604]; // Center on Ethiopia
  const zoomLevel: number = 6;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div className="h-90">
        <MapContainer
          center={mapPosition}
          zoom={zoomLevel}
          style={{ height: "400px" }}
        >
          {/* Add TileLayer for the map */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Add Marker for a specific location */}
          <Marker position={mapPosition}>
            {/* Add Popup for the marker */}
            <Popup>
              Add any additional information about this location here.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapOne;
