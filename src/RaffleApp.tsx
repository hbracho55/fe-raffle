import { RouterProvider } from 'react-router'
import { appRouter } from './router/app.router'

export const RaffleApp = () => {
  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}
