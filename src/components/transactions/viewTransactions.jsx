import { React, useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from "moment/moment";
import "../../App.css"
const TransactionsList = () => {
    const [historyData, setHistoryData] = useState([])
    const fetchData = async () => {
        const shgAadhar = localStorage.getItem("shgAadhar");
        const historySnap = await getDoc(doc(db, "transaction-history", shgAadhar));
        const data = [];
        historySnap?.data()?.transactions.forEach(e => {
            data.push(e)
        })
        console.log(data);
        setHistoryData([...data]);
    }
    useEffect(() => {
        fetchData();
    }, [])

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));


    return (
        <div className="Requests">
            <div className="member-border-4">
                <div className="main-head">
                <Button href='/shg-list' variant='contained' size='medium'>Go Back</Button>
                    <div className="main-2">Transaction Details</div>
                    <div className="main-1"></div>
                </div>
                <br />

                <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} style={{width: 1100}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>S. No.</StyledTableCell>
            <StyledTableCell align="right">Sender</StyledTableCell>
            <StyledTableCell align="right">Receiver</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
            <StyledTableCell align="right">TimeStamp</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            historyData.length === 0 ? (<h3 style={{textAlign: 'center'}}>No Transactions  Found!</h3>)
            : (
                 historyData.map((e, i) => {
                return (
                  <StyledTableRow key={e.timeStamp}>
                  <StyledTableCell component="th" scope="row">
                    {String(i + 1)}
                  </StyledTableCell>
                  <StyledTableCell align="right">{e.senderName}</StyledTableCell>
                  <StyledTableCell align="right">{e.receiverName}</StyledTableCell>
                  <StyledTableCell align="right">{e.amountTransferred}</StyledTableCell>
                  <StyledTableCell align="right">{moment(e.timeStamp).format("DD/MM/YYYY, hh:mm")}</StyledTableCell>
            {/* boolean condn. for display */}
                </StyledTableRow>
                )
              })
            )
          }
        </TableBody>
      </Table>
    </TableContainer>
                {/* <Table>
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
                                <tr key={e.timeStamp}>
                                    <td>{String(i + 1)}</td>
                                    <td>{e.senderName}</td>
                                    <td>{e.receiverName}</td>
                                    <td>{e.amountTransferred}</td>
                                    <td>{e.timeStamp}</td>
                                </tr>
                            );
                        }) : ""}
                    </tbody>
                </Table> */}
            </div>
        </div>
    );
};

export default TransactionsList;
