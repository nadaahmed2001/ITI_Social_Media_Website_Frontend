/**
 * WebSocketManager: A robust WebSocket client with auto-reconnection and event handling
 */
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10; // Default, will be overridden by config
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
    this.config = null;
  }

  /**
   * Fetch WebSocket configuration from backend
   * @returns {Promise<Object>} WebSocket configuration object
   */
  async fetchConfig() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/websocket-config/');
      if (!response.ok) {
        throw new Error(`Config fetch failed: ${response.status}`);
      }
      const config = await response.json();
      console.log('WebSocket config loaded:', config);
      this.config = config;
      if (config.wsMaxRetry) {
        this.maxReconnectAttempts = config.wsMaxRetry;
      }
      return config;
    } catch (error) {
      console.error('Error fetching WebSocket config:', error);
      return {
        wsHost: "itisocialmediawebsitebackend-production.up.railway.app",
        wsProtocol: "wss",
        wsPort: "443",
        enableWebsocket: true,
        wsMaxRetry: 5,
        ws_url: "wss://itisocialmediawebsitebackend-production.up.railway.app/ws/"
      };
    }
  }

  /**
   * Connect to a WebSocket endpoint
   * @param {string} path - The WebSocket path (e.g., chat/private/123/)
   * @param {string} token - The authentication token
   * @param {Object} [overrideConfig] - Optional override for WebSocket config
   */
  async connect(path, token, overrideConfig = null) {
    if (!token) {
      console.error("No token provided for WebSocket connection");
      this.triggerEvent('error', { message: 'Authentication token missing' });
      return;
    }

    // Validate token before connecting
    const validation = this.validateToken(token);
    if (!validation.valid) {
      console.error("WebSocket: Refusing to connect with invalid/expired token:", validation);
      this.triggerEvent('error', { type: 'auth_error', message: validation.reason });
      return;
    }

    console.log("WebSocket: Using token:", token);

    this.token = token;
    this.path = path;

    const config = overrideConfig || this.config || await this.fetchConfig();
    if (config.wsMaxRetry) {
      this.maxReconnectAttempts = config.wsMaxRetry;
    }

    let cleanPath = path.replace(/^\/+|\/+$/g, '');
    if (!cleanPath.endsWith('/')) {
      cleanPath += '/';
    }
    const encodedToken = encodeURIComponent(token);

    let finalUrl;
    if (config.ws_url) {
      const baseUrl = config.ws_url.endsWith('/') ? config.ws_url.slice(0, -1) : config.ws_url;
      
      // Check if the base URL already contains "ws/" at the end
      const baseHasWsPrefix = baseUrl.endsWith('/ws') || baseUrl.includes('/ws/');
      
      // Only add "ws/" to the path if the base URL doesn't already include it
      let pathForUrl;
      if (baseHasWsPrefix) {
        // Base already has "ws/", don't add it to the path
        pathForUrl = cleanPath;
      } else {
        // Base doesn't have "ws/", check if path has it
        const wsPrefix = 'ws/';
        const needsPrefix = !cleanPath.startsWith(wsPrefix);
        pathForUrl = needsPrefix ? `${wsPrefix}${cleanPath}` : cleanPath;
      }
      
      finalUrl = `${baseUrl}/${pathForUrl}?token=${encodedToken}`;
      
      // Debug the URL construction
      console.log("URL Construction Details:", {
        baseUrl,
        baseHasWsPrefix,
        originalPath: path,
        cleanPath,
        pathForUrl,
        finalUrl
      });
    } else {
      // Similar fix for the fallback URL construction
      const protocol = config.wsProtocol || (window.location.protocol === 'https:' ? 'wss' : 'ws');
      const host = config.wsHost || 'itisocialmediawebsitebackend-production.up.railway.app';
      const port = config.wsPort ? `:${config.wsPort}` : '';
      
      // Use a single consistent "ws/" prefix in the path
      const wsPrefix = 'ws/';
      const needsPrefix = !cleanPath.startsWith(wsPrefix);
      const pathForUrl = needsPrefix ? `${wsPrefix}${cleanPath}` : cleanPath;
      
      finalUrl = `${protocol}://${host}${port}/${pathForUrl}?token=${encodedToken}`;
    }

    // Remove double slashes in URL (except after protocol)
    finalUrl = finalUrl.replace(/([^:])\/\//g, '$1/');

    this.connectionUrl = finalUrl;
    console.log(`Connecting to WebSocket with details:`, {
      url: finalUrl,
      originalPath: path, 
      cleanedPath: cleanPath,
      tokenLength: token.length,
      configLoaded: !!this.config
    });

    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close();
    }

    if (config.enableWebsocket === false) {
      console.warn("WebSockets are disabled in configuration");
      this.triggerEvent('error', { type: 'websockets_disabled' });
      return;
    }

    // Try connecting with specific protocols to increase compatibility
    const protocols = ['', 'chat', 'v1.chat'];
    let connected = false;
    
    // Try each protocol until one works
    for (const protocol of protocols) {
      if (connected) break;
      
      try {
        // Connect with current protocol
        console.log(`Attempting WebSocket connection with protocol: ${protocol || 'default'}`);
        
        // Create the WebSocket connection
        this.socket = protocol ? new WebSocket(finalUrl, protocol) : new WebSocket(finalUrl);
        this.setupSocketEvents();
        
        // Wait briefly to see if connection succeeds
        await new Promise(resolve => {
          const checkConnection = () => {
            if (this.socket.readyState === WebSocket.OPEN) {
              console.log(`WebSocket connected successfully with protocol: ${protocol || 'default'}`);
              connected = true;
              resolve();
            } else if (this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING) {
              resolve(); // Connection failed, try next protocol
            } else {
              // Still connecting, check again in 100ms
              setTimeout(checkConnection, 100);
            }
          };
          
          // Start checking connection state
          setTimeout(checkConnection, 100);
          
          // Timeout after 3 seconds
          setTimeout(resolve, 3000);
        });
      } catch (error) {
        console.error(`WebSocket connection error with protocol ${protocol || 'default'}:`, error);
      }
    }
    
    if (!connected) {
      console.error("Failed to connect with any WebSocket protocol");
      this.triggerEvent('error', { 
        type: 'connection_error',
        message: 'Failed to establish WebSocket connection after trying multiple protocols'
      });
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
      console.log('WebSocket connection established successfully', {
        url: this.socket.url,
        protocol: this.socket.protocol || 'default',
        readyState: this.socket.readyState
      });
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.triggerEvent('open', event);
      if (this.reconnectAttempts > 0) {
        this.triggerEvent('reconnected', { wasReconnect: true });
      }
    };
    
    // Connection closed
    this.socket.onclose = (event) => {
      const wasConnected = this.isConnected;
      this.isConnected = false;
      
      const closeCodeMeanings = {
        1000: 'Normal closure',
        1001: 'Going away',
        1002: 'Protocol error',
        1003: 'Unsupported data',
        1004: 'Reserved',
        1005: 'No status received',
        1006: 'Abnormal closure',
        1007: 'Invalid frame payload data',
        1008: 'Policy violation',
        1009: 'Message too big',
        1010: 'Missing extension',
        1011: 'Internal error',
        1012: 'Service restart',
        1013: 'Try again later',
        1014: 'Bad gateway',
        1015: 'TLS handshake'
      };
      
      const codeMeaning = closeCodeMeanings[event.code] || 'Unknown';
      
      console.log(`WebSocket connection closed:`, {
        code: event.code,
        codeMeaning,
        reason: event.reason || 'No reason provided',
        wasClean: event.wasClean,
        wasConnected,
        url: this.connectionUrl
      });
      
      // If code 1006 (abnormal closure), try alternate configuration
      if (event.code === 1006) {
        console.warn('Abnormal WebSocket closure (1006). This often indicates connectivity issues, CORS problems, or server unavailability.');
        
        // Perform a connectivity test to help diagnose
        this.testConnectivity()
          .then(result => {
            console.log('Connectivity test result:', result);
          })
          .catch(err => {
            console.error('Connectivity test failed:', err);
          });
      }
      
      if (event.code === 4001 || 
          (event.code === 1008 && event.reason.toLowerCase().includes('auth'))) {
        console.error('WebSocket authentication failed');
        this.triggerEvent('error', { 
          type: 'auth_error',
          message: 'Authentication failed',
          code: event.code
        });
        return;
      }
      if (event.code !== 1000) {
        this.scheduleReconnect();
      }
    };
    
    // Connection error
    this.socket.onerror = (event) => {
      const errorDetails = {
        type: 'error',
        target: event.target,
        currentTarget: event.currentTarget,
        eventPhase: event.eventPhase,
        timestamp: new Date().toISOString()
      };
      console.error('WebSocket error:', errorDetails);
      this.triggerEvent('error', errorDetails);
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
   * Test basic connectivity to diagnose WebSocket connection issues
   * @private
   */
  async testConnectivity() {
    const results = {};
    
    try {
      // Use a known valid API endpoint instead of the root URL
      const httpUrl = 'http://127.0.0.1:8000/api/websocket-config/';
      
      console.log(`Testing HTTP connectivity to ${httpUrl}`);
      
      // Try to make a simple request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });
      
      const fetchPromise = fetch(httpUrl, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      results.httpStatus = response.status;
      results.httpOk = response.ok;
      
      // Check for CORS headers
      const corsHeader = response.headers.get('Access-Control-Allow-Origin');
      results.cors = corsHeader ? true : false;
      results.corsValue = corsHeader;
      
      // Add response content if available
      if (response.ok) {
        try {
          const data = await response.json();
          results.responseData = data;
        } catch (parseError) {
          results.parseError = parseError.message;
        }
      }
      
    } catch (error) {
      results.httpError = error.message;
    }
    
    // Log network information
    try {
      results.online = navigator.onLine;
      if (navigator.connection) {
        results.connectionType = navigator.connection.effectiveType;
        results.downlink = navigator.connection.downlink;
        results.rtt = navigator.connection.rtt;
      }
    } catch (e) {
      results.networkInfoError = e.message;
    }
    
    // Log browser details
    results.userAgent = navigator.userAgent;
    results.secureContext = window.isSecureContext;
    
    return results;
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   * @private 
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      this.triggerEvent('reconnectFailed', { 
        attempts: this.reconnectAttempts
      });
      return;
    }
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts),
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
      console.log(`Reconnecting to WebSocket (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
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

  /**
   * Add a debug method to test the token validation
   * @param {string} token - The token to validate
   */
  validateToken(token) {
    try {
      // Basic token structure validation
      const parts = token.split('.');
      if (parts.length !== 3) {
        return {
          valid: false,
          reason: 'Token does not have three parts (header.payload.signature)'
        };
      }
      
      // Check if token is expired
      const payload = JSON.parse(atob(parts[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      if (expirationTime < currentTime) {
        return {
          valid: false,
          reason: 'Token is expired',
          exp: new Date(expirationTime).toISOString(),
          now: new Date(currentTime).toISOString()
        };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return {
        valid: false,
        reason: 'Token parsing error',
        error: error.message
      };
    }
  }

  /**
   * Check if a token is valid and refresh it if needed
   * @param {string} token - The token to check
   * @returns {Promise<string>} - A valid token 
   */
  async ensureValidToken(token) {
    // First check if the token is valid
    const validation = this.validateToken(token);
    console.log('Token validation result:', validation);
    
    if (validation.valid) {
      return token; // Token is valid, return it
    }
    
    // If token is invalid, try to refresh it
    console.warn('Token is invalid, attempting to refresh');
    
    // Here you would typically call your token refresh API
    // For example: const newToken = await refreshToken();
    
    // For now, just getting a new token from localStorage as a fallback
    const refreshedToken = localStorage.getItem('access_token');
    if (refreshedToken && refreshedToken !== token) {
      console.log('Using refreshed token from localStorage');
      return refreshedToken;
    }
    
    // If no new token is available, return the original and let the server reject it
    console.warn('Could not refresh token, using original');
    return token;
  }
}

export default WebSocketManager;
