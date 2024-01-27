import { defineConfig } from 'histoire'
import { HstSvelte } from '@histoire/plugin-svelte'

export default defineConfig({
  storyMatch: ['src/lib/*.story.svelte'],
  plugins: [HstSvelte()],
})
