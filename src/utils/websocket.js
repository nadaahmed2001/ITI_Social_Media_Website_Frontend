/**
 * WebSocketManager: A robust WebSocket client with auto-reconnection and event handling
 */
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.baseReconnectDelay = 1000; // Start with 1 second
    this.listeners = {
      message: [],
      open: [],
      close: [],
      error: [],
      reconnecting: [],
      reconnected: [],
      reconnectFailed: []
    };
    this.connectionUrl = null;
    this.token = null;
  }

  /**
   * Connect to a WebSocket endpoint
   * @param {string} path - The WebSocket path (e.g., chat/private/123/)
   * @param {string} token - The authentication token
   */
  connect(path, token) {
    if (!token) {
      console.error("No token provided for WebSocket connection");
      this.triggerEvent('error', { message: 'Authentication token missing' });
      return;
    }

    this.token = token;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    
    // Determine proper host based on environment
    const isProduction = !window.location.hostname.includes('localhost') && 
                        window.location.hostname !== '127.0.0.1';
    const host = isProduction 
      ? 'itisocialmediawebsitebackend-production.up.railway.app'
      : 'localhost:8000';
    
    this.connectionUrl = `${wsProtocol}${host}/ws/${path}?token=${token}`;
    console.log(`Connecting to WebSocket at: ${this.connectionUrl}`);
    
    // Close existing connection if any
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close();
    }
    
    try {
      this.socket = new WebSocket(this.connectionUrl);
      this.setupSocketEvents();
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      this.triggerEvent('error', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Set up WebSocket event handlers
   * @private
   */
  setupSocketEvents() {
    // Connection opened
    this.socket.onopen = (event) => {
      console.log('WebSocket connection established');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.triggerEvent('open', event);
    };
    
    // Connection closed
    this.socket.onclose = (event) => {
      this.isConnected = false;
      console.log(`WebSocket connection closed (code: ${event.code}, reason: ${event.reason})`);
      this.triggerEvent('close', event);
      
      // Handle abnormal closes (code 1006 and others)
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };
    
    // Connection error
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.triggerEvent('error', error);
    };
    
    // Message received
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.triggerEvent('message', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
        this.triggerEvent('error', { 
          type: 'parse_error', 
          originalEvent: event,
          error 
        });
      }
    };
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   * @private 
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      this.triggerEvent('reconnectFailed', { attempts: this.reconnectAttempts });
      return;
    }
    
    // Calculate delay with exponential backoff with max of 30 seconds
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      30000
    );
    
    console.log(`Attempting to reconnect in ${delay/1000} seconds (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    this.triggerEvent('reconnecting', { 
      attempt: this.reconnectAttempts + 1, 
      delay,
      maxAttempts: this.maxReconnectAttempts 
    });
    
    setTimeout(() => {
      this.reconnectAttempts++;
      if (this.token && this.connectionUrl) {
        try {
          this.socket = new WebSocket(this.connectionUrl);
          this.setupSocketEvents();
        } catch (error) {
          console.error("Error during reconnection:", error);
          this.scheduleReconnect();
        }
      }
    }, delay);
  }

  /**
   * Send data through the WebSocket connection
   * @param {Object} data - The data to send
   * @returns {boolean} - Whether the send was successful
   */
  send(data) {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message - WebSocket is not connected');
      return false;
    }
    
    try {
      this.socket.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      this.triggerEvent('error', { type: 'send_error', error });
      return false;
    }
  }

  /**
   * Add an event listener
   * @param {string} eventType - The event type (message, open, close, error, reconnecting, reconnected, reconnectFailed)
   * @param {Function} callback - The callback function
   */
  addEventListener(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  /**
   * Remove an event listener
   * @param {string} eventType - The event type
   * @param {Function} callback - The callback function to remove
   */
  removeEventListener(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(
        listener => listener !== callback
      );
    }
  }

  /**
   * Trigger an event
   * @param {string} eventType - The event type
   * @param {*} data - The event data
   * @private
   */
  triggerEvent(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventType} event handler:`, error);
        }
      });
    }
  }

  /**
   * Disconnect the WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Normal closure");
    }
    this.isConnected = false;
    this.reconnectAttempts = 0;
    console.log('WebSocket disconnected');
  }
}

export default WebSocketManager;
