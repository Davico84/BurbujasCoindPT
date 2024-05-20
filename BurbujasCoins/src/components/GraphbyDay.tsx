import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler, // Importar el elemento Filler
  Chart,
} from "chart.js";


// Registrar todos los elementos necesarios, incluyendo Filler
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface GraphbyDayProps {
  currency: string;
}
import { useParams } from "react-router-dom";
const GraphbyDay: React.FC<GraphbyDayProps> = ({ currency }) => {
  const [chartData, setChartData] = useState<any>({});
  const { id } = useParams(); 
console.log(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`)
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((chartData) => {
        // Procesa los datos del gráfico
        const prices = chartData.prices;

        const labels = prices.map((price: any) => {
          // Convierte la marca de tiempo a una fecha legible
          const date = new Date(price[0]);
          return `${date.getHours()}:${date.getMinutes()}`;
        });

        const data = prices.map((price: any) => price[1]);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `Precio de ${id} (USD)`,
              data: data,
              borderColor: "#FF3A33",
              backgroundColor: "rgba(255, 58, 51, 0.4)", // Utiliza el gradiente aquí
              pointBackgroundColor: "rgba(255, 58, 51, 0.9)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(75, 192, 192, 1)",
              fill: true, // Rellenar el área debajo de la línea
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  return (
    <div className="container mx-auto box-sizing: border-box bg-slate-100 rounded">
      <h1 className="text-3xl font-bold text-center mb-4 text-black">
        Grafico de Precios por tiempo
      </h1>
      {chartData.labels ? <Line data={chartData} /> : <p>Cargando...</p>}
    </div>
  );
};

export default GraphbyDay;
