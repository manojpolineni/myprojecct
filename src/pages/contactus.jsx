
import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
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
    getLoggedinUserDetails,
    getTodayPurohitPuja,
    sendContactMail
} from '../utils/api';
import loggedInUser from '../js/userdetails';
import toastr, { success } from 'toastr';
import moment from 'moment';
const ContactUsPage = (props) => {
    const [email, setEmail] = useState('');
    const [recentEventsDevotee, setRecentEventsDevotee] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [feedback, setFeedback] = useState('');
    const [userData, setuserDetails] = useState({});
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [response, setResponseMessage] = useState({});
    
    useEffect(() => {
        let user = loggedInUser();
        if (user && user.uid) {
            getLoggedinUserDetails(user.uid)
                .then((userDetails) => {
                    if (userDetails) {
                        setuserDetails(userDetails);
                        setEmail(userDetails.email);
                        let list = [];
                        let recentEventArray = [];
                        getTodayPurohitPuja(userDetails._id, userDetails.role)
                            .then((resp) => {
                                resp.forEach(element => {
                                    if (element.status == 'Completed') {
                                        recentEventArray.push(element);
                                    }
                                });
                                console.log("hello", recentEventArray);
                                setRecentEventsDevotee(recentEventArray);
                            });
                    } else {
                        console.warn("No user details found.");
                    }
                })
                .catch(error => {
                    throw new Error(error);
                });
        }
    }, []);

    const handleSubmit = () => {
        if (!feedback || !selectedEvent) {
            setErrorMessage("Please select all fields");
        }
        else {
            let payload = {
                mail: email,
                userName: userData.firstName + " " + userData.lastName,
                selectedEvent: selectedEvent,
                feedback: feedback,
                message: message
            }
            console.log(payload);
            sendContactMail(payload).then((resp) => {
                if (resp) {
                    setResponseMessage(resp);
                    setErrorMessage('');
                    toastr.success("Thankyou for your feedback.We will get back to you soon!"); 
                    setInterval(() => {
                     props.f7router.navigate('/home/');    
                    },5000);
                } else {
                    console.warn("No resp"); 
                }
            })
                .catch(error => {
                    throw new Error(error);
                });
        }
    }
                   

    return (
        <Page style={{ backgroundColor: "#FFFFFF" }} name="services" className="color-deeporange custom-bg">
            <Navbar className="header-bg">
                <a href="/home/" slot="left" className="link back"><Icon f7="arrow_left" backLink="Back" color="black" style={{fontWeight:'400',marginRight:'10px',fontSize:'20px',}}></Icon></a>
               <NavLeft className="header-detail" style={{position:'absolute' ,left:'40px'}}>
          <Link href='/mywallet/'><img src={coin}></img>
            <span className="header-credits" style={{ 'color': 'white', 'fontSize':'19px',paddingLeft:'3px' }}>{userData.tokens}</span></Link>
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
                 <h3 style={{ color: 'black', 'textAlign':'center', }}>Contact Us</h3>
                <h5 style={{ color: 'orange', position: 'relative', left: '30px', top: '20px' }}>Email</h5>
                <ListInput
                    outline
                    value={email}
                    disabled
                ></ListInput>
                <ListInput
                    outline
                    label="RecentEvents"
                    type="select"
                    onInput={(e) => {
                        setSelectedEvent(e.target.value);
                    }}
                >
                    <option>Select</option>
                    {/* {recentEventsDevotee && recentEventsDevotee.length > 0 ?
                        recentEventsDevotee.map((item, i) => (
                     <option>{item} </option>
                    ))
                        : null}
                     <option>ALL</option> */}
                    {
                        recentEventsDevotee.map((item, i) => (
                            <option value={item.serviceName + ", " + item.requestedTime + ", " + moment(item.requestedDate).format('DD/MM/YYYY')}>
                                {item.serviceName + ", " + item.requestedTime + ", " + moment(item.requestedDate).format('DD/MM/YYYY')}
                            </option>
                        ))}
                </ListInput>
                <ListInput
                    outline
                    label="Feedback"
                    type="select"
                    onInput={(e) => {
                        setFeedback(e.target.value);
                    }}
                >
                    <option>Select</option>
                    <option>Technical Issue Audio/video</option>
                    <option>Temple/Purohit didnot attend</option>
                    <option>Not Satisfied with Quality</option>
                    <option>I want share my experience</option>
                    <option>Other</option>
                </ListInput>
            </List>
            {feedback && feedback == "I want share my experience" || feedback && feedback == "Other" ?
                <List className="item-content item-input">
                    <div className="item-inner" style={{ padding: '20px', backgroundColor: '#fff', }}>
                        <div className="title label" style={{ color: 'orange' }}>Message</div>
                        <div className="item-input-wrap">
                            <textarea value={message} onInput={(e) => { setMessage(e.target.value); }} type="text" name="message" placeholder="Your Message Here" style={{ border: '1px solid gray' }}></textarea>
                        </div>
                    </div>
                </List>
                : null}
            {errorMessage ? (
                <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                    {errorMessage}
                </Block>
            ) : null}
            <Block className="" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                <Button className="col button button-fill color-orange" fill round raised style={{ 'width': '100px' }}
                    onClick={handleSubmit}>Submit</Button>
            </Block>
        </Page >
    );
}
export default ContactUsPage;