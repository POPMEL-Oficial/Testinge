document.addEventListener('DOMContentLoaded', () => {
    // Facebook Pixel configuration
    const facebookPixelConfig = {
        enabled: true,
        pixelId: '711563284715041'
    };
    
    // Set placeholder images - logo, badge, and app icon removed
    // document.getElementById('gp-logo').src = window.placeholderImages.googlePlayLogo;
    // document.getElementById('dev-badge').src = window.placeholderImages.topDeveloperBadge;
    // document.getElementById('app-icon').src = window.placeholderImages.appIcon;
    // Promo images are now directly set in HTML with placeholder.com URLs
    
    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const prevButton = document.querySelector('.nav-btn.prev');
    const nextButton = document.querySelector('.nav-btn.next');
    
    let currentIndex = 0;
    const totalItems = items.length;
    const indicatorsToShow = 3; // We want to show only 3 indicators
    
    // Clear any existing indicators
    indicatorsContainer.innerHTML = '';
    
    // Create only 3 indicators
    for (let i = 0; i < indicatorsToShow; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
        
        indicator.addEventListener('click', () => {
            // Map the 3 indicators to 5 slides
            let targetIndex;
            if (i === 0) targetIndex = 0; // First indicator -> First slide
            else if (i === 1) targetIndex = Math.floor(totalItems / 2); // Middle indicator -> Middle slide
            else targetIndex = totalItems - 1; // Last indicator -> Last slide
            
            goToSlide(targetIndex);
        });
    }
    
    const indicators = document.querySelectorAll('.indicator');
    
    // Initialize buttons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(totalItems - 1); // Go to last slide
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentIndex < totalItems - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Go to first slide
        }
    });
    
    function goToSlide(index) {
        const itemWidth = items[0].offsetWidth + 12; // Including margin - calculated dynamically
        track.scrollTo({
            left: itemWidth * index,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateIndicators();
    }
    
    function updateIndicators() {
        // Update which indicator should be active based on current slide
        let activeIndicator;
        if (currentIndex === 0) activeIndicator = 0; // First slide -> First indicator
        else if (currentIndex === totalItems - 1) activeIndicator = indicatorsToShow - 1; // Last slide -> Last indicator
        else activeIndicator = 1; // All middle slides -> Middle indicator
        
        indicators.forEach((indicator, index) => {
            if (index === activeIndicator) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Handle scroll events to update indicators
    track.addEventListener('scroll', () => {
        const itemWidth = items[0].offsetWidth + 12; // Including margin - calculated dynamically
        const scrollPosition = track.scrollLeft;
        const newIndex = Math.round(scrollPosition / itemWidth);
        
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateIndicators();
        }
    });
    
    // Navigation tabs
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
        });
    });
    
    // Device selector
    const deviceButtons = document.querySelectorAll('.device-btn');
    
    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Section headers expandable
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            const content = Array.from(section.children).filter(el => !el.classList.contains('section-header'));
            
            // Toggle visibility of content
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                content.forEach(el => el.style.display = 'none');
                header.setAttribute('aria-expanded', 'false');
                header.querySelector('i').classList.remove('fa-chevron-down');
                header.querySelector('i').classList.add('fa-chevron-right');
            } else {
                content.forEach(el => el.style.display = '');
                header.setAttribute('aria-expanded', 'true');
                header.querySelector('i').classList.remove('fa-chevron-right');
                header.querySelector('i').classList.add('fa-chevron-down');
            }
        });
        
        // Initialize state
        header.setAttribute('aria-expanded', 'true');
    });
    
    // More options buttons
    const moreOptionsButtons = document.querySelectorAll('.more-options-btn');
    
    moreOptionsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // Here you would typically show a dropdown menu
            alert('More options clicked');
        });
    });
    
    // Action buttons
    const shareBtn = document.querySelector('.share-btn');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    
    shareBtn.addEventListener('click', () => {
        // Share functionality would typically integrate with Web Share API
        alert('Share feature clicked');
        
        // Track share event with Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('track', 'Share', {
                content_name: 'POPMEL App',
                content_type: 'product'
            });
        }
    });
    
    wishlistBtn.addEventListener('click', () => {
        const icon = wishlistBtn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            wishlistBtn.style.color = '#f44336';
            
            // Track add to wishlist event with Facebook Pixel
            if (typeof fbq === 'function') {
                fbq('track', 'AddToWishlist', {
                    content_name: 'POPMEL App',
                    content_category: 'App',
                    value: 1,
                    currency: 'BRL'
                });
            }
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            wishlistBtn.style.color = '#018786';
            
            // Track remove from wishlist event with Facebook Pixel
            if (typeof fbq === 'function') {
                fbq('trackCustom', 'RemoveFromWishlist', {
                    content_name: 'POPMEL App',
                    content_category: 'App'
                });
            }
        }
    });
    
    // Track install button clicks with Facebook Pixel
    const installBtn = document.querySelector('.install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (typeof fbq === 'function') {
                fbq('track', 'Lead', {
                    content_name: 'POPMEL Install',
                    value: 1,
                    currency: 'BRL'
                });
            }
        });
    }
    
    // Track navigation tab clicks with Facebook Pixel
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Track navigation click with Facebook Pixel
            if (typeof fbq === 'function') {
                const category = item.querySelector('span').textContent;
                fbq('track', 'ViewContent', {
                    content_name: category,
                    content_category: 'Navigation'
                });
            }
        });
    });
    
    // Track carousel navigation with Facebook Pixel
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            goToSlide(totalItems - 1); // Go to last slide
        }
        
        // Track carousel navigation with Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('trackCustom', 'CarouselNavigation', {
                direction: 'Previous',
                content_category: 'User Interaction'
            });
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentIndex < totalItems - 1) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(0); // Go to first slide
        }
        
        // Track carousel navigation with Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('trackCustom', 'CarouselNavigation', {
                direction: 'Next',
                content_category: 'User Interaction'
            });
        }
    });

    // Image Lightbox functionality
    const lightboxOverlay = document.getElementById('imageLightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');

    items.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('click', () => {
                if (lightboxOverlay && lightboxImg) {
                    lightboxOverlay.style.display = 'flex'; // Use flex to center content
                    lightboxImg.src = img.src;
                }
            });
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (lightboxOverlay) {
                lightboxOverlay.style.display = 'none';
            }
        });
    }

    // Close lightbox when clicking on the overlay (outside the image)
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', function(event) {
            if (event.target === lightboxOverlay) { // Check if the click is on the overlay itself
                lightboxOverlay.style.display = 'none';
            }
        });
    }
    // End Image Lightbox functionality
});

// Enhanced Facebook Pixel conversion tracking
document.addEventListener('DOMContentLoaded', function() {
    if (typeof fbq !== 'undefined') {
        // Track outbound link clicks as conversions
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.href.includes('popmel33.com')) {
                    fbq('track', 'Lead', {
                        content_name: 'App Installation Link',
                        content_category: 'App Download',
                        value: 1,
                        currency: 'BRL'
                    });
                }
            });
        });
        
        // Track time spent on page
        const timeIntervals = [30, 60, 90, 120];
        timeIntervals.forEach(seconds => {
            setTimeout(() => {
                fbq('trackCustom', 'TimeOnPage', {
                    seconds: seconds,
                    page: window.location.pathname
                });
            }, seconds * 1000);
        });
        
        // Track app value proposition views
        const observers = {};
        document.querySelectorAll('.bonus-item').forEach((element, index) => {
            observers[`bonus${index}`] = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        fbq('trackCustom', 'ValuePropositionView', {
                            proposition_text: entry.target.innerText.trim(),
                            index: index
                        });
                        // Unobserve after first view
                        observers[`bonus${index}`].unobserve(entry.target);
                    }
                });
            }, {threshold: 0.7});
            
            observers[`bonus${index}`].observe(element);
        });
    }
}); 