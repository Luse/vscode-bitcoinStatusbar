'use strict';

import * as vscode from 'vscode';
import * as https from 'https';


export function activate(context: vscode.ExtensionContext) {
    refresh()

}


export function deactivate() {
}

function refresh(): void {
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