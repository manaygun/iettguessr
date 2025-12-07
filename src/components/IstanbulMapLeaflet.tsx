'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import { districts } from '@/data/districts';

interface IstanbulMapLeafletProps {
    onDistrictClick: (districtName: string) => void;
    onDistrictHover: (districtName: string | null) => void;
    correctDistrict: string | null;
    wrongGuess: string | null;
    disabled: boolean;
}

// Istanbul bounds
const istanbulBounds: L.LatLngBoundsExpression = [
    [40.75, 27.9],  // Southwest
    [41.35, 29.7]   // Northeast
];

const istanbulCenter: L.LatLngExpression = [41.0, 28.95];

// Helper to find district side
const getDistrictSide = (name: string): 'european' | 'asian' | undefined => {
    const district = districts.find(d => d.name === name);
    return district?.side;
};

// GeoJSON style function
const getStyle = (
    feature: Feature | undefined,
    correctDistrict: string | null,
    wrongGuess: string | null
): L.PathOptions => {
    const districtName = feature?.properties?.name || '';
    const side = getDistrictSide(districtName);

    // Default colors by side
    let fillColor = side === 'asian' ? '#0891b2' : '#6366f1'; // cyan vs indigo
    let fillOpacity = 0.5;
    let weight = 1;
    let color = 'rgba(255, 255, 255, 0.3)';

    // Correct guess styling
    if (correctDistrict === districtName) {
        fillColor = '#22c55e';
        fillOpacity = 0.8;
        weight = 3;
        color = '#ffffff';
    }
    // Wrong guess styling
    else if (wrongGuess === districtName) {
        fillColor = '#ef4444';
        fillOpacity = 0.8;
        weight = 3;
        color = '#ffffff';
    }

    return {
        fillColor,
        fillOpacity,
        weight,
        color,
        className: 'district-path'
    };
};

function MapContent({
    onDistrictClick,
    onDistrictHover,
    correctDistrict,
    wrongGuess,
    disabled,
    geoJsonData
}: IstanbulMapLeafletProps & { geoJsonData: FeatureCollection }) {
    const map = useMap();
    const geoJsonRef = useRef<L.GeoJSON | null>(null);

    // Fit bounds on mount
    useEffect(() => {
        map.fitBounds(istanbulBounds, { padding: [10, 10] });
        map.setMinZoom(8);
        map.setMaxZoom(12);
    }, [map]);

    // Update styles when props change
    useEffect(() => {
        if (geoJsonRef.current) {
            geoJsonRef.current.setStyle((feature) =>
                getStyle(feature as Feature, correctDistrict, wrongGuess)
            );
        }
    }, [correctDistrict, wrongGuess]);

    const onEachFeature = (feature: Feature, layer: L.Layer) => {
        const districtName = feature.properties?.name || '';

        if (layer instanceof L.Path) {
            layer.on({
                mouseover: (e) => {
                    if (disabled) return;
                    onDistrictHover(districtName);
                    const target = e.target as L.Path;
                    target.setStyle({
                        fillOpacity: 0.8,
                        weight: 2,
                        color: 'rgba(255, 255, 255, 0.6)'
                    });
                    target.bringToFront();
                },
                mouseout: (e) => {
                    onDistrictHover(null);
                    const target = e.target as L.Path;
                    target.setStyle(getStyle(feature, correctDistrict, wrongGuess));
                },
                click: () => {
                    if (!disabled) {
                        onDistrictClick(districtName);
                    }
                }
            });
        }
    };

    const style = (feature: Feature | undefined) =>
        getStyle(feature, correctDistrict, wrongGuess);

    return (
        <GeoJSON
            ref={geoJsonRef}
            data={geoJsonData as GeoJsonObject}
            style={style}
            onEachFeature={onEachFeature}
        />
    );
}

export default function IstanbulMapLeaflet(props: IstanbulMapLeafletProps) {
    const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/istanbul-districts.json')
            .then(res => res.json())
            .then(data => {
                setGeoJsonData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading GeoJSON:', err);
                setLoading(false);
            });
    }, []);

    if (loading || !geoJsonData) {
        return (
            <div className="istanbul-map-container flex items-center justify-center">
                <span className="text-gray-400 text-sm">Harita yükleniyor...</span>
            </div>
        );
    }

    return (
        <MapContainer
            center={istanbulCenter}
            zoom={9}
            className="istanbul-map-container"
            zoomControl={false}
            attributionControl={false}
            dragging={true}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={true}
        >
            <MapContent {...props} geoJsonData={geoJsonData} />
        </MapContainer>
    );
}
