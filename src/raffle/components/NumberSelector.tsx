import { useEffect, useState } from 'react';

interface Ticket {
  id: string;
  number: number;
  createdAt: string;
  winner1: boolean;
  winner2: boolean;
  winner3: boolean;
  status: string;
}

interface NumberSelectorProps {
  raffleId: string;
  selectedNumbers: number[];
  selectedNumberIds: string[];
  onNumberToggle: (ticket: Ticket) => void;
  tickets: Ticket[];
  maxSelection?: number;
}

export const NumberSelector = ({
  raffleId,
  selectedNumbers,
  selectedNumberIds,
  onNumberToggle,
  tickets,
  maxSelection = 10
}: NumberSelectorProps) => {
  const [takenNumbers, setTakenNumbers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  //  fetchTakenNumbers();
  }, [raffleId]);

  /* const fetchTakenNumbers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tickets')
      .select('ticket_number')
      .eq('raffle_id', raffleId);

    if (error) {
      console.error('Error fetching taken numbers:', error);
    } else {
      const taken = new Set(data.map(t => t.ticket_number));
      setTakenNumbers(taken);
    }
    setLoading(false);
  }; */

  const handleNumberClick = (ticket: Ticket) => {
    if (takenNumbers.has(ticket.number)) return;

    if (selectedNumbers.includes(ticket.number)) {
      onNumberToggle(ticket);
    } else if (selectedNumbers.length < maxSelection) {
      onNumberToggle(ticket);
    }
  };

  const isSelected = (num: Ticket) => selectedNumbers.includes(num.number);
  const isReserved = (num: Ticket) => num.status === 'Reservado';
  const isPaid = (num: Ticket) => num.status === 'Pagado';

  const getNumberStyle = (num: Ticket) => {
    if (isReserved(num)) {
      return 'bg-orange-300 text-gray-500 cursor-not-allowed';
    }
    if (isPaid(num)) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    if (isSelected(num)) {
      return 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg scale-105 ring-2 ring-blue-400';
    }
    return 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:shadow-md hover:scale-105 cursor-pointer';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const sortedTickets = [...tickets].sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Selecciona tus números
        </h3>
        <div className="text-sm text-gray-600">
          {selectedNumbers.length} / {maxSelection} seleccionados
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
          <span className="text-gray-600">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded"></div>
          <span className="text-gray-600">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-300 rounded"></div>
          <span className="text-gray-600">Reservado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Pagado</span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg">
       
        {sortedTickets.map((ticket) => (
          <button
            key={ticket.number}
            type="button"
            onClick={() => handleNumberClick(ticket)}
            disabled={isPaid(ticket)}
            className={`
              aspect-square rounded-lg font-bold text-sm
              transition-all duration-200 flex items-center justify-center
              ${getNumberStyle(ticket)}
            `}
          >
            {ticket.number}
          </button>
        ))}
      </div>

      {selectedNumbers.length === maxSelection && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
          Has alcanzado el máximo de {maxSelection} números seleccionados
        </div>
      )}
    </div>
  );
}
