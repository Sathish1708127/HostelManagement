import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { Providers } from './providers';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Providers>
  );
}

export default App;
