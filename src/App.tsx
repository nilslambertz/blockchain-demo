import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";

interface AppProps {
}

interface accountArray {
    [index: number]: {id: number, privateKey: string, publicKey: string, balance: number}
}

interface AppState {
    accounts: accountArray,
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            accounts: []
        };
    }


    render() {
        return <div className="App">
            <UpperList
                title={"accounts"}
            />
            <UpperList
                title={"transactions"}
            />
        </div>;
    };
}

export default App;