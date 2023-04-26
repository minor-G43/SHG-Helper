import { useState,useEffect } from "react";
import { app, db, storage } from "../../firebase.config";
import { Navigate } from "react-router-dom";
import bcrypt from 'bcryptjs'
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    getAuth,
} from "firebase/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import bankData from '../../bankData.js'
import '../../App.css'
import { collection, addDoc } from "firebase/firestore";

const Register = () => {
    const auth = getAuth(app);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [aadhar,setAadhar] = useState('')
    const [accno,setAccno] = useState('')
    const [ifsc,setIfsc] = useState('')
    const [phoneNo, setPhoneNo] = useState("");
    const [verifyBank,setVerifyBank] = useState(false)
    const [bankValid,setBankValid] = useState(false)
    const [phoneValid,setPhoneValid] = useState(false)
    const [redirect, setRedirect] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filename,setFilename] = useState("")
    const [otp, setOtp] = useState("");
    const [errOtp, setErrOtp] = useState("");
    const [verifyBtn, setVerifyBtn] = useState(false);
    const [verifyOtp, setVerifyOtp] = useState(false);
    const [errUsername, setErrUsername] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errPassword, setErrPassword] = useState("");
    const [errPhoneNo, setErrPhoneNo] = useState("");
    const [errAadhar,setErrAadhar] = useState('')
    const [errAccno,setErrAccno] = useState('')
    const [errIfsc,setErrIfsc] = useState('')
    const [name, setName] = useState("");
    const [panName, setpanName] = useState("");
    const [userState, setUserState] = useState("");
    const [district, setDistrict] = useState("");
    const [vname, setvName] = useState("");
    const [rate, setRate] = useState("");
    // const [role, setRole] = useState("");
    const [errName, setErrName] = useState("");
    const [errPanName, setErrPanName] = useState("");
    const [errUserState, setErrUserState] = useState("");
    const [errDistrict, setErrDistrict] = useState("");
    const [errVname, setErrVName] = useState("");
    const [errRate, setErrRate] = useState("");
    const [errRole, setErrRole] = useState("");

    useEffect(() => {
        const onChangeMobile = () => {
            if (
                phoneNo?.length > 10 ||
                phoneNo?.length < 10 ||
                typeof (phoneNo === undefined)
            ) {
                setVerifyBtn(false);
            }

            if (phoneNo?.length === 10) {
                setVerifyBtn(true);
                // setPhoneNo(e.target.value)
                console.log(phoneNo);
            }
        };

        onChangeMobile();
    }, [phoneNo]);

    useEffect(() => {
        const onChangeBank = () => {
            if((aadhar?.length < 12 || aadhar?.length > 12 || typeof (aadhar === undefined)) &&
               (accno?.length < 8 || aadhar?.length > 20 || typeof (accno === undefined)) &&
               (ifsc?.length < 11 || ifsc?.length > 11 || typeof (ifsc === undefined))
            ) {
                setVerifyBank(false)
            }

            if (aadhar?.length === 12 && ifsc?.length === 11 && (accno?.length > 8 && accno?.length < 20)) {
                setVerifyBank(true);
            }
        }
        onChangeBank()
    },[aadhar,ifsc,accno])

    const onCaptchaVerify = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "sign-in-button",
            {
                size: "invisible",
                callback: (res) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    onSignInSubmit();
                },
            },
            auth
        );
    };

    const onSignInSubmit = (e) => {
        e.preventDefault();
        onCaptchaVerify();
        const phoneNumber = "+91" + phoneNo;
        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                alert("OTP Sent!");
                setVerifyOtp(true);
            })
            .catch((err) => {
                console.log(err, "hi");
            });
    };

    const verifyCode = () => {
        window.confirmationResult
            .confirm(otp)
            .then((result) => {
                const user = result.user;
                console.log(user);
                setPhoneValid(true)
                alert("Phone Number verified!");
            })
            .catch((err) => {
                alert(err);
            });
    };

    const validateForm = () => {
        let validity = true;

        if (username === "") {
            validity = false;
            setErrUsername("*Please Enter Your Name");
        }

        if (typeof username !== "undefined") {
            if (!(username.length > 3)) {
                validity = false;
                setErrUsername("*Please Enter More Than 3 Characters");
            }
        }

        if (email === "") {
            validity = false;
            setErrEmail("*Please enter your Email ID");
        }

        if (typeof email !== "undefined") {
            let pattern = new RegExp(
                /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
            );
            if (!pattern.test(email)) {
                validity = false;
                setErrEmail("*Please enter valid Email ID");
            }
        }

        if (password === "") {
            validity = false;
            setErrPassword("*Please enter your Password");
        }

        if (typeof password !== "undefined") {
            if (!(password.length > 6)) {
                validity = false;
                setErrPassword("*Please enter more than 6 characters");
            }
        }

        if (phoneNo === "") {
            validity = false;
            setErrPhoneNo("*Please enter your Phone Number");
        }

        if (typeof phoneNo !== "undefined") {
            let pattern = new RegExp(
                /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/
            );

            if (!pattern.test(phoneNo)) {
                validity = false;
                setErrPhoneNo("*Please enter a valid phone number");
            }

            if (!(phoneNo.length === 10)) {
                validity = false;
                setErrPhoneNo("*Please enter a valid phone number");
            }
        }

        if (aadhar === "") {
          validity = false;
          setErrAadhar("*Please Enter Your Aadhar Card Number");
      }

      if (typeof aadhar !== "undefined") {
          if (!(aadhar.length === 12)) {
              validity = false;
              setErrAadhar("*Please Enter a valid Aadhar Number");
          }
      }

      if (accno === "") {
        validity = false;
        setErrAccno("*Please Enter Your Bank Account Number");
            }

            if (typeof accno !== "undefined") {
                if (!(accno.length >= 9 && accno.length <= 20)) {
                    validity = false;
                    setErrAccno("*Please Enter a valid Bank Account Number");
                }
            }

            if (ifsc === "") {
            validity = false;
            setErrIfsc("*Please Enter Your IFSC Code");
        }

        if (typeof ifsc !== "undefined") {
            if (!(ifsc.length === 11)) {
                validity = false;
                setErrIfsc("*Please Enter a valid IFSC Code");
            }
        }

        if(phoneValid===false) {
            validity = false
            alert("Phone number not verified")
        }

        if(bankValid===false) {
            validity = false
            alert("Bank records not verified")
        }

        if (name === "") {
            validity = false;
            setErrName("*Please enter SHG Name");
        }

        if (panName === "") {
            validity = false;
            setErrPanName("*Please Enter Panchayat Name");
        }

        if (userState === "") {
            validity = false;
            setErrUserState("*Please enter State");
        }

        if (district === "") {
            validity = false;
            setErrDistrict("*Please enter District");
        }

        if (vname === "") {
            validity = false;
            setErrVName("*Please enter Village");
        }

        if (rate === "") {
            validity = false;
            setErrRate("*Please enter Rate");
        }

        if(filename === "") {
            validity = false
            alert("Bank Verification document not uploaded")
        }

        return validity;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const salt = bcrypt.genSaltSync(10)
        // console.log("salt",salt)
        const hashedPassword = bcrypt.hashSync(password, "$2a$10$VOewjLxpFub4SeAk1vtbK.")
        if (validateForm()) {

            const val = await addDoc(collection(db, "shg"), {
                username: username,
                email: email,
                password: hashedPassword,
                phoneNo: phoneNo,
                accno: accno,
                aadhar: aadhar,
                ifsc: ifsc,
                shg_name: name,
                state: userState,
                district: district,
                pname: panName,
                interest_rate: rate,
                village_name: vname,
                shg_doc: filename,
                members: [],
                requests: [],
                role: "admin",
            });
            console.log(val)
        }

        if(bankValid && phoneValid) {
            alert("SHG creation request sent successfully!")
            setRedirect(true)
        }

        // setName("");
        // setUserState("");
        // setDistrict("");
        // setpanName("");
        // setvName("");
        // setRate("");
        // setRole("");
    };

    const handleBank = (e) => {
        e.preventDefault()

        for (let i = 0; i < Object.values(bankData).length; i++) {
            if (accno === Object.values(bankData)[i].bank_acc && 
                aadhar === Object.values(bankData)[i].aadhar && 
                ifsc === Object.values(bankData)[i].ifsc) 
                {
                setBankValid(true)
            }
        }
        if(bankValid) {
            alert("Bank details verified successfully!")
        }
        else {
            alert("Bank does not exist!")
        }

        console.log("Bank")
    }

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

        const storageRef = ref(storage, `files/${file.name}`);
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

    const handleForm = () => {
        if (
            username.length > 3 ||
            email.length > 0 ||
            password.length > 6 ||
            phoneNo.length === 10 ||
            otp.length === 6
        ) {
            setErrUsername("");
            setErrEmail("");
            setErrPassword("");
            setErrPhoneNo("");
            setErrOtp("");
            setErrAadhar("")
            setErrAccno("")
            setErrIfsc("")
            setErrPanName("")
            setErrUserState("")
            setErrDistrict("")
            setErrVName("")
            setErrRate("")
            setErrName("")
        }
    };

    return (
        <div className="Register">
            <div className="container3">
                <div
                    className="form"
                    name="Login-Form"
                    onChange={handleForm}
                >
                    <h2>New SHG User Registration</h2>

                    <div id="sign-in-button"></div>
                    <div className="control">
                        <label htmlFor="username">Admin Name</label>
                        <input
                            type="text"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Admin name"
                        />
                        <small className="errorMsg">{errUsername}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                        />
                        <small className="errorMsg">{errEmail}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                        />
                        <small className="errorMsg">{errPassword}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="Phoneno">Phone Number</label>
                        <input
                            type="text"
                            name="phoneno"
                            onChange={(e) => setPhoneNo(e.target.value)}
                            placeholder="Enter Phone Number"
                        />
                        <small className="errorMsg">{errPhoneNo}</small>
                        {verifyBtn ? (
                            <>
                                <br />
                                <button
                                    onClick={(e) => onSignInSubmit(e)}
                                    className="get-otp"
                                >
                                    Get OTP
                                </button>
                            </>
                        ) : null}
                    </div>

                    {verifyOtp ? (
                        <div className="control">
                            <label htmlFor="OTP">OTP</label>
                            <input
                                type="text"
                                name="otp"
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                            />
                            <small className="errorMsg">{errOtp}</small>
                            <br />
                            <button onClick={verifyCode} className="verify-otp">
                                Verify OTP
                            </button>
                        </div>
                    ) : null}

                      <div className="control">
                        <label htmlFor="aadhar">Aadhar Card Number</label>
                        <input
                            type="text"
                            name="aadhar"
                            onChange={(e) => setAadhar(e.target.value)}
                            placeholder="Enter Aadhar Card Number"
                        />
                        <small className="errorMsg">{errAadhar}</small>
                      </div>

                      <div className="control">
                        <label htmlFor="accno">Bank Account Number</label>
                        <input
                            type="text"
                            name="accno"
                            onChange={(e) => setAccno(e.target.value)}
                            placeholder="Enter Bank Account Number"
                        />
                        <small className="errorMsg">{errAccno}</small>
                      </div>

                      <div className="control">
                        <label htmlFor="ifsc">IFSC Code</label>
                        <input
                            type="text"
                            name="ifsc"
                            onChange={(e) => setIfsc(e.target.value)}
                            placeholder="Enter IFSC Code"
                        />
                        <small className="errorMsg">{errIfsc}</small>

                        {verifyBank ? (
                            <>
                                <br />
                                <button
                                    onClick={(e) => handleBank(e)}
                                    className="get-otp"
                                >
                                    Verify Bank
                                </button>
                            </>
                        ) : null}
                      </div>

                    <div className="control">
                        <label htmlFor="shg-name">SHG Name</label>
                        <input
                            type="text"
                            name="shg-name"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter SHG Name"
                        />
                        <small className="errorMsg">{errName}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            name="state"
                            onChange={(e) => setUserState(e.target.value)}
                            placeholder="Enter State"
                        />
                        <small className="errorMsg">{errUserState}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="district">District</label>
                        <input
                            type="text"
                            name="district"
                            onChange={(e) => setDistrict(e.target.value)}
                            placeholder="Enter District"
                        />
                        <small className="errorMsg">{errDistrict}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="panchayat-name">Panchayat Name</label>
                        <input
                            type="text"
                            name="panchayat-name"
                            onChange={(e) => setpanName(e.target.value)}
                            placeholder="Enter Panchayat"
                        />
                        <small className="errorMsg">{errPanName}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="village-name">Village Name</label>
                        <input
                            type="text"
                            name="village-name"
                            onChange={(e) => setvName(e.target.value)}
                            placeholder="Enter Village"
                        />
                        <small className="errorMsg">{errVname}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="interest-rate">Interest Rate</label>
                        <input
                            type="text"
                            name="interest-rate"
                            onChange={(e) => setRate(e.target.value)}
                            placeholder="Enter Interest Rate"
                        />
                        <small className="errorMsg">{errRate}</small>
                    </div>

                    <div className="control">
                        <label htmlFor="shg-doc">SHG Bank Verified Document</label>
                        <input
                            type="file"
                            name="shg-doc"
                            accept="application/pdf"
                            onChange={handleFile}
                        />
                        <small>Uploading done {progress} %</small>
                    </div>
                    <button onClick={handleSubmit} className="button">
                        Sign Up
                    </button>
                </div>
                {redirect===true ? <Navigate to='/' /> : ''}
            </div>
        </div>
    );
};

export default Register;
