import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { db } from "../firebase.config";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";



export default function Chat() {
  const [message, setMessage] = useState('')
  const [fields, setFields] = useState([])
  const [curUser, setCurUser] = useState('')
  const [shgName, setShgName] = useState('')
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "messages", localStorage?.getItem("shg-name"))
      const docSnap = await getDoc(docRef);
      setCurUser(localStorage?.getItem("cus-name"))
      setShgName(localStorage?.getItem("shg-name"))

      if (docSnap.exists()) {
        setFields(docSnap?.data()?.msg)
        // console.log("Document data:", docSnap?.data()?.msg);
      } else {
        console.log("No such document!");
      }
    }
    fetchData()
  }, [fields])

  const handleInput = e => {
    e.preventDefault()
    if (e?.target?.value) {
      setMessage(e?.target?.value)
      setDisabled(false)
    }
    else {
      setDisabled(true)
    }
  }

  const padTo2Digits = (num) => {
    return String(num).padStart(2, '0');
  }

  const handleSubmit = async () => {
    const shg_name = localStorage?.getItem("shg-name")
    const cusName = localStorage?.getItem("cus-name")
    setCurUser(cusName)
    setShgName(shg_name)
    const today = new Date()
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()
    const time = padTo2Digits(today.getHours()) + ':' + padTo2Digits(today.getMinutes())
    const docRef = doc(db, "messages", shg_name);
    // console.log("msg",message,disabled,date,time,cusName,shg_name)

    await updateDoc(docRef, {
      msg: arrayUnion({
        username: cusName,
        message: message,
        date: date,
        time: time
      })
    }).then(() => {
      setMessage('')
      setDisabled(true)
      console.log("hogya")
    }).catch(err => console.log(err))
  }
  return (
    <div className="Chat">
      <div className="chat-container">
        <Button href='/shg-list' variant='contained' size='medium' style={{ margin: "10px" }}>Go Back</Button>
        <h2>Chat Forum: {shgName}</h2>
        <div className="msg-container">
          {
            fields.length === 0 ? (<h3 style={{ textAlign: 'center' }}>No Chats Found!</h3>)
              : (
                fields.map(post => {
                  return (
                    <div key={post.time}>

                      {post.username === curUser ?
                        (
                          <div className="sender">
                            <div className="sender-name">{post.username} (You)</div>
                            <hr color="white" />
                            <div className="sender-msg">
                              {post.message}
                            </div>
                            <div className="sender-dt">{post.date}, {post.time}</div>
                          </div>
                        ) : (
                          <div className="receiver">
                            <div className="receiver-name">{post.username}</div>
                            <hr color="white" />
                            <div className="receiver-msg">
                              {post.message}
                            </div>
                            <div className="receiver-dt">{post.date}, {post.time}</div>
                          </div>

                        )}
                    </div>

                  )
                })
              )
          }
        </div>
        <div className="input-text">
          <TextField
            sx={{ width: 500 }}
            id="outlined-textarea"
            size="small"
            label="Text Message"
            placeholder="Enter Message Here ..."
            multiline
            maxRows={1}
            onChange={(e) => handleInput(e)}
            value={message}
          />
          <span className="input-space"></span>
          <Button
            variant="outlined"
            size="small"
            endIcon={<SendIcon />}
            disabled={disabled}
            onClick={handleSubmit}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}