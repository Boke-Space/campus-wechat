import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    uni({
      vueOptions: {
        reactivityTransform: true, // 开启响应式语法糖
      },
    }),
    AutoImport({
      imports: [
        'vue',
        {
          pinia: ['storeToRefs', 'defineStore'],
        },
      ],
      dirs: ['src/api/**', 'src/service/**', 'src/hooks/**', 'src/store/**'],
      eslintrc: {
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({
      dirs: ['src/components', 'src/base', 'src/common'],
      extensions: ['vue'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
