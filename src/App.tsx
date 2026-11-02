import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app/router';
import { Providers } from './app/providers';

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
