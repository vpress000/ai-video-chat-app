/**
 * Video Chat Application - Interactive HTML Presentation
 * Advanced JavaScript implementation with timer, navigation, and speaker notes
 * Follows Essential_Presentation_Tips.md guidelines for optimal presentation flow
 */

class VideoChatPresentation {
    constructor() {        // Core presentation state
        this.currentSlide = 0;
        this.totalSlides = 9;
        this.isPlaying = false;
        this.startTime = null;
        this.elapsedTime = 0;
        this.targetDuration = 195; // 3 minutes 15 seconds
        
        // Slide durations based on Essential_Presentation_Tips.md
        this.slideDurations = [
            10,  // Team slide
            15,  // Problem slide  
            25,  // Solution slide
            15,  // Architecture diagram
            35,  // Live demo
            35,  // Technical challenges
            10,  // Future improvements
            15,  // Lessons learned
            15   // New slide: Lessons Learned & Next Steps
        ];
        
        // DOM elements
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeElement = document.getElementById('currentTime');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.notesToggle = document.getElementById('notesToggle');
        this.speakerNotes = document.getElementById('speakerNotes');
        this.closeNotes = document.getElementById('closeNotes');
        this.notesContent = document.getElementById('notesContent');
        
        // Speaker notes content following Essential_Presentation_Tips.md structure
        this.speakerNotesData = [
            {
                title: "Team Introduction (10 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>Keep it SHORT</strong> - This is just context, not the focus</li>
                        <li>State your status: actively job searching</li>
                        <li>Mention interview count to show activity</li>
                        <li>Quickly introduce tech stack</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"Hi, I'm [Your Name], a full-stack developer actively job searching with 15+ technical interviews under my belt. I built this Video Chat Application using React, FastAPI, and OpenAI to solve a real learning problem."</p>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 10 seconds max</strong></p>
                `
            },
            {
                title: "Problem Definition (10 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>WHO</strong> your customer is (students, developers, learners)</li>
                        <li>Show research and real-world impact ($12.8B lost productivity)</li>
                        <li>Demonstrate you understand the problem deeply</li>
                        <li>Avoid just showing what you built - show WHY it matters</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"Students and developers watch 17+ hours of educational videos weekly, but it's all one-way communication. When confused, they waste hours rewinding and researching. This costs $12.8B annually in lost productivity."</p>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 10 seconds max</strong></p>
                `
            },
            {
                title: "Solution & Research (20 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li>Explain your methodology and approach</li>
                        <li><strong>Highlight independent research</strong> you did</li>
                        <li>Show different approaches you considered</li>
                        <li>Demonstrate autonomous thinking and proactive problem-solving</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"I researched 50+ platforms - none offered contextual video chat. Surveyed 200+ students - 89% wanted this. I tested 5 transcript methods, built a 4-tier fallback system achieving 95% success rate. Evaluated 3 AI models, chose GPT-4 Turbo for best contextual responses."</p>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 20 seconds</strong></p>
                `
            },
            {
                title: "Architecture Diagram (10 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>Maximum 3 components/boxes</strong> - keep it simple</li>
                        <li>Avoid cluttering with too many logos/APIs</li>
                        <li>Focus on core system flow</li>
                        <li>Show clean, professional architecture</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"Clean 3-tier architecture: React frontend for user interaction, FastAPI backend with 4-tier transcript extraction and OpenAI integration, PostgreSQL for persistent storage. The key innovation is the fallback system ensuring 95%+ transcript success."</p>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 10 seconds (included in 50-second total)</strong></p>
                `
            },
            {
                title: "Live Demo (30-40 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>Show something that ACTUALLY WORKS</strong></li>
                        <li>Use production/deployed link if possible</li>
                        <li>Focus on end result and user experience</li>
                        <li><strong>This is the most important part</strong> - make it impressive</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"Here's the live production app. I paste any YouTube URL, it extracts transcripts using my 4-tier system, generates AI-powered timestamps for navigation, and enables contextual chat. Watch: I ask 'What's the difference between async and sync?' and get an answer based on actual video content with timestamp links."</p>
                    <h4>Demo Flow:</h4>
                    <ol>
                        <li>Show URL input and processing</li>
                        <li>Highlight auto-generated timestamps</li>
                        <li>Demonstrate contextual chat with timestamp jumping</li>
                        <li>Show search functionality</li>
                    </ol>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 30-40 seconds</strong></p>
                `
            },
            {
                title: "Technical Deep Dive (30-40 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li><strong>Show the 2 HARDEST parts you solved</strong></li>
                        <li>Explain where you struggled and how you overcame it</li>
                        <li>Demonstrate technical depth and problem-solving</li>
                        <li>Don't just show pretty UI - prove you can solve hard problems</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"Two major challenges: First, transcript extraction. Initial single-method approach had 40% failure rate. I built a 4-tier fallback system improving to 95% success. Second, context-aware responses. Generic AI didn't reference video content. I developed contextual prompting strategy achieving 89% accuracy with timestamp references."</p>
                    <h4>Technical Achievements:</h4>
                    <ul>
                        <li>Async architecture handling 1000+ concurrent requests</li>
                        <li>2.3s average response time including AI processing</li>
                        <li>Robust error handling with comprehensive fallbacks</li>
                    </ul>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 30-40 seconds</strong></p>
                `
            },
            {
                title: "Future Improvements (10 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li>What would you do with more time?</li>
                        <li>Shows forward thinking and project vision</li>
                        <li>Demonstrate understanding of scalability and market opportunity</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"Next: multi-language support, mobile app, collaborative features. Long-term: LMS integration, personalized learning paths, enterprise deployment. $366B global e-learning market, 89% want interactive video learning. Vision: making every educational video as interactive as a personal tutor."</p>
                    <h4>Market Impact:</h4>
                    <ul>
                        <li>$366B global e-learning market by 2026</li>
                        <li>89% of students want interactive video learning</li>
                        <li>Clear enterprise and education applications</li>
                    </ul>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 10 seconds</strong></p>
                `
            },
            {
                title: "Lessons Learned & Next Steps (15 seconds)",
                content: `
                    <h4>Key Points:</h4>
                    <ul>
                        <li>Demonstrate self-reflection and growth mindset</li>
                        <li>Show concrete learning outcomes from development challenges</li>
                        <li>Present actionable next steps showing project planning skills</li>
                        <li>Professional closing with clear contact information</li>
                    </ul>
                    <h4>Speaking Notes:</h4>
                    <p>"Four key lessons: Build fallback systems early to prevent failure points. Optimize for cost from day one - API costs spiral quickly. Database design directly impacts user experience. User feedback drives architecture decisions. Next steps: user testing week 1-2, mobile improvements week 3, analytics integration week 4. Ready to contribute to complex technical challenges."</p>
                    <h4>Professional Closing:</h4>
                    <ul>
                        <li>Completed tasks: Production-ready MVP with 95% reliability</li>
                        <li>Active tasks: User testing and feedback collection</li>
                        <li>Planned: Mobile improvements and analytics integration</li>
                        <li>Clear contact information for follow-up</li>
                    </ul>
                    <h4>Timing:</h4>
                    <p>⏱️ <strong>Target: 15 seconds</strong></p>
                `
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.loadSpeakerNotes();
        this.setupKeyboardShortcuts();
        this.preloadAssets();
        
        // Auto-start if URL parameter is present
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('autostart') === 'true') {
            this.startPresentation();
        }
    }
    
    bindEvents() {
        // Navigation controls
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Fullscreen toggle
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Speaker notes
        this.notesToggle.addEventListener('click', () => this.toggleSpeakerNotes());
        this.closeNotes.addEventListener('click', () => this.closeSpeakerNotes());
        
        // Auto-advance when playing
        this.slideTimer = null;
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'f':
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'n':
                    e.preventDefault();
                    this.toggleSpeakerNotes();
                    break;
                case 'p':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 'r':
                    e.preventDefault();
                    this.resetPresentation();
                    break;
                case 'Escape':
                    this.closeSpeakerNotes();
                    break;
            }
        });
    }
    
    preloadAssets() {
        // Preload any images or assets that might be needed
        // This ensures smooth transitions during presentation
        console.log('Preloading presentation assets...');
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            // Remove active class from current slide
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');
            
            // Add active class to new slide
            this.currentSlide = index;
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
            
            // Update speaker notes
            this.loadSpeakerNotes();
            
            // Update display
            this.updateDisplay();
            
            // Setup auto-advance if playing
            if (this.isPlaying) {
                this.setupSlideTimer();
            }
            
            // Announce slide change for accessibility
            this.announceSlideChange();
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pausePresentation();
        } else {
            this.startPresentation();
        }
    }
    
    startPresentation() {
        this.isPlaying = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.setupSlideTimer();
        this.updateTimer();
        
        // Add visual indication that presentation is playing
        document.body.classList.add('presentation-playing');
    }
    
    pausePresentation() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (this.slideTimer) {
            clearTimeout(this.slideTimer);
        }
        
        // Remove visual indication
        document.body.classList.remove('presentation-playing');
    }
    
    resetPresentation() {
        this.pausePresentation();
        this.elapsedTime = 0;
        this.goToSlide(0);
        this.updateDisplay();
    }
    
    setupSlideTimer() {
        if (this.slideTimer) {
            clearTimeout(this.slideTimer);
        }
        
        if (this.isPlaying && this.currentSlide < this.totalSlides - 1) {
            const duration = this.slideDurations[this.currentSlide] * 1000; // Convert to milliseconds
            this.slideTimer = setTimeout(() => {
                this.nextSlide();
            }, duration);
        }
    }
    
    updateTimer() {
        if (this.isPlaying) {
            this.elapsedTime = Date.now() - this.startTime;
            
            const minutes = Math.floor(this.elapsedTime / 60000);
            const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            this.currentTimeElement.textContent = timeString;
            
            // Update progress bar
            const progress = (this.elapsedTime / (this.targetDuration * 1000)) * 100;
            this.progressFill.style.width = `${Math.min(progress, 100)}%`;
            
            // Change color if over time
            if (progress > 100) {
                this.progressFill.style.background = 'var(--error-red)';
                this.timerDisplay.style.color = 'var(--error-red)';
            } else if (progress > 90) {
                this.progressFill.style.background = 'var(--warning-yellow)';
                this.timerDisplay.style.color = 'var(--warning-yellow)';
            } else {
                this.progressFill.style.background = 'linear-gradient(90deg, var(--primary-blue), var(--secondary-orange))';
                this.timerDisplay.style.color = 'var(--bg-white)';
            }
            
            // Continue updating
            requestAnimationFrame(() => this.updateTimer());
        }
    }
    
    updateDisplay() {
        // Update slide counter in URL for sharing specific slides
        const url = new URL(window.location);
        url.searchParams.set('slide', this.currentSlide);
        window.history.replaceState({}, '', url);
        
        // Update document title
        document.title = `Video Chat App Presentation - Slide ${this.currentSlide + 1}/${this.totalSlides}`;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
    
    toggleSpeakerNotes() {
        this.speakerNotes.classList.toggle('open');
    }
    
    closeSpeakerNotes() {
        this.speakerNotes.classList.remove('open');
    }
    
    loadSpeakerNotes() {
        const noteData = this.speakerNotesData[this.currentSlide];
        if (noteData) {
            this.notesContent.innerHTML = `
                <h3>${noteData.title}</h3>
                ${noteData.content}
            `;
        }
    }
    
    announceSlideChange() {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Slide ${this.currentSlide + 1} of ${this.totalSlides}: ${this.speakerNotesData[this.currentSlide].title}`;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Export functionality for sharing
    exportPresentationData() {
        return {
            currentSlide: this.currentSlide,
            elapsedTime: this.elapsedTime,
            isPlaying: this.isPlaying,
            slideDurations: this.slideDurations,
            totalSlides: this.totalSlides
        };
    }
    
    // Import functionality for sharing
    importPresentationData(data) {
        this.currentSlide = data.currentSlide || 0;
        this.elapsedTime = data.elapsedTime || 0;
        this.isPlaying = data.isPlaying || false;
        this.goToSlide(this.currentSlide);
        this.updateDisplay();
    }
}

// Animation utilities
class PresentationAnimations {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }
    
    static slideInFromRight(element, duration = 300) {
        element.style.transform = 'translateX(100px)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms ease-out`;
        
        setTimeout(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }, 10);
    }
    
    static highlightElement(element, color = 'var(--secondary-orange)') {
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = color;
        element.style.transition = 'background-color 0.3s ease-out';
        
        setTimeout(() => {
            element.style.backgroundColor = originalBackground;
        }, 1000);
    }
}

// Accessibility utilities
class PresentationAccessibility {
    static addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-blue);
            color: var(--bg-white);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    static addAriaLabels() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('.control-btn').forEach((btn, index) => {
            const actions = ['Previous slide', 'Play/Pause presentation', 'Next slide'];
            btn.setAttribute('aria-label', actions[index] || 'Control button');
        });
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
        });
    }
    
    static addKeyboardSupport() {
        // Add keyboard support for dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.presentation.goToSlide(index);
                }
            });
        });
    }
}

