import { Calendar, Ticket } from 'lucide-react';

interface RaffleCardProps {
  raffle: Raffle;
  onSelect: (raffle: Raffle) => void;
}

interface Ticket {
  id: string;
  number: number;
  createdAt: string;
  winner1: boolean;
  winner2: boolean;
  winner3: boolean;
  status: string;
}

interface Raffle {
  id: string;
  title: string;
  description: string;
  image_url: string;
  ticket_price: number;
  totalTickets: number;
  tickets_sold: number;
  draw_date: string;
  status: string;
  winner_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  tickets: Ticket[];
}

export const RaffleCard = ({ raffle, onSelect }: RaffleCardProps) => {
  const percentageSold = 100;
  const drawDate = new Date('2025/12/05');

  return (
    <div
      onClick={() => onSelect(raffle)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="relative h-56 bg-gradient-to-br from-blue-500 to-cyan-400">
        {raffle.description ? (
          <img
            src='/caricatura_gim.png'
            alt={raffle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Ticket className="w-20 h-20 text-white opacity-50" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
          2.000 CLP
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Sorteo: {drawDate.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentageSold}%` }}
            />
          </div>
        </div>

        <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg">
          Participar Ahora
        </button>
      </div>
    </div>
  );
}
