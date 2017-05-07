# Bitcoinwatcher README

![alt text](https://github.com/GrayOverride/vscode-bitcoinStatusbar/blob/master/assets/logo.png?raw=true "bitcoinwatcher logo")

This extension allows you to see the current bitcoin value in your statusbar.

___
### Options
```
{
    //use color to show negative or positive difference between current bitcoin value and the defined value, if multiple values then the average is calculated
    bitcoinwatcher.useRelativeDifference : [<number>],
    
    //change the displayed currency
    bitcoinwatcher.currency: "<string>" (default: usd) 
    
    //change the amount of decimals
    bitcoinwatcher.decimals: <number> (default: 2)
}
```

_“Powered by [CoinDesk]"_

[CoinDesk]: http://www.coindesk.com/price/
