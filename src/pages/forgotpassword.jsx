import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import { auth, firestore } from "../firebase/firebase";
import {
    f7,
    Page,
    LoginScreenTitle,
    List,
    ListInput,
    Button,
    Block,
    Link

} from 'framework7-react';


import { forgotPassword } from '../utils/api.js';


const ForgotPasswordPage = (props) => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email) {
            setError(null);
            setErrorMessage("Please enter the email address");
        } else {
            forgotPassword(email)
                .then((resp) => {
                    console.log("An link has been sent to " + email + " Please reset the password using the link");
                })
                .catch((err) => {
                    let message = "Email not found. Please enter a valid email";
                    setErrorMessage(null);
                    setError(message);
                })
        }
    }


    return (
        <Page loginScreen className="color-deeporange">
            <LoginScreenTitle style={{ 'color': '#aa0a80' }}>
                <img src={logo} alt="logo" />
                <br></br>
        TelePuja
      </LoginScreenTitle>
            <List form>
                <ListInput
                    outline
                    label="Email"
                    floatingLabel
                    type="text"
                    name="email"
                    value={email}
                    id="email"
                    placeholder="Your email"
                    clearButton
                    validate
                    autofocus
                    onInput={(e) => {
                        setEmail(e.target.value);
                    }}
                >
                </ListInput>
            </List>
            {errorMessage ? (
                <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                    {errorMessage}
                </Block>) : null
            }
            {error ? (
                <Block className="display-flex justify-content-center" style={{ 'color': 'red' }}>
                    {error}
                </Block>) : null
            }
            <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                <Button fill round raised style={{ 'width': '150px' }} onClick={handleSubmit}>Send Link</Button>
            </Block>
            <Block style={{ 'display': 'flex', 'justifyContent': 'center', fontSize: '20px' }}>
                <Link href="/" animate={false} ignoreCache={true}>cancel</Link>
            </Block>
        </Page>
    );
};
export default ForgotPasswordPage;