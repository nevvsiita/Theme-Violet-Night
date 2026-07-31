const vscode = require('vscode');

/**
 * Bongo Cat extension integration
 * @param {vscode.ExtensionContext} context
 */
function activate({ subscriptions }) {
  try {
    const statusTextArray = [
      '$(bg-leftup)$(bg-rightup)',
      '$(bg-leftdown)$(bg-rightup)',
      '$(bg-leftup)$(bg-rightdown)'
    ];
    let currentIndex = 0;
    let leftWasLastDown = false;
    let timeout;
    let statusBarVisible = true;

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    statusBarItem.text = `${statusTextArray[currentIndex]}`;
    statusBarItem.show();

    const onTextChanged = vscode.workspace.onDidChangeTextDocument((event) => {
      if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
        if (leftWasLastDown) {
          currentIndex = 2;
        } else {
          currentIndex = 1;
        }

        leftWasLastDown = !leftWasLastDown;
        statusBarItem.text = `${statusTextArray[currentIndex]}`;

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          currentIndex = 0;
          statusBarItem.text = `${statusTextArray[currentIndex]}`;
        }, 500);
      }
    });

    const toggleStatusBarCommand = vscode.commands.registerCommand('extension.toggleStatusBar', () => {
      statusBarVisible = !statusBarVisible;
      if (statusBarVisible) {
        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    });

    subscriptions.push(onTextChanged, statusBarItem, toggleStatusBarCommand);
  } catch (err) {
    console.error('Error activating Bongo Cat:', err);
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
