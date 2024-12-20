// Enhanced Debug Utility for The Black Vault
console.log('Debug utility script loaded');

class DebugUtility {
    constructor() {
        console.log('Debug utility constructor called');
        this.errors = [];
        this.warnings = [];
        this.resourceLoads = [];
        this.networkRequests = [];
        this.performanceMetrics = {
            pageLoad: null,
            resources: {},
            memory: {},
            fps: []
        };
        this.settings = {
            maxLogs: 100,
            enablePerformance: true,
            enableNetworkLogging: true,
            enableMemoryMonitoring: true,
            enableFPSMonitoring: true,
            logLevel: 'debug' // 'debug', 'info', 'warn', 'error'
        };
        this.init();
    }

    init() {
        console.log('Debug utility init started');
        try {
            // Create the panel first so it exists for other functions
            this.createEnhancedDebugPanel();
            
            // Then set up all monitoring
            this.setupResourceLoadingDebugger();
            this.setupConsoleOverrides();
            this.setupErrorHandling();
            this.setupPerformanceMonitoring();
            this.setupNetworkMonitoring();
            this.setupMemoryMonitoring();
            this.setupFPSMonitoring();
            this.setupKeyboardShortcuts();
            
            console.log('Debug utility init completed');
        } catch (error) {
            console.error('Error during debug utility initialization:', error);
        }
    }

    setupResourceLoadingDebugger() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                const status = entry.transferSize === 0 ? 'Failed/Cached' : 'Loaded';
                const record = {
                    resource: entry.name,
                    type: entry.initiatorType,
                    status: status,
                    duration: entry.duration.toFixed(2) + 'ms',
                    size: this.formatBytes(entry.transferSize),
                    timestamp: new Date().toISOString()
                };
                this.resourceLoads.push(record);
                this.updateDebugPanel();

