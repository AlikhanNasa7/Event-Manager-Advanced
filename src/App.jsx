import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import Events from './components/Events/Events.jsx';
import EventDetails from './components/Events/EventDetails.jsx';
import NewEvent from './components/Events/NewEvent.jsx';
import EditEvent, { loader as fetchEventLoader, action as updateEventAction } from './components/Events/EditEvent.jsx';
import {queryClient} from './util/http.js'

import {QueryClientProvider } from '@tanstack/react-query';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/events" />,
  },
  {
    path: '/events',
    element: <Events />,

    children: [
      {
        path: '/events/new',
        element: <NewEvent />,
      },
    ],
  },
  {
    path: '/events/:id',
    element: <EventDetails />,
    children: [
      {
        path: '/events/:id/edit',
        element: <EditEvent />,
        loader: fetchEventLoader,
        action: updateEventAction
      },
    ],
  },
]);


function App() {
  return <QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>;
}

export default App;
