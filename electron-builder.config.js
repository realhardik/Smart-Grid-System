const path = require('path');

module.exports = {
  appId: 'com.smartwatergrid.dashboard',
  productName: 'Smart Water Grid Dashboard',
  directories: {
    output: 'dist-electron',
    buildResources: 'build',
  },
  files: [
    'out/**/*',
    '.next/**/*',
    'electron/**/*',
    'package.json',
    'node_modules/**/*',
    '!node_modules/.cache/**/*',
  ],
  extraResources: [
    {
      from: 'public',
      to: 'public',
      filter: ['**/*'],
    },
  ],
  mac: {
    category: 'public.app-category.utilities',
    target: ['dmg', 'zip'],
    icon: 'public/icon.svg',
  },
  win: {
    target: ['nsis', 'portable'],
    icon: 'public/icon.svg',
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Utility',
    icon: 'public/icon.svg',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
};

