'use strict';

import * as vscode from 'vscode';
import * as http from 'http';

let bitcoinItem
let relativeDifference;
let currency;
let decimals;
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
    const currencyConfig = config.get('bitcoinwatcher.currency', "");
    decimals = config.get('bitcoinwatcher.decimals');

    currency = setDefaultCurrency(currencyConfig);
    relativeDifference = calculateRelativeDifference(relativeConfig);
    createItem()
}
function setDefaultCurrency(val): string {
    return val.toUpperCase()
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
    const url = "http://api.coindesk.com/v1/bpi/currentprice/" + currency + ".json";
    httpGet(url).then(response => {
        const responseObj = JSON.parse(response)
        updateStatusWithResult(responseObj.bpi[currency].code, responseObj.bpi[currency].rate_float);
    })
}

function userDefinedPrecision(rate): number {
    return rate.toFixed(decimals);
}

function updateStatusWithResult(code, rate): void {
    var data = userDefinedPrecision(rate)

    if (relativeDifference) {
        bitcoinItem.text = "Bitcoin: " + data.toString() + " " + code;
        bitcoinItem.tooltip = " RD: " + relativeDifference.toString()
        if (data > relativeDifference) {
            bitcoinItem.color = "lightgreen"
        } else {
            bitcoinItem.color = "tomato"
        }
    } else {
        bitcoinItem.text = "Bitcoin(USD): " + data.toString();
    }
}

function httpGet(url): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get(url, response => {
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
