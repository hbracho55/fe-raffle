import { Outlet } from 'react-router'

export const RaffleLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Outlet />
    </div>
  )
}
