import { useState } from 'react';
import { X, Calendar, Ticket } from 'lucide-react';
import { NumberSelector } from './NumberSelector';

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

interface RaffleModalProps {
  raffle: Raffle;
  onClose: () => void;
  onPurchaseSuccess: () => void;
  onPurchaseError: () => void;
}

export const RaffleModal = ({ raffle, onClose, onPurchaseSuccess, onPurchaseError }: RaffleModalProps) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedNumberIds, setSelectedNumberIds] = useState<string[]>([]);
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTextFieldsDisabled, setIsTextFieldsDisabled] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  
  if (!raffle) return null;

  const total = 2000 * selectedNumbers.length;
  const drawDate = new Date('2025/12/05');

  const handleNumberToggle = (ticket: Ticket) => {
    setSelectedNumbers(prev =>
      prev.includes(ticket.number)
        ? prev.filter(n => n !== ticket.number)
        : [...prev, ticket.number]
    );
    setSelectedNumberIds(prev =>
      prev.includes(ticket.id)
        ? prev.filter(n => n !== ticket.id)
        : [...prev, ticket.id]
    );
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedNumbers.length === 0) {
      setError('Debes seleccionar al menos un número');
      return;
    }
    if (email !== confirmEmail) {
      setError('Los correos electrónicos no coinciden.');
      return;
    }

    setError('');
    setLoading(true);

    try {

      const res = await fetch(`https://fe-raffle.vercel.app:4200/api/manage-raffle-orq/tickets`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          status: 'Reservado',
          ticketIds: selectedNumberIds,
          player: {
            personalId: documentNumber,
            name: fullName,
            email: email,
            phone: phone,
            status: 'Activo'
          },
          raffle: {
            id: raffle.id
          }
        }),
      });

      if (!res.ok) {
        setErrorDialogMessage('El ticket seleccionado no se encuentra disponible para reservar.');
        setShowErrorDialog(true);
        return;
      }

      // Limpia formulario
      setDocumentNumber('');
      setFullName('');
      setEmail('');
      setConfirmEmail('');
      setPhone('');
  
      onPurchaseSuccess();
      onClose();
      
    } catch (err) {
      console.error('Error al reservar ticket:', err);
      setErrorDialogMessage('Error al procesar la reserva. Intenta nuevamente.');
      setShowErrorDialog(true);
      onClose(); // Cierra el modal automáticamente
    } finally {
      setLoading(false);
    }
  };

  const handleInputOnBlur = async () => {
    if (documentNumber.trim() != '') {
      try {
        const res = await fetch(`https://fe-raffle.vercel.app/:4200/api/players/criteria?personalId=${documentNumber.trim()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }
        });

        if (!res.ok) {
          throw new Error('Failed to retrieve player criteria data');
        }

        const data = await res.json();
        if (data && data.data.length > 0) {
          setFullName(data.data[0].name);
          setEmail(data.data[0].email);
          setConfirmEmail(data.data[0].email);
          setPhone(data.data[0].phone);
          setIsTextFieldsDisabled(true);
        } else {
          setIsTextFieldsDisabled(false);
        }

      } catch (error) {
        console.error('Failed to retrieve Player data: ', error)
      }
    } 
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'documentNumber') {
      const regex = /^[0-9\-]*$/; // Permitir solo números y el símbolo "-"
      if (!regex.test(value)) {
        return; // Si el valor no cumple con el patrón, no actualices el estado
      }
      setDocumentNumber(e.target.value)
    }

    // Si el campo es "email", valida formato valido
    /* if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Patrón para validar emails
      if (!emailRegex.test(value)) {
      //  setFormErrors((prev) => ({ ...prev, email: true })); // Marca el error si no es válido
      } else {
      //  setFormErrors((prev) => ({ ...prev, email: false })); // Limpia el error si es válido
      }
      setEmail(e.target.value)
    } */

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Reservar número de ticket</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-yellow-500 mb-3">Información</h3>
          <p className="text-gray-600 mb-6">La reserva del número sólo permanecerá vigente por algunos días y durante ese período debe realizarse el pago. El pago debe ser notificado al contacto que se visualiza en la descripción de la rifa. Finalmente, cuando se haya validado el pago se marcará el número como pagado y se enviará un correo con la información correspondiente.</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-blue-600 mb-2">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-semibold">Fecha del Sorteo</span>
              </div>
              <p className="text-gray-900 font-bold">
                {drawDate.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center text-green-600 mb-2">
                <Ticket className="w-5 h-5 mr-2" />
                <span className="font-semibold">Precio por Ticket</span>
              </div>
              <p className="text-gray-900 font-bold text-2xl">2.000 CLP</p>
            </div>
          </div>

          <form onSubmit={handlePurchase} className="space-y-6">
            <NumberSelector
              raffleId={raffle.id}
              selectedNumbers={selectedNumbers}
              onNumberToggle={handleNumberToggle}
              tickets={raffle.tickets}
              maxSelection={100}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rut
              </label>
              <input
                type="text"
                name='documentNumber'
                value={documentNumber}
                onBlur={handleInputOnBlur}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rut"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
                disabled={isTextFieldsDisabled}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+56987654321"
                disabled={isTextFieldsDisabled}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                disabled={isTextFieldsDisabled}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmación de Correo Electrónico
              </label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                disabled={isTextFieldsDisabled}
                required
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total a Pagar:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>
              {selectedNumbers.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Números seleccionados: {selectedNumbers.sort((a, b) => a - b).join(', ')}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || selectedNumbers.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : selectedNumbers.length === 0 ? 'Selecciona al menos un número' : 'Reservar Tickets'}
            </button>
          </form>
        </div>
      </div>

      {/* Diálogo de error */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error en la Reserva</h3>
              <p className="text-gray-600">
                {errorDialogMessage}
              </p>
            </div>
            <button
              onClick={() => {
                setShowErrorDialog(false);
                setErrorDialogMessage('');
                onPurchaseError(); // Llama a fetchRaffles para actualizar la información
                onClose();
              }}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

