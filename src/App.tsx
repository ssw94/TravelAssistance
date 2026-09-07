import { RouterProvider } from 'react-router-dom';
import { routes } from './config/Routes';
import RegisterProvider from './providers/RegisterProvider';

const App = () => {
  return (
    <RegisterProvider>
      <RouterProvider router={routes} />
    </RegisterProvider>
  );
};

export default App;
