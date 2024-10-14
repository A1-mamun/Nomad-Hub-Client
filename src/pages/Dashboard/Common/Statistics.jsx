import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import AdminStatistics from "../Admin/AdminStatistics";
import HostStatistics from "../Host/HostStatistics";
import GuestStatistics from "../Guest/GuestStatistics";

const Statistics = () => {
  const [role, isLoading] = useRole();

  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      {role === "Admin" && <AdminStatistics />}
      {role === "Host" && <HostStatistics />}
      {role === "Guest" && <GuestStatistics />}
    </>
  );
};

export default Statistics;
