import { useEffect, useState } from "react";
import Chart from "./components/Chart";

function App() {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setCharts(data))
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {charts.length === 0 && <p>⏳ در حال بارگذاری داده‌ها...</p>}
      {charts.map((chart, idx) => (
        <div key={idx} style={{ marginBottom: "50px" }}>
          <h2>{chart.title}</h2>
          <Chart data={chart.data} />
        </div>
      ))}
    </div>
  );
}

export default App;
