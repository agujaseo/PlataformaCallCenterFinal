import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, KeyRound } from 'lucide-react';
import { useNichosStore } from '../stores/nichosStore';

interface Technician {
  id: number;
  name: string;
  phone: string;
  email: string;
  nichos: string[];
  commission: number;
}

export default function Tecnicos() {
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: 1,
      name: 'Juan Pérez',
      phone: '+34 611234567',
      email: 'juan@example.com',
      nichos: ['Restaurantes', 'Hoteles'],
      commission: 25
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTechnician, setNewTechnician] = useState<Partial<Technician>>({});
  const { categories } = useNichosStore();

  const handleAddTechnician = () => {
    if (newTechnician.name && newTechnician.phone && newTechnician.email && newTechnician.commission) {
      const newId = Math.max(...technicians.map(t => t.id), 0) + 1;
      setTechnicians([...technicians, {
        id: newId,
        name: newTechnician.name,
        phone: newTechnician.phone,
        email: newTechnician.email,
        nichos: newTechnician.nichos || [],
        commission: newTechnician.commission
      }]);
      setNewTechnician({});
    }
  };

  const handleEditTechnician = (technician: Technician) => {
    setEditingId(technician.id);
    setNewTechnician(technician);
  };

  const handleSaveTechnician = () => {
    if (editingId && newTechnician.name && newTechnician.phone && newTechnician.email && newTechnician.commission) {
      setTechnicians(technicians.map(tech =>
        tech.id === editingId ? { ...tech, ...newTechnician } as Technician : tech
      ));
      setEditingId(null);
      setNewTechnician({});
    }
  };

  const handleDeleteTechnician = (id: number) => {
    setTechnicians(technicians.filter(tech => tech.id !== id));
  };

  const handleResetPassword = (email: string) => {
    // Aquí iría la lógica para resetear la contraseña
    console.log('Reseteando contraseña para:', email);
  };

  const handleSetPassword = (email: string) => {
    // Aquí iría la lógica para establecer la contraseña
    console.log('Estableciendo contraseña para:', email);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Gestión de Técnicos</h2>

          {/* Add new technician form */}
          <div className="mb-6 grid grid-cols-6 gap-4">
            <input
              type="text"
              value={newTechnician.name || ''}
              onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
              placeholder="Nombre"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="tel"
              value={newTechnician.phone || ''}
              onChange={(e) => setNewTechnician({ ...newTechnician, phone: e.target.value })}
              placeholder="Teléfono"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="email"
              value={newTechnician.email || ''}
              onChange={(e) => setNewTechnician({ ...newTechnician, email: e.target.value })}
              placeholder="Email"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <select
              multiple
              value={newTechnician.nichos || []}
              onChange={(e) => setNewTechnician({ 
                ...newTechnician, 
                nichos: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={newTechnician.commission || ''}
              onChange={(e) => setNewTechnician({ ...newTechnician, commission: Number(e.target.value) })}
              placeholder="Comisión %"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTechnician}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Technicians table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nichos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {technicians.map(technician => (
                  <tr key={technician.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{technician.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{technician.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{technician.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {technician.nichos.map(nicho => (
                          <span
                            key={nicho}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {nicho}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{technician.commission}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTechnician(technician)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTechnician(technician.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleSetPassword(technician.email)}
                          className="text-gray-400 hover:text-green-600"
                          title="Establecer contraseña"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(technician.email)}
                          className="text-gray-400 hover:text-yellow-600"
                          title="Resetear contraseña"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
