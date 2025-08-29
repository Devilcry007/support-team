import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    // Минификация HTML
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Оптимизация CSS
    cssMinify: true,
    
    // Разделение на чанки
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        training: resolve(__dirname, 'training.html'),
        qviz: resolve(__dirname, 'qviz.html'),
        rpgQuiz: resolve(__dirname, 'rpg-quiz.html'),
        account: resolve(__dirname, 'account.html')
      },
      output: {
        // Хэши для кэширования
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    
    // Оптимизация изображений
    assetsInlineLimit: 4096, // Встраивать маленькие изображения как base64
    
    // Сжатие
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },
  
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['three']
  },
  
  // Сервер разработки
  server: {
    port: 3000,
    open: true
  }
})
