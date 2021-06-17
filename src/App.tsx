import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account, transcation} from "./Utils/Interfaces";
import {generateKeyAddressPair} from "./Utils/Functions";

interface AppProps {
}

interface AppState {
    accountIdCount: number,
    accounts: account[],
    transactionIdCount: number,
    unusedTransactions: transcation[]
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            accountIdCount: 0,
            accounts: [],
            transactionIdCount: 0,
            unusedTransactions: []
        };
    }

    addAccount = () : void => {
        let keys = generateKeyAddressPair();
        let count = this.state.accountIdCount;

        let a : account = {
            id: count,
            privateKey: keys.privateKey,
            address: keys.address
        }
        this.setState({accountIdCount: count + 1});

        a.balance = Math.floor(Math.random() * 1001);

        let arr : account[] = this.state.accounts;
        arr.push(a);
        this.setState({accounts: arr});
    }

    addTransaction = () : void => {
        let count = this.state.transactionIdCount;

        let t : transcation = {
            id: count,
            from: "me",
            to: "u uwu",
            amount: 187,
            signature: "alge"
        }
        this.setState({transactionIdCount: count + 1});

        let arr : transcation[] = this.state.unusedTransactions;
        arr.push(t);
        this.setState({unusedTransactions: arr});
    }


    render() {
        return <div className="App">
            <div id={"upperContent"}>
                <UpperList
                    title={"accounts"}
                    accounts={this.state.accounts}
                    className={"accountListContainer"}
                    addFunction={this.addAccount}
                />
                <UpperList
                    title={"transactions"}
                    transactions={this.state.unusedTransactions}
                    className={"transactionListContainer"}
                    addFunction={this.addTransaction}
                />
            </div>
        </div>;
    };
}

export default App;