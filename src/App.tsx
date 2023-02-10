import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

import { SettingsProvider, Theme, useTheme } from './contexts/Settings';
import { TaquitoProvider } from './contexts/Taquito';
import { BeaconProvider } from './contexts/Beacon';
import { ContractProvider } from './contexts/Contract';

// import { BasicInfo } from './routes/BasicPage';
import { MintPage } from './routes/MintPage';

import './App.css';
import { StrictMode } from 'react';

const router = createBrowserRouter([
  // {
  //   path: "/basic",
  //   element: <BasicInfo />,
  // },
  {
    path: "/mint",
    element: <MintPage />,
  },
  // {
  //   path: "*",
  //   element: <ErrorPage />,
  // },
]);


function DApp() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme   = useTheme()
  const uiTheme = createTheme({
    palette: {
      mode: theme === Theme.Default && prefersDarkMode ? 'dark' : (theme === Theme.Dark ? 'dark' : 'light'),
    },
  });
  return (

      <ThemeProvider theme={uiTheme}>
        <TaquitoProvider>
          <BeaconProvider>
            <ContractProvider>
            <Paper elevation={0}>
                    <div style={{ height: '100vh', overflow: 'auto' }}>
                    {/* <TopBar></TopBar> */}
                    <RouterProvider router={router} />
                    {/* <EventAlert /> */}
                    </div>
                  </Paper>
{/* <StrictMode><MainPanel /></StrictMode> */}




              
            </ContractProvider>
          </BeaconProvider>
        </TaquitoProvider>
        </ThemeProvider>
  );
}

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <SettingsProvider>
        <DApp />
      </SettingsProvider>
    </div>
  );
}

export default App;