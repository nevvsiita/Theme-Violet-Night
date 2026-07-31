const vscode = require('vscode');

/**
 * Bongo Cat en la barra de estado
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  try {
    const statusTextArray = [
      '$(bg-leftup)$(bg-rightup)',
      '$(bg-leftdown)$(bg-rightup)',
      '$(bg-leftup)$(bg-rightdown)'
    ];

    let currentIndex = 0;
    let leftWasLastDown = false;
    let timeout;
    let isVisible = true;

    // Crear el ítem de la barra de estado con id único y alta prioridad
    const statusBarItem = vscode.window.createStatusBarItem(
      'cozyVioletBongoCat',
      vscode.StatusBarAlignment.Right,
      10000
    );

    statusBarItem.name = 'Bongo Cat Mascot';
    statusBarItem.text = statusTextArray[0];
    statusBarItem.tooltip = '🐱 Bongo Cat — Haz clic para toggle u opcionales / ¡Escribe para animarlo!';
    statusBarItem.command = 'cozyViolet.toggleBongoCat';
    statusBarItem.show();

    // Animar al escribir en el documento activo
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

    // Registro de comando interactivo
    const toggleHandler = () => {
      isVisible = !isVisible;
      if (isVisible) {
        statusBarItem.show();
        vscode.window.showInformationMessage('🐱 Bongo Cat está visible en la barra de estado (abajo a la derecha).');
      } else {
        statusBarItem.hide();
        vscode.window.showInformationMessage('🐱 Bongo Cat se ha ocultado.');
      }
    };

    const cmd1 = vscode.commands.registerCommand('extension.toggleStatusBar', toggleHandler);
    const cmd2 = vscode.commands.registerCommand('cozyViolet.toggleBongoCat', toggleHandler);

    context.subscriptions.push(cmd1, cmd2);

    console.log('Bongo Cat activado correctamente en la barra de estado.');
  } catch (err) {
    console.error('Error al activar Bongo Cat:', err);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
