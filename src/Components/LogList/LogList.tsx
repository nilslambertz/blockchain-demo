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
                <table>
                    <tbody>
                        {this.props.logs.map((v, i) => {
                            return <tr key={i}><td><samp>{v.time}</samp></td><td className={v.type}><samp>{v.message}</samp></td></tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </div>;
    }
}

export default LogList;