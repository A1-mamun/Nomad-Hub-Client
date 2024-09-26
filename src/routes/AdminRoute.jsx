import useRole from "../hooks/useRole";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading) return <LoadingSpinner />;
  if (role === "Admin") return children;
  return <Navigate to="/dashboard"></Navigate>;
};

AdminRoute.propTypes = {
  children: PropTypes.element,
};

export default AdminRoute;
