import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import { auth, googleAuthProvider } from "../firebase/firebase.js";
import {
    Page,
    Icon,
    NavTitle,
    NavRight,
    NavLeft,
    List,
    ListInput,
    Navbar,
    Link,
    Block,
    Button,
    Message,
} from 'framework7-react';
import {
    login,
    getLoggedinUserDetails,
    changepassword
} from '../utils/api';
import loggedInUser from '../js/userdetails';
import toastr from 'toastr';
const ChangepPasswordPage = (props) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [userData, setuserDetails] = useState({});
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
        let user = loggedInUser();
        if (user && user.uid) {
            getLoggedinUserDetails(user.uid)
                .then((userDetails) => {
                    if (userDetails) {
                        setuserDetails(userDetails);
                        setEmail(userDetails.email);
                    } else {
                        console.warn("No user details found.");
                    }
                })
                .catch(error => {
                    throw new Error(error);
                });
        }
    }, []);
    const handlePassword = (event) => {
        event.preventDefault();
        let password = event.target.value;
        setPassword(password);
    }
    const handleNewPassword = (event) => {
        event.preventDefault();
        let newPassword = event.target.value;
        setNewPassword(newPassword);
    }
    const handleConfirmPassword = (event) => {
        event.preventDefault();
        let confirmPassword = event.target.value;
        setConfirmPassword(confirmPassword);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Please enter all details");
        } else if (newPassword !== confirmPassword) {
            setErrorMessage("Newpassword and confirmpassword didnot match");
        }
         else if (password.length < 8) {
            setErrorMessage("Password length must be atleast 8 characters");
        }
        else {
            let obj = {};
            obj.email = userData.email;
            obj.password = password;
            login(obj)
                .then((resp) => {
                    if (resp) {
                        let changePassword = newPassword;
                        auth.currentUser.updatePassword(changePassword).then(function (changedPassword) {
                            // setSuccessMessage("Password Changed successfully");
                            toastr.success("Password Changed successfully");
                             setTimeout(() => {
                                props.f7router.navigate('/home/');
                            },5000);
                        }).catch(function (err) {
                            toastr.error(err.message);
                        });
                    }
                }).catch(function (err) {
                    throw new Error(err);
                });
        }
    }
    return (
        <Page style={{ backgroundColor: "#FFFFFF" }} name="services" className="color-deeporange custom-bg">
            <Navbar className="header-bg">
                <a href="/home/" slot="left" className="link back"><Icon f7="arrow_left" backLink="Back" color="black" style={{fontWeight:'400',marginRight:'10px',fontSize:'20px',}}></Icon></a>
                <NavLeft className="header-detail" style={{position:'absolute' ,left:'40px'}}>
          <Link href='/mywallet/'><img src={coin}></img>
            <span className="header-credits" style={{ 'color': 'white' , 'fontSize':'19px',paddingLeft:'3px'}}>{userData.tokens}</span></Link>
        </NavLeft>
                <div style={{ 'width': '100%', 'display': 'flex', position: 'fixed', 'justifyContent': 'center', alignItems: 'center', }}>
                    <Link href='/home/'><img src={logo} width="60"></img></Link>
                </div>
                <NavRight className="header-img">
                    <Link href='/profile/'>
                        <span style={{ color: 'white' }}>
                            {userData.firstName && userData.lastName ? userData.firstName + " "  : userData.email}</span>
                        <img src={userData.imageUrl ? userData.imageUrl : Avatar}></img></Link>
                </NavRight>
            </Navbar>              
            <List>
                    <h3 style={{ color: 'black',textAlign:'center', }}>Change Password</h3>
                <ListInput
                    outline
                    label="Current Password *"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    onChange={handlePassword}
                >
                </ListInput>
                <ListInput
                    outline
                    label="New Password *"
                    name="password"
                    type="password"
                    placeholder="New password"
                    onChange={handleNewPassword}
                >
                </ListInput>
                <ListInput
                    outline
                    label="Confirm Password *"
                    name="Password"
                    type="password"
                    placeholder="Confirm password"
                    onChange={handleConfirmPassword}
                >
                </ListInput>
            </List>
            <Block style={{ padding: '20px', backgroundColor: '#fff', }}>
                {errorMessage ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                        {errorMessage}
                    </Block>) : null}
                {successMessage ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'green' }}>
                        {successMessage}
                    </Block>) : null}
                <Block className="" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                    <Button className="col button button-fill color-orange" fill round raised style={{ 'width': '100px' }}
                        onClick={handleSubmit}>Submit</Button>
                </Block>
            </Block>
        </Page >
    );
}
export default ChangepPasswordPage;