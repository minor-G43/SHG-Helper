import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, setDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import { currentUser } from '../../cuurentUser';
import data from "../../bankData.js"
import { Navigate } from 'react-router';

const UserDetails = (props) => {
    const [redirect, setRedirect] = useState(false)
    const [fields, setFields] = useState([])
    const [userBankData, setUserBankData] = useState({})
    const [SHGBankData, setSHGBankData] = useState({})
    const [amount, setAmount] = useState(0);
    const [aadhar, setAadhar] = useState(0);
    console.log(currentUser);
    const getUserBankDetails = async () => {
        try {
            const userRef = doc(db, "bank-details", currentUser?.aadhar);
            const userSnap = await getDoc(userRef);
            console.log(userSnap.data());
            setUserBankData({ ...userSnap.data() })
        }
        catch (err) {
            console.log(err);
        }
        getSHGBankDetails()
    }
    const getSHGBankDetails = async () => {
        // const docRef = collection(db, "shg")
        // const docSnap = await getDocs(docRef)
        // var fields;
        // docSnap.forEach(doc => {
        //     if (doc?.data()?.shg_name === localStorage?.getItem("shg-name")) {
        //         setFields(doc?.data())
        //         fields = doc?.data()
        //     }
        // })
        try {
            const userRef = doc(db, "bank-details", localStorage.getItem("shgAadhar"));
            const userSnap = await getDoc(userRef);
            console.log(userSnap.data());
            setSHGBankData({ ...userSnap.data() })
        }
        catch (err) {
            console.log(err);
        }
    }
    const transferFund = async (userAadhar, shgAadhar, amount) => {
        await updateDoc(doc(db, "bank-details", userAadhar), { balance: Number(Number(userBankData.balance) - Number(amount)), loan_amt: Number(Number(userBankData.loan_amt) - Number(amount)), amount_contri: Number(Number(userBankData.amount_contri) + Number(amount)) })
        console.log(Number(Number(SHGBankData.balance) + Number(amount)));
        await updateDoc(doc(db, "bank-details", shgAadhar), { balance: Number(Number(SHGBankData.balance) + Number(amount)) })
        const collection = {
            amountTransferred: amount,
            timeStamp: new Date().toISOString(),
            senderName: currentUser.username,
            receiverName: localStorage.getItem("shg"),
            from: userAadhar,
            to: shgAadhar
        }
        const data = (await getDoc(doc(db, "transaction-history", shgAadhar)))?.data()
        console.log(data);
        if (data === undefined) {
            await setDoc(doc(db, "transaction-history", shgAadhar), {
                transactions: [collection]
            })
        }
        else {
            data.transactions = [...data.transactions, collection]
            await updateDoc(doc(db, "transaction-history", shgAadhar), {
                transactions: [...data.transactions]
            })
        }
        return setRedirect(true);
    }
    const transferFundtoUser = async (userAadhar, shgAadhar, amount) => {
        console.log(userAadhar, shgAadhar, amount);
        await updateDoc(doc(db, "bank-details", shgAadhar), { balance: Number(Number(SHGBankData.balance) - Number(amount)) })
        const userData = (await getDoc(doc(db, "bank-details", userAadhar))).data();
        const userDetails = (collection(db, "user"));
        const userDetailsSnap = await getDocs(userDetails)
        const name = [];
        userDetailsSnap.forEach(e => {
            console.log(e.data()?.aadhar === userAadhar);
            if (e.data()?.aadhar === userAadhar) {
                name.push(e.data().username)
            }
        })
        console.log(name[0]);
        await updateDoc(doc(db, "bank-details", userAadhar), { balance: Number(Number(userData.balance) + Number(amount)), loan_amt: Number(Number(userData.loan_amt) + Number(amount)) })
        const dataCollection = {
            amountTransferred: amount,
            timeStamp: new Date().toISOString(),
            receiverName: name[0],
            senderName: localStorage.getItem("shg"),
            to: userAadhar,
            from: shgAadhar
        }
        const data = (await getDoc(doc(db, "transaction-history", shgAadhar))).data()
        if (data.transactions !== undefined) {
            data.transactions = [...data.transactions, dataCollection]
        }
        else {
            data.transactions = [dataCollection]
        }
        console.log(data);
        await updateDoc(doc(db, "transaction-history", shgAadhar), data)
        return setRedirect(true);
    }
    // const insert = async () => {
    //     const docRef = collection(db, "bank-details");
    //     data.forEach(async e => {
    //         setDoc(doc(db, "bank-details" , e.aadhar), e).then(res => {
    //             console.log(res);
    //         }).catch(err => console.log(err))
    //     })
    // }
    useEffect(() => {
        if (localStorage.getItem("isAdmin") === null)
            getUserBankDetails()
        else
            getSHGBankDetails()
        // insert()
    }, [])


    return (
        <div className='Requests'>
            {redirect ? <Navigate to="/shg-list"></Navigate> : ""}
            <div className="member-border-4">
                <div className="main-head">
                    <Button href='/shg-list' variant='info'>Go Back</Button>
                    <div className='main-2'>User Details</div>
                    <div className='main-1'></div>
                </div>
                <br />
                <Card>
                    <Card.Body style={{ padding: "20px" }}>
                        <Row style={{ display: "flex", justifyContent: "space-evenly" }}>
                            {localStorage.getItem("isAdmin") === null ? <><Col sm="6" style={{ display: "flex", flexDirection: "column" }}>
                                <h1>General Details</h1>
                                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", height: "200px", justifyContent: "space-between" }}>
                                    <span>Name : {currentUser.username}</span>
                                    <span>Aadhar : {currentUser.aadhar}</span>
                                    <span>Phone : {currentUser.phoneNo}</span>
                                    <span>Email : {currentUser.email}</span>
                                </div>
                            </Col>
                                <Col>
                                    <hr style={{ height: "100%" }}></hr>
                                </Col>
                                <Col sm="6">
                                    <h1>Transfer money to SHG</h1>
                                    <div>
                                        <Row style={{ marginBottom: "20px" }}>
                                            Your Balance : {userBankData.balance}
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <Form.Label>
                                                Transfer to SHG : &nbsp;
                                            </Form.Label>
                                            <Form.Control type='number' min={0} onChange={(e) => {
                                                setAmount(Number(e.target.value))
                                                console.log(typeof (amount), amount);
                                            }} />
                                            <Button variant="info" disabled={amount === 0} onClick={() => { transferFund(currentUser?.aadhar, localStorage.getItem("shgAadhar"), amount) }} style={{ padding: "5px 10px", marginLeft: "10px" }}>Transfer</Button>
                                        </Row>
                                        <Row>
                                            SHG Balance : {SHGBankData.balance}
                                        </Row>
                                    </div>
                                </Col></> :
                                <Col sm="6">
                                    <h1>Transfer money to User</h1>
                                    <div>
                                        <Row style={{ marginBottom: "20px" }}>
                                            SHG Balance : {SHGBankData.balance}
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <Form.Label>
                                                User Aadhar: &nbsp;
                                            </Form.Label>
                                            <Form.Control type='text' onChange={(e) => {
                                                setAadhar(e.target.value)
                                            }} />
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <Form.Label>
                                                Transfer Amount: &nbsp;
                                            </Form.Label>
                                            <Form.Control type='number' min={0} onChange={(e) => {
                                                setAmount(Number(e.target.value))
                                            }} />
                                            <Button variant="info" disabled={amount === 0} onClick={() => { transferFundtoUser(aadhar, localStorage.getItem("shgAadhar"), amount) }} style={{ padding: "5px 10px", marginLeft: "10px" }}>Transfer</Button>
                                        </Row>
                                    </div>
                                </Col>

                            }

                        </Row>
                    </Card.Body>
                </Card>
                {/* </div> */}
                {/* </Stack> */}
            </div>
        </div >
    )
}

export default UserDetails