import { Button, MenuItem, TextField } from '@mui/material';
import { useState, useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvent, useMap } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css"
import type { LatLngTuple } from 'leaflet';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { createRestaurant, viewRestaurant, updateRestaurant } from '../api/restaurantService';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import type { restaurant } from '../interfaces/restaurant';
import { FaArrowLeft } from "react-icons/fa";
import { handleApiError } from '../utils/handleApiError';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type PreviewFile = {
    file?: File;
    previewUrl: string;
};

function MapRecenter({ position }: { position: LatLngTuple | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
        }
    }, [position, map]);
    return null;
}

function RestaurantPage() {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_NAME;
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = id ? true : false;
    const defaultCenter: LatLngTuple = [9.9312, 76.2673];
    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [selectedPosition, setSelectedPosition] = useState<LatLngTuple | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<PreviewFile | null>(
        null,
    );
    const [imageError, setImageError] = useState<string | null>(null);
    const modeOptions = [{ label: "Dining", value: "DINING" }, { label: "Takeout", value: "TAKEOUT" }, { label: "Both Dining & Takeout", value: "BOTH" }];
    const [formData, setFormData] = useState({
        name: {
            value: "",
            error: false,
            helperText: ""
        },
        mode: {
            value: "DINING",
            error: false,
            helperText: ""
        },
        phone: {
            value: "",
            error: false,
            helperText: ""
        },
        email: {
            value: "",
            error: false,
            helperText: ""
        },
        website: {
            value: "",
            error: false,
            helperText: ""
        },
        address: {
            value: "",
            error: false,
            helperText: ""
        }
    })

    useEffect(() => {
        if (isEditMode && id) {
            const fetchRestaurant = async () => {
                setLoading(true);
                setNotFound(false);
                try {
                    const response = await viewRestaurant(id);
                    if (response.success && response.data) {
                        const rest = response.data as restaurant;
                        setFormData({
                            name: { value: rest.name || "", error: false, helperText: "" },
                            mode: { value: rest.mode || "DINING", error: false, helperText: "" },
                            phone: { value: rest.phone || "", error: false, helperText: "" },
                            email: { value: rest.email || "", error: false, helperText: "" },
                            website: { value: rest.website || "", error: false, helperText: "" },
                            address: { value: rest.address || "", error: false, helperText: "" }
                        });
                        if (rest.latitude !== null && rest.longitude !== null && rest.latitude !== undefined && rest.longitude !== undefined) {
                            setSelectedPosition([Number(rest.latitude), Number(rest.longitude)]);
                        }
                        if (rest.displayImage) {
                            setImagePreview({ previewUrl: rest.displayImage });
                        }
                    } else {
                        setNotFound(true);
                        toast.error(response.message || "Failed to load restaurant details");
                    }
                } catch (error) {
                    setNotFound(true);
                    handleApiError(error, "Error loading restaurant details");
                } finally {
                    setLoading(false);
                }
            };
            fetchRestaurant();
        }
    }, [isEditMode, id]);
    const ACCEPTED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
    ];

    const MAX_SIZE_MB = 2;
    function SetLocation() {
        useMapEvent("click", (e) => {
            setSelectedPosition([e.latlng.lat, e.latlng.lng]);
            setLocationError(null);
        });
        return null;
    }

    function validateFile(file: File) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return "Only PDF, JPG, and PNG files are allowed.";
        }

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return "File size must be less than 5 MB.";
        }

        return null;
    }

    function handleFile(file: File) {
        const validationError = validateFile(file);
        if (validationError) {
            setImageError(validationError)
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        setImagePreview({
            file,
            previewUrl,
        });

        setImageError(null);
    }

    function handleRemoveImage() {
        setImagePreview(null);
        setImageError(null);
    }

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "restaurants")
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            { method: "post", body: formData }
        )
        const image = await response.json();
        return image;
    }

    async function handleSubmit() {
        let hasError = false;
        const newFormData = { ...formData };

        if (!formData.name.value.trim()) {
            newFormData.name = {
                value: formData.name.value,
                error: true,
                helperText: "Restaurant name is required"
            };
            hasError = true;
        } else if (formData.name.value.trim().length < 3) {
            newFormData.name = {
                value: formData.name.value,
                error: true,
                helperText: "Restaurant name must be at least 3 characters"
            };
            hasError = true;
        } else if (formData.name.value.trim().length > 100) {
            newFormData.name = {
                value: formData.name.value,
                error: true,
                helperText: "Restaurant name cannot exceed 100 characters"
            };
            hasError = true;
        }

        const validModes = ["DINING", "TAKEOUT", "BOTH"];
        if (!formData.mode.value) {
            newFormData.mode = {
                value: formData.mode.value,
                error: true,
                helperText: "Mode selection is required"
            };
            hasError = true;
        } else if (!validModes.includes(formData.mode.value)) {
            newFormData.mode = {
                value: formData.mode.value,
                error: true,
                helperText: "Invalid mode selection"
            };
            hasError = true;
        }

        if (!formData.phone.value.trim()) {
            newFormData.phone = {
                value: formData.phone.value,
                error: true,
                helperText: "Phone number is required"
            };
            hasError = true;
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.value.trim())) {
            newFormData.phone = {
                value: formData.phone.value,
                error: true,
                helperText: "Invalid phone number (must be 10 digits starting with 6-9)"
            };
            hasError = true;
        }

        if (formData.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.value.trim())) {
            newFormData.email = {
                value: formData.email.value,
                error: true,
                helperText: "Invalid email address"
            };
            hasError = true;
        }

        if (!formData.address.value.trim()) {
            newFormData.address = {
                value: formData.address.value,
                error: true,
                helperText: "Address is required"
            };
            hasError = true;
        } else if (formData.address.value.trim().length > 255) {
            newFormData.address = {
                value: formData.address.value,
                error: true,
                helperText: "Address cannot exceed 255 characters"
            };
            hasError = true;
        }

        if (!imagePreview) {
            setImageError("Display image is required");
            hasError = true;
        } else if (imageError) {
            hasError = true;
        }

        if (!selectedPosition) {
            setLocationError("Please select a location on the map");
            hasError = true;
        }

        if (hasError) {
            setFormData(newFormData);
            toast.error("Please fix the validation errors");
            return;
        }

        const toastId = toast.loading(isEditMode ? "Saving restaurant..." : "Uploading image...");
        try {
            let displayImageUrl = "";
            if (imagePreview?.file) {
                const uploadRes = await uploadImage(imagePreview.file);
                displayImageUrl = uploadRes.secure_url || uploadRes.url || "";
                if (!displayImageUrl) {
                    throw new Error("Failed to get image URL from upload response");
                }
            } else if (imagePreview?.previewUrl) {
                displayImageUrl = imagePreview.previewUrl;
            }

            toast.loading(isEditMode ? "Updating restaurant..." : "Creating restaurant...", { id: toastId });

            const restaurantData: restaurant = {
                name: formData.name.value.trim(),
                address: formData.address.value.trim(),
                latitude: selectedPosition![0],
                longitude: selectedPosition![1],
                email: formData.email.value.trim() || "",
                phone: formData.phone.value.trim() || "",
                website: formData.website.value.trim() || "",
                displayImage: displayImageUrl,
                tags: [],
                mode: formData.mode.value as "DINING" | "TAKEOUT" | "BOTH",
                averageSpending: 0
            };

            let response;
            if (isEditMode) {
                restaurantData.id = Number(id);
                response = await updateRestaurant(restaurantData);
            } else {
                response = await createRestaurant(restaurantData);
            }

            if (response.success) {
                toast.success(isEditMode ? "Restaurant updated successfully!" : "Restaurant created successfully!", { id: toastId });
                navigate("/");
            } else {
                toast.error(response.message || (isEditMode ? "Failed to update restaurant" : "Failed to create restaurant"), { id: toastId });
            }
        } catch (error) {
            handleApiError(error, "An error occurred during submission", toastId);
        }
    }

    return (
        <div className='flex justify-center'>
            <div className="flex flex-col w-full lg:w-350 pt-3 lg:pt-10 gap-3">
                <div className='flex items-center gap-4 px-5 lg:px-7'>
                    <div className='hover:bg-gray-200 translate-y-0.5 active:bg-gray-300 p-2 rounded-full transition-all duration-200 items-center cursor-pointer' onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </div>
                    <h1 className='font-bold text-3xl  '>
                        {isEditMode ? "Edit Restaurant" : "Add Restaurant"}
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
                        <span className="animate-pulse text-lg">Loading restaurant details...</span>
                    </div>
                ) : notFound ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 px-5 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Restaurant Not Found</h2>
                        <p className="text-gray-500">The restaurant you are trying to edit could not be found.</p>
                        <Button variant="contained" onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
                            Back to Manage Page
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex flex-col gap-4 lg:w-3/5 px-5 lg:px-7 lg:py-5">
                                <h2 className='font-semibold text-xl'>Basic Information</h2>
                                <form className='bg-white  rounded-sm w-full max-h-screen overflow-y-auto py-1.5'>
                                    <div className='flex flex-col gap-6'>
                                        <TextField label="Name" variant='outlined' value={formData.name.value} onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, name: { value: e.target.value, error: false, helperText: "" } }))
                                        }} error={formData.name.error} helperText={formData.name.helperText} />
                                        <div className='flex flex-col lg:flex-row gap-3 w-full'>
                                            <TextField label="Mode" variant='outlined' value={formData.mode.value} select fullWidth onChange={(e) => {
                                                setFormData((prev) => ({ ...prev, mode: { value: e.target.value, error: false, helperText: "" } }))
                                            }} error={formData.mode.error} helperText={formData.mode.helperText}>
                                                {modeOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField label="Phone" variant='outlined' value={formData.phone.value} fullWidth onChange={(e) => {
                                                setFormData((prev) => ({ ...prev, phone: { value: e.target.value, error: false, helperText: "" } }))
                                            }} error={formData.phone.error} helperText={formData.phone.helperText} />
                                        </div>
                                        <div className='flex flex-col lg:flex-row gap-3'>
                                            <TextField label="Email" variant='outlined' value={formData.email.value} fullWidth onChange={(e) => {
                                                setFormData((prev) => ({ ...prev, email: { value: e.target.value, error: false, helperText: "" } }))
                                            }} error={formData.email.error} helperText={formData.email.helperText} />
                                            <TextField label="Website" variant='outlined' value={formData.website.value} fullWidth onChange={(e) => {
                                                setFormData((prev) => ({ ...prev, website: { value: e.target.value, error: false, helperText: "" } }))
                                            }} error={formData.website.error} helperText={formData.website.helperText} />
                                        </div>
                                        <TextField label="Address" variant='outlined' value={formData.address.value} multiline maxRows={4} minRows={4} onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, address: { value: e.target.value, error: false, helperText: "" } }))
                                        }} error={formData.address.error} helperText={formData.address.helperText} />
                                    </div>
                                </form>
                            </div>
                            <div className="flex flex-col gap-4 px-5 lg:px-7 lg:py-5 lg:w-2/5">
                                <h2 className='font-semibold text-xl'>Display image</h2>
                                <div className={`border-2 border-dashed rounded-sm p-4 flex flex-col items-center justify-center min-h-[220px] transition-all duration-300 ${imageError ? 'border-red-500 bg-red-50/10' : 'border-black/30 bg-gray-50/50'} h-full`}>
                                    {imagePreview ? (
                                        <div className="flex flex-col items-center gap-3 w-full">
                                            <div className="relative group w-full max-h-[270px] overflow-hidden rounded-md flex justify-center bg-gray-100 border border-gray-200">
                                                <img
                                                    src={imagePreview.previewUrl}
                                                    alt="Image preview"
                                                    className="max-h-[250px] max-w-full rounded-md object-contain p-1"
                                                />
                                            </div>
                                            <div className='flex justify-between w-full items-center'>

                                                <div className="text-left w-full px-2">
                                                    <p className="text-sm font-semibold text-gray-700 truncate max-w-[250px]" title={imagePreview.file?.name || (imagePreview.previewUrl ? imagePreview.previewUrl.substring(imagePreview.previewUrl.lastIndexOf('/') + 1) : "image")}>
                                                        {imagePreview.file?.name || (imagePreview.previewUrl ? imagePreview.previewUrl.substring(imagePreview.previewUrl.lastIndexOf('/') + 1) : "image")}
                                                    </p>
                                                    {imagePreview.file && (
                                                        <p className="text-xs text-gray-500">
                                                            {imagePreview.file.size > 1024 * 1024
                                                                ? `${(imagePreview.file.size / (1024 * 1024)).toFixed(2)} MB`
                                                                : `${(imagePreview.file.size / 1024).toFixed(2)} KB`}
                                                        </p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<MdDelete />}
                                                    onClick={handleRemoveImage}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center gap-3 cursor-pointer w-full h-full py-6">
                                            <MdCloudUpload className="text-5xl text-gray-400 hover:text-blue-500 transition-colors" />
                                            <div className="text-center">
                                                <span className="text-sm font-medium text-blue-600 hover:underline">Choose a file</span>
                                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 2MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFile(file);
                                                }}
                                            />
                                        </label>
                                    )}
                                    {imageError && (
                                        <div className="text-red-500 text-xs font-semibold mt-3 text-center">
                                            {imageError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 px-5 lg:px-7 lg:py-5">
                            <h2 className='font-semibold text-xl'>Location</h2>
                            <div className={`h-[350px] lg:h-[550px] overflow-hidden rounded-sm border ${locationError ? 'border-red-500' : 'border-transparent'}`}>
                                <MapContainer center={defaultCenter} zoom={10} scrollWheelZoom={true}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {selectedPosition && (
                                        <Marker position={selectedPosition}>
                                            <Popup>
                                                Selected Location
                                            </Popup>
                                        </Marker>
                                    )}
                                    <SetLocation />
                                    <MapRecenter position={selectedPosition} />
                                </MapContainer>
                            </div>
                            {locationError && (
                                <div className="text-red-500 text-xs lg:text-sm">
                                    {locationError}
                                </div>
                            )}
                        </div>
                        <div className='flex px-5 lg:px-7 lg:py-5 w-full justify-center lg:justify-end pt-4'>
                            <Button variant='contained' className='h-12 w-full lg:w-100' onClick={handleSubmit}>
                                {isEditMode ? "Update" : "Submit"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default RestaurantPage;