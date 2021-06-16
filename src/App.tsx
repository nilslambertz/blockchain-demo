import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account} from "./Utils/Interfaces";
import Account from "./Components/Account/Account";
import {generateKeyAddressPair} from "./Utils/Functions";

const crypto = require('crypto');
const primeLength = 120;

interface AppProps {
}

interface AppState {
    idCount: number,
    accounts: account[],
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            idCount: 0,
            accounts: []
        };
    }

    addAccount = (random?: boolean) : void => {
        let keys = generateKeyAddressPair();
        let count = this.state.idCount;

        let a : account = {
            id: count,
            privateKey: keys.privateKey,
            address: keys.address
        }
        this.setState({idCount: count + 1})

        if(random) {
            a.balance = Math.floor(Math.random() * 1001);
        }

        let arr : account[] = this.state.accounts;
        arr.push(a);
        this.setState({accounts: arr});
        console.log(a);
    }

    render() {
        return <div className="App">
            <div id={"upperContent"} onClick={() => this.addAccount(true)}>
                <UpperList
                    title={"accounts"}
                    accounts={this.state.accounts}
                />
                <UpperList
                    title={"transactions"}
                />
                <UpperList
                    title={"settings"}
                />
            </div>
        </div>;
    };
}

export default App;