const { app, Menu, shell } = require('electron');

const template = [
  {
    role: 'help',
    submenu: [
      {
        label: 'About Editor Component',
        click() {
          shell.openExternal('https://simplemde.com');
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }],
  });
}

if (process.env.DEBUG) {
  template.push({
    label: 'Debugging',
    submenu: [
      {
        label: 'Dev Tools',
        role: 'toggleDevTools',
      },

      { type: 'separator' },
      {
        role: 'reload',
        accelerator: 'Alt+R',
      },
    ],
  });
}

const menu = Menu.buildFromTemplate(template);
module.exports = menu;
