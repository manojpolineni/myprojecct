import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import {
    f7,
    Icon,
    Page,
    Navbar,
    NavTitle,
    Block,
    Button,
    Link,
    NavRight,
    NavLeft,
    List,
    Row,
} from "framework7-react";
import userDetails from '../js/user_details'
import { getLoggedinUserDetails, createDevoteeRequest, sendDevoteeEmail, sendPurohithEmail, createTimeSlot } from '../utils/api';

import moment from "moment";
import toastr from "toastr";

const Bookingpage = (props) => {
    const [userData, setUserData] = useState('');
    let data = "";
    const bookingData = props.bookingData;
    const timeslotData = props.timeslotData;
    const [error, setError] = useState("");
    useEffect(() => {
        let user = userDetails();
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
    const bookservice = () => {
        if (userData.tokens < bookingData.tokens) {
            let message = "Please Add Tokens";
            setError(message);
        }
        else {
            let obj = {}
            if (bookingData.requestType === 'TempleService' && userData.firstName && userData.lastName && userData.email && timeslotData.timeSlot) {
                obj.requestType = "TempleService";
                obj.requestedDate = bookingData.bookingSlot;
                obj.requestedTime = timeslotData.timeSlot;
                obj.devoteeId = userData._id;
                obj.templeServiceId = bookingData.templeServiceId;
                obj.templeId = bookingData.templeId;
                obj.status = "Requested";
                obj.tokens = Number(bookingData.tokens);
                obj.tokenQuantity = Number(bookingData.tokens);
                obj.purohithName = bookingData.name;
                obj.serviceName = bookingData.serviceName;
                obj.userName = userData.firstName + " " + userData.lastName;
                obj.mail = userData.email;
                obj.purohithMail = bookingData.templeEmail;
                obj.imageId = bookingData.image,
                    obj.date = timeslotData.bookingDate;

                createDevoteeRequest(obj)
                    .then((resp) => {
                        if (resp.status === 200) {
                            sendDevoteeEmail(obj)
                                .then((result) => {
                                    setDevoteeEmail(result);
                                })
                                .catch((error) => {
                                    console.warn(error);
                                });
                            sendPurohithEmail(obj)
                                .then((result) => {
                                    setPurohithEmail(result);
                                })
                                .catch((error) => {
                                    console.warn(error);
                                });
                            createTimeSlot(timeslotData).then((resp) => {
                                console.log("created timeslot");
                            })
                            data = {
                                type: "templeService",
                                name: bookingData.name,
                                service: bookingData.serviceName,
                                time: moment(parseInt(bookingData.bookingSlot)).format("hh:mm a"),
                                timeSlot: bookingData.timeslot,
                                date: moment(parseInt(bookingData.bookingSlot)).format("DD/MM/YYYY")
                            }
                            console.log(data);
                            props.f7router.navigate('/confirmbooking/' + bookingData._id, { props: { bookedData: data } });
                        }
                    })
                    .catch((error) => toastr.error(error.message));
            }
            else {
                if (userData.firstName && userData.lastName && userData.email && timeslotData.timeSlot) {
                    obj.requestType = "PurohithService";
                    obj.requestedDate = bookingData.bookingSlot;
                    obj.requestedTime = timeslotData.timeSlot;
                    obj.purohithId = bookingData.purohitId;
                    obj.devoteeId = userData._id;
                    obj.devoteeUserId = userData.userId;
                    obj.purohithServiceId = bookingData.purohitServiceId;
                    obj.status = "Requested";
                    obj.tokens = Number(bookingData.tokens);
                    obj.tokenQuantity = Number(bookingData.tokens);
                    obj.purohithName = bookingData.name;
                    obj.serviceName = bookingData.serviceName;
                    obj.userName = userData.firstName + " " + userData.lastName;
                    obj.mail = userData.email;
                    obj.purohithMail = bookingData.purohithEmail;
                    obj.imageId = bookingData.image;
                    obj.date = timeslotData.bookingDate;
                }

                createDevoteeRequest(obj)
                    .then((resp) => {
                        if (resp.status === 200) {
                            sendDevoteeEmail(obj)
                                .then((result) => {
                                    setDevoteeEmail(result);
                                })
                                .catch((error) => {
                                    console.warn(error);
                                });
                            sendPurohithEmail(obj)
                                .then((result) => {
                                    setPurohithEmail(result);
                                })
                                .catch((error) => {
                                    console.warn(error);
                                });
                            createTimeSlot(timeslotData).then((resp) => {
                                console.log("created timeslot");
                            })
                            data = {
                                type: "purohithService",
                                name: bookingData.name,
                                service: bookingData.serviceName,
                                time: moment(parseInt(bookingData.bookingSlot)).format("hh:mm a"),
                                timeSlot: bookingData.timeslot,
                                date: moment(parseInt(bookingData.bookingSlot)).format("DD/MM/YYYY")
                            }
                            props.f7router.navigate('/confirmbooking/' + bookingData.id, { props: { bookedData: data } });
                        }
                    })
                    .catch((error) => toastr.error(error.message));
            }
        };
    }
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
            <Block style={{ backgroundColor: "#ffffff" }}>
                <div>
                    <List>
                        <div style={{ color: '#ff9500', 'textAlign': 'left', marginTop: 'auto', fontSize: '20px', fontWeight: '600' }}>{bookingData.name}<hr color='#8e8e93'></hr></div>
                        <div >{bookingData.address + ", " + bookingData.city + ", " + bookingData.state + ", " + bookingData.country}</div>
                        <hr color='#8e8e93'></hr>
                        <div >Service : {bookingData.serviceName}</div>
                        <hr color='#8e8e93'></hr>
                        <div >Note : {bookingData.note}</div>
                        <hr color='#8e8e93'></hr>
                        <Block className="justify-content-space-between display-flex" style={{ border: '2px solid orange', margin: '2px' }}>
                            <Row>Booking Time : </Row>
                            {/* <Row>{moment(parseInt(bookingData.bookingSlot)).format("hh:mm a")}</Row> */}
                            <Row>{bookingData.timeslot}</Row>
                        </Block>
                        <Block className="justify-content-space-between display-flex" style={{ border: '2px solid orange', margin: '2px', marginTop: '5px' }}>
                            <Row>Booking Date : </Row>
                            <Row>{moment(parseInt(bookingData.bookingSlot)).format("MMMM DD,YYYY")}</Row>
                        </Block> <hr color='#8e8e93'></hr>
                        <div>
                            <p >Available Tokens : {userData.tokens}</p>
                            <h3 style={{ color: 'green' }}>Tokens Needed : {bookingData.tokens}</h3>
                        </div>
                        {/* <ListItem>Available Tokens:{authUser.tokens}</ListItem>
            <div>
                <List>
                    <div style={{ color: '#ff9500', 'textAlign': 'left', marginTop: 'auto', fontSize: '20px', fontWeight: '600' }}>{bookingData.name}<hr color='#8e8e93'></hr></div>
                    <div style={{ color: 'white' }}>{bookingData.address + ", " + bookingData.city + ", " + bookingData.state + ", " + bookingData.country}</div>
                    <hr color='#8e8e93'></hr>
                    <div style={{ color: 'white' }}>Service : {bookingData.serviceName}</div>
                    <hr color='#8e8e93'></hr>
                    <div style={{ color: 'white' }}>Note : {bookingData.note}</div>
                    <hr color='#8e8e93'></hr>
                    <Block className="justify-content-space-between display-flex" style={{ color: 'white', border: '2px solid orange', margin: '2px' }}>
                        <Row>Booking Time : </Row>
                        <Row>{moment(parseInt(bookingData.bookingSlot)).format("hh:mm a")}</Row>
                    </Block>
                    <Block className="justify-content-space-between display-flex" style={{ color: 'white', border: '2px solid orange', margin: '2px', marginTop: '5px' }}>
                        <Row>Booking Date : </Row>
                        <Row>{moment(parseInt(bookingData.bookingSlot)).format("MMMM DD,YYYY")}</Row>
                    </Block> <hr color='#8e8e93'></hr>
                    <div>
                        <p style={{ color: 'white' }}>Available Tokens : {userDetails.tokens}</p>
                        <h3 style={{ color: 'green' }}>Tokens Needed : {bookingData.tokens}</h3>
                    </div>
                    {/* <ListItem>Available Tokens:{authUser.tokens}</ListItem>
                    <ListItem style={{ color: 'green' }}>Tokens Needed : {bookingData.tokens}</ListItem> */}
                    </List>
                    <List>
                        {error ? (
                            <Block className="display-flex justify-content-center" style={{ color: 'red' }}>
                                {error}
                            </Block>) : null
                        }
                        <Block className="" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                            <Button class="col button button-fill button-round color-green" fill round raised style={{ 'width': '170px' }} onClick={() => bookservice()}>Confirm Booking</Button>
                        </Block>
                        {bookingData.requestType === "TempleService" ?
                            <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                                <a className="link col button color-black" href="/temples/">Cancel</a>
                            </Block> :
                            <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                                <a className="link col button color-black" href="/purohits/">Cancel</a>
                            </Block>}
                    </List>
                </div>
            </Block>
        </Page>
    );
};
export default Bookingpage;