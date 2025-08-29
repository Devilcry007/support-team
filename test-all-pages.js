// Автоматическое тестирование всех страниц сайта
(function() {
    'use strict';

    class PageTester {
        constructor() {
            this.results = {};
            this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
            this.init();
        }

        init() {
            console.log('🧪 Запуск тестирования страницы:', this.currentPage);
            this.runAllTests();
        }

        runAllTests() {
            this.testCSSOptimization();
            this.testJavaScriptOptimization();
            this.testImageOptimization();
            this.testFontAwesomeReplacement();
            this.testLazyLoading();
            this.testPerformance();
            this.generateReport();
        }

        // Тест CSS оптимизации
        testCSSOptimization() {
            console.log('🎨 Тестирование CSS оптимизации...');
            
            const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
            let minifiedCount = 0;
            let totalSize = 0;

            cssLinks.forEach(link => {
                const href = link.href;
                if (href.includes('.min.')) {
                    minifiedCount++;
                    console.log(`✅ Минифицированный CSS: ${href.split('/').pop()}`);
                } else if (href.includes('font-awesome')) {
                    console.log(`⚠️ Font Awesome найден: ${href.split('/').pop()}`);
                } else {
                    console.log(`ℹ️ Обычный CSS: ${href.split('/').pop()}`);
                }
            });

            this.results.css = {
                minified: minifiedCount,
                total: cssLinks.length,
                fontAwesomeFound: document.querySelectorAll('link[href*="font-awesome"]').length > 0
            };

            console.log(`📊 CSS: ${minifiedCount}/${cssLinks.length} минифицированы`);
        }

        // Тест JavaScript оптимизации
        testJavaScriptOptimization() {
            console.log('⚙️ Тестирование JavaScript оптимизации...');
            
            const scripts = document.querySelectorAll('script[src]');
            let minifiedCount = 0;
            let externalCount = 0;

            scripts.forEach(script => {
                const src = script.src;
                if (src.includes('.min.')) {
                    minifiedCount++;
                    console.log(`✅ Минифицированный JS: ${src.split('/').pop()}`);
                } else {
                    console.log(`ℹ️ Обычный JS: ${src.split('/').pop()}`);
                }

                if (src.includes('cdnjs.cloudflare.com')) {
                    externalCount++;
                }
            });

            this.results.javascript = {
                minified: minifiedCount,
                total: scripts.length,
                external: externalCount
            };

            console.log(`📊 JavaScript: ${minifiedCount}/${scripts.length} минифицированы`);
        }

        // Тест оптимизации изображений
        testImageOptimization() {
            console.log('🖼️ Тестирование оптимизации изображений...');
            
            const images = document.querySelectorAll('img');
            let lazyImages = 0;
            let highPriorityImages = 0;
            let missingAlt = 0;

            images.forEach(img => {
                if (img.hasAttribute('data-src')) {
                    lazyImages++;
                }
                if (img.classList.contains('high-priority')) {
                    highPriorityImages++;
                }
                if (!img.hasAttribute('alt')) {
                    missingAlt++;
                }
            });

            this.results.images = {
                total: images.length,
                lazy: lazyImages,
                highPriority: highPriorityImages,
                missingAlt: missingAlt
            };

            console.log(`📊 Изображения: ${lazyImages} lazy, ${highPriorityImages} высокий приоритет`);
        }

        // Тест замены Font Awesome
        testFontAwesomeReplacement() {
            console.log('🎯 Тестирование замены Font Awesome...');
            
            const fontAwesomeIcons = document.querySelectorAll('i[class*="fa-"]');
            const svgIcons = document.querySelectorAll('svg use');
            const inlineIcons = document.querySelectorAll('svg:not([style*="display: none"])');

            this.results.fontAwesome = {
                found: fontAwesomeIcons.length,
                svgReplacement: svgIcons.length,
                inlineIcons: inlineIcons.length
            };

            if (fontAwesomeIcons.length > 0) {
                console.log(`⚠️ Найдено ${fontAwesomeIcons.length} Font Awesome иконок`);
            } else {
                console.log('✅ Font Awesome иконки не найдены');
            }

            if (svgIcons.length > 0) {
                console.log(`✅ Найдено ${svgIcons.length} SVG иконок`);
            }
        }

        // Тест Lazy Loading
        testLazyLoading() {
            console.log('🔄 Тестирование Lazy Loading...');
            
            const lazyLoader = window.lazyLoader;
            const intersectionObserver = 'IntersectionObserver' in window;
            const lazyImages = document.querySelectorAll('img[data-src]');

            this.results.lazyLoading = {
                initialized: !!lazyLoader,
                intersectionObserver: intersectionObserver,
                lazyImages: lazyImages.length,
                working: lazyImages.length > 0 && !!lazyLoader
            };

            if (lazyLoader) {
                console.log('✅ LazyLoader инициализирован');
            } else {
                console.log('❌ LazyLoader не инициализирован');
            }

            if (intersectionObserver) {
                console.log('✅ Intersection Observer поддерживается');
            } else {
                console.log('⚠️ Intersection Observer не поддерживается');
            }

            console.log(`📊 Lazy images: ${lazyImages.length}`);
        }

        // Тест производительности
        testPerformance() {
            console.log('⚡ Тестирование производительности...');
            
            const navigation = performance.getEntriesByType('navigation')[0];
            const domLoadTime = navigation.domContentLoadedEventEnd - navigation.startTime;
            const pageLoadTime = navigation.loadEventEnd - navigation.startTime;

            this.results.performance = {
                domLoadTime: Math.round(domLoadTime),
                pageLoadTime: Math.round(pageLoadTime),
                totalResources: performance.getEntriesByType('resource').length
            };

            console.log(`📊 DOM загружен за ${Math.round(domLoadTime)}ms`);
            console.log(`📊 Страница загружена за ${Math.round(pageLoadTime)}ms`);
        }

        // Генерация отчета
        generateReport() {
            console.log('\n📋 ОТЧЕТ О ТЕСТИРОВАНИИ');
            console.log('=' .repeat(50));
            
            // CSS
            const cssScore = this.results.css.minified / this.results.css.total * 100;
            console.log(`🎨 CSS оптимизация: ${cssScore.toFixed(1)}% (${this.results.css.minified}/${this.results.css.total})`);
            
            if (this.results.css.fontAwesomeFound) {
                console.log('⚠️ Font Awesome все еще используется');
            }

            // JavaScript
            const jsScore = this.results.javascript.minified / this.results.javascript.total * 100;
            console.log(`⚙️ JavaScript оптимизация: ${jsScore.toFixed(1)}% (${this.results.javascript.minified}/${this.results.javascript.total})`);

            // Изображения
            const lazyScore = this.results.images.lazy / this.results.images.total * 100;
            console.log(`🖼️ Lazy loading: ${lazyScore.toFixed(1)}% (${this.results.images.lazy}/${this.results.images.total})`);

            if (this.results.images.missingAlt > 0) {
                console.log(`⚠️ ${this.results.images.missingAlt} изображений без alt атрибута`);
            }

            // Font Awesome
            if (this.results.fontAwesome.found > 0) {
                console.log(`⚠️ ${this.results.fontAwesome.found} Font Awesome иконок не заменены`);
            } else {
                console.log('✅ Font Awesome полностью заменен');
            }

            // Lazy Loading
            if (this.results.lazyLoading.working) {
                console.log('✅ Lazy Loading работает корректно');
            } else {
                console.log('❌ Lazy Loading не настроен');
            }

            // Общая оценка
            const totalScore = this.calculateTotalScore();
            console.log(`\n🏆 ОБЩАЯ ОЦЕНКА: ${totalScore.toFixed(1)}/100`);
            
            if (totalScore >= 90) {
                console.log('🌟 Отлично! Сайт хорошо оптимизирован');
            } else if (totalScore >= 70) {
                console.log('👍 Хорошо! Есть возможности для улучшения');
            } else {
                console.log('⚠️ Требует доработки');
            }

            // Рекомендации
            this.generateRecommendations();
        }

        // Расчет общей оценки
        calculateTotalScore() {
            let score = 0;
            
            // CSS (25 баллов)
            const cssScore = this.results.css.minified / this.results.css.total * 25;
            score += cssScore;
            
            // JavaScript (25 баллов)
            const jsScore = this.results.javascript.minified / this.results.javascript.total * 25;
            score += jsScore;
            
            // Изображения (20 баллов)
            const imageScore = this.results.images.lazy / Math.max(this.results.images.total, 1) * 20;
            score += imageScore;
            
            // Font Awesome (15 баллов)
            if (this.results.fontAwesome.found === 0) {
                score += 15;
            }
            
            // Lazy Loading (15 баллов)
            if (this.results.lazyLoading.working) {
                score += 15;
            }
            
            return score;
        }

        // Генерация рекомендаций
        generateRecommendations() {
            console.log('\n💡 РЕКОМЕНДАЦИИ:');
            
            if (this.results.css.minified < this.results.css.total) {
                console.log('• Минифицировать оставшиеся CSS файлы');
            }
            
            if (this.results.javascript.minified < this.results.javascript.total) {
                console.log('• Минифицировать оставшиеся JavaScript файлы');
            }
            
            if (this.results.css.fontAwesomeFound) {
                console.log('• Заменить оставшиеся Font Awesome иконки на SVG');
            }
            
            if (this.results.images.lazy < this.results.images.total) {
                console.log('• Настроить lazy loading для всех изображений');
            }
            
            if (this.results.images.missingAlt > 0) {
                console.log('• Добавить alt атрибуты для изображений');
            }
            
            if (!this.results.lazyLoading.working) {
                console.log('• Настроить систему lazy loading');
            }
        }
    }

    // Автоматический запуск тестирования
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PageTester();
        });
    } else {
        new PageTester();
    }

    // Экспорт для ручного использования
    window.PageTester = PageTester;

})();
