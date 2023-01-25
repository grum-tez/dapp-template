import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { SettingsProvider } from './contexts/Settings';
import { TaquitoProvider } from './contexts/Taquito';
import { BeaconProvider } from './contexts/Beacon';
import { ContractProvider } from './contexts/Contract';
import { createBrowserRouter } from 'react-router-dom';
import { Basic } from './routes/BasicPage';
import { RouterProvider } from 'react-router';
const router = createBrowserRouter([
  {
    path: "/basic",
    element: <Basic />,
  },
  // {
  //   path: "*",
  //   element: <ErrorPage />,
  // },
]);


function App() {
  return (
    <div className="App">
      <CssBaseline />
      <SettingsProvider>
        <TaquitoProvider>
          <BeaconProvider>
            <ContractProvider>
              <p>"hi"</p>
              <RouterProvider router = {router} />






              {/* <MainPanel /> */}
            </ContractProvider>
          </BeaconProvider>
        </TaquitoProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;