// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sign in with Tezos',
  tagline: 'Ditch passwords once and for all',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://docs.siwt.xyz',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'StakeNow', // Usually your GitHub org/user name.
  projectName: 'siwt', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/StakeNow/SIWT',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '',
        logo: {
          alt: 'Sign in with Tezos Logo',
          src: 'img/siwt-logo.svg',
        },
        items: [
          {
            href: 'https://github.com/StakeNow/SIWT',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting started',
                to: 'getting-started/ui',
              },
              {
                label: 'Access control query',
                to: '/access-control-query',
              },
              {
                label: 'Core',
                to: '/core',
              },
              {
                label: 'SDK',
                to: '/sdk',
              },
              {
                label: 'Discord bot',
                to: '/discord-bot/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.com/invite/6J3bjhkpxm',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/stakenow',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/StakeNow/SIWT',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Sign in with Tezos.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
