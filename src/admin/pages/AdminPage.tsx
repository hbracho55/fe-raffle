import { useState, useEffect } from 'react';
import { TicketManagement } from '../components/TicketManagement';
import { RaffleManagement } from '../components/RaffleManagement';
import { AdminHeader } from '../layouts/AdminHeader';

interface Raffle {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ticket_price: number;
  total_tickets: number;
  tickets_sold: number;
  draw_date: string;
  status: 'active' | 'completed' | 'cancelled';
  winner_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   // checkAuth();
  }, []);

  const checkAuth = async () => {
   /* const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.is_admin) {
        setIsAuthenticated(true);
      }
    }
    setLoading(false);*/
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    //return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {'3d38ecd8-3fdc-4bda-a8ce-c6d8f21b51c7' ? (
          <TicketManagement
            raffle={'12d179fc-ab9b-43c3-928e-9dc064bdd98e'}
            onBack={() => setSelectedRaffle(null)}
          />
        ) : (
          <RaffleManagement onSelectRaffle={setSelectedRaffle} />
        )}
      </main>
    </div>
  );
}
