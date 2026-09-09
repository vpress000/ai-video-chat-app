/**
 * Interactive Presentation Script
 * Aligned with Essential_Presentation_Tips.md guidelines
 */

class InteractivePresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.timer = {
            startTime: null,
            pauseTime: 0,
            isRunning: false,
            interval: null
        };
        this.targetTime = 180; // 3 minutes in seconds
        this.slideTimings = []; // Target timings for each slide
        this.actualTimings = []; // Actual time spent on each slide
        this.isNotesVisible = false;
        this.isFullscreen = false;
        
        this.init();
    }

    init() {
        this.setupSlides();
        this.setupEventListeners();
        this.updateUI();
        this.loadSlideNotes();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
        
        // Auto-focus for keyboard navigation
        document.body.setAttribute('tabindex', '0');
        document.body.focus();
        
        console.log('Interactive Presentation initialized');
        console.log(`Total slides: ${this.totalSlides}`);
        console.log('Target presentation time: 3 minutes');
    }

    setupSlides() {
        const slides = document.querySelectorAll('.slide');
        this.totalSlides = slides.length;
        
        // Extract slide timings from data attributes
        slides.forEach((slide, index) => {
            const timing = parseInt(slide.dataset.timing) || 30;
            this.slideTimings.push(timing);
            this.actualTimings.push(0);
            
            // Add slide transition classes
            slide.classList.add('slide-transition');
        });
        
        // Show first slide
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Timer controls
        const startTimerBtn = document.getElementById('startTimer');
        const resetTimerBtn = document.getElementById('resetTimer');
        
        if (startTimerBtn) {
            startTimerBtn.addEventListener('click', () => this.toggleTimer());
        }
        
        if (resetTimerBtn) {
            resetTimerBtn.addEventListener('click', () => this.resetTimer());
        }
        
        // Notes toggle
        const toggleNotesBtn = document.getElementById('toggleNotes');
        const closeNotesBtn = document.getElementById('closeNotes');
        
        if (toggleNotesBtn) {
            toggleNotesBtn.addEventListener('click', () => this.toggleNotes());
        }
        
        if (closeNotesBtn) {
            closeNotesBtn.addEventListener('click', () => this.hideNotes());
        }
        
        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Mouse wheel navigation
        document.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > 50) { // Threshold to prevent accidental navigation
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        }, { passive: true });
        
        // Touch/swipe support
        this.setupTouchNavigation();
    }

    setupTouchNavigation() {
        let startX = null;
        let startY = null;
        const threshold = 50; // Minimum swipe distance
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
            
            startX = null;
            startY = null;
        }, { passive: true });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't interfere if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.code) {
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                    
                case 'ArrowRight':
                case 'ArrowDown':
                case 'PageDown':
                case 'Space':
                    e.preventDefault();
                    if (e.code === 'Space' && e.shiftKey) {
                        this.toggleTimer();
                    } else {
                        this.nextSlide();
                    }
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                    
                case 'KeyR':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.resetTimer();
                    }
                    break;
                    
                case 'KeyN':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.toggleNotes();
                    }
                    break;
                    
                case 'KeyF':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
                    
                case 'Escape':
                    if (this.isNotesVisible) {
                        this.hideNotes();
                    } else if (this.isFullscreen) {
                        this.exitFullscreen();
                    }
                    break;
                    
                // Number keys for direct slide navigation
                case 'Digit1':
                case 'Digit2':
                case 'Digit3':
                case 'Digit4':
                case 'Digit5':
                case 'Digit6':
                case 'Digit7':
                case 'Digit8':
                case 'Digit9':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        const slideNumber = parseInt(e.code.replace('Digit', '')) - 1;
                        if (slideNumber < this.totalSlides) {
                            this.goToSlide(slideNumber);
                        }
                    }
                    break;
            }
        });
    }

    setupAccessibility() {
        // Add ARIA labels and roles
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${this.totalSlides}`);
            slide.setAttribute('aria-hidden', index !== 0 ? 'true' : 'false');
        });
        
        // Add live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'slide-announcements';
        document.body.appendChild(liveRegion);
        
        // Screen reader only styles
        const srOnlyStyle = document.createElement('style');
        srOnlyStyle.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(srOnlyStyle);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.recordSlideTime();
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.recordSlideTime();
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
        
        const slides = document.querySelectorAll('.slide');
        
        // Hide current slide
        slides[this.currentSlide].classList.remove('active');
        slides[this.currentSlide].setAttribute('aria-hidden', 'true');
        
        // Show new slide
        this.currentSlide = slideIndex;
        slides[this.currentSlide].classList.add('active');
        slides[this.currentSlide].setAttribute('aria-hidden', 'false');
        
        this.updateUI();
        this.updateNotes();
        this.announceSlideChange();
        
        // Auto-start timer on first slide if not already started
        if (this.currentSlide === 0 && !this.timer.isRunning && !this.timer.startTime) {
            setTimeout(() => {
                if (!this.timer.isRunning) {
                    this.showTimerPrompt();
                }
            }, 1000);
        }
    }

    recordSlideTime() {
        if (this.timer.startTime && this.timer.isRunning) {
            const now = Date.now();
            const totalElapsed = (now - this.timer.startTime - this.timer.pauseTime) / 1000;
            
            // Calculate time spent on current slide
            const previousSlidesTime = this.actualTimings.slice(0, this.currentSlide).reduce((sum, time) => sum + time, 0);
            const currentSlideTime = totalElapsed - previousSlidesTime;
            
            this.actualTimings[this.currentSlide] = Math.max(0, currentSlideTime);
        }
    }

    announceSlideChange() {
        const liveRegion = document.getElementById('slide-announcements');
        if (liveRegion) {
            const slideTitle = document.querySelector('.slide.active .slide-title')?.textContent || '';
            const timing = this.slideTimings[this.currentSlide];
            liveRegion.textContent = `Slide ${this.currentSlide + 1} of ${this.totalSlides}: ${slideTitle}. Target time: ${timing} seconds.`;
        }
    }

    updateUI() {
        // Update slide counter
        const slideCounter = document.getElementById('slideCounter');
        if (slideCounter) {
            slideCounter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }
        
        // Update progress bar
        this.updateProgressBar();
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    toggleTimer() {
        if (this.timer.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        const now = Date.now();
        
        if (!this.timer.startTime) {
            this.timer.startTime = now;
            this.timer.pauseTime = 0;
        } else {
            // Resuming from pause
            this.timer.pauseTime += now - this.timer.pauseTime;
        }
        
        this.timer.isRunning = true;
        this.timer.interval = setInterval(() => this.updateTimer(), 100);
        
        this.updateTimerButton();
        this.announceTimerState('Timer started');
    }

    pauseTimer() {
        if (this.timer.isRunning) {
            this.timer.isRunning = false;
            this.timer.pauseTime = Date.now();
            clearInterval(this.timer.interval);
            this.updateTimerButton();
            this.announceTimerState('Timer paused');
        }
    }

    resetTimer() {
        this.timer.startTime = null;
        this.timer.pauseTime = 0;
        this.timer.isRunning = false;
        clearInterval(this.timer.interval);
        
        // Reset slide timings
        this.actualTimings = new Array(this.totalSlides).fill(0);
        
        this.updateTimer();
        this.updateTimerButton();
        this.announceTimerState('Timer reset');
    }

    updateTimer() {
        const timerDisplay = document.getElementById('timer');
        if (!timerDisplay) return;
        
        let elapsed = 0;
        
        if (this.timer.startTime) {
            const now = this.timer.isRunning ? Date.now() : this.timer.pauseTime;
            elapsed = (now - this.timer.startTime - (this.timer.isRunning ? 0 : Date.now() - this.timer.pauseTime)) / 1000;
        }
        
        const minutes = Math.floor(elapsed / 60);
        const seconds = Math.floor(elapsed % 60);
        
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning class if over target time
        if (elapsed > this.targetTime) {
            timerDisplay.classList.add('overtime');
        } else {
            timerDisplay.classList.remove('overtime');
        }
        
        // Update timer color based on progress
        const progress = elapsed / this.targetTime;
        if (progress > 1) {
            timerDisplay.style.color = '#ef4444'; // Red for overtime
        } else if (progress > 0.8) {
            timerDisplay.style.color = '#f59e0b'; // Orange for warning
        } else {
            timerDisplay.style.color = '#06b6d4'; // Blue for normal
        }
    }

    updateTimerButton() {
        const startTimerBtn = document.getElementById('startTimer');
        if (!startTimerBtn) return;
        
        const icon = startTimerBtn.querySelector('i');
        const text = startTimerBtn.querySelector('i').nextSibling;
        
        if (this.timer.isRunning) {
            icon.className = 'fas fa-pause';
            if (text) text.textContent = ' Pause';
            startTimerBtn.classList.add('active');
        } else {
            icon.className = 'fas fa-play';
            if (text) text.textContent = ' Start';
            startTimerBtn.classList.remove('active');
        }
    }

    announceTimerState(message) {
        const liveRegion = document.getElementById('slide-announcements');
        if (liveRegion) {
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        }
    }

    showTimerPrompt() {
        const liveRegion = document.getElementById('slide-announcements');
        if (liveRegion) {
            liveRegion.textContent = 'Press the Start button or Space key to begin timing your presentation.';
        }
    }

    toggleNotes() {
        if (this.isNotesVisible) {
            this.hideNotes();
        } else {
            this.showNotes();
        }
    }

    showNotes() {
        const notesPanel = document.getElementById('notesPanel');
        const toggleBtn = document.getElementById('toggleNotes');
        
        if (notesPanel) {
            notesPanel.classList.add('visible');
            this.isNotesVisible = true;
        }
        
        if (toggleBtn) {
            toggleBtn.classList.add('active');
        }
        
        this.updateNotes();
    }

    hideNotes() {
        const notesPanel = document.getElementById('notesPanel');
        const toggleBtn = document.getElementById('toggleNotes');
        
        if (notesPanel) {
            notesPanel.classList.remove('visible');
            this.isNotesVisible = false;
        }
        
        if (toggleBtn) {
            toggleBtn.classList.remove('active');
        }
    }

    loadSlideNotes() {
        // Notes are embedded in the HTML, no need to load separately
        this.updateNotes();
    }

    updateNotes() {
        const notesContent = document.getElementById('notesContent');
        const currentSlideNotes = document.querySelector('.slide.active .slide-notes');
        
        if (notesContent && currentSlideNotes) {
            notesContent.innerHTML = currentSlideNotes.innerHTML;
        }
    }

    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    enterFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (!fullscreenBtn) return;
        
        const icon = fullscreenBtn.querySelector('i');
        const text = icon.nextSibling;
        
        if (this.isFullscreen) {
            icon.className = 'fas fa-compress';
            if (text) text.textContent = ' Exit Full Screen';
            fullscreenBtn.classList.add('active');
        } else {
            icon.className = 'fas fa-expand';
            if (text) text.textContent = ' Full Screen';
            fullscreenBtn.classList.remove('active');
        }
    }

    handleResize() {
        // Adjust presentation layout for different screen sizes
        const slides = document.querySelectorAll('.slide');
        const viewportWidth = window.innerWidth;
        
        slides.forEach(slide => {
            if (viewportWidth < 768) {
                slide.classList.add('mobile-layout');
            } else {
                slide.classList.remove('mobile-layout');
            }
        });
    }

    // Analytics and reporting methods
    getTimingReport() {
        const report = {
            totalSlides: this.totalSlides,
            currentSlide: this.currentSlide + 1,
            targetTimes: this.slideTimings,
            actualTimes: this.actualTimings,
            totalTargetTime: this.slideTimings.reduce((sum, time) => sum + time, 0),
            totalActualTime: this.actualTimings.reduce((sum, time) => sum + time, 0),
            isOverTime: false
        };
        
        report.isOverTime = report.totalActualTime > report.totalTargetTime;
        
        return report;
    }

    exportTimingData() {
        const report = this.getTimingReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation-timing-report.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Practice mode features
    startPracticeMode() {
        this.resetTimer();
        this.goToSlide(0);
        this.startTimer();
        
        // Show practice mode indicator
        const indicator = document.createElement('div');
        indicator.className = 'practice-mode-indicator';
        indicator.innerHTML = '<i class="fas fa-stopwatch"></i> Practice Mode';
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(239, 68, 68, 0.95);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            document.body.removeChild(indicator);
        }, 3000);
        
        // Add practice mode styles
        const practiceStyle = document.createElement('style');
        practiceStyle.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(practiceStyle);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.presentation = new InteractivePresentation();
});

// Add CSS for timer overtime
const timerStyles = document.createElement('style');
timerStyles.textContent = `
    .timer-display.overtime {
        animation: pulse-red 1s infinite;
    }
    
    @keyframes pulse-red {
        0%, 100% { background-color: rgba(239, 68, 68, 0.1); }
        50% { background-color: rgba(239, 68, 68, 0.2); }
    }
    
    .practice-mode-indicator {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(timerStyles);
