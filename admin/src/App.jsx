import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AdminProduct from "./pages/AdminProduct";
import AddProduct from "./pages/AddProduct";
import AdminLogin from "./pages/AdminLogin";


const App = () => {

  return (
    <BrowserRouter>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#ffffff",
            color: "#333333",
          },
        }}
      />

      <Routes>

        <Route path="/login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/products" element={<AdminProduct />} />

          <Route path="/products/add" element={<AddProduct />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default App;