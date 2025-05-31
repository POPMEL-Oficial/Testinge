// Bot Detection System
class BotDetector {
    constructor() {
        this.botPatterns = [
            /bot/i,
            /crawler/i,
            /spider/i,
            /slurp/i,
            /search/i,
            /mediapartners/i,
            /nagios/i,
            /curl/i,
            /wget/i,
            /python/i,
            /java/i,
            /perl/i,
            /ruby/i,
            /php/i,
            /headless/i,
            /phantomjs/i,
            /selenium/i,
            /puppeteer/i,
            /playwright/i,
            /cypress/i
        ];
        
        this.suspiciousPatterns = [
            /^[A-Z0-9]+$/i,  // All caps or numbers
            /^[a-z0-9]+$/i,  // All lowercase or numbers
            /^[0-9]+$/,      // All numbers
            /^[a-z]+$/,      // All lowercase
            /^[A-Z]+$/       // All uppercase
        ];
        
        this.init();
    }
    
    init() {
        this.checkUserAgent();
        this.checkBehavior();
        this.checkHeaders();
        this.checkJavaScriptCapabilities();
    }
    
    checkUserAgent() {
        const userAgent = navigator.userAgent;
        const isBot = this.botPatterns.some(pattern => pattern.test(userAgent));
        
        if (isBot) {
            this.handleBotDetection('User Agent Match');
        }
    }
    
    checkBehavior() {
        // Check for suspicious mouse movements
        let lastMove = Date.now();
        let moveCount = 0;
        
        document.addEventListener('mousemove', () => {
            const now = Date.now();
            if (now - lastMove < 50) { // Suspiciously fast movements
                moveCount++;
                if (moveCount > 10) {
                    this.handleBotDetection('Suspicious Mouse Movement');
                }
            }
            lastMove = now;
        });
        
        // Check for suspicious scrolling
        let lastScroll = Date.now();
        let scrollCount = 0;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScroll < 50) { // Suspiciously fast scrolling
                scrollCount++;
                if (scrollCount > 10) {
                    this.handleBotDetection('Suspicious Scrolling');
                }
            }
            lastScroll = now;
        });
    }
    
    checkHeaders() {
        // Check for common bot headers
        const headers = {
            'Accept-Language': navigator.language,
            'Accept': navigator.languages,
            'User-Agent': navigator.userAgent
        };
        
        // Check if headers are suspiciously empty or malformed
        if (!headers['Accept-Language'] || !headers['Accept']) {
            this.handleBotDetection('Missing Headers');
        }
    }
    
    checkJavaScriptCapabilities() {
        // Check for common bot JavaScript capabilities
        const tests = {
            'canvas': this.testCanvas(),
            'webgl': this.testWebGL(),
            'fonts': this.testFonts(),
            'plugins': this.testPlugins()
        };
        
        if (!tests.canvas || !tests.webgl || !tests.fonts || !tests.plugins) {
            this.handleBotDetection('Limited JavaScript Capabilities');
        }
    }
    
    testCanvas() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            return ctx !== null;
        } catch (e) {
            return false;
        }
    }
    
    testWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    testFonts() {
        return document.fonts && document.fonts.check;
    }
    
    testPlugins() {
        return navigator.plugins && navigator.plugins.length > 0;
    }
    
    handleBotDetection(reason) {
        // Log the detection
        console.log(`Bot detected: ${reason}`);
        
        // Track with Facebook Pixel if available
        if (typeof fbq === 'function') {
            fbq('trackCustom', 'BotDetection', {
                reason: reason,
                userAgent: navigator.userAgent
            });
        }
        
        // You can implement additional actions here, such as:
        // - Redirecting to a different page
        // - Showing a CAPTCHA
        // - Blocking access
        // - Logging to your server
    }
}

// Initialize bot detection when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.botDetector = new BotDetector();
}); 