import { useEffect } from 'react';
import { TicketManagement } from '../components/TicketManagement';
import { AdminHeader } from '../layouts/AdminHeader';

export const AdminPage = () => {
  
  useEffect(() => {
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TicketManagement/>
      </main>
    </div>
  );
}
