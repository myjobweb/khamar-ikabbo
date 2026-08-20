import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AdminLogin } from './AdminLogin';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminProductManagement } from './AdminProductManagement';
import { AdminCategoryManagement } from './AdminCategoryManagement';
import { AdminSubcategoryManagement } from './AdminSubcategoryManagement';
import { AdminComboManagement } from './AdminComboManagement';
import { AdminOrdersManagement } from './AdminOrdersManagement';
import { AdminAbandonedOrders } from './AdminAbandonedOrders';
import { AdminCustomersManagement } from './AdminCustomersManagement';
import { AdminInventoryManagement } from './AdminInventoryManagement';
import { AdminSiteSettings } from './AdminSiteSettings';
import { AdminProfile } from './AdminProfile';

export const AdminLayout: React.FC = () => {
  const { adminUser, adminTab, setAdminTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in, show the Admin Login form
  if (!adminUser) {
    return <AdminLogin />;
  }

  // Active tab renderer
  const renderTabContent = () => {
    switch (adminTab) {
      case 'dashboard':
        return <AdminDashboardOverview />;
      case 'products':
        return <AdminProductManagement />;
      case 'categories':
        return <AdminCategoryManagement />;
      case 'subcategories':
        return <AdminSubcategoryManagement />;
      case 'combinations':
        return <AdminComboManagement />;
      case 'orders':
        return <AdminOrdersManagement />;
      case 'abandoned-orders':
        return <AdminAbandonedOrders />;
      case 'customers':
        return <AdminCustomersManagement />;
      case 'inventory':
        return <AdminInventoryManagement />;
      case 'settings':
        return <AdminSiteSettings />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <AdminDashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top Navbar */}
        <AdminTopNav onMenuClick={() => setSidebarOpen(true)} />

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};
