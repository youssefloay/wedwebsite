import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { RsvpPage } from "./components/RsvpPage";
import { TravelPage } from "./components/TravelPage";
import { AccommodationPage } from "./components/AccommodationPage";
import { GiftsPage } from "./components/GiftsPage";

export const router = createBrowserRouter([
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
]);