/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  siwtSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/ui', 'getting-started/server', 'getting-started/putting-it-together'],
    },
    'access-control-query',
    'core',
    'sdk',
    {
      type: 'category',
      label: 'Discord bot',
      items: ['discord-bot/intro', 'discord-bot/ui', 'discord-bot/server'],
    }, 
  ],
};

module.exports = sidebars;
