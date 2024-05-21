import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectIsSignedIn, sessionExpired } from "store/slices/authSlice";
import { tokenExpiresAt } from "helpers/session";

// setTimeout overflows above ~24.8 days.
const MAX_TIMEOUT = 2 ** 31 - 1;

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const signedIn = useSelector(selectIsSignedIn);
  const expiresAt = useSelector((state) => tokenExpiresAt(state.auth.token));

  useEffect(() => {
    if (!expiresAt) return undefined;
    const timer = setTimeout(
      () => dispatch(sessionExpired()),
      Math.min(Math.max(expiresAt - Date.now(), 0), MAX_TIMEOUT)
    );
    return () => clearTimeout(timer);
  }, [dispatch, expiresAt]);

  return signedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
