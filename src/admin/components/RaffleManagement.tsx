import { useEffect, useState } from 'react';
import { Calendar, Ticket, Trophy, Users, Edit, Trash2 } from 'lucide-react';
//import { supabase, Raffle, TicketWithDetails } from '../lib/supabase';

interface RaffleManagementProps {
  onSelectRaffle: (raffle: Raffle) => void;
}

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

export const RaffleManagement = ({ onSelectRaffle }: RaffleManagementProps) => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    setLoading(true);
    /*const { data, error } = await supabase
      .from('raffles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching raffles:', error);
    } else {
      setRaffles(data || []);
    }
    setLoading(false);*/
  };

  const handleStatusChange = async (raffleId: string, newStatus: string) => {
    /*const { error } = await supabase
      .from('raffles')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', raffleId);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchRaffles();
    }*/
  };

  const handleDelete = async (raffleId: string) => {
    /*if (!confirm('¿Estás seguro de que deseas eliminar esta rifa?')) return;

    const { error } = await supabase
      .from('raffles')
      .delete()
      .eq('id', raffleId);

    if (error) {
      console.error('Error deleting raffle:', error);
    } else {
      fetchRaffles();
    }*/
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Rifas</h2>
        <div className="text-sm text-gray-600">
          Total de rifas: {raffles.length}
        </div>
      </div>

      <div className="grid gap-6">
        {raffles.map((raffle) => {
          const drawDate = new Date(raffle.draw_date);
          const percentageSold = (raffle.tickets_sold / raffle.total_tickets) * 100;

          return (
            <div
              key={raffle.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {raffle.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(raffle.status)}`}>
                        {raffle.status === 'active' ? 'Activa' : raffle.status === 'completed' ? 'Completada' : 'Cancelada'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{raffle.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{drawDate.toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Ticket className="w-4 h-4 mr-2" />
                        <span>${raffle.ticket_price}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{raffle.tickets_sold} / {raffle.total_tickets}</span>
                      </div>
                      <div className="flex items-center text-sm font-semibold text-blue-600">
                        <Trophy className="w-4 h-4 mr-2" />
                        <span>{percentageSold.toFixed(0)}% vendido</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentageSold}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectRaffle(raffle)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    <Ticket className="w-4 h-4" />
                    Ver Boletos
                  </button>

                  <select
                    value={raffle.status}
                    onChange={(e) => handleStatusChange(raffle.id, e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Activa</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>

                  <button
                    onClick={() => handleDelete(raffle.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {raffles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay rifas disponibles
          </h3>
          <p className="text-gray-600">
            Crea una nueva rifa para comenzar
          </p>
        </div>
      )}
    </div>
  );
}
