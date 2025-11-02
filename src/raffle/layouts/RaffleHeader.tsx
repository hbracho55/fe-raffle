import { Trophy } from 'lucide-react';

interface Props {
    title: string,
    description?: string
}

export const RaffleHeader = ({title, description}: Props) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {title}
                </h1>
                { description && (
                    <p className="text-sm text-gray-600">{description}</p>
                    )
                }
              </div>
            </div>
          </div>
        </div>
      </header>
  )
}
