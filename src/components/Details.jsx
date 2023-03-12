import React, { useEffect, useState } from 'react'
import '../App.css'
import { collection,getDocs,doc } from 'firebase/firestore';
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
import {db} from '../firebase.config';

const Details = () => {
  const [fields,setFields] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      let fieldValues=[]
      const querySnapshot = await getDocs(collection(db,"shg"))
      querySnapshot.forEach(doc => {
        const val = doc.data()
        fieldValues.push({
          id: doc.id,
          username: val.username,
          shg_name: val.shg_name,
          state: val.state,
          district: val.district,
          pname: val.pname,
          vname: val.village_name,
          rate: val.interest_rate
        })
      })
      setFields(fieldValues)
    }
    fetchData()

  },[fields])

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
    <div className='Details'>
        {/* <div className="member-border-3"> */}
            {/* <Stack direction='column' spacing={2}> */}
          <div className="member-border-4">
          <div className="reg-head">
            <Typography variant='h4'>Register in an SHG today and avail the benefits online on mobile!</Typography>
        </div>
        <br />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} style={{width: 1100}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Registered SHGs</StyledTableCell>
            <StyledTableCell align="right">State</StyledTableCell>
            <StyledTableCell align="right">District</StyledTableCell>
            <StyledTableCell align="right">Panchayat Name</StyledTableCell>
            <StyledTableCell align="right">Village Name</StyledTableCell>
            <StyledTableCell align="right">Interest Rate</StyledTableCell>
            <StyledTableCell align="right">SHG President</StyledTableCell>
            <StyledTableCell align="right">SHG Join</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            fields.length === 0 ? (<h3 style={{textAlign: 'center'}}>No SHGs Found!</h3>)
            : (
              fields.map(post => {
                return (
                  <StyledTableRow key={post.id}>
                  <StyledTableCell component="th" scope="row">
                    {post.shg_name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{post.state}</StyledTableCell>
                  <StyledTableCell align="right">{post.district}</StyledTableCell>
                  <StyledTableCell align="right">{post.pname}</StyledTableCell>
                  <StyledTableCell align="right">{post.vname}</StyledTableCell>
                  <StyledTableCell align="right">{post.rate}</StyledTableCell>
                  <StyledTableCell align="right">{post.username}</StyledTableCell>
            <StyledTableCell align="right"><Button variant="outlined" size='small'>Join</Button></StyledTableCell>
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

export default Details