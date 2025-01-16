import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function Nichos() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Restaurantes' },
    { id: 2, name: 'Hoteles' },
    { id: 3, name: 'Clínicas Dentales' },
    { id: 4, name: 'Gimnasios' },
    { id: 5, name: 'Talleres Mecánicos' },
    { id: 6, name: 'Inmobiliarias' },
    { id: 7, name: 'Peluquerías y Salones de Belleza' }
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      setCategories(categories.map(cat => 
        cat.id === editingId ? { ...cat, name: editValue.trim() } : cat
      ));
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newId = Math.max(...categories.map(c => c.id), 0) + 1;
      setCategories([...categories, { id: newId, name: newCategory.trim() }]);
      setNewCategory('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Categorías GMB</h2>
        </div>
        
        <div className="p-6">
          {/* Add new category */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </button>
          </div>

          {/* Categories list */}
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                {editingId === category.id ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{category.name}</span>
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
