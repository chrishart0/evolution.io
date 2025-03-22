import { useEffect } from 'react';
import { io } from 'socket.io-client';
function App() {
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('welcome', (data) => console.log(data.message));
  }, []);
  return <div>Hello from Frontend</div>;
}
export default App;