import { createHashRouter } from "react-router";
import { Home } from "./components/Home";
import { RsvpPage } from "./components/RsvpPage";
import { TravelPage } from "./components/TravelPage";
import { AccommodationPage } from "./components/AccommodationPage";
import { GiftsPage } from "./components/GiftsPage";
import { FaqPage } from "./components/FaqPage";
import { Layout } from "./components/Layout";

export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/travel",
        Component: TravelPage,
      },
      {
        path: "/accommodation",
        Component: AccommodationPage,
      },
      {
        path: "/gifts",
        Component: GiftsPage,
      },
      {
        path: "/rsvp",
        Component: RsvpPage,
      },
      {
        path: "/faq",
        Component: FaqPage,
      },
    ],
  },
]);