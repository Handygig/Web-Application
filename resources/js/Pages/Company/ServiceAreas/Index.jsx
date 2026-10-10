import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { GoogleMap, useJsApiLoader, Circle, Autocomplete } from '@react-google-maps/api';
import AppLayout from '@/Layouts/AppLayout';
import { MapPin, Plus, Trash2, ShieldAlert } from 'lucide-react';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '1rem',
};

export default function ServiceAreas({ serviceAreas, serviceCategories, googleMapsApiKey }) {
    const { t } = { t: (str) => str }; // Mock translation if needed, assuming they have it in AppLayout or similar. In this demo, we'll just use strings directly or simple passthrough.
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey,
        libraries: libraries,
    });

    const [map, setMap] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
    const [radius, setRadius] = useState(30); // in km

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        service_category_id: '',
        name: '',
        latitude: 40.7128,
        longitude: -74.0060,
        service_radius: 30,
    });

    const handleRadiusChange = (e) => {
        const val = parseInt(e.target.value);
        setRadius(val);
        setData('service_radius', val);
    };

    const onLoadAutocomplete = (autoC) => {
        setAutocomplete(autoC);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setCenter({ lat, lng });
                setData(data => ({
                    ...data,
                    latitude: lat,
                    longitude: lng
                }));
                map?.panTo({ lat, lng });
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('company.service-areas.store'), {
            onSuccess: () => reset(),
        });
    };

    const deleteArea = (id) => {
        if (confirm('Are you sure you want to remove this service area?')) {
            destroy(route('company.service-areas.destroy', id));
        }
    };

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manage Service Areas
                </h2>
            }
        >
            <Head title="Service Areas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* ADD NEW AREA SECTION */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-lg font-bold text-gray-900">Define New Coverage Zone</h3>
                            </div>

                            <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Side: Form Controls */}
                                <div className="space-y-5 lg:col-span-1">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Service Category</label>
                                        <select
                                            value={data.service_category_id}
                                            onChange={e => setData('service_category_id', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Select a service...</option>
                                            {serviceCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        {errors.service_category_id && <p className="mt-1 text-xs text-red-600">{errors.service_category_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Zone Name (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Downtown Metro"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Location</label>
                                        {isLoaded && (
                                            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                                                <input
                                                    type="text"
                                                    placeholder="Search city, neighborhood, or zip..."
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </Autocomplete>
                                        )}
                                        {errors.latitude && <p className="mt-1 text-xs text-red-600">Please select a valid location.</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 flex justify-between">
                                            <span>Service Radius</span>
                                            <span className="font-bold text-indigo-600">{radius} km</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="150"
                                            value={radius}
                                            onChange={handleRadiusChange}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>1 km</span>
                                            <span>150 km</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Save Service Area
                                    </button>
                                </div>

                                {/* Right Side: Map Preview */}
                                <div className="lg:col-span-2 relative">
                                    {!isLoaded ? (
                                        <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse">
                                            <span className="text-gray-400 font-medium">Loading map...</span>
                                        </div>
                                    ) : (
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={center}
                                            zoom={10}
                                            onLoad={map => setMap(map)}
                                        >
                                            <Circle
                                                center={center}
                                                radius={radius * 1000} // Google Maps uses meters
                                                options={{
                                                    fillColor: '#4f46e5',
                                                    fillOpacity: 0.2,
                                                    strokeColor: '#4f46e5',
                                                    strokeOpacity: 0.8,
                                                    strokeWeight: 2,
                                                }}
                                            />
                                        </GoogleMap>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* EXISTING AREAS LIST */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Active Service Areas</h3>
                            
                            {serviceAreas.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                    <h4 className="text-sm font-semibold text-gray-900">No Service Areas Defined</h4>
                                    <p className="text-xs text-gray-500 mt-1">You will not receive job requests until you define your coverage zones.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {serviceAreas.map((area) => (
                                        <div key={area.id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-300 transition-colors bg-gray-50/50">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                                                        {area.service_category.name}
                                                    </span>
                                                    <button 
                                                        onClick={() => deleteArea(area.id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm">
                                                    {area.name || `${area.service_category.name} Coverage`}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Coverage: <span className="font-bold text-gray-700">{area.service_radius} km radius</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
