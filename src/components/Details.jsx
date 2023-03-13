import React, { useEffect, useState } from 'react'
import '../App.css'
import { collection,getDocs,addDoc, setDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Navigate } from "react-router-dom";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {db,app,storage} from '../firebase.config';

const Details = () => {
  const [fields,setFields] = useState([])
  const [open,setOpen] = useState(false)
  const [progress, setProgress] = useState(0);
  const [filename,setFilename] = useState("")
  const [redirect, setRedirect] = useState(false);
  const [curShg,setCurShg] = useState()
  const [suc,setSuc] = useState(false)

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

  const handleFile = e => {
    e.preventDefault()
    const file = e.target.files[0]
    console.log(file)

    uploadFiles(file)
    // const storageRef = app.storage().ref()
    // const fileRef = storageRef.child(file.name)

    // fileRef.put(file).then(() => {
    //     console.log("uploaded file", file.name)
    // })
}

const uploadFiles = file => {
    if(!file)
    return

    const storageRef = ref(storage, `userVerify/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
    "state_changed",
    (snapshot) => {
        const prog = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
    },
    (error) => console.log(error),
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFilename(downloadURL)
        console.log("File available at", downloadURL);
        });
    }
    );
}

  const handleClickOpen = (id) => {
    setCurShg(id)
    setOpen(true);
  };

  const handleClose = () => {
    setCurShg()
    setOpen(false);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const salt = bcrypt.genSaltSync(10)
    // console.log("salt",salt)
    if(filename === "") {
      alert("Bank Verification document not uploaded")
    } 
    else {
      const email = getAuth()?.currentUser?.email
      const docRef = doc(db, "user", email);
      const docSnap = await getDoc(docRef);
      const docData = docSnap.data()
      const shgRef = doc(db, "shg", curShg);
      // const shgSnap = await getDoc(shgRef)
      await updateDoc(shgRef, {
        requests: arrayUnion({
          username: docData.username,
          email: docData.email,
          phoneNo: docData.phoneNo,
          aadhar: docData.aadhar,
          aadhar_doc: filename
        })
      }).then(() => {
        console.log("Requests updated")
        alert("Details submitted successfully")
        setRedirect(true)
      })
      .catch(err => console.log(err))
        // const val = await setDoc(doc(db, "member", email), {
            // username: docData.username,
            // email: docData.email,
            // phoneNo: docData.phoneNo,
            // aadhar: docData.aadhar,
            // aadhar_doc: filename,
        // });
        // console.log(val)
    }
};


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
                  <StyledTableCell align="right"><Button variant="outlined" onClick={() => handleClickOpen(post.id)} size='small'>Join</Button></StyledTableCell>
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

        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload Aadhar Card for Verification
          </DialogContentText>
          <div className="control">
          <input
            type="file"
            name="shg-doc"
            accept="application/pdf"
            onChange={handleFile}
          />
          <small>Uploading done {progress} %</small>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
        {redirect===true ? <Navigate to='/' /> : ''}
      </Dialog>
    </div>
  )
}

export default Details