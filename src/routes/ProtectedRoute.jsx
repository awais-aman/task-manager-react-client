import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Auth from "modules/Authorization";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  return user ? <Outlet /> : <Auth isLogin />;
};

export default ProtectedRoute;
