import { useState, useEffect } from "react";

import {
    Settings,
    Store,
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Lock,
} from "lucide-react";

import toast from "react-hot-toast";
import API_URL from "../../config/api";
import { useAuth } from "../../context/AuthContext";


const AdminSettings = () => {

    const { user, setUser } = useAuth();


    // Store State
    const [store, setStore] = useState({
        storeName: "CARTVIA",
        email: "",
        phone: "",
        address: "",
        description: "Your one-stop online shopping destination.",
    });


    // Admin State
    const [admin, setAdmin] = useState({
        name: "",
        email: "",
    });


    const [storeLoading, setStoreLoading] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false);


    // Fetch Store Settings
    useEffect(() => {

        const fetchSettings = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/admin/store-settings`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load settings");
                }

                if (data.settings) {

                    setStore({
                        storeName: data.settings.storeName || "CARTVIA",
                        email: data.settings.email || "",
                        phone: data.settings.phone || "",
                        address: data.settings.address || "",
                        description: data.settings.description || "",
                    });

                }

            } catch (error) {

                console.error("Settings Error:", error);
                toast.error(error.message);

            }

        };

        fetchSettings();

    }, []);


    // Fetch Admin Details from AuthContext
    useEffect(() => {

        if (user) {

            setAdmin({
                name: user.name || "",
                email: user.email || "",
            });

        }

    }, [user]);


    // Store Input Change
    const handleStoreChange = (e) => {

        setStore({
            ...store,
            [e.target.name]: e.target.value,
        });

    };


    // Admin Input Change
    const handleAdminChange = (e) => {

        setAdmin({
            ...admin,
            [e.target.name]: e.target.value,
        });

    };


    // Save Store Settings
    const handleStoreSubmit = async (e) => {

        e.preventDefault();

        try {

            setStoreLoading(true);

            const response = await fetch(
                `${API_URL}/admin/store-settings`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify(store),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to save settings");
            }

            setStore({
                storeName: data.settings.storeName || "CARTVIA",
                email: data.settings.email || "",
                phone: data.settings.phone || "",
                address: data.settings.address || "",
                description: data.settings.description || "",
            });

            toast.success("Store settings saved successfully!");

        } catch (error) {

            console.error("Save Settings Error:", error);
            toast.error(error.message);

        } finally {

            setStoreLoading(false);

        }

    };


    // Update Admin Profile
    const handleAdminSubmit = async (e) => {

        e.preventDefault();

        try {

            setAdminLoading(true);

            const response = await fetch(
                `${API_URL}/admin/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        ...admin,
                        phone: user?.phone || "",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Update AuthContext
            setUser(data.user);

            toast.success("Admin profile updated successfully!");

        } catch (error) {

            console.error("Profile Update Error:", error);
            toast.error(error.message);

        } finally {

            setAdminLoading(false);

        }

    };


    const inputStyle =
        "w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition";


    return (

        <div className="space-y-8">


            {/* Header */}
            <div>

                <div className="flex items-center gap-3">

                    <div className="bg-violet-100 p-3 rounded-xl">

                        <Settings
                            className="text-violet-700"
                            size={25}
                        />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            Settings
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Manage your store and administrator information.
                        </p>

                    </div>

                </div>

            </div>



            {/* Store Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">


                <div className="flex items-center gap-3 mb-6">

                    <Store
                        className="text-violet-600"
                        size={22}
                    />

                    <h2 className="text-xl font-bold text-gray-800">
                        Store Information
                    </h2>

                </div>


                <form
                    onSubmit={handleStoreSubmit}
                    className="space-y-5"
                >


                    {/* Store Name */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store Name
                        </label>

                        <input
                            type="text"
                            name="storeName"
                            value={store.storeName}
                            onChange={handleStoreChange}
                            className={inputStyle}
                            required
                        />

                    </div>



                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Email
                            </label>

                            <div className="relative">

                                <Mail
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={store.email}
                                    onChange={handleStoreChange}
                                    placeholder="store@example.com"
                                    className={`${inputStyle} pl-10`}
                                    required
                                />

                            </div>

                        </div>



                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Phone
                            </label>

                            <div className="relative">

                                <Phone
                                    size={18}
                                    className="absolute left-3 top-3.5 text-gray-400"
                                />

                                <input
                                    type="tel"
                                    name="phone"
                                    value={store.phone}
                                    onChange={handleStoreChange}
                                    placeholder="Enter phone number"
                                    className={`${inputStyle} pl-10`}
                                    required
                                />

                            </div>

                        </div>

                    </div>



                    {/* Store Address */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store Address
                        </label>

                        <div className="relative">

                            <MapPin
                                size={18}
                                className="absolute left-3 top-3.5 text-gray-400"
                            />

                            <input
                                type="text"
                                name="address"
                                value={store.address}
                                onChange={handleStoreChange}
                                placeholder="Enter store address"
                                className={`${inputStyle} pl-10`}
                            />

                        </div>

                    </div>



                    {/* Store Description */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store Description
                        </label>

                        <textarea
                            name="description"
                            value={store.description}
                            onChange={handleStoreChange}
                            rows="3"
                            className={inputStyle}
                            placeholder="Enter store description"
                        />

                    </div>



                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={storeLoading}
                        className="flex items-center gap-2 bg-violet-600 text-white px-5 py-3 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                    >

                        <Save size={18} />

                        {storeLoading ? "Saving..." : "Save Store Settings"}

                    </button>


                </form>

            </div>




            {/* Admin Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">


                <div className="flex items-center gap-3 mb-6">

                    <User
                        className="text-violet-600"
                        size={22}
                    />

                    <h2 className="text-xl font-bold text-gray-800">
                        Admin Profile
                    </h2>

                </div>



                <form
                    onSubmit={handleAdminSubmit}
                    className="space-y-5"
                >


                    {/* Admin Name */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={admin.name}
                            onChange={handleAdminChange}
                            placeholder="Enter admin name"
                            className={inputStyle}
                            required
                        />

                    </div>



                    {/* Admin Email */}
                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={admin.email}
                            onChange={handleAdminChange}
                            placeholder="Enter admin email"
                            className={inputStyle}
                            required
                        />

                    </div>



                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={adminLoading}
                        className="flex items-center gap-2 bg-violet-600 text-white px-5 py-3 rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
                    >

                        <Save size={18} />

                        {adminLoading ? "Updating..." : "Save Admin Profile"}

                    </button>


                </form>

            </div>




            {/* Security */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">


                <div className="flex items-center gap-3 mb-4">

                    <Lock
                        className="text-violet-600"
                        size={22}
                    />

                    <h2 className="text-xl font-bold text-gray-800">
                        Security
                    </h2>

                </div>


                <p className="text-gray-500 text-sm mb-4">
                    Keep your administrator account secure by using a strong password.
                </p>


                <p className="text-sm text-gray-400">
                    Password management will be connected to your backend in the next step.
                </p>


            </div>


        </div>

    );

};


export default AdminSettings;