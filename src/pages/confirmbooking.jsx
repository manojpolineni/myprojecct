import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Link,
    NavRight,
    NavLeft,
    Icon,
    List,
    ListItem,
    Block,
    Button,
} from "framework7-react";
import loggedInUser from '../js/userdetails';
import { getLoggedinUserDetails } from '../utils/api';
import useInterval from '../js/useIntervel';


const ConfirmBookingPage = (props) => {
    const bookingConfirmData = props.bookedData;
    const [userData, setUserData] = useState('');
    useEffect(() => {
        let user = loggedInUser();
        if (user && user.uid) {
            getLoggedinUserDetails(user.uid)
                .then((result) => {
                    if (result) {
                        setUserData(result);
                    }
                    else {
                        console.warn("No user details found");
                    }
                })
                .catch(error => {
                    throw new Error(error);
                })
        }

    }, []);
    const redirectHome = () => {
        props.f7router.navigate('/home/');
    }
    const stopInterval = useInterval(redirectHome, 5000);
     

    const navigateMyPujas = () => {
        stopInterval(); 
        props.f7router.navigate('/mypujas/');
    }
   
    // (function () {
    //     setInterval(function () {
    //         window.location = "/";
    //     }, 7000);
    // })
    //     ();
    return (
        <Page name="services" className="color-deeporange custom-bg">
            <Navbar className="header-bg">
                <a href="/home/" slot="left" className="link back" ><Icon f7="arrow_left" backLink="Back" color="black" style={{fontWeight:'400',marginRight:'10px',fontSize:'20px',}}></Icon></a>
                <NavLeft className="header-detail" style={{position:'absolute' ,left:'40px'}}>
          <Link href='/mywallet/'><img src={coin}></img>
            <span className="header-credits" style={{ 'color': 'white', 'fontSize':'19px',paddingLeft:'3px' }}>{userData.tokens}</span></Link>
        </NavLeft> 
                <div style={{ 'width': '100%', 'display': 'flex', position: 'fixed', 'justifyContent': 'center', alignItems: 'center', }}>
                    <Link href='/home/'><img className="logoservice" src={logo} width="60"></img></Link>
                </div>
                <NavRight className="header-img">
                    <Link href='/profile/'>
                        <span style={{ color: 'white' }}>
                            {userData.firstName && userData.lastName ? userData.firstName + " "  : userData.email}</span>
                        <img src={userData.imageUrl ? userData.imageUrl : Avatar}></img></Link>
                </NavRight>
            </Navbar>
            <div>
                <Block style={{ color: '#ff9500', 'textAlign': 'center', marginTop: '20px', marginLeft: '10px', fontSize: '30px' }}>
                    {bookingConfirmData.name}
                </Block>
                <Block style={{ 'textAlign': 'center', marginLeft: '10px', fontSize: '15px', color: 'black' }}>
                    {bookingConfirmData.service + ", " + bookingConfirmData.timeSlot + ", " + bookingConfirmData.date}
                </Block>
                <Block class="block block-strong" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                    <button class="col button button-fill button-round color-green text-color-white" fill round raised style={{ 'width': '170px', }}>Booking Confirmed</button>
                </Block>
                <Block class="block block-strong" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                    <Button class="link" style={{ color: 'black' }} onClick={navigateMyPujas}>View Booking</Button>
                </Block>
            </div>
        </Page>
    );
};

export default ConfirmBookingPage;
