import { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';
import { CustomJumbotron } from '@/raffle/layouts/CustomJumbotron';
import { RaffleHeader } from '@/raffle/layouts/RaffleHeader';
import { RaffleFooter } from '@/raffle/layouts/RaffleFooter';
import { RaffleCard } from '@/raffle/components/RaffleCard';
import { RaffleModal } from '@/raffle/components/RaffleModal';
//import { supabase, Raffle } from './lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
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
  status: 'Activo' | 'Reservado' | 'Pagado';
  winner_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Ticket {
  id: string;
  raffle_id: string;
  user_id: string;
  ticket_number: number;
  purchase_date: string;
}

export const HomePage = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const fetchRaffles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://rifabramen.ddns.net:4200/api/raffles`, {
        headers: {
          Accept: 'application/json'
        }
      })
      if (!res.ok) throw new Error('Failed to fetch tickets data')
      const data = await res.json()
      setRaffles(data || []);
      //return data
    } catch (error) {
      console.error('Failed to fetch tickets data: ', error)
      //return []
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRaffles();
  }, []);

  const handlePurchaseSuccess = () => {
    fetchRaffles();
    setShowSuccessDialog(true);
  };

  const handleRefreshRaffles = () => {
    fetchRaffles();
  };

  return (
    <>
      <RaffleHeader title='RIFA' description='Participa, colabora y gana premios'/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CustomJumbotron 
          title='Rifa a beneficio de Marcela Bracho' 
          description='Esta rifa tiene como objetivo recolectar fondos destinados a entrenemientos deportivos de Marcela que se realizarán en Argentina durante Febrero 2026.  Los tickets ganadores se obtendrán del terminal de los resultados de la loteria de Chile del día viernes 5 de diciembre (los resultados del sorteo se podrán revisar en el siguiente enlace: https://www.combinacionganadora.com/cl/).' 
          awards='Premios' 
          award1='- 1er Premio: Audífonos inalámbricos JBL. (Modelo Tune 520BT). Este premio se obtiene del terminal del resultado de la loteria de la noche.'
          award2='- 2do Premio: Botella de vino Tinto Montes Alpha Carmenere 750 ml. Este premio se obtiene del terminal del resultado de la loteria de la tarde.'
          award3='- 3er Premio: Botella de vino Tinto Montes Alpha Carmenere 750 ml. Este premio se obtiene del terminal del resultado de la loteria de la mañana.'
          payment='Datos para el pago' 
          description2='Transferencia a nombre de Marcela Bracho, cuenta rut 25654750 Banco Estado. Rut 25654750-3, correo hbracho55@hotmail.com. Teléfono +56983764365. Por favor indicar en la transferencia el número del ticket que se está pagando.'
        />
          
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : raffles.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No hay rifas disponibles
            </h3>
            <p className="text-gray-600">
              Pronto habrá nuevas rifas disponibles. ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {raffles.map((raffle) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                onSelect={setSelectedRaffle}
              />
            ))}
          </div>
        )}

      </main>

      <RaffleFooter />

      {selectedRaffle && (
        <RaffleModal
          raffle={selectedRaffle}
          onClose={() => setSelectedRaffle(null)}
          onPurchaseSuccess={handlePurchaseSuccess}
          onPurchaseError={handleRefreshRaffles}
        />
      )}

      {/* Diálogo de éxito */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">¡Reserva de tickets exitosa!</h3>
              <p className="text-gray-600">
                Recibirás un correo con los detalles de la reserva.
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
              }}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
