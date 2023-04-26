import { React, useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { Table } from "@mui/material";
import "../../App.css"
const TransactionsList = () => {
    const [historyData, setHistoryData] = useState([])
    const fetchData = async () => {
        const shgAadhar = localStorage.getItem("shgAadhar");
        const historySnap = await getDoc(doc(db, "transaction-history", shgAadhar));
        const data = [];
        historySnap.data().transacions.forEach(e => {
            data.push(e)
        })
        console.log(data);
        setHistoryData([...data]);
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <div className="Requests">
            <div className="member-border-4">
                <div className="main-head">
                    <Button href="/shg-list" variant="info">
                        Go Back
                    </Button>
                    <div className="main-2">Transaction Details</div>
                    <div className="main-1"></div>
                </div>
                <br />
                <Table>
                    <thead>
                        <th>
                            <td>S.No</td>
                            <td>Sender</td>
                            <td>Receiver</td>
                            <td>Amount</td>
                            <td>TimeStamp</td>
                        </th>
                    </thead>
                    <tbody>
                        {historyData.length > 0 ? historyData.map((e, i) => {
                            return (
                                <tr key={e.timeStamp.seconds}>
                                    <td>{String(i + 1)}</td>
                                    <td>{e.senderName}</td>
                                    <td>{e.receiverName}</td>
                                    <td>{e.amountTransferred}</td>
                                    <td>{new Date(e.timeStamp.seconds).toISOString()}</td>
                                </tr>
                            );
                        }) : ""}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default TransactionsList;
