const vscode = require('vscode');

/**
 * Bongo Cat Mascot en la barra de estado
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  try {
    // Array de estados animados con fallback garantizado (Emojis + ASCII + Iconos Font)
    const statusTextArray = [
      '🐱 ฅ^•ﻌ•^ฅ $(bg-leftup)$(bg-rightup)',
      '🐾 ฅ^•ﻌ•^ฅ $(bg-leftdown)$(bg-rightup)',
      'ฅ^•ﻌ•^ฅ 🐾 $(bg-leftup)$(bg-rightdown)'
    ];

    let currentIndex = 0;
    let leftWasLastDown = false;
    let timeout;
    let isVisible = true;

    // Crear el ítem en el lado derecho de la barra de estado con alta prioridad
    const statusBarItem = vscode.window.createStatusBarItem(
      'cozyVioletBongoCat',
      vscode.StatusBarAlignment.Right,
      10000
    );

    statusBarItem.name = 'Bongo Cat Mascot';
    statusBarItem.text = statusTextArray[0];
    statusBarItem.tooltip = '🐱 Bongo Cat — ¡Escribe para animarme o haz clic para acariciarme!';
    statusBarItem.command = 'cozyViolet.petBongoCat';
    statusBarItem.show();

    // Evento al escribir en el documento activo
    const onTextChanged = vscode.workspace.onDidChangeTextDocument((event) => {
      if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
        currentIndex = leftWasLastDown ? 2 : 1;
        leftWasLastDown = !leftWasLastDown;
        statusBarItem.text = statusTextArray[currentIndex];

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          currentIndex = 0;
          statusBarItem.text = statusTextArray[currentIndex];
        }, 500);
      }
    });

    context.subscriptions.push(onTextChanged, statusBarItem);

    // Registro de comandos
    const toggleHandler = () => {
      isVisible = !isVisible;
      if (isVisible) {
        statusBarItem.show();
        vscode.window.showInformationMessage('🐱 Bongo Cat está visible en la barra de estado.');
      } else {
        statusBarItem.hide();
        vscode.window.showInformationMessage('🐱 Bongo Cat se ha ocultado.');
      }
    };

    const petMessages = [
      'ฅ^•ﻌ•^ฅ *purrrrrr* 💜 ¡Gracias por acariciarme!',
      '(=^‧^=) ¡Bongo Cat está feliz programando contigo!',
      '(ฅ'ω'ฅ) 🐾 ¡Patitas en el teclado!',
      '🐱 ¡Miau! Sigue programando increíble ✨'
    ];

    const petHandler = () => {
      const msg = petMessages[Math.floor(Math.random() * petMessages.length)];
      vscode.window.showInformationMessage(msg);
    };

    const cmd1 = vscode.commands.registerCommand('extension.toggleStatusBar', toggleHandler);
    const cmd2 = vscode.commands.registerCommand('cozyViolet.toggleBongoCat', toggleHandler);
    const cmd3 = vscode.commands.registerCommand('cozyViolet.petBongoCat', petHandler);

    context.subscriptions.push(cmd1, cmd2, cmd3);

    console.log('Bongo Cat activado correctamente en la barra de estado.');
  } catch (err) {
    console.error('Error al activar Bongo Cat:', err);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
