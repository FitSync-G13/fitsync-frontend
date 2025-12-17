import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    FileText,
    Plus,
    Trash2,
    AlertCircle,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const GymModal = ({ isOpen, onClose, onSubmit, gym = null, mode = "add" }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        phone: "",
        email: "",
        website: "",
        address: {
            street: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
        },
        amenities: [],
    });
    const [newAmenity, setNewAmenity] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (gym && mode === "edit") {
            setFormData({
                name: gym.name || "",
                description: gym.description || "",
                phone: gym.phone || "",
                email: gym.email || "",
                website: gym.website || "",
                address: gym.address || {
                    street: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "",
                },
                amenities: gym.amenities || [],
            });
        } else {
            setFormData({
                name: "",
                description: "",
                phone: "",
                email: "",
                website: "",
                address: {
                    street: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "",
                },
                amenities: [],
            });
        }
        setError("");
        setNewAmenity("");
    }, [gym, mode, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleAddAmenity = () => {
        if (newAmenity.trim()) {
            setFormData({
                ...formData,
                amenities: [...formData.amenities, newAmenity.trim()],
            });
            setNewAmenity("");
        }
    };

    const handleRemoveAmenity = (index) => {
        setFormData({
            ...formData,
            amenities: formData.amenities.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name) {
            setError("Gym name is required");
            return;
        }

        if (
            !formData.address.street ||
            !formData.address.city ||
            !formData.address.state ||
            !formData.address.postal_code ||
            !formData.address.country
        ) {
            setError("Please fill in all address fields");
            return;
        }

        setLoading(true);

        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 w-full max-w-3xl my-8"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    {mode === "add"
                                        ? "Add New Gym"
                                        : "Edit Gym"}
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="h-8 w-8"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Basic Information
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Gym Name *
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                name="name"
                                                placeholder="FitZone Gym"
                                                className="pl-10"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Description
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <textarea
                                                name="description"
                                                placeholder="A brief description of the gym..."
                                                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-fitness-orange min-h-[100px]"
                                                value={formData.description}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Contact Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Phone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="+1234567890"
                                                    className="pl-10"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    placeholder="gym@example.com"
                                                    className="pl-10"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Website
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="url"
                                                name="website"
                                                placeholder="https://gym-website.com"
                                                className="pl-10"
                                                value={formData.website}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Address *
                                    </h3>

                                    <div className="space-y-2">
                                        <Input
                                            type="text"
                                            name="address.street"
                                            placeholder="Street Address"
                                            value={formData.address.street}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            name="address.city"
                                            placeholder="City"
                                            value={formData.address.city}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                        <Input
                                            type="text"
                                            name="address.state"
                                            placeholder="State/Province"
                                            value={formData.address.state}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            name="address.postal_code"
                                            placeholder="Postal Code"
                                            value={formData.address.postal_code}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                        <Input
                                            type="text"
                                            name="address.country"
                                            placeholder="Country"
                                            value={formData.address.country}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Amenities
                                    </h3>

                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Add amenity (e.g., Free WiFi, Parking)"
                                            value={newAmenity}
                                            onChange={(e) =>
                                                setNewAmenity(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddAmenity();
                                                }
                                            }}
                                            disabled={loading}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddAmenity}
                                            disabled={
                                                loading || !newAmenity.trim()
                                            }
                                            className="gradient-orange"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {formData.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.amenities.map(
                                                (amenity, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg"
                                                    >
                                                        <span className="text-sm">
                                                            {amenity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveAmenity(
                                                                    index
                                                                )
                                                            }
                                                            disabled={loading}
                                                            className="text-destructive hover:text-destructive/80"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 gradient-orange"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Saving..."
                                            : mode === "add"
                                            ? "Add Gym"
                                            : "Update Gym"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GymModal;
