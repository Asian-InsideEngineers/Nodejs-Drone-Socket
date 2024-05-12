const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.post('/send-message', (req, res) => {
  const { message } = req.body;
  wss.clients.forEach(client => {
    client.send(message);
    console.log('Sent message to client:', message); // Log the sent message
  });
  res.send('Message sent to all clients');
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('Received message from Flutter:', message.toString());
    if (message.toString() === 'ConnectDrone') {
      ws.send('Drone Server Connected');
      console.log('Sent response to Flutter: Drone Server Connected');
    }
  });
});

server.listen(8080, () => {
  console.log('Server started on port 8080');
});
