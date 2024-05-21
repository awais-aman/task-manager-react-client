import React from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "routes/ProtectedRoute";
import LoginSignupPage from "modules/Authorization";
import NotFoundPage from "components/shared/Error404";
import Layout from "components/layouts";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" exact element={<Layout />} />
      </Route>
      <Route path="/login" element={<LoginSignupPage isLogin />} />
      <Route path="/sign-up" element={<LoginSignupPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
