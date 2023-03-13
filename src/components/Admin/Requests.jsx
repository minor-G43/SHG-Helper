import {useState,useEffect} from 'react'
import { collection,getDocs,addDoc, setDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import {Button} from '@mui/material';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import { db } from '../../firebase.config';

const Requests = () => {
    const [id,setId] = useState()
    const [fields,setFields] = useState([])

    useEffect(() =>{
        const fetchData = async () => {
            const docRef = collection(db,"shg")
            const docSnap = await getDocs(docRef)

            docSnap.forEach(doc => {
                if(doc?.data()?.email === localStorage?.getItem("email")) {
                    setId(doc?.id)
                    setFields(doc?.data()?.requests)
                }
            })
        }
        fetchData()
    },[fields,id])

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
    <div className='Requests'>
        <div className="member-border-4">
          <div className="reg-head">
            <Typography variant='h4'>Requests for Verification</Typography>
        </div>
        <br />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} style={{width: 1100}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Phone No.</StyledTableCell>
            <StyledTableCell align="right">Aadhar No.</StyledTableCell>
            <StyledTableCell align="right">Aadhar Document</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            fields.length === 0 ? (<h3 style={{textAlign: 'center'}}>No Requests Found!</h3>)
            : (
              fields.map(post => {
                return (
                  <StyledTableRow key={post.email}>
                  <StyledTableCell component="th" scope="row">
                    {post.username}
                  </StyledTableCell>
                  <StyledTableCell align="right">{post.phoneNo}</StyledTableCell>
                  <StyledTableCell align="right">{post.aadhar}</StyledTableCell>
                  <StyledTableCell align="right"><Button variant="outlined" href={post?.aadhar_doc} target="_blank" size='small'>Join</Button></StyledTableCell>
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

export default Requests