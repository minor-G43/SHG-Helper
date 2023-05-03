import { useEffect, useState } from 'react'
import '../App.css'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { db } from '../firebase.config';
import { Navigate } from 'react-router-dom';
import { currentUser } from '../cuurentUser';
const Main = () => {
  const userEmail = localStorage?.getItem("email")
  const userAadhar = localStorage?.getItem("aadhar")
  const isAdmin = localStorage?.getItem("isAdmin")
  const [fields, setFields] = useState([])
  const [name, setName] = useState()
  const [shgBankData, setSHGBankData] = useState({})
  const [id, setId] = useState()
  const [redirect, setRedirect] = useState(false)
  const [transaction, setTransaction] = useState(false)
  const [bankData, setBankData] = useState({})

  const fetchData = async () => {
    const docRef = collection(db, "shg")
    const docSnap = await getDocs(docRef)
    if (localStorage.getItem("isAdmin") === null) {
      const bankRef = collection(db, "bank-details");
      const bankSnap = await getDocs(bankRef);
      var temp = {};
      bankSnap.forEach(e => {
        temp[e.data().aadhar] = e.data()
      })
      console.log(temp);
      setBankData(temp);
    }
    else {
    }
    if (localStorage.getItem("isAdmin") === null) {
      docSnap.forEach(async doc => {
        for (let i = 0; i < doc?.data()?.members.length; i++) {
          if (doc?.data()?.members[i]?.email === userEmail) {
            setId(doc?.id)
            doc?.data()?.members.forEach(e => {
              if (e.email === localStorage.getItem("email")) {
                console.log(e);
                return Object.assign(currentUser, e);
              }
            })
            setFields([...doc?.data()?.members])
            console.log(doc?.data());
            setName(doc?.data()?.shg_name)
            localStorage.setItem("shg", doc?.data()?.shg_name)
            localStorage.setItem("shgAadhar", doc?.data()?.aadhar)
            localStorage.setItem("shg-name", doc?.data()?.shg_name)
            localStorage.setItem("cus-name", doc?.data()?.members[i]?.username)
            // obj = true
            break;
          }
        }
        console.log("fels", fields)
      })
      const shgRef = doc(db, "bank-details", localStorage.getItem("shgAadhar"))
      const shgSnap = await getDoc(shgRef)
      console.log(shgSnap.data());
      setSHGBankData(shgSnap.data())
    }
    else {
      docSnap.forEach(doc => {
        if (doc?.data()?.email === userEmail) {
          setFields(doc?.data()?.members)
          setName(doc?.data()?.shg_name)
          localStorage.setItem("shgAadhar", doc?.data()?.aadhar)
          localStorage.setItem("shg-name", doc?.data()?.shg_name)
          localStorage.setItem("cus-name", doc?.data()?.username)
        }
      })
      const bankCollection = collection(db, "bank-details")
      const docs = await getDocs(bankCollection)
      const tempBankData = {}
      docs?.forEach(e => {
        tempBankData[e?.data().aadhar] = e?.data()
        if (e?.data().aadhar === localStorage.getItem("shgAadhar")) { setSHGBankData({ balance: e?.data().balance }) }
      });
      console.log(tempBankData);
      const temp = {}
      fields?.forEach(e => {
        temp[e?.aadhar] = tempBankData[e?.aadhar]
      })
      console.log(temp);

      setBankData({ ...temp })
    }
  }
  useEffect(() => {
    fetchData()
  }, [bankData, fields])

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
    <div className='Main'>
      {redirect ? <Navigate to={{
        pathname: '/user-details',
        state: { name: { name }, aadhar: { userAadhar } }
      }} /> : ""}
      {transaction ? <Navigate to="/trans-history" /> : ""}
      <div className="member-border-4">
        <div className="main-head">
          {isAdmin ? (<div className='main-2'>
            <Button href='/requests' variant='contained' size='medium'>View Requests</Button>
            <Button onClick={() => { setTransaction(true) }} variant='contained' size='medium' style={{ marginLeft: "10px" }}>View Transactions</Button>
            <Button onClick={() => setRedirect(true)} variant='contained' size='medium' style={{ marginLeft: "10px" }}>View Details</Button>

          </div>) : (<div className='main-2'>
            <Button onClick={() => setRedirect(true)} variant='contained' size='medium'>View Details</Button>
            <Button onClick={() => { setTransaction(true) }} variant='contained' size='medium' style={{ marginLeft: "10px" }}>View Transactions</Button>
          </div>)
          }
          <div className='main-2'>SHG: {name}</div>
          <div className='main-1'>Collected:{shgBankData?.balance} <span style={{ fontWeight: 'bolder' }}>↑</span></div>
        </div>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} style={{ width: 1100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Member Name</StyledTableCell>
                <StyledTableCell align="right">Phone No.</StyledTableCell>
                <StyledTableCell align="right">Aadhar No.</StyledTableCell>
                <StyledTableCell align="right">Money Contributed</StyledTableCell>
                <StyledTableCell align="right">Loan Taken</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* <StyledTableRow key='1'>
                        <StyledTableCell component="th" scope="row">
                        Jenish
                        </StyledTableCell>
                        <StyledTableCell align="right">8527419630</StyledTableCell>
                        <StyledTableCell align="right">7410 2589 6302</StyledTableCell>
                        <StyledTableCell align="right"><span style={{color: 'green'}}>8520</span></StyledTableCell>
                        <StyledTableCell align="right"><span style={{color: 'red'}}>4321</span></StyledTableCell>
                        
                </StyledTableRow> */}
              {
                fields.length === 0 ? (<h3 style={{ textAlign: 'center' }}>No members Found!</h3>)
                  : (
                    fields.map((post, i) => {
                      return (
                        <StyledTableRow key={post.aadhar}>
                          <StyledTableCell component="th" scope="row">
                            {post?.username}
                          </StyledTableCell>
                          <StyledTableCell align="right">{post?.phoneNo}</StyledTableCell>
                          <StyledTableCell align="right">{post?.aadhar}</StyledTableCell>
                          <StyledTableCell align="right">{bankData[post?.aadhar] ? bankData[post?.aadhar]?.amount_contri : ""}</StyledTableCell>
                          <StyledTableCell align="right">{bankData[post?.aadhar] ? bankData[post?.aadhar]?.loan_amt : ""}</StyledTableCell>
                          {/* boolean condn. for display */}
                        </StyledTableRow>
                      )
                    })
                  )
              }

            </TableBody>
          </Table>
        </TableContainer>
        {/* </div> */}
        {/* </Stack> */}
      </div>
    </div >
  )
}

export default Main