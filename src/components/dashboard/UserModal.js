import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Lock, Briefcase, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const UserModal = ({
    isOpen,
    onClose,
    onSubmit,
    user = null,
    mode = "add",
}) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "client",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && mode === "edit") {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                role: user.role || "client",
                password: "", // Don't populate password for edit
            });
        } else {
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                role: "client",
            });
        }
        setError("");
    }, [user, mode, isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (mode === "add" && !formData.password) {
            setError("Password is required");
            return;
        }

        if (mode === "add" && formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!formData.first_name || !formData.last_name || !formData.email) {
            setError("Please fill in all required fields");
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 w-full max-w-2xl"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    {mode === "add"
                                        ? "Add New User"
                                        : "Edit User"}
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            First Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                name="first_name"
                                                placeholder="John"
                                                className="pl-10"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                required
                                                disabled={
                                                    loading || mode === "edit"
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Last Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                name="last_name"
                                                placeholder="Doe"
                                                className="pl-10"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                required
                                                disabled={
                                                    loading || mode === "edit"
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {mode === "edit" && (
                                    <p className="text-xs text-muted-foreground">
                                        * Name fields cannot be changed by
                                        admin. Users must update their own
                                        profiles.
                                    </p>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="user@example.com"
                                            className="pl-10"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={
                                                loading || mode === "edit"
                                            }
                                        />
                                    </div>
                                    {mode === "edit" && (
                                        <p className="text-xs text-muted-foreground">
                                            Email cannot be changed
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                {mode === "add" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                name="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                minLength={8}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Minimum 8 characters
                                        </p>
                                    </div>
                                )}

                                {/* Role */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Role *
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-fitness-orange"
                                            required
                                            disabled={loading}
                                        >
                                            <option value="client">
                                                Client
                                            </option>
                                            <option value="trainer">
                                                Trainer
                                            </option>
                                            <option value="gym_owner">
                                                Gym Owner
                                            </option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
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
                                            ? "Add User"
                                            : "Update User"}
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

export default UserModal;
