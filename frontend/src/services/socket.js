import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(url = 'http://localhost:3001') {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(url, {
      transports: ['websocket'],
      upgrade: true
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('🚨 Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  subscribeToLocation(locationId) {
    if (this.socket) {
      this.socket.emit('subscribe-location', locationId);
    }
  }

  cleanup() {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.off(event, callback);
      });
    });
    this.listeners.clear();
  }
}

export default new SocketService();