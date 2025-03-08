/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {MapContainer,Marker,TileLayer,useMap,} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { motion } from "framer-motion";
import { FaLocationArrow, FaRegDotCircle } from "react-icons/fa";

// const API_KEY_GOOGLE = "AIzaSyDLKAZoyY16HjFXgv3N7lZ_H-tM4CVJ9eo";
const API_KEY_GOOGLE = "AIzaSyDLKAZoyY16HjFXgv3N7lZ_H-tM4CVJ9eo  ";
const API_KEY_OLA = "PBAcSepBB2mZNagmG7i1MMCpeXeZqqzRE2RiVdAg";
const API_KEY_GO_MAPS = 'AlzaSy_J30dfJViJOGlNUaxzzbIqQY3H18AcW1w'

const CabBooking = () => {
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [waypoints, setWaypoints] = useState("");

    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
    const [waypointsSuggestions, setWaypointsSuggestions] = useState([]);

    const [pickupCoords, setPickupCoords] = useState("");
    const [dropoffCoords, setDropoffCoords] = useState("");
    const [waypointsCoords, setWaypointsCoords] = useState([]);

    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [price, setPrice] = useState(null);

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [middle, setMiddle] = useState("");

    let start = [20.472833,85.890161]; 
    let end = [20.281103,85.816885]; 

    useEffect(() => {
        window.scrollTo(0, 0); // Page load hone ke turant baad top pe scroll karega
    }, []);

    const fetchSuggestions = async (input, setSuggestions) => {
        if (!input) return;
        const url = `https://api.olamaps.io/places/v1/autocomplete?input=${input}&api_key=${API_KEY_OLA}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data.predictions.map((place) => place.description));
            if (data.predictions.length > 0) {
                const firstLocation = data.predictions[0].geometry.location;
                const or = `${firstLocation.lat},${firstLocation.lng}`;
                setOrigin(or);
                console.log(or); // Output: "20.92744,82.82344"
            } else {
                console.log("No location found");
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
        }
    };

    const fetchSuggestions2 = async (input, setSuggestions) => {
        if (!input) return;
        const url = `https://api.olamaps.io/places/v1/autocomplete?input=${input}&api_key=${API_KEY_OLA}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data.predictions.map((place) => place.description));
            if (data.predictions.length > 0) {
                const firstLocation = data.predictions[0].geometry.location;
                const or = `${firstLocation.lat},${firstLocation.lng}`;
                setDestination(or);
                console.log(or); // Output: "20.92744,82.82344"
            } else {
                console.log("No location found");
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
        }
    };

    const fetchSuggestions3 = async (input, setSuggestions) => {
        if (!input) return;
        const url = `https://api.olamaps.io/places/v1/autocomplete?input=${input}&api_key=${API_KEY_OLA}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data.predictions.map((place) => place.description));
            if (data.predictions.length > 0) {
                const firstLocation = data.predictions[0].geometry.location;
                const way = `${firstLocation.lat},${firstLocation.lng}`;
                setMiddle(way);
                console.log(way); // Output: "20.92744,82.82344"
            } else {
                console.log("No location found");
            }
        } catch (error) {
            console.error("Error fetching autocomplete suggestions:", error);
        }
    };

    const getRoute = async () => {
        if (!origin) return;
        console.log("origin: " + origin);
        console.log("destination: " + destination);
        console.log("waypoints: " + middle);
        
        // const url = `https://api.olamaps.io/routing/v1/directions?origin=${origin}&destinations=${destination}&api_key=${API_KEY_OLA}`;
        const url_go_map = `https://maps.gomaps.pro/maps/api/directions/json?destination=${destination}&origin=${origin}&waypoints=${middle}&key=${API_KEY_GO_MAPS}`
        // const url_google = `https://maps.googleapis.com/maps/api/directions/json?origin=New+York,NY&destination=Los+Angeles,CA&mode=driving&key=${API_KEY_GOOGLE}`;
        console.log("url: ", url_go_map);
        try {
            const response = await fetch(url_go_map);
            console.log("data: ", response);
            const data = await response.json();
            if (data.routes) {
                const route = data.routes[0];
                if(route.legs[1]){
                    setDistance(route.legs[0].distance.text + route.legs[1].distance.text);
                    setDuration(route.legs[0].duration.text + route.legs[1].duration.text);
                    setPrice(parseInt((route.legs[0].distance.value + route.legs[1].distance.value) / 100) * 10); // ₹10 per km

                    console.log("route: ", route);

                    // Set pickup, waypoints & dropoff coordinates
                    setPickupCoords([route.legs[0].start_location.lat, route.legs[0].start_location.lng]);
                    setWaypointsCoords([route.legs[0].end_location.lat, route.legs[0].end_location.lng])
                    setDropoffCoords([route.legs[1].end_location.lat, route.legs[1].end_location.lng]);
                } else {
                    setDistance(route.legs[0].distance.text);
                    setDuration(route.legs[0].duration.text);
                    setPrice(parseInt((route.legs[0].distance.value) / 1000) * 10); // ₹10 per km

                    console.log("route: ", route);

                    // Set pickup & dropoff coordinates
                    setPickupCoords([route.legs[0].start_location.lat, route.legs[0].start_location.lng]);
                    setDropoffCoords([route.legs[0].end_location.lat, route.legs[0].end_location.lng]);
                }

                console.log("pickupCoords: ", pickupCoords);
                console.log("dropoffCoords: ", dropoffCoords);
                console.log("waypointsCoords: ", waypointsCoords);
            }
            else{
                console.log("No routes found !")
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const RoutingMachine = () => {
        const map = useMap();

        useEffect(() => {
            if (!map) return;
            let routingControl 
            if(waypointsCoords.length > 0) {
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(pickupCoords[0], pickupCoords[1]),
                        L.latLng(waypointsCoords[0], waypointsCoords[1]),
                        L.latLng(dropoffCoords[0], dropoffCoords[1]),
                    ],
                    routeWhileDragging: true,
                }).addTo(map);
            } else {
                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(pickupCoords[0], pickupCoords[1]),
                        L.latLng(dropoffCoords[0], dropoffCoords[1]),
                    ],
                    routeWhileDragging: true,
                }).addTo(map);
            }

            return () => map.removeControl(routingControl);
        }, [map]);

        return null;
    };  

    return (
        <motion.div 
            className="bg-black text-white min-h-screen flex flex-col items-center p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        > 
            <motion.div className="w-[87%]">
                {/* location + estimated */}
                <motion.div className="w-full flex-col gap-20">
                    {/* top items */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }} 
                        className="flex sm:flex-row flex-col sm:gap-3 justify-between mb-10"
                    >
                        {/* location */}
                        <motion.div className="flex sm:flex-row flex-col lg:gap-10 md:gap-5 sm:gap-2 ">
                            {/* pickup */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="xl:w-[300px] sm:mb-0 mb-2 lg:w-[200px] md:w-[150px] sm:w-[150px] w-full"
                            >
                                <label className="block sm:mb-3 mb-2 ml-1 font-semibold xl:text-base lg:text-sm  text-xs">
                                    Pick up location
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={pickup}
                                        onChange={(e) => {
                                            setPickup(e.target.value);
                                            fetchSuggestions(
                                                e.target.value,
                                                setPickupSuggestions
                                            );
                                        }}
                                        placeholder="Pick up location"
                                        className="w-full xl:text-base lg:text-sm sm:text-xs text-[10px] lg:p-3 p-2 border border-gray-400 rounded-md outline-none"
                                    />
                                    {pickupSuggestions.length > 0 && (
                                        <ul className="absolute z-[1000] bg-white text-black border w-full shadow-md max-h-100 overflow-y-auto">
                                            {pickupSuggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {    
                                                        setPickup(suggestion);
                                                        setPickupSuggestions([]);
                                                    }}
                                                >
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <FaLocationArrow className="absolute xl:size-4 lg:size-3 sm:size-2.5 size-3 lg:right-3 lg:top-4 sm:right-2 sm:top-3 top-2.5 right-2 text-gray-400" />
                                </div>
                            </motion.div>

                            {/* dropoff */}
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="xl:w-[300px] sm:mb-0 mb-2 lg:w-[200px] md:w-[150px] sm:w-[150px] w-fulll"
                            >
                                <label className="block sm:mb-3 mb-2 ml-1 font-semibold xl:text-base lg:text-sm text-xs">
                                    Dropoff location
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={dropoff}
                                        onChange={(e) => {
                                            setDropoff(e.target.value);
                                            fetchSuggestions2(
                                                e.target.value,
                                                setDropoffSuggestions
                                            );
                                        }}
                                        placeholder="Dropoff location"
                                        className="w-full xl:text-base lg:text-sm sm:text-xs text-[10px] lg:p-3 p-2 border border-gray-400 rounded-md outline-none"
                                    />
                                    {dropoffSuggestions.length > 0 && (
                                        <ul className="absolute z-[1000] bg-white text-black border w-full shadow-md max-h-100 overflow-y-auto">
                                            {dropoffSuggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        setDropoff(suggestion);
                                                        setDropoffSuggestions([]);
                                                    }}
                                                >
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <FaRegDotCircle className="absolute xl:size-4 lg:size-3 sm:size-2.5 size-3 lg:right-3 lg:top-4 sm:right-2 sm:top-3 top-2.5 right-2 text-gray-400" />
                                </div>
                            </motion.div>

                            {/* waypoints */}
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="xl:w-[300px] sm:mb-0 mb-2 lg:w-[200px] md:w-[150px] sm:w-[150px] w-full"
                            >
                                <label className="block sm:mb-3 mb-2 ml-1 font-semibold xl:text-base lg:text-sm text-xs">
                                    Waypoint location
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={waypoints}
                                        onChange={(e) => {
                                            setWaypoints(e.target.value);
                                            fetchSuggestions3(
                                                e.target.value,
                                                setWaypointsSuggestions
                                            );
                                        }}
                                        placeholder="Waypoint location"
                                        className="w-full xl:text-base lg:text-sm sm:text-xs text-[10px] lg:p-3 p-2 border border-gray-400 rounded-md outline-none"
                                    />
                                    {waypointsSuggestions.length > 0 && (
                                        <ul className="absolute z-[1000] bg-white text-black border w-full shadow-md max-h-100 overflow-y-auto">
                                            {waypointsSuggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        setWaypoints(suggestion);
                                                        setWaypointsSuggestions([]);
                                                    }}
                                                >
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <FaRegDotCircle className="absolute xl:size-4 lg:size-3 sm:size-2.5 size-3 lg:right-3 lg:top-4 sm:right-2 sm:top-3 top-2.5 right-2 text-gray-400" />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* get route button */}
                        <motion.div 
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="bg-cyan-400 xl:mt-9 lg:mt-7 md:mt-8 sm:mt-4 mt-2 lg:text-base text-xs cursor-pointer text-black xl:px-8 lg:px-5 sm:px-2 px-2 font-semibold lg:my-1 sm:my-3 lg:pt-3 sm:py-2 py-1.5 sm:w-auto w-fit lg:translate-y-1 sm:-translate-y-0.5 rounded"    
                            onClick={getRoute}
                        >
                            Get Route
                        </motion.div>
                    </motion.div>

                    {/* estimated distance/duration/price */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-end font-semibold lg:text-base sm:text-sm text-xs justify-between text-white mb-4"
                    >
                        <div>
                            <p className="text-[#787B7B]">
                                Estimated distance:
                            </p>
                            <p><strong>{distance}</strong></p>
                        </div>
                        <div>
                            <p className="text-[#787B7B]">
                                Estimated duration
                            </p>
                            <p><strong>{duration}</strong></p>
                        </div>
                        <div>
                            <p className="text-[#787B7B]">
                                Estimated Price
                            </p>
                            <p><strong>{price}</strong></p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Map Integration */}
                <motion.div 
                    className="w-full rounded-md overflow-hidden relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <MapContainer 
                        center={start} 
                        zoom={13} 
                        className="xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[320px] h-[250px]"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={start} />
                        <Marker position={end} />
                        <RoutingMachine start={start} end={end} />
                    </MapContainer>
                </motion.div>

                {/* submit button */}
                <motion.div className="flex justify-end mt-2">
                    <div 
                        className="bg-cyan-400 lg:text-base sm:text-sm text-xs cursor-pointer text-black lg:px-8 sm:px-3 px-2 font-semibold lg:py-2 sm:py-1.5 p-1 rounded"
                    >
                        Submit
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default CabBooking;
