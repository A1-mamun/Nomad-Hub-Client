import { Chart } from "react-google-charts";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { tr } from "date-fns/locale";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const options = {
  title: "Sales Over Time",
  curveType: "function",
  legend: { position: "bottom" },
  series: [{ color: "#F43F5E" }],
};

const SalesLineChart = ({ data }) => {
  const [loading, setLoading] = useState(tr);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner smallHeight />
      ) : data.length > 1 ? (
        <Chart
          chartType="LineChart"
          width="100%"
          data={data}
          options={options}
        />
      ) : (
        <p className="text-center">Not Enough Data for this Section !</p>
      )}
    </>
  );
};
SalesLineChart.propTypes = {
  data: PropTypes.array,
};

export default SalesLineChart;
