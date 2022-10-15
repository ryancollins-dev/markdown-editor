const {
  app,
  Menu,
  shell,
  ipcMain,
  BrowserWindow,
  globalShortcut,
  dialog,
} = require('electron');

const fs = require('fs');

function saveFile() {
  console.log('Saving the file');

  const window = BrowserWindow.getFocusedWindow();
  window.webContents.send('editor-event', 'save');
}

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+S', () => {
    saveFile();
  });
});

ipcMain.on('save', (event, arg) => {
  console.log(`Saving content of the file`);
  console.log(arg);

  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: 'Save markdown file',
    filters: [
      {
        name: 'MyFile',
        extensions: ['md'],
      },
    ],
  };

  const filename = dialog.showSaveDialogSync(window, options);
  if (filename) {
    console.log(`Saving content to the file: ${filename}`);
    fs.writeFileSync(filename, arg);
  }
});

ipcMain.on('editor-reply', (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
});

const template = [
  {
    label: 'Format',
    submenu: [
      {
        label: 'Toggle Bold',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-bold');
        },
      },
      {
        label: 'Toggle Italic',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-italic');
        },
      },
      {
        label: 'Toggle Strikethrough',
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send('editor-event', 'toggle-strikethrough');
        },
      },
    ],
  },
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

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [{ role: 'about' }, { type: 'separator' }, { role: 'quit' }],
  });
}

const menu = Menu.buildFromTemplate(template);

module.exports = menu;
