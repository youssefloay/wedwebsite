import { createHashRouter } from "react-router";
import { Home } from "./components/Home";
import { RsvpPage } from "./components/RsvpPage";
import { TravelPage } from "./components/TravelPage";
import { AccommodationPage } from "./components/AccommodationPage";
import { GiftsPage } from "./components/GiftsPage";
import { FaqPage } from "./components/FaqPage";
import { DiscoveryPage } from "./components/DiscoveryPage";
import { Layout } from "./components/Layout";

// Admin Imports
import { AdminLayout } from "./components/Admin/AdminLayout";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { AdminGuestList } from "./components/Admin/AdminGuestList";
import { AdminDietaryList } from "./components/Admin/AdminDietaryList";
import { AdminAccommodationList } from "./components/Admin/AdminAccommodationList";
import { AdminTravelList } from "./components/Admin/AdminTravelList";
import { AdminLogin } from "./components/Admin/AdminLogin";
import { ProtectedRoute } from "./components/Admin/ProtectedRoute";

export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "travel",
        element: <TravelPage />,
      },
      {
        path: "accommodation",
        element: <AccommodationPage />,
      },
      {
        path: "gifts",
        element: <GiftsPage />,
      },
      {
        path: "rsvp",
        element: <RsvpPage />,
      },
      {
        path: "faq",
        element: <FaqPage />,
      },
      {
        path: "discovery",
        element: <DiscoveryPage />,
      },
    ],
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "guests",
        element: <AdminGuestList />,
      },
      {
        path: "dietaries",
        element: <AdminDietaryList />,
      },
      {
        path: "accommodation",
        element: <AdminAccommodationList />,
      },
      {
        path: "travel",
        element: <AdminTravelList />,
      },
    ],
  },
]);