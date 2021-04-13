import React, { useState, useEffect, createContext } from 'react';
import { auth, firestore } from "../firebase/firebase";
import logo from '../assets/img/logo.png'

import {
  f7,
  f7ready,
  App,
  Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListItem,
  ListInput,
  ListButton,
  BlockFooter,
  Icon
} from 'framework7-react';
import { getLoggedinUserDetails } from '../utils/api';


import routes from '../js/routes';
import store from '../js/store';

export const appContext = createContext();
const MyApp = () => {
  const f7params = {
    name: 'TelePuja', // App name
    theme: 'auto', // Automatic theme detection
    // App store
    store: store,
    // App routes
    routes: routes,
  };
  const [authUser, setAuthUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    var parsedAuthUser;
    const localAuthUser = localStorage.getItem("current_user");
    if (localAuthUser) {
      parsedAuthUser = JSON.parse(localAuthUser);
      setAuthUser(parsedAuthUser);
    }
  }, []);
  useEffect(() => {
    if (authUser) {
      getLoggedinUserDetails(authUser.uid)
        .then((resp) => {
          if (resp) {
            setUserDetails(resp);
          }
          else {
            console.warn("No user details found.");
          }
        })
        .catch(error => {
          throw new Error(error);
        });
    }
  }, [authUser]);
  const signOut = () => {
    auth.signOut()
      .then(function () {
        localStorage.clear();
        console.log("User signed out");
        window.location.href = "/";
      })
      .catch(function (error) {
        console.log("Error signing out " + error);
      });
  }
  const alertLoginData = () => {
    f7.dialog.alert('Username: ' + username + '<br>Password: ' + password, () => {
      f7.loginScreen.close();
    });
  }
  f7ready(() => {
    // Call F7 APIs here
  });

  return (
    <appContext.Provider value={{
      authUser,
      setAuthUser,
      userDetails,
      setUserDetails
    }}>
      <App {...f7params} >
        <Panel right cover>
          <View>
            <Page className="custom-side-menu">
              <Block className="side-nav-logo">
                <img src={logo} width="100"></img>
              </Block>
              <Block className="side-nav-text">
                <span>TelePuja</span><span style={{ 'fontSize': '8px', 'padding': '8px 0px 0px 2px' }}>(v-0.0.1)</span>
              </Block>
              <List>
                <ListItem title="My Profile" link="/profile/" view=".view-main" panelClose>
                  <Icon slot="media" f7="person_alt"></Icon>
                </ListItem>
                <ListItem title="My Pujas" link="/mypujas/" view=".view-main" panelClose>
                  <Icon slot="media" f7="calendar_today"></Icon>
                </ListItem>
                <ListItem title="Transactions" link="/transactions/" view=".view-main" panelClose>
                  <Icon slot="media" f7="money_dollar_circle"></Icon>
                </ListItem>
                <ListItem title="My Wallet" link="/mywallet/" view=".view-main" panelClose>
                  <Icon slot="media" f7="creditcard_fill"></Icon>
                </ListItem>
                <ListItem title="Notifications" link="/notifications/" view=".view-main" panelClose>
                  <Icon slot="media" f7="bell_fill"></Icon>
                </ListItem>
                {/* <ListItem title="Invite Friends">
                  <Icon slot="media" f7="person_badge_plus_fill"></Icon>
                </ListItem> */}
                <ListItem title="Contact Us" link="/contactus/" view=".view-main" panelClose>
                  <Icon slot="media" f7="phone_circle_fill"></Icon>
                </ListItem>
                <ListItem title="Change Password" link="/changepassword/" view=".view-main" panelClose>
                  <Icon slot="media" f7="lock_rotation"></Icon>
                </ListItem>
                <ListItem title="Signout" onClick={(event) => signOut(event)}>
                  <Icon slot="media" f7="lock_fill"></Icon>
                </ListItem>
              </List>
            </Page>
          </View>
        </Panel>

        {/* Your main view, should have "view-main" class */}
        <View id="#main-view" main className="safe-areas" url="/" />
      </App>
    </appContext.Provider>
  )
}
export default MyApp;