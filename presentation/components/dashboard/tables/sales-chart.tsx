"use client";

import { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export function SalesChart() {
  const chartRef = useRef<ChartJS<"line">>(null);

  const data: ChartData<"line"> = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Sucursal Principal",
        data: [3500, 4200, 3800, 5100, 4800, 5500],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        tension: 0.3,
      },
      {
        label: "Sucursal Norte",
        data: [2800, 3100, 2900, 3400, 3200, 3800],
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.5)",
        tension: 0.3,
      },
      {
        label: "Sucursal Sur",
        data: [1900, 2300, 2100, 2600, 2400, 2900],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "$" + value,
        },
      },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
