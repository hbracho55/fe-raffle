import { createBrowserRouter } from "react-router";

import { HomePage } from '../raffle/pages/home/HomePage';
import { RafflePage } from "@/raffle/pages/raffle/RafflePage";
import { AdminPage } from "@/admin/pages/AdminPage";
import { RaffleLayout } from "@/raffle/layouts/RaffleLayout";
import { AdminLayout } from "@/admin/layouts/AdminLayout";

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <RaffleLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'raffle/1',
                element: <RafflePage />
            },
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminPage />
            },
        ]
    },
])