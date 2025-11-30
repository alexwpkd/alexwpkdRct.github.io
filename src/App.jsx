// src/App.jsx
import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import Shop from "./components/Shop";
import CarritoPage from "./pages/CarritoPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./components/Admin";
import ProductList from "./components/ProductList";
import Product from "./components/Product";

function App() {
  const { auth, logout } = useAuth();

  return (
    <div>
      <nav
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Link to="/shop">Tienda</Link>
        <Link to="/carrito">Carrito</Link>

        {auth?.rol === "ADMIN" && (
          <>
            <Link to="/admin">Panel Admin</Link>
            <Link to="/admin/productos">Productos Admin</Link>
          </>
        )}

        <div style={{ marginLeft: "auto" }}>
          {auth.token ? (
            <>
              <span style={{ marginRight: "10px" }}>
                Rol: {auth.rol || "Usuario"}
              </span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />

        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <CarritoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;