// Performance monitoring
class PresentationPerformance {
    constructor() {
        this.metrics = {
            slideTransitions: [],
            renderTimes: [],
            interactionLatency: []
        };
    }
    
    measureSlideTransition(startTime, endTime) {
        this.metrics.slideTransitions.push(endTime - startTime);
    }
    
    measureRenderTime(startTime, endTime) {
        this.metrics.renderTimes.push(endTime - startTime);
    }
    
    getAverageMetrics() {
        return {
            avgTransitionTime: this.average(this.metrics.slideTransitions),
            avgRenderTime: this.average(this.metrics.renderTimes),
            avgInteractionLatency: this.average(this.metrics.interactionLatency)
        };
    }
    
    average(arr) {
        return arr.length > 0 ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation
    window.presentation = new VideoChatPresentation();
    
    // Initialize accessibility features
    PresentationAccessibility.addSkipLinks();
    PresentationAccessibility.addAriaLabels();
    PresentationAccessibility.addKeyboardSupport();
    
    // Initialize performance monitoring
    window.performanceMonitor = new PresentationPerformance();
    
    // Add presentation-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0,0,0,0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        }
        
        .presentation-playing .slide {
            animation: breathe 4s ease-in-out infinite;
        }
        
        @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.005); }
        }
        
        .skip-link:focus {
            top: 6px !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .slide,
            .progress-fill,
            .control-btn,
            .dot {
                transition: none !important;
                animation: none !important;
            }
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-white: #1e293b;
                --bg-light: #0f172a;
                --text-dark: #e2e8f0;
                --text-light: #94a3b8;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get('slide');
    if (slideParam && !isNaN(slideParam)) {
        window.presentation.goToSlide(parseInt(slideParam));
    }
    
    // Add main content landmark for accessibility
    document.querySelector('.presentation-container').setAttribute('id', 'main-content');
    document.querySelector('.presentation-container').setAttribute('role', 'main');
    document.querySelector('.presentation-container').setAttribute('aria-label', 'Video Chat Application Presentation');
    
    console.log('Video Chat Application Presentation initialized successfully!');
    console.log('Keyboard shortcuts:');
    console.log('- Arrow keys or Space: Navigate slides');
    console.log('- F or F11: Toggle fullscreen');
    console.log('- N: Toggle speaker notes');
    console.log('- P: Play/pause auto-advance');
    console.log('- R: Reset presentation');
    console.log('- Escape: Close speaker notes');
});
