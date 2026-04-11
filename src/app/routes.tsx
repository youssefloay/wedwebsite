import { createHashRouter } from "react-router";
import { Home } from "./components/Home";
import { RsvpPage } from "./components/RsvpPage";
import { TravelPage } from "./components/TravelPage";
import { AccommodationPage } from "./components/AccommodationPage";
import { GiftsPage } from "./components/GiftsPage";
import { FaqPage } from "./components/FaqPage";
import { DiscoveryPage } from "./components/DiscoveryPage";
import { Layout } from "./components/Layout";

export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/travel",
        element: <TravelPage />,
      },
      {
        path: "/accommodation",
        element: <AccommodationPage />,
      },
      {
        path: "/gifts",
        element: <GiftsPage />,
      },
      {
        path: "/rsvp",
        element: <RsvpPage />,
      },
      {
        path: "/faq",
        element: <FaqPage />,
      },
      {
        path: "/discovery",
        element: <DiscoveryPage />,
      },
    ],
  },
]);