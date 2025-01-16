import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LogOut, Settings, PhoneCall, Wrench, Building2, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function NavItem({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="whitespace-nowrap">{children}</span>
    </Link>
  );
}

export default function Layout() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-[240px] bg-white shadow-lg lg:static lg:block">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
          <h1 className="text-lg font-semibold whitespace-nowrap">Gestión de Servicios</h1>
        </div>
        <nav className="p-4 space-y-1">
          <NavItem to="/dashboard" icon={Layers}>
            Dashboard
          </NavItem>
          <NavItem to="/call-center" icon={PhoneCall}>
            Call Center
          </NavItem>
          <NavItem to="/tecnicos" icon={Wrench}>
            Técnicos
          </NavItem>
          <NavItem to="/perfiles-gmb" icon={Building2}>
            Perfiles GMB
          </NavItem>
          <NavItem to="/nichos" icon={Layers}>
            Nichos
          </NavItem>
          <NavItem to="/configuracion" icon={Settings}>
            Configuración
          </NavItem>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: '240px' }}>
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center px-4">
          <div className="flex-1 flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-x-hidden" style={{ paddingLeft: '50px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
