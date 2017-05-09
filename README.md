# Bitcoinwatcher README

![alt text](https://github.com/GrayOverride/vscode-bitcoinStatusbar/blob/master/assets/logo.png?raw=true "bitcoinwatcher logo")

This extension allows you to see the current bitcoin value in your statusbar.

![alt text](https://github.com/GrayOverride/vscode-bitcoinStatusbar/blob/master/assets/screenshot.PNG?raw=true "Example: color is from one of the options")
___
### Options
```
{
    //Show percentage difference between current bitcoin value and the defined value, if multiple values then the average is calculated
    bitcoinwatcher.useRelativeDifference : [<number>],
    
    //Change the displayed currency
    bitcoinwatcher.currency: "<string>" (default: usd) 
    
    //Change the amount of decimals
    bitcoinwatcher.decimals: <number> (default: 2)

    //see change of value from yesterday
    bitcoinwatcher.relativeToYesterday : <boolean> (default: false)
}
```

_“Powered by [CoinDesk]"_

[CoinDesk]: http://www.coindesk.com/price/
