import { QueryClient, QueryClientProvider } from 'react-query';
import Map from './components/Map';

import './App.css';

const queryClient = new QueryClient();
const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Map />
      </QueryClientProvider>
    </>
  );
};

export default App;
