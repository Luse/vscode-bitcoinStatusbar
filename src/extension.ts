'use strict';

import * as vscode from 'vscode';
import * as https from 'https';

let bitcoinItem
export function activate(context: vscode.ExtensionContext) {
    bitcoinItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    bitcoinItem.text = "loading";
    bitcoinItem.show();
    
    refresh()
    setInterval(refresh, 60000);
}


export function deactivate() {
}

function refresh(): void {
    createItem()
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
    bitcoinItem.text = data.toString();
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
