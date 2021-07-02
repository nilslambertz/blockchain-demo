import React from 'react';
import { logElem } from '../../Utils/Interfaces';
import "../UpperList/UpperList.scss";
import "./LogList.scss";

interface LogListProps {
    logs: logElem[]
    logsVisible: boolean
}

class LogList extends React.Component<LogListProps, {}> {
    render() {
        return <div id={"logs"} className={this.props.logsVisible ? "visible" : ""}>
            <div id={"logList"}>
                {this.props.logs.map((v, i, a) => {
                    return <div key={i} className={v.type}><span style={{ color: "white", fontWeight: "bold" }}>{v.time}</span> {v.message}</div>
                })}
            </div>
        </div>
    }
}

export default LogList;