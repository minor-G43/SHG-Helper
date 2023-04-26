import {useState,useEffect} from 'react'
import { collection,getDocs,addDoc, setDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { db } from '../../firebase.config';

const Requests = () => {
    const [id,setId] = useState()
    const [fields,setFields] = useState([])
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [details,setDetails] = useState()

    const handleClickAcceptOpen = (det) => {
      setOpen(true);
      setDetails(det)
    };

    const handleClickDenyOpen = (det) => {
      setOpen2(true);
      setDetails(det)
    };

    const handleAcceptClose = () => {
      setOpen(false);
      setDetails()
    };

    const handleDenyClose = () => {
      setOpen2(false);
      setDetails()
    };

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

      const handleAccept = async () => {
        const reqRef = doc(db, "shg",id)
        const userRef = doc(db,"user",details.email)

        await updateDoc(userRef, {
          isMember: true
        }).then(userRef => console.log("isMember changed"))
        .catch(err => console.log(err))

        await updateDoc(reqRef, {
          members: arrayUnion({
            username: details.username,
            email: details.email,
            phoneNo: details.phoneNo,
            aadhar: details.aadhar,
            aadhar_doc: details.aadhar_doc
          }),
          requests: arrayRemove({
            username: details.username,
            email: details.email,
            phoneNo: details.phoneNo,
            aadhar: details.aadhar,
            aadhar_doc: details.aadhar_doc
          })
        }).then(() => {
          // alert("Member Requests Accepted!")
          setOpen(false);
          console.log("accept success")})
        .catch(err => console.log(err))
      }

      const handleDeny = async () => {
        const reqRef = doc(db, "shg",id)

        await updateDoc(reqRef, {
          requests: arrayRemove({
            username: details.username,
            email: details.email,
            phoneNo: details.phoneNo,
            aadhar: details.aadhar,
            aadhar_doc: details.aadhar_doc
          })
        }).then(() => {
          // alert("Member Requests Accepted!")
          setOpen2(false);
          console.log("deny success")})
        .catch(err => console.log(err))
      }
    
  return (
    <div className='Requests'>
        <div className="member-border-4">
        <div className="main-head">
          <div className='main-2'><Button href='/shg-list' variant='contained' size='medium'>Go Back</Button></div>
          <div className='main-2'>User Requests</div> 
          <div className='main-1'></div>          
        </div>
          {/* <div className="reg-head">
            <Typography variant='h4'>User Requests</Typography>
        </div> */}
        <br />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} style={{width: 1100}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Phone No.</StyledTableCell>
            <StyledTableCell align="right">Aadhar No.</StyledTableCell>
            <StyledTableCell align="right">Aadhar Document</StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
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
                  <StyledTableCell align="right"><Button variant="outlined" href={post?.aadhar_doc} target="_blank" size='small'>View</Button></StyledTableCell>
                  <StyledTableCell align="right"><Button variant="outlined" onClick={() => handleClickAcceptOpen(post)} color='success' size='small'>Accept</Button></StyledTableCell>
                  <StyledTableCell align="right"><Button variant="outlined" onClick={() => handleClickDenyOpen(post)} color='error' size='small'>Deny</Button></StyledTableCell>
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

        <Dialog
        open={open}
        onClose={handleAcceptClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Accept Request"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Confirm that the user will be a member of your SHG
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAcceptClose}>Disagree</Button>
          <Button onClick={handleAccept} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleDenyClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deny Request"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm that the user will <span style={{fontWeight: 'bold'}}>not</span> be a member of your SHG
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDenyClose}>Disagree</Button>
          <Button onClick={handleDeny} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Requests