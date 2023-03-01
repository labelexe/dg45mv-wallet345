
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug','8d8'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config','a93'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content','e13'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData','5ad'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata','549'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry','076'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes','d3e'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page','e94'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs','dbd'),
    routes: [
      {
        path: '/docs/guide/onboarding/wallet1',
        component: ComponentCreator('/docs/guide/onboarding/wallet1','fd8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/onboarding/wallet2',
        component: ComponentCreator('/docs/guide/onboarding/wallet2','b80'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/onboarding/wallet3',
        component: ComponentCreator('/docs/guide/onboarding/wallet3','137'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/onboarding/wallet4',
        component: ComponentCreator('/docs/guide/onboarding/wallet4','d89'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/setupwallet/',
        component: ComponentCreator('/docs/guide/setupwallet/','02d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/setupwallet/complete',
        component: ComponentCreator('/docs/guide/setupwallet/complete','59e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/setupwallet/seedcreate',
        component: ComponentCreator('/docs/guide/setupwallet/seedcreate','b81'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/setupwallet/seedimport',
        component: ComponentCreator('/docs/guide/setupwallet/seedimport','385'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/setupwallet/walletpassword',
        component: ComponentCreator('/docs/guide/setupwallet/walletpassword','faf'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/splash',
        component: ComponentCreator('/docs/guide/splash','71c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/guide/success/',
        component: ComponentCreator('/docs/guide/success/','6c9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intall/setup-android',
        component: ComponentCreator('/docs/intall/setup-android','49c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intall/setup-mac',
        component: ComponentCreator('/docs/intall/setup-mac','296'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intall/start-app',
        component: ComponentCreator('/docs/intall/start-app','25c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intro',
        component: ComponentCreator('/docs/intro','aed'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/','f99'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
