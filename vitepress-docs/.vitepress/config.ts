import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Awesome key factory',
  description: 'A type-safe key factory for managing react-query keys with full TypeScript support.',
  base: '/awesome-key-factory/',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/introduction' },
      { text: 'API Reference', link: '/api-reference/create-key-factory' },
      { text: 'Examples', link: '/examples/react-query-setup' },
      { text: 'Blog', link: '/blog/managing-react-query-keys' }
    ],
    
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guides/introduction' },
          { text: 'Installation', link: '/guides/installation' },
          { text: 'Quick Start', link: '/guides/quick-start' }
        ]
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Base Key', link: '/core-concepts/base-key' },
          { text: 'Key Generation', link: '/core-concepts/key-generation' },
          { text: 'Schema Structure', link: '/core-concepts/schema-structure' }
        ]
      },
      {
        text: 'Usage Guide',
        items: [
          { text: 'Basic Usage', link: '/usage-guide/basic-usage' },
          { text: 'Advanced Patterns', link: '/usage-guide/advanced-patterns' }
        ]
      },
      {
        text: 'TypeScript',
        items: [
          { text: 'Type Inference', link: '/typescript/type-inference' },
          { text: 'Custom Types', link: '/typescript/custom-types' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'createKeyFactory', link: '/api-reference/create-key-factory' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'React Query Setup', link: '/examples/react-query-setup' },
          { text: 'API Versioning', link: '/examples/api-versioning' },
          { text: 'E-commerce App', link: '/examples/ecommerce-app' }
        ]
      },
      {
        text: 'Best Practices',
        link: '/best-practices'
      },
      {
        text: 'FAQ',
        link: '/faq'
      },
      {
        text: 'Blog',
        items: [
          { text: 'Managing React Query Keys', link: '/blog/managing-react-query-keys' }
        ]
      }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bhaskar20/awesome-key-factory' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024'
    },
    
    search: {
      provider: 'local'
    }
  }
})
