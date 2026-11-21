import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Client Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import UserProfile from "./pages/UserProfile";

// Layouts
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./admin/layouts/AdminLayout";

// Admin Pages
import Dashboard from "./admin/pages/Dashboard";
import AdminProduct from "./admin/pages/AdminProduct";
import AddProduct from "./admin/pages/AddProduct";
import Customers from "./admin/pages/Customers";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Categories from "./pages/Categories";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./admin/pages/Orders";
import MyOrders from "./pages/MyOrders";

function App() {
  return (
    <>
      <Toaster position="top-center" />

      <Routes>

        {/* Shared Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Website */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        {/* Protected Admin Dashboard */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>

      </Routes>
    </>
  );
}

export default App;