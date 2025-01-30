import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Login";
import ChooseStore from "./components/ChooseStore";
import SalesOutlet from "./SalesOutlet";
import ServiceCenter from "./ServiceCenter";
import Invoice from "./Invoice";
import ViewTicket from "./ViewTicket";
import UnauthorizedPage from "./components/UnauthorizedPage";
import AddProduct from "./AddProduct";
import ProductList from "./components/ProductList";
import EditProduct from "./components/editProduct";
import AddStock from "./components/AddStock";
import ViewStock from "./components/ViewStock";
import EditStock from "./components/EditStock";
import PrintInvoice from "./components/PrintInvoice";
import OutletReturn from "./OutletReturn";
import ViewInvoice from "./components/ViewInvoice";



 


const App = () => {


  return (
    <Router>
      <Routes>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<Login />} />

        <Route path="/inv" element={<PrintInvoice />} />


        <Route path="/sales-return" element={<OutletReturn/>} />

        <Route path="/view-invoice/:id" element={<ViewInvoice/>} />
        <Route
          path="/AddStock"
          element={
            <ProtectedRoute accessType="admin">
              <AddStock />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stocks/:id/edit"
          element={
            <ProtectedRoute accessType="admin">
              <EditStock />
            </ProtectedRoute>
          }
        />

        <Route
          path="/viewStock"
          element={
            <ProtectedRoute accessType="admin">
              <ViewStock />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute accessType="admin">
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute accessType="admin">
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-product"
          element={
            <ProtectedRoute accessType="admin">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/choose-store"
          element={
            <ProtectedRoute accessType="admin">
              <ChooseStore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service-center"
          element={
            <ProtectedRoute accessType="technician">
              <ServiceCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-outlet"
          element={
            <ProtectedRoute accessType={["admin", "cashier"]}>
              <SalesOutlet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice"
          element={
            <ProtectedRoute accessType={["admin", "cashier"]}>
              <Invoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-ticket/:id"
          element={
            <ProtectedRoute accessType="technician">
              <ViewTicket />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
