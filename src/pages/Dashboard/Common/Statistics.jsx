import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import AdminStatistics from "../Admin/AdminStatistics";

const Statistics = () => {
  const [role, isLoading] = useRole();

  if (isLoading) return <LoadingSpinner />;
  return <>{role === "Admin" && <AdminStatistics />}</>;
};

export default Statistics;
