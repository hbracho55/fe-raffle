import { useEffect, useState } from 'react';
import { CheckCircle, Award} from 'lucide-react';

interface Raffle {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ticket_price: number;
  total_tickets: number;
  beneficiary: string;
  draw_date: string;
  status: string;
  winner_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Player {
  personalId: string;
  name: string;
  email: string;
  phone: string;
}

interface Ticket {
  id: string;
  number: number;
  createdAt: string;
  winner1: boolean;
  winner2: boolean;
  winner3: boolean;
  status: string;
  player: Player;
}

interface TicketWithDetails extends Ticket {
  raffle?: Raffle;
}

export const TicketManagement = () => {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [raffleId, setRaffleId] = useState('');
  const [beneficiary, setBeneficiary] = useState('');

  useEffect(() => {
    fetchTickets();
  //}, [raffle.id]);
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://superabnormal-unmounded-wilford.ngrok-free.dev/api/raffles`, {
        headers: {
          Accept: 'application/json'
        }
      })
      if (!res.ok) throw new Error('Failed to fetch tickets data')
      const data = await res.json()
      setTickets(data[0].tickets || []);
      setRaffleId(data[0].id);
      setBeneficiary(data[0].beneficiary)
      //return data
    } catch (error) {
      console.error('Failed to fetch tickets data: ', error)
      //return []
    }
    setLoading(false);
  };

  const handleStatusChange = async (ticketId: string, newStatus: string, playerData: Player) => {
    try {
      const res = await fetch(`https://superabnormal-unmounded-wilford.ngrok-free.dev/api/manage-raffle-orq/tickets`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          status: newStatus, // Estado dinámico seleccionado
          ticketIds: [ticketId],
          player: {
            personalId: playerData.personalId,
            name: playerData.name,
            email: playerData.email,
            phone: playerData.phone,
          },
          raffle: {
            id: raffleId,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Error updating ticket status');
      }

      await res.json();

      // Refresca los datos después de la actualización
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleUpdateWinner = async (ticketId: string, winnerField: string, isWinner: boolean, playerData: Player) => {
    try {
      const res = await fetch(`https://superabnormal-unmounded-wilford.ngrok-free.dev/api/manage-raffle-orq/tickets`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          [winnerField]: isWinner,
          ticketIds: [ticketId],
          player: {
            personalId: playerData.personalId,
            name: playerData.name,
            email: playerData.email,
            phone: playerData.phone,
          },
          raffle: {
            id: '12d179fc-ab9b-43c3-928e-9dc064bdd98e', // ID de la rifa
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Error updating ticket ${winnerField}:`);
      }
      await res.json();
      fetchTickets();
    } catch (error) {
      console.error(`Error updating ticket ${winnerField}:`, error);
    }
  };

  const handleNotifyEmail = async (ticketNumber: number, name: string, email: string, beneficiary: string) => {
    try {
      const res = await fetch(`https://superabnormal-unmounded-wilford.ngrok-free.dev/api/manage-raffle-orq/send-email-no-winner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          number: ticketNumber,
          beneficiary: beneficiary
        }),
      });

      if (!res.ok) {
        throw new Error(`Error sending email`);
      }
      await res.json();
    } catch (error) {
      console.error(`Error sending email: `, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    total: tickets.length,
    available: tickets.filter(t => t.status === 'Activo').length,
    reserved: tickets.filter(t => t.status === 'Reservado').length,
    paid: tickets.filter(t => t.status === 'Pagado').length,
    winners: tickets.filter(t => t.winner1 || t.winner2 || t.winner3).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const sortedTickets = [...tickets].sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-gray-600">Gestión de Boletos</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-md border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          <div className="text-sm text-green-600">Disponibles</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-md border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
          <div className="text-sm text-yellow-600">Reservados</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-md border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.paid}</div>
          <div className="text-sm text-red-600">Pagados</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow-md border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.winners}</div>
          <div className="text-sm text-purple-600">Ganadores</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Participante
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cambiar estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  1er Ganador
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  2do Ganador
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  3er Ganador
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Notificar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTickets.map((ticket) => (
                <tr key={ticket.id} className={ticket.winner1 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {ticket.number}
                      </span>
                      {(ticket.winner1 || ticket.winner2 || ticket.winner3) && (
                        <Award className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ticket.player?.name || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {ticket.player?.email || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {ticket.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value, {
                                        personalId: ticket.player?.personalId ?? '',
                                        name: ticket.player?.name ?? '',
                                        email: ticket.player?.email ?? '',
                                        phone: ticket.player?.phone ?? '',
                                      })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Reservado">Reservado</option>
                      <option value="Pagado">Pagado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={ticket.winner1.toString()}
                      onChange={(e) => handleUpdateWinner(ticket.id, 'winner1', e.target.value === 'true', {
                                        personalId: ticket.player?.personalId ?? '',
                                        name: ticket.player?.name ?? '',
                                        email: ticket.player?.email ?? '',
                                        phone: ticket.player?.phone ?? '',
                                      })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={ticket.winner2.toString()}
                      onChange={(e) => handleUpdateWinner(ticket.id, 'winner2', e.target.value === 'true', {
                                        personalId: ticket.player?.personalId ?? '',
                                        name: ticket.player?.name ?? '',
                                        email: ticket.player?.email ?? '',
                                        phone: ticket.player?.phone ?? '',
                                      })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={ticket.winner3.toString()}
                      onChange={(e) => handleUpdateWinner(ticket.id, 'winner3', e.target.value === 'true', {
                                        personalId: ticket.player?.personalId ?? '',
                                        name: ticket.player?.name ?? '',
                                        email: ticket.player?.email ?? '',
                                        phone: ticket.player?.phone ?? '',
                                      })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    { !ticket.winner1 && !ticket.winner2 && !ticket.winner3 && (
                      <button
                        onClick={() => handleNotifyEmail(ticket.number, ticket.player.name, ticket.player.email, beneficiary)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors bg-purple-600 text-white hover:bg-purple-700`}
                      >
                        {'Notificar sin premio'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No hay boletos vendidos
          </h3>
          <p className="text-gray-600">
            Los boletos aparecerán aquí cuando los usuarios participen
          </p>
        </div>
      )}
    </div>
  );
}
