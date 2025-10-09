import { BrowserRouter } from 'react-router-dom';
import { ClinicProvider } from './contexts/ClinicContext';
import { RegionProvider } from './contexts/RegionContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <RegionProvider>
      <ClinicProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ClinicProvider>
    </RegionProvider>
  );
}

export default App;