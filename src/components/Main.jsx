import { useEffect, useState } from 'react'
import '../App.css'
import { collection, getDocs, doc } from 'firebase/firestore';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { db } from '../firebase.config';

const Main = () => {
  const userEmail = localStorage?.getItem("email")

  const [fields, setFields] = useState([])
  const [name, setName] = useState()
  const [id, setId] = useState()

  const fetchData = async () => {
    const docRef = collection(db, "shg")
    const docSnap = await getDocs(docRef)
    console.log(localStorage.getItem("isAdmin") === null)
    if (localStorage.getItem("isAdmin") === null) {
      let obj = false
      docSnap.forEach(doc => {
        for (let i = 0; i < doc?.data()?.members.length; i++) {
          if (doc?.data()?.members[i]?.email === userEmail) {
            setId(doc?.id)
            console.log(...doc?.data()?.members);
            setFields([...doc?.data()?.members])
            setName(doc?.data()?.shg_name)
            obj = true
            break;
          }
        }

        console.log("fels", fields)
      })
    }
    else {
      docSnap.forEach(doc => {
        if (doc?.data()?.email === userEmail)
          setFields(doc?.data()?.members)
        setName(doc?.data()?.shg_name)

      })
    }

  }
  useEffect(() => {
    fetchData()
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
    <div className='Main'>
      <div className="member-border-4">
        <div className="main-head">
          <div className='main-2'>SHG: {name}</div>
          <div className='main-1'>Collected: 74235<span style={{ fontWeight: 'bolder' }}>↑</span></div>
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
                    fields.map(post => {
                      return (
                        <StyledTableRow key={post.email}>
                          <StyledTableCell component="th" scope="row">
                            {post.username}
                          </StyledTableCell>
                          <StyledTableCell align="right">{post.phoneNo}</StyledTableCell>
                          <StyledTableCell align="right">{post.aadhar}</StyledTableCell>
                          <StyledTableCell align="right"><span style={{ color: 'green' }}>8520</span></StyledTableCell>
                          <StyledTableCell align="right"><span style={{ color: 'red' }}>4321</span></StyledTableCell>
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
    </div>
  )
}

export default Main