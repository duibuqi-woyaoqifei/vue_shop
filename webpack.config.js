import ElementPlus from 'unplugin-element-plus/webpack'
export default defineConfig({
    css: {
      loaderOptions: {
        scss: {
          additionalData: `@use "~/static/element/index.scss" as *;`,
        },
      },
    },
    plugins: [
      ElementPlus({
        useSource: true,
      }),
    ],
  })