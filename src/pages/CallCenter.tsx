import { useState } from 'react';
import { Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useNichosStore } from '../stores/nichosStore';

interface CallCenterAgent {
  id: number;
  name: string;
  phone: string;
  email: string;
  nichos: string[];
  commission: number;
  gmbProfiles: string[];
}

export default function CallCenter() {
  const [agents, setAgents] = useState<CallCenterAgent[]>([
    {
      id: 1,
      name: 'Carlos López',
      phone: '+34 611234567',
      email: 'carlos@example.com',
      nichos: ['Restaurantes', 'Hoteles'],
      commission: 20,
      gmbProfiles: ['Taller Centro', 'Taller Norte']
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newAgent, setNewAgent] = useState<Partial<CallCenterAgent>>({});
  const { categories } = useNichosStore();

  const handleAddAgent = () => {
    if (newAgent.name && newAgent.phone && newAgent.email && newAgent.commission) {
      const newId = Math.max(...agents.map(a => a.id), 0) + 1;
      setAgents([...agents, {
        id: newId,
        name: newAgent.name,
        phone: newAgent.phone,
        email: newAgent.email,
        nichos: newAgent.nichos || [],
        commission: newAgent.commission,
        gmbProfiles: newAgent.gmbProfiles || []
      }]);
      setNewAgent({});
    }
  };

  const handleEditAgent = (agent: CallCenterAgent) => {
    setEditingId(agent.id);
    setNewAgent(agent);
  };

  const handleSaveAgent = () => {
    if (editingId && newAgent.name && newAgent.phone && newAgent.email && newAgent.commission) {
      setAgents(agents.map(agent =>
        agent.id === editingId ? { ...agent, ...newAgent } as CallCenterAgent : agent
      ));
      setEditingId(null);
      setNewAgent({});
    }
  };

  const handleDeleteAgent = (id: number) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  return (
    <div className="ml-12 w-full space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Gestión de Agentes de Call Center</h2>

          {/* Add new agent form */}
          <div className="mb-6 grid grid-cols-7 gap-4">
            <input
              type="text"
              value={newAgent.name || ''}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              placeholder="Nombre"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="tel"
              value={newAgent.phone || ''}
              onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
              placeholder="Teléfono"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="email"
              value={newAgent.email || ''}
              onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
              placeholder="Email"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <select
              multiple
              value={newAgent.nichos || []}
              onChange={(e) => setNewAgent({ 
                ...newAgent, 
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
              value={newAgent.commission || ''}
              onChange={(e) => setNewAgent({ ...newAgent, commission: Number(e.target.value) })}
              placeholder="Comisión %"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newAgent.gmbProfiles?.join(', ') || ''}
              onChange={(e) => setNewAgent({ ...newAgent, gmbProfiles: e.target.value.split(',').map(profile => profile.trim()) })}
              placeholder="Perfiles GMB"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleAddAgent}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Agents table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nichos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comisión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfiles GMB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map(agent => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {agent.nichos.map(nicho => (
                          <span
                            key={nicho}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {nicho}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.commission}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.gmbProfiles.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="text-gray-400 hover:text-blue-600"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
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
