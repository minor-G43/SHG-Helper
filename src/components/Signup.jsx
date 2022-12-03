import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    getAuth,
} from "firebase/auth";
import { app, db } from "../firebase.config";
import { addDoc, collection } from "firebase/firestore";

const Signup = () => {
    const auth = getAuth(app);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [aadhar,setAadhar] = useState('')
    const [accno,setAccno] = useState('')
    const [ifsc,setIfsc] = useState('')
    const [phoneNo, setPhoneNo] = useState("");
    
    const [redirect, setRedirect] = useState(false);
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
        if (!(accno.length >= 6 && accno.length < 40)) {
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

        return validity;
    };

    const handleSubmit = async () => {
        // e.preventDefault()
        if (validateForm()) {
            console.log(username);
            console.log(email);
            console.log(password);
            const cell = parseInt(phoneNo);
            console.log(cell);
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (res) => {
                    const user = res.user;
                    console.log(user);
                    const val = await addDoc(collection(db, "user"), {
                        username: username,
                        email: email,
                        phoneNo: phoneNo,
                        accno: accno,
                        aadhar: aadhar,
                        ifsc: ifsc
                    });
                    console.log(val);
                    await updateProfile(user, {
                        displayName: username,
                        phoneNumber: cell,
                    });
                })
                .catch((err) => console.log(err));

            alert("Registered Successfully!");
            setRedirect(true);
        }

        // setUsername('')
        // setEmail('')
        // setPassword('')
        // setPhoneNo()
    };

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
        }
    };

    return (
        <div className="Signup">
            <div className="container2">
                <div
                    className="form"
                    name="Login-Form"
                    onChange={handleForm}
                    // onSubmit={(e) => handleSubmit(e)}
                >
                    <h2>Sign Up</h2>
                    <div id="sign-in-button"></div>
                    <div className="control">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username"
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
                      </div>

                    <div className="control">
                        <span>
                            Already have an account?{" "}
                            <Link to="/login" className="login-link-1">
                                Login
                            </Link>
                        </span>
                    </div>

                    <button onClick={handleSubmit} className="button">
                        Sign Up
                    </button>
                </div>
                {redirect === true ? <Navigate to="/login" /> : ""}
            </div>
        </div>
    );
};

export default Signup;
