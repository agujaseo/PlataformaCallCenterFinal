import { useState } from 'react';

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [nicho, setNicho] = useState('all');
  const [technician, setTechnician] = useState('all');

  // Simulated data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Tickets Resolved',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tickets Resolved Over Time',
      },
    },
  };

  return (
    <div className="ml-12 w-full">
      <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>
      <div className="mb-4">
        <label className="mr-2">Período de tiempo:</label>
        <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="mr-4">
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>

        <label className="mr-2">Nicho:</label>
        <select value={nicho} onChange={(e) => setNicho(e.target.value)} className="mr-4">
          <option value="all">Todos</option>
          <option value="restaurants">Restaurantes</option>
          <option value="hotels">Hoteles</option>
          {/* Add more options as needed */}
        </select>

        <label className="mr-2">Técnico:</label>
        <select value={technician} onChange={(e) => setTechnician(e.target.value)}>
          <option value="all">Todos</option>
          <option value="juan">Juan Pérez</option>
          <option value="ana">Ana García</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow p-6 w-full">
        {/* Uncomment the Bar component and import statements when using in a real environment */}
        {/* <Bar data={data} options={options} /> */}
        <p>Gráfica de ejemplo (integrar con Chart.js en un entorno real)</p>
      </div>
    </div>
  );
}
