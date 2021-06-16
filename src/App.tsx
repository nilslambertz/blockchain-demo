import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {accountArray} from "./Utils/Interfaces";

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