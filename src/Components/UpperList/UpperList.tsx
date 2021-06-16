import React from 'react';
import './UpperList.scss';
import {account, transcation} from "../../Utils/Interfaces";

interface UpperListProps {
    title: string;
    list?: account[] | transcation[]
}

class UpperList extends React.Component<UpperListProps, {}> {
    render() {
        return <div className={"upperList"}>
            <div className={"upperListTitle"}>{this.props.title}</div>
            <div>xd</div>
        </div>;
    }
}

export default UpperList;