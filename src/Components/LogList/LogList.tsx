import React from 'react';
import "../UpperList/UpperList.scss";
import "./LogList.scss";

interface LogListProps {
    logsVisible: boolean
}

class LogList extends React.Component<LogListProps, {}> {
    render() {
        return <div id={"logs"} className={this.props.logsVisible ? "visible" : ""}>
            <div id={"logList"}>
                <div className="error">error</div>
                <div className="warning">warning</div>
                <div className="success">success</div>
                <div className="info">info</div>
            </div>
        </div>
    }
}

export default LogList;