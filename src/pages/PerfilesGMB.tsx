import { useState } from 'react';
import { Plus, Pencil, Trash2, Save } from 'lucide-react';

interface Location {
  id: number;
  name: string;
}

interface Profile {
  id: number;
  name: string;
  url: string;
  phone: string;
  technician: string;
  pricePerCall: number;
}

export default function PerfilesGMB() {
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: 'Madrid' },
    { id: 2, name: 'Barcelona' },
    { id: 3, name: 'Valencia' }
  ]);
  
  const [activeLocation, setActiveLocation] = useState<number>(1);
  const [profiles, setProfiles] = useState<Record<number, Profile[]>>({
    1: [
      { id: 1, name: 'Taller Centro', url: 'https://g.page/example1', phone: '+34 911234567', technician: 'Juan Pérez', pricePerCall: 25 },
      { id: 2, name: 'Taller Norte', url: 'https://g.page/example2', phone: '+34 911234568', technician: 'Ana García', pricePerCall: 30 }
    ],
    2: [
      { id: 1, name: 'Taller Eixample', url: 'https://g.page/example3', phone: '+34 931234567', technician: 'Marc Vila', pricePerCall: 28 }
    ],
    3: []
  });

  const [editingLocation, setEditingLocation] = useState<number | null>(null);
  const [newLocationName, setNewLocationName] = useState('');
  const [editingProfile, setEditingProfile] = useState<number | null>(null);
  const [newProfile, setNewProfile] = useState<Partial<Profile>>({});

  // Location management
  const handleAddLocation = () => {
    if (newLocationName.trim()) {
      const newId = Math.max(...locations.map(l => l.id), 0) + 1;
      setLocations([...locations, { id: newId, name: newLocationName.trim() }]);
      setProfiles({ ...profiles, [newId]: [] });
      setNewLocationName('');
    }
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location.id);
    setNewLocationName(location.name);
  };

  const handleSaveLocation = () => {
    if (newLocationName.trim() && editingLocation) {
      setLocations(locations.map(loc => 
        loc.id === editingLocation ? { ...loc, name: newLocationName.trim() } : loc
      ));
      setEditingLocation(null);
      setNewLocationName('');
    }
  };

  const handleDeleteLocation = (id: number) => {
    setLocations(locations.filter(loc => loc.id !== id));
    const newProfiles = { ...profiles };
    delete newProfiles[id];
    setProfiles(newProfiles);
    if (activeLocation === id) {
      setActiveLocation(locations[0]?.id);
    }
  };

  // Profile management
  const handleAddProfile = () => {
    if (newProfile.name && newProfile.url && newProfile.phone && newProfile.technician && newProfile.pricePerCall) {
      const locationProfiles = profiles[activeLocation] || [];
      const newId = Math.max(...locationProfiles.map(p => p.id), 0) + 1;
      const profileToAdd = {
        id: newId,
        ...newProfile
      } as Profile;
      
      setProfiles({
        ...profiles,
        [activeLocation]: [...locationProfiles, profileToAdd]
      });
      setNewProfile({});
    }
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile.id);
    setNewProfile(profile);
  };

  const handleSaveProfile = () => {
    if (editingProfile && newProfile.name && newProfile.url && newProfile.phone && newProfile.technician && newProfile.pricePerCall) {
      setProfiles({
        ...profiles,
        [activeLocation]: profiles[activeLocation].map(profile =>
          profile.id === editingProfile ? { ...profile, ...newProfile } as Profile : profile
        )
      });
      setEditingProfile(null);
      setNewProfile({});
    }
  };

  const handleDeleteProfile = (id: number) => {
    setProfiles({
      ...profiles,
      [activeLocation]: profiles[activeLocation].filter(profile => profile.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Perfiles GMB por Localidad</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Nueva localidad"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={handleAddLocation}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Añadir
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {locations.map(location => (
              <div
                key={location.id}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${
                  activeLocation === location.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                {editingLocation === location.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveLocation()}
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      onClick={() => setActiveLocation(location.id)}
                      className="mr-2"
                    >
                      {location.name}
                    </span>
                    <button
                      onClick={() => handleEditLocation(location)}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Add new profile form */}
          <div className="mb-6 grid grid-cols-5 gap-4">
            <input
              type="text"
              value={newProfile.name || ''}
              onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
              placeholder="Nombre"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newProfile.url || ''}
              onChange={(e) => setNewProfile({ ...newProfile, url: e.target.value })}
              placeholder="URL GMB"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newProfile.phone || ''}
              onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
              placeholder="Teléfono"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newProfile.technician || ''}
              onChange={(e) => setNewProfile({ ...newProfile, technician: e.target.value })}
              placeholder="Técnico"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newProfile.pricePerCall || ''}
                onChange={(e) => setNewProfile({ ...newProfile, pricePerCall: Number(e.target.value) })}
                placeholder="€/aviso"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                onClick={handleAddProfile}
                className="flex-shrink-0 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Profiles table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL GMB</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">€/Aviso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(profiles[activeLocation] || []).map(profile => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {profile.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.technician}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.pricePerCall}€</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProfile(profile)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="text-gray-400 hover:text-red-600"
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
