import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account, accountArray} from "./Utils/Interfaces";
import Account from "./Components/Account/Account";

interface AppProps {
}

interface AppState {
    idCount: number,
    accounts: accountArray,
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            idCount: 0,
            accounts: []
        };
    }


    render() {
        return <div className="App">
            <div id={"upperContent"}>
                <UpperList
                    title={"accounts"}
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