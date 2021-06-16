import React from 'react';
import './UpperList.scss';

interface UpperListProps {
    title: string;
}

class UpperList extends React.Component<UpperListProps, {}> {
    render() {
        return <div className={"upperList"}>
            <div className={"upperListTitle"}>{this.props.title}</div>
        </div>;
    }
}

export default UpperList;