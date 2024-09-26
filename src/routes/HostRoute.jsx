import useRole from "../hooks/useRole";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const HostRoute = ({ children }) => {
  const [role, isLoading] = useRole();

  if (isLoading) return <LoadingSpinner />;
  if (role === "Host") return children;
  return <Navigate to="/dashboard"></Navigate>;
};

HostRoute.propTypes = {
  children: PropTypes.element,
};

export default HostRoute;
