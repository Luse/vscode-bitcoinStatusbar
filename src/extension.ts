'use strict';

import * as vscode from 'vscode';
import * as http from 'http';

let bitcoinItem
let relativeDifference;
let currency;
let decimals;
let useRelativeToYesterday;
let historicalData;
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
    const relativeConfig = config.get('bitcoinwatcher.useRelativeDifference', []);
    const currencyConfig = config.get('bitcoinwatcher.currency', "");
    useRelativeToYesterday = config.get('bitcoinwatcher.relativeToYesterday');
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
        updateStatusWithResult(currency, responseObj.bpi[currency].rate_float);
    })
}

function fetchHistoricalData(url): Promise<string> {
    return httpGet(url).then(response => {
        return response
    })
}

function relativeToYesterday(input): Promise<any> {
    if (input) {
        const url = "http://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday&currency=" + currency
        return fetchHistoricalData(url).then(response => {
            const responseObj = JSON.parse(response);
            return responseObj.bpi[Object.keys(responseObj.bpi)[0]]
        })
    }
}

function userDefinedPrecision(rate): number {
    return rate.toFixed(decimals);
}

function updateStatusWithResult(code, rate): void {
    var data = userDefinedPrecision(rate)
    bitcoinItem.text = "Bitcoin: " + data.toString() + " " + code;
    if (useRelativeToYesterday) {
        relativeToYesterday(useRelativeToYesterday).then(x => {
            var val = userDefinedPrecision((rate - x))
            if (val > 0) {
                bitcoinItem.text += " (+" + val.toString() + ")";
                bitcoinItem.color = "lightgreen"
            } else {
                bitcoinItem.text += " (" + val.toString() + ")";
                bitcoinItem.color = "LightSalmon"
            }
        })
    }
    if (relativeDifference) {
        //bitcoinItem.tooltip = " RD: " + relativeDifference.toString()
        var percentage = userDefinedPrecision((rate - relativeDifference) / relativeDifference * 100).toString() + "%";
        if (rate > relativeDifference) {
            bitcoinItem.color = "MediumVioletRed";
            bitcoinItem.text += "(+" + percentage + ")"
        } else {
            bitcoinItem.text += "(-" + percentage + ")"
            bitcoinItem.color = "tomato"
        }
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
