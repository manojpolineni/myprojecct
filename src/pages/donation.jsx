import React, { useState, useEffect, useContext } from 'react';
import logo from '../assets/img/logo.png';
import coin from '../assets/img/coin.png';
import Avatar from "../assets/img/avatar.jpg";
import {
    f7,
    Page,
    Navbar,
    NavTitle,
    Block,
    Col,
    Button,
    NavLeft,
    NavRight,
    Icon,
    List,
    ListItem,
    ListInput,
    Link,
    Row,
} from "framework7-react";
import {
    getLoggedinUserDetails, donation, devoteeDonateMail, purohithDonateMail
} from '../utils/api';
import loggedInUser from '../js/userdetails.js';

const DonationPage = (props) => {
    const donationDetails = props.donate;
    let requestType = props.donate.requestType;
    let obj = props.data;
    const [userData, setUserData] = useState('');
    const [balance, setBalance] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);
    const [errorMessageToken, setErrorMessageToken] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

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

    const submitDonation = (tokens, id) => {
        let data = {}, mail = {};
        setErrorMessage(false)
        setSuccessMessage(false)
        data.tokens = Number(tokens);
        data.devoteeId = userData._id;
        mail.userName = userData.firstName + " " + userData.lastName;
        mail.mail = userData.email;
        data.requestType = donationDetails.requestType;

        if(requestType === "PurohithService") {
            data.purohithId = donationDetails.purohithId._id;
            mail.purohithName = donationDetails.purohithId.firstName + " " + donationDetails.purohithId.lastName;
            mail.purohithMail = donationDetails.purohithId.email;
        }
        else if (donationDetails.requestType === "TempleService") {
            data.templeId = donationDetails.templeId._id;
            mail.purohithName = donationDetails.templeId.name;
            mail.purohithMail = donationDetails.templeId.email;
        } else if (donationDetails.requestType === "callToAction" && donationDetails.request === "Dakshina" ) {
            data.purohithId = donationDetails._id;
            data.requestType = "PurohithService";
            mail.purohithMail = donationDetails.email;
            mail.purohithName = donationDetails.firstName+" "+donationDetails.lastName;;
            
        }
        else if (donationDetails.requestType === "callToAction" && donationDetails.request === "Donate" ) {
            data.templeId = donationDetails._id;
            data.requestType="TempleService";
            mail.purohithName = donationDetails.name;
            mail.purohithMail = donationDetails.email;
        }
        if (!tokens) {
            setErrorMessageToken(true);
            setErrorMessage(true);
        }
        else if (userData.tokens < tokens) {
            setErrorMessage(true);
        } else {

            donation(data)
                .then((resp) => {
                    f7.preloader.show();
                    if (resp && resp.statusCode === 200) {
                        setSuccessMessage(true);
                        devoteeDonateMail(mail)
                            .then((resp) => { });
                        purohithDonateMail(mail)
                            .then((resp) => { });
                        f7.dialog.close();
                        setTimeout(() => {
                            props.f7router.navigate('/home/');
                        }, 5000);
                    }
                })
        }

    };
   
    return (
        <Page name="services" className="color-deeporange custom-bg">
            <Navbar className="header-bg">
                <a href="/home/" slot="left" className="link back"><Icon f7="arrow_left" backLink="Back" color="black" style={{fontWeight:'400',marginRight:'10px',fontSize:'20px',}}></Icon></a>
                <NavLeft className="header-detail" style={{position:'absolute' ,left:'40px'}}>
          <Link href='/mywallet/'><img src={coin}></img>
            <span className="header-credits" style={{ 'color': 'white', 'fontSize':'19px',paddingLeft:'3px'}}>{userData.tokens}</span></Link>
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
            <Block style={{ 'backgroundolColor': '#FFFFFF', 'height': '400px', 'margin': '15px' }}>
                
                <h2 style={{ textAlign: "center" }}>
                    { requestType == "callToAction" && donationDetails.request ? donationDetails.request:requestType && requestType === "PurohithService" ?
                        <h2>Dakshina</h2> :
                        <h2>Donate</h2>}
                </h2>
                    {requestType == "PurohithService"? 
                    <Block>          
                        <Row >
                        <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px', 'fontSize': '16px', 'color': '#ff9500' }}>{" " + donationDetails.purohithId.firstName + " " + donationDetails.purohithId.lastName}</p>
                        </Row>
                        <Row>
                        <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px','fontSize': '14px', 'color': '#ff9500' }}>{" " + donationDetails.purohithId.address}</p>
                        </Row>
                        <Row>
                        <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px','fontSize': '14px', 'color': '#ff9500' }}>{" " + donationDetails.purohithId.phone}</p>
                        </Row>
                    </Block>:
                    requestType == "TempleService"? 
                    <Block>
                        
                        <Row >
                            <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px','fontSize': '14px', 'color': '#ff9500' }}>{donationDetails.purohithName} </p> 
                     
                        </Row>
                        <Row>
                        {/* <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}>{" " +  donationDetails.city.name + ", " + donationDetails.country.name }</p> */}
                     
                        </Row>
                        <Row>
                        {/* <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}>{" " + donationDetails.purohithId.phone}</p> */}
                     
                        </Row>
                        
                        </Block> : requestType = "callToAction" ?
                            
                        <Block>          
                            <Row>
                            <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px','fontSize': '14px', 'color': '#ff9500' }}>{donationDetails.name?donationDetails.name:donationDetails.firstName}</p>
                            </Row>
                            <Row>
                                    <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px','fontSize': '14px', 'color': '#ff9500' }}> { donationDetails.address ? donationDetails.address:null}{ "," + donationDetails.city.name + ", " + donationDetails.country.name }</p>
                            </Row>
                        </Block>:null}
                    
                        
                    {/* <form> */}
                        <List noHairlinesMd>
                            <ListInput
                                type="number"
                                outline
                                validate pattern="[0-9]*"
                                label="Tokens"
                                value={balance}
                                onInput={(e) => {
                                    setBalance(e.target.value);
                                }}
                                style={{ color: 'orange' }}
                            />   
                        </List>
                    {/* </form> */}
                    {(errorMessage && errorMessageToken) ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                        <p style={{ margin: '0px 4px 0px 0px' }}>Please add Tokens</p>

                    </Block>
                ) : null}
                {(errorMessage && !errorMessageToken) ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                        <p style={{ margin: '0px 4px 0px 0px' }}>Insufficient tokens.Please</p>
                        <Link href='/mywallet/' style={{ textDecoration: 'underline', fontWeight: " 700" }}> click here  </Link>
                        <p style={{ margin: '0px 0px 0px 4px' }}>to add tokens.</p>
                    </Block>
                ) : null}
                {successMessage ? (
                    <Block className="display-flex justify-content-center" style={{ 'color': 'green' }}>
                        Tokens sent successfully.
                    </Block>
                ) : null}
                <Block className="justify-content-center display-flex">

                    <Button
                        fill
                        className="submit-btn"
                        onClick={() => submitDonation(balance, userData._id)}>
                        Submit
                      </Button>
                </Block>
            </Block>
        </Page >
    );
};
export default DonationPage;