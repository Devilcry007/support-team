// Lazy Loading Implementation
(function() {
  'use strict';

  // Check if Intersection Observer is supported
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  
  // Lazy loading class
  class LazyLoader {
    constructor() {
      this.images = [];
      this.observer = null;
      this.init();
    }

    init() {
      // Add fallback class if no Intersection Observer
      if (!supportsIntersectionObserver) {
        document.body.classList.add('no-intersection');
        this.loadAllImages();
        return;
      }

      // Setup Intersection Observer
      this.setupObserver();
      this.findImages();
    }

    setupObserver() {
      const options = {
        root: null,
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, options);
    }

    findImages() {
      // Find all images with data-src attribute
      this.images = document.querySelectorAll('img[data-src]');
      
      // Observe each image
      this.images.forEach(img => {
        this.observer.observe(img);
      });
    }

    loadImage(img) {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      const sizes = img.dataset.sizes;

      // Create new image to preload
      const tempImage = new Image();
      
      tempImage.onload = () => {
        // Image loaded successfully
        img.src = src;
        if (srcset) img.srcset = srcset;
        if (sizes) img.sizes = sizes;
        
        img.classList.remove('lazy-image');
        img.classList.add('loaded');
        
        // Remove loading attributes
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.removeAttribute('data-sizes');
        
        // Trigger custom event
        this.triggerEvent('imageLoaded', { image: img });
      };

      tempImage.onerror = () => {
        // Image failed to load
        img.classList.remove('lazy-image');
        img.classList.add('error');
        
        // Show fallback or placeholder
        this.showErrorPlaceholder(img);
        
        // Trigger custom event
        this.triggerEvent('imageError', { image: img });
      };

      // Start loading
      tempImage.src = src;
      if (srcset) tempImage.srcset = srcset;
    }

    showErrorPlaceholder(img) {
      // Create error placeholder
      const placeholder = document.createElement('div');
      placeholder.className = 'lazy-placeholder';
      placeholder.style.width = img.width + 'px';
      placeholder.style.height = img.height + 'px';
      placeholder.innerHTML = '<span style="color: #999; font-size: 12px;">Image not available</span>';
      
      // Replace image with placeholder
      img.parentNode.insertBefore(placeholder, img);
      img.style.display = 'none';
    }

    loadAllImages() {
      // Fallback: load all images immediately
      this.images = document.querySelectorAll('img[data-src]');
      this.images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy-image');
        img.classList.add('loaded');
      });
    }

    triggerEvent(eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.dispatchEvent(event);
    }

    // Public method to refresh
    refresh() {
      if (this.observer) {
        this.observer.disconnect();
      }
      this.init();
    }
  }

  // Initialize when DOM is ready
  function initLazyLoading() {
    window.lazyLoader = new LazyLoader();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
  } else {
    initLazyLoading();
  }

  // Expose for manual initialization
  window.LazyLoader = LazyLoader;

  // Utility function to convert existing images to lazy loading
  window.convertToLazyLoading = function() {
    const images = document.querySelectorAll('img:not([data-src])');
    
    images.forEach(img => {
      // Skip if already processed or is above the fold
      if (img.classList.contains('high-priority') || img.classList.contains('lazy-image')) {
        return;
      }

      // Get current src
      const src = img.src;
      if (!src) return;

      // Add lazy loading attributes
      img.dataset.src = src;
      img.classList.add('lazy-image');
      
      // Remove src to prevent immediate loading
      img.removeAttribute('src');
      
      // Add placeholder
      if (!img.classList.contains('skeleton-image')) {
        img.classList.add('skeleton-image');
      }
    });

    // Refresh lazy loader
    if (window.lazyLoader) {
      window.lazyLoader.refresh();
    }
  };

  // Auto-convert images after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.convertToLazyLoading();
    }, 1000); // Wait 1 second after page load
  });

})();
