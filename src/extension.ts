'use strict';

import * as vscode from 'vscode';
import * as https from 'https';

let bitcoinItem
let relativeDifference;
export function activate(context: vscode.ExtensionContext) {
    bitcoinItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    bitcoinItem.text = "loading";
    bitcoinItem.show();

    refresh();
    setInterval(refresh, 60000);
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(refresh))

}


export function deactivate() {
}

function refresh(): void {
    const config = vscode.workspace.getConfiguration();
    const relativeConfig = config.get('bitcoinwatcher.useRelativeDifference', [])
    relativeDifference = calculateRelativeDifference(relativeConfig);
    createItem()
}
function calculateRelativeDifference(input): number {
    let average = 0;
    input.forEach(element => {
        parseInt(element)
        average += element
    });
    return average / input.length
}

function createItem(): void {
    const url = "https://xbtprovider.com/api/rates?currency=eur";
    httpGet(url).then(response => {
        const responseObj = JSON.parse(response)
        updateStatusWithResult(responseObj.data);
    })

}
function updateStatusWithResult(result): void {
    var data = result.usdAverage
    if (relativeDifference) {
        bitcoinItem.text = "Bitcoin(USD): " + data.toString();
        bitcoinItem.tooltip = " RD: " + relativeDifference.toString()
        if(data > relativeDifference){
            bitcoinItem.color = "lightgreen"
        }else{
            bitcoinItem.color = "tomato"
        }
    } else {
        bitcoinItem.text = "Bitcoin(USD): " + data.toString();
    }
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
