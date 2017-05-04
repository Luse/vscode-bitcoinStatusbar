'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as https from 'https';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    refresh()
    // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    //     // The code you place here will be executed every time your command is executed
    //     console.log('Congratulations, your extension "bitcoinwatcher" is now active!');

    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World!');

    // });

    // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function refresh(): void {
    //const config = vscode.workspace.getConfiguration()

    createItem()
}

function createItem(): void {
    const url = "https://xbtprovider.com/api/rates?currency=eur";
    console.log('starting');
    httpGet(url).then(response => {
        const responseObj = JSON.parse(response)
        updateStatusWithResult(responseObj.data);
    })


}
function updateStatusWithResult(result): void {
    var data = result.usdAverage
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    item.text = data;
    item.show();
}


function httpGet(url): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            let responseData = '';
            response.on('data', chunk => responseData += chunk);
            response.on('end', () => {
                if (response.statusCode === 200) {
                    resolve(responseData)
                } else {
                    reject('fail: ' + response.statusCode)
                }
            })
        })
    })
}