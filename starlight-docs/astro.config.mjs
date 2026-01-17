import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  base: '/react-query-key-factory/',
  site: 'https://yourusername.github.io',
  integrations: [
    starlight({
      title: 'React Query Key Factory',
      description: 'A type-safe key factory for managing react-query keys with full TypeScript support.',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/yourusername/react-query-key-factory',
        },
      ],
      customCss: [
        './src/custom.css',
      ],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Introduction', link: '/guides/introduction/' },
            { label: 'Installation', link: '/guides/installation/' },
            { label: 'Quick Start', link: '/guides/quick-start/' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { label: 'Base Key', link: '/core-concepts/base-key/' },
            { label: 'Schema Structure', link: '/core-concepts/schema-structure/' },
            { label: 'Key Generation', link: '/core-concepts/key-generation/' },
          ],
        },
        {
          label: 'Usage Guide',
          items: [
            { label: 'Basic Usage', link: '/usage-guide/basic-usage/' },
            { label: 'Advanced Patterns', link: '/usage-guide/advanced-patterns/' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'createKeyFactory', link: '/api-reference/create-key-factory/' },
          ],
        },
        {
          label: 'Examples',
          items: [
            { label: 'React Query Setup', link: '/examples/react-query-setup/' },
            { label: 'E-commerce App', link: '/examples/ecommerce-app/' },
            { label: 'API Versioning', link: '/examples/api-versioning/' },
          ],
        },
        {
          label: 'TypeScript',
          items: [
            { label: 'Type Inference', link: '/typescript/type-inference/' },
            { label: 'Custom Types', link: '/typescript/custom-types/' },
          ],
        },
        {
          label: 'Best Practices',
          link: '/best-practices/',
        },
        {
          label: 'FAQ',
          link: '/faq/',
        },
      ],
    }),
  ],
});