                if (status === 'Failed/Cached' && !entry.name.includes('data:')) {
                    this.logError(`Resource failed to load: ${entry.name}`, {
                        type: 'resource',
                        details: record
                    });
                }
            });
        });

        observer.observe({ entryTypes: ['resource', 'navigation'] });
    }

    setupConsoleOverrides() {
        // Store original console methods
        const originalConsole = {
            log: console.log.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console)
        };

        // Override console methods
        console.log = (...args) => {
            this.logInfo(args.join(' '));
            originalConsole.log.apply(console, args);
        };

        console.warn = (...args) => {
            this.logWarning(args.join(' '));
            originalConsole.warn.apply(console, args);
        };

        console.error = (...args) => {
            this.logError(args.join(' '));
            originalConsole.error.apply(console, args);
        };
    }

    setupPerformanceMonitoring() {
        if (!this.settings.enablePerformance) return;

        // Page Load Metrics
        window.addEventListener('load', () => {
            const timing = performance.timing;
            this.performanceMetrics.pageLoad = {
                total: timing.loadEventEnd - timing.navigationStart,
                network: timing.responseEnd - timing.fetchStart,
                domProcessing: timing.domComplete - timing.domLoading,
                renderTime: timing.domComplete - timing.domContentLoadedEventStart
            };
        });

        // Resource Timing
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.performanceMetrics.resources[entry.name] = {
                    duration: entry.duration,
                    size: entry.transferSize,
                    type: entry.initiatorType
                };
            });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
    }

    setupNetworkMonitoring() {
        if (!this.settings.enableNetworkLogging) return;

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = performance.now();
            const request = {
                url: args[0],
                method: args[1]?.method || 'GET',
                timestamp: new Date().toISOString(),
                duration: 0,
                status: 'pending'
            };
            this.networkRequests.push(request);

            try {
                const response = await originalFetch(...args);
                request.status = response.status;
                request.duration = (performance.now() - startTime).toFixed(2) + 'ms';
                this.updateDebugPanel();
                return response;
            } catch (error) {
                request.status = 'failed';
                request.error = error.message;
                this.updateDebugPanel();
                throw error;
            }
        };
    }

    setupMemoryMonitoring() {
        if (!this.settings.enableMemoryMonitoring) return;

        setInterval(() => {
            if (performance.memory) {
                this.performanceMetrics.memory = {
                    usedJSHeapSize: this.formatBytes(performance.memory.usedJSHeapSize),
                    totalJSHeapSize: this.formatBytes(performance.memory.totalJSHeapSize),
                    jsHeapSizeLimit: this.formatBytes(performance.memory.jsHeapSizeLimit)
                };
                this.updateDebugPanel();
            }
        }, 2000);
    }

    setupFPSMonitoring() {
        if (!this.settings.enableFPSMonitoring) return;

        let frameCount = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            const currentTime = performance.now();
            frameCount++;

            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.performanceMetrics.fps.push(fps);
                if (this.performanceMetrics.fps.length > 60) {
                    this.performanceMetrics.fps.shift();
                }
                frameCount = 0;
                lastTime = currentTime;
                this.updateDebugPanel();
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + D to toggle debug panel
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                this.toggleDebugPanel();
            }
            // Ctrl/Cmd + Shift + C to clear logs
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                this.clearLogs();
            }
        });
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logError(`Error occurred: ${event.message}`, {
                type: 'error',
                details: {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                }
            });
        });
    }

    createEnhancedDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 0;
            right: 0;
            width: 500px;
            height: 400px;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            border-top-left-radius: 5px;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0;">Enhanced Debug Panel</h3>
                <div>
                    <select id="debug-tab-selector" style="background: #444; color: #fff; border: none; margin-right: 10px;">
                        <option value="logs">Logs</option>
                        <option value="network">Network</option>
                        <option value="performance">Performance</option>
                        <option value="memory">Memory</option>
                    </select>
                    <button id="clear-logs-btn" style="background: #444; color: #fff; border: none; padding: 3px 8px; margin-right: 5px;">Clear</button>
                    <button id="toggle-debug-btn" style="background: #444; color: #fff; border: none; padding: 3px 8px;">Hide</button>
                </div>
            </div>
        `;

        const content = document.createElement('div');
        content.id = 'debug-content';
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.3);
            padding: 10px;
            border-radius: 3px;
        `;

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        this.setupDebugPanelControls();
    }

    setupDebugPanelControls() {
        const tabSelector = document.getElementById('debug-tab-selector');
        const clearBtn = document.getElementById('clear-logs-btn');
        const toggleBtn = document.getElementById('toggle-debug-btn');
        const content = document.getElementById('debug-content');

        tabSelector.addEventListener('change', () => {
            this.updateDebugPanel();
        });

        clearBtn.addEventListener('click', () => {
            this.clearLogs();
        });

        toggleBtn.addEventListener('click', () => {
            this.toggleDebugPanel();
        });
    }

    updateDebugPanel() {
        const content = document.getElementById('debug-content');
        const tabSelector = document.getElementById('debug-tab-selector');
        
        if (!content || !tabSelector) {
            console.warn('Debug panel elements not found');
            return;
        }

        const selectedTab = tabSelector.value;
        
        switch (selectedTab) {
            case 'logs':
                content.innerHTML = this.generateLogsHTML();
                break;
            case 'network':
                content.innerHTML = this.generateNetworkHTML();
                break;
            case 'performance':
                content.innerHTML = this.generatePerformanceHTML();
                break;
            case 'memory':
                content.innerHTML = this.generateMemoryHTML();
                break;
            default:
                content.innerHTML = this.generateLogsHTML();
        }
    }

    generateLogsHTML() {
        return `
            <div style="margin-bottom: 10px;">
                <strong>Errors (${this.errors.length}):</strong>
                ${this.errors.map(error => `
                    <div style="color: #ff6b6b; margin: 5px 0; padding: 5px; background: rgba(255,107,107,0.1);">
                        ${error}
                    </div>
                `).join('')}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Warnings (${this.warnings.length}):</strong>
                ${this.warnings.map(warning => `
                    <div style="color: #ffd93d; margin: 5px 0; padding: 5px; background: rgba(255,217,61,0.1);">
                        ${warning}
                    </div>
                `).join('')}
            </div>
            <div>
                <strong>Recent Resource Loads:</strong>
                ${this.resourceLoads.slice(-5).map(record => `
                    <div style="color: ${record.status === 'Failed/Cached' ? '#ff6b6b' : '#6bff6b'}; margin: 5px 0; padding: 5px; background: rgba(107,255,107,0.1);">
                        ${record.type}: ${record.resource.split('/').pop()} (${record.status}) - ${record.size}
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateNetworkHTML() {
        return `
            <div>
                <strong>Network Requests:</strong>
                ${this.networkRequests.map(request => `
                    <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1);">
                        <div>${request.method} ${request.url}</div>
                        <div>Status: ${request.status} - Duration: ${request.duration}</div>
                        ${request.error ? `<div style="color: #ff6b6b;">Error: ${request.error}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    generatePerformanceHTML() {
        const pageLoad = this.performanceMetrics.pageLoad;
        const fps = this.performanceMetrics.fps;
        
        return `
            <div>
                <strong>Page Load Metrics:</strong>
                ${pageLoad ? `
                    <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1);">
                        <div>Total Load Time: ${pageLoad.total}ms</div>
                        <div>Network Time: ${pageLoad.network}ms</div>
                        <div>DOM Processing: ${pageLoad.domProcessing}ms</div>
                        <div>Render Time: ${pageLoad.renderTime}ms</div>
                    </div>
                ` : 'Loading...'}
            </div>
            <div style="margin-top: 10px;">
                <strong>FPS Monitor:</strong>
                <div style="height: 50px; background: rgba(255,255,255,0.1); margin: 5px 0; display: flex; align-items: flex-end;">
                    ${fps.map(value => `
                        <div style="width: ${100/60}%; height: ${value/60*100}%; background: ${value < 30 ? '#ff6b6b' : value < 50 ? '#ffd93d' : '#6bff6b'};">
                        </div>
                    `).join('')}
                </div>
                <div>Current FPS: ${fps[fps.length - 1] || 0}</div>
            </div>
        `;
    }

    generateMemoryHTML() {
        const memory = this.performanceMetrics.memory;
        return `
            <div>
                <strong>Memory Usage:</strong>
                <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1);">
                    <div>Used JS Heap: ${memory.usedJSHeapSize || 'N/A'}</div>
                    <div>Total JS Heap: ${memory.totalJSHeapSize || 'N/A'}</div>
                    <div>JS Heap Limit: ${memory.jsHeapSizeLimit || 'N/A'}</div>
                </div>
            </div>
        `;
    }

    toggleDebugPanel() {
        const content = document.getElementById('debug-content');
        const toggleBtn = document.getElementById('toggle-debug-btn');
        const isVisible = content.style.display !== 'none';
        
        content.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? 'Show' : 'Hide';
    }

    clearLogs() {
        this.errors = [];
        this.warnings = [];
        this.resourceLoads = [];
        this.networkRequests = [];
        this.updateDebugPanel();
    }

    formatBytes(bytes) {
        if (bytes === 0 || !bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    logInfo(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        // Update the panel if it exists
        this.updateDebugPanel();
    }

    logError(message, details = {}) {
        const timestamp = new Date().toISOString();
        const error = `[${timestamp}] ${message}${details.type ? ` (${details.type})` : ''}`;
        this.errors.push(error);
        if (this.errors.length > this.settings.maxLogs) {
            this.errors.shift();
        }
        this.updateDebugPanel();
    }

    logWarning(message) {
        const timestamp = new Date().toISOString();
        this.warnings.push(`[${timestamp}] ${message}`);
        if (this.warnings.length > this.settings.maxLogs) {
            this.warnings.shift();
        }
        this.updateDebugPanel();
    }
}

// Initialize the debug utility when the page loads
console.log('Setting up load event listener');
window.addEventListener('load', () => {
    console.log('Window load event fired');
    try {
        window.debugUtility = new DebugUtility();
        console.log('Debug utility instance created successfully');
    } catch (error) {
        console.error('Error creating debug utility instance:', error);
    }
});
