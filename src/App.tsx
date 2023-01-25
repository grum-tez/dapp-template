import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { SettingsProvider } from './contexts/Settings';
import { TaquitoProvider } from './contexts/Taquito';
import { BeaconProvider } from './contexts/Beacon';
import { ContractProvider } from './contexts/Contract';



function App() {
  return (
    <div className="App">
      <CssBaseline />
      <SettingsProvider>
        <TaquitoProvider>
          <BeaconProvider>
            <ContractProvider>
              <p>"hi"</p>
              {/* <MainPanel /> */}
            </ContractProvider>
          </BeaconProvider>
        </TaquitoProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;