import React, { useEffect, useState } from 'react';
import moment from "moment";
import '../../css/index.css';
import coin from '../../assets/img/coin.png';
import logo from '../../assets/img/logo.png';
import VideoConference from "../jitsi";
import Avatar from "../../assets/img/avatar.jpg";
import {
  f7,
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Swiper,
  SwiperSlide,
  SwipeoutActions,
  SwipeoutButton,
  Block,
  BlockTitle,
  List,
  Card,
  CardContent,
  ListItem,
  Row,
  Col,
  Icon,
  Popover,
  Button
} from 'framework7-react';
import { getLoggedinUserDetails, getTempleNames, getPurohitNotifications, updateAsCompleted, getpurohitnames, updateNotifRequest, getTodayPurohitPuja, acceptEmail, rejectEmail, cancelService, purohithCancelService, thankYouMail }
  from "../../utils/api";


const HomePage = (props) => {
  const [homeScreenOpened, setHomeScreenOpened] = useState(false);
  const user = JSON.parse(localStorage.getItem("current_user"));
  const [userData, setUserData] = useState({});
  const [upcomingEventsDevotee, setUpcomingEventsDevotee] = useState([]);
  const [recentEventsDevotee, setRecentEventsDevotee] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [purohitPujas, setPurohitPujas] = useState([]);
  const [upcomingEventsShowData, setUpcomingEventsShowData] = useState(false);
  const [recentEventsShowData, setRecentEventsShowData] = useState(false);
  const [latestUpdateShowData, setLatestUpdateShowData] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [kitData, setKitData] = useState([]);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [callStatus, setCallStatus] = useState(false);
  const [list, setList] = useState([]);
  const [latestUpdates, setlatestUpdates] = useState([]);
  const [purohitList, setPurohitList] = useState([]);



  window.setInterval(function () {
    let date = new Date();
    let today = moment(new Date()).format('DD-MM-YYYY');
    let todayDay = today.split("-")[0];
    let todayMonth = today.split("-")[1];
    let todayYear = today.split("-")[2];
    upcomingEventsDevotee && upcomingEventsDevotee.length > 0 ?
      upcomingEventsDevotee.forEach((item) => {
        if (todayDay == moment(item.requestedDate).format('DD-MM-YYYY').split("-")[0] &&
          todayMonth == moment(item.requestedDate).format('DD-MM-YYYY').split("-")[1] &&
          todayYear == moment(item.requestedDate).format('DD-MM-YYYY').split("-")[2] &&
          date.getHours() == item.requestedTime.split("-")[1].split(":")[0] &&
          date.getMinutes() == item.requestedTime.split("-")[1].split(":")[1] &&
          date.getSeconds() == 0) {
          updateAsCompleted(item._id)
            .then((resp) => {
              if (resp.statusCode === 200) {
                thankYouMail(item)
                  .then((mail) => {

                  })
                  .catch((err) => {
                    throw new Error(err);
                  });
              }
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
      }) : null
  }, 1000);

  const forward = () => {
    f7.dialog.alert('Forward');
  };
  const handleUpdateReq = (data, type) => {
    f7.preloader.show();
    const obj = {};
    let array = [];
    obj.notificationId = data.requestId._id;
    obj.type = type;
    let kit1 = ""; let kit2 = ""; let kit3 = ""; let kit4 = "";
    let kit = data.requestId.purohithServiceId ? data.requestId.purohithServiceId.ServiceKit.split(',') : null;
    if (kit && kit.length > 0) {
      kit1 = kit[0];
      kit2 = kit[1];
      kit3 = kit[2];
      kit4 = kit[3];
    }
    let mailDetails = {
      userName: data.requestId.devoteeId.firstName + " " + data.requestId.devoteeId.lastName,
      mail: data.requestId.devoteeId.email,
      purohithName: data.requestId.purohithName,
      requestedDate: data.requestId.date,
      requestedTime: data.requestId.requestedTime,
      serviceName: data.requestId.serviceName,
      kit1: kit1,
      kit2: kit2,
      kit3: kit3,
      kit4: kit4
    }
    if (type === 'Accepted') {
      acceptEmail(mailDetails)
        .then((result) => {
          setEmail(result);
        })
        .catch((error) => {
          console.warn(error);
        });
    }
    else {
      rejectEmail(mailDetails)
        .then((result) => {
          setEmail(result);
        })
        .catch((error) => {
          console.warn(error);
        })
    }
    //f7.dialog.preloader();
    updateNotifRequest(obj)
      .then((resp) => {
        if (resp.status === 200) {
          getPurohitNotifications(userData._id, userData.role)
            .then((data) => {
              data.forEach((x) => {
                if (x.requestId && x.requestId.status === "Requested") {
                  array.push(x);
                }
              })
              setNotifications(array);
              f7.dialog.close();
            })
          getLoggedinUserDetails(user.uid).then((resp) => {
            setUserData(resp);
          });

        }

      })
      .catch((error) => {
        // toastr.error(error.message);
      });
    f7.preloader.hide();
  };
  const updateUpcomingEventsShowData = (value) => {
    setUpcomingEventsShowData(value);
  };
  const updatelatestUpdateShowData = (value) => {
    setLatestUpdateShowData(value);
  };
  const updateRecentEventsShowData = (value) => {
    setRecentEventsShowData(value);
  };
  const getPurohitNotificationData = () => {
    let array = [];
    let purohitPujaData = [];
    f7.preloader.show();
    getLoggedinUserDetails(user.uid).then((resp) => {
      setUserData(resp);
      let currentDate = new Date(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d).getTime();
      // let currentTime = moment().format("hh:mm");
      if (resp && resp.role != 'devotee') {
        getPurohitNotifications(resp._id, resp.role)
          .then((respData) => {
            respData.forEach((x, index) => {
              if (x.requestId) {
                if (x.requestId.status === "Requested") {
                  array.push(x);
                }
                let req = moment(x.requestedDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
                let timeslot = moment(x.requestedDate).format('x');
                let timingSplit = x.requestId.requestedTime.split("-")
                // let currentTimeSplit = currentTime.split(":");
                let pujaStartTimeSplit = timingSplit[0].split(":");
                let pujaEndTimeSplit = timingSplit[1].split(":");
                let pujaEndTimeTimezoneSplit = pujaEndTimeSplit[1].split(" ");
                let date = new Date(req).getTime();
                let joinEnableDate = new Date(req).getTime() + (Number(pujaEndTimeSplit[0] * 3600000) + Number(pujaEndTimeTimezoneSplit[0] * 60000));
                console.log(date == currentDate, date, currentDate, pujaStartTimeSplit[0]);
                if (date >= currentDate && x.requestId.status == "Accepted") {
                  // if (date == currentDate) {
                  //   if (pujaStartTimeSplit[0] <= currentTimeSplit[0] && pujaEndTimeSplit[0] >= currentTimeSplit[0]
                  //     && pujaStartTimeSplit[1] <= currentTImeSplit[1] && pujaEndTimeTimezoneSplit[0] >= currentTimeSplit[1]) {
                  //     x.joinButton = true;
                  //   } else if (pujaStartTimeSplit[0] < currentTimeSplit[0] && pujaEndTimeSplit[0] == currentTimeSplit[0]
                  //     && pujaEndTimeTimezoneSplit[0] >= currentTimeSplit[1]) {
                  //     x.joinButton = true;
                  //   }
                  //   else {
                  //     x.joinButton = false;
                  //   }
                  // } else {
                  //   x.joinButton = false;
                  // }
                  purohitPujaData.push(x);
                }
              }

            })
            setPurohitPujas(purohitPujaData);
            setNotifications(array);
            f7.preloader.hide();
          });
      } else {
        let list = [];
        let recentEventArray = [];
        getTodayPurohitPuja(resp._id, resp.role)
          .then((resp) => {
            resp.forEach(element => {
              let req = moment(element.requestedDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })._d;
              let timingSplit = element.requestedTime.split("-")
              // let currentTimeSplit = JSON.stringify(currentTime.split(":"));
              let pujaStartTimeSplit = timingSplit[0].split(":");
              let pujaEndTimeSplit = timingSplit[1].split(":");
              let pujaEndTimeTimezoneSplit = pujaEndTimeSplit[1].split(" ");
              let date = new Date(req).getTime();
              let joinEnableDate = new Date(req).getTime() + (Number(pujaEndTimeSplit[0] * 3600000) + Number(pujaEndTimeTimezoneSplit[0] * 60000));
              if (date >= currentDate && (element.status == 'Accepted' || element.status == 'Requested')) {
                // if (date == currentDate && element.status == 'Accepted') {
                //   console.log("current time",currentTime)
                //   console.log(Number(pujaStartTimeSplit[0]), Number(currentTimeSplit[0]) , Number(pujaEndTimeSplit[0]) , Number(currentTimeSplit[0]),Number(pujaStartTimeSplit[1]) ,Number(currentTimeSplit[1]), Number(pujaEndTimeTimezoneSplit[0]),Number(currentTImeSplit[1]));
                //   if (Number(pujaStartTimeSplit[0]) <= Number(currentTimeSplit[0]) && Number(pujaEndTimeSplit[0]) >= Number(currentTimeSplit[0])
                //     && Number(pujaStartTimeSplit[1]) <= Number(currentTimeSplit[1]) && Number(pujaEndTimeTimezoneSplit[0]) >= Number(currentTimeSplit[1])) {
                //       element.joinButton = true;
                //   } else if (Number(pujaStartTimeSplit[0]) < Number(currentTimeSplit[0]) && Number(pujaEndTimeSplit[0]) == Number(currentTimeSplit[0])
                //     && Number(pujaEndTimeTimezoneSplit[0]) >= Number(currentTimeSplit[1])) {
                //       element.joinButton = true;
                //   }
                //   else {
                //       element.joinButton = false;
                //   }
                // }
                list.push(element);
              }
              if (element.status == 'Completed') {
                recentEventArray.push(element);
              }

            });
            setUpcomingEventsDevotee(list.reverse());
            setRecentEventsDevotee(recentEventArray);
          });
        f7.preloader.hide();
      }

    });
  };
  const cancelPuja = (id) => {

    f7.dialog.confirm('Do you want to cancel Puja?', 'Cancel Puja', function () {
      cancelService(id).then((resp) => {
        getPurohitNotificationData();

      });
    })
  };
  const purohithCancelPuja = (id) => {

    f7.dialog.confirm('Do you want to cancel Puja?', 'Cancel Puja', function () {
      purohithCancelService(id).then((resp) => {
        getPurohitNotificationData();

      });
    })
  };

  const getKitDetails = (item) => {
    var splitData = item.purohithServiceId ? (item.purohithServiceId.ServiceKit ? item.purohithServiceId.ServiceKit.split(",") : null) : (item.templeServiceId.ServiceKit ? item.templeServiceId.ServiceKit.split(",") : null);
    setKitData(splitData);
  };

  useEffect(() => {
    getPurohitNotificationData();
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000)

  }, []);
  useEffect(() => {
    if (!latestUpdates.length) {
      getLatestUpdates();
    }

  }, []);

  useEffect(() => {
    getTempleNames().then((resp) => {
      setList(resp);
    });
  }, [userData]);

  const getLatestUpdates = () => {
    let finalUpdates = [];
    getTempleNames().then((resp) => {
      setList(resp);
      getpurohitnames().then((respdata) => {
        setPurohitList(respdata);
        resp.forEach((x) => {
          finalUpdates.push(x);
        })
        respdata.forEach((x) => {
          finalUpdates.push(x);
        })
        finalUpdates.sort(function (a, b) { return moment(b.createdAt).format('x') - moment(a.createdAt).format('x') });
        finalUpdates.forEach((x, index) => {
          if (index < 5)
            latestUpdates.push(x);
        })
      });
    });

  }

  const handleClick = (event) => {
    event.preventDefault();
    window.location.reload();
  }

  const navigateService = (item) => {
    item.requestType = "TempleService";
    item.service = "home";
    // item.serviceTokens="3000"
    console.log(item);
    props.f7router.navigate('/services/' + item._id, { props: { details: item } });
  }
  const donateTokens = (item, requestType) => {
    if (requestType == "callToAction") {
      item.requestType = "callToAction";
      item.request = "Donate";
    }
    // item.requestType = "TempleService";
    props.f7router.navigate('/donation/', { props: { donate: item } });
  }

  return (
    <Page name="home" className="color-deeporange custom-bg">
      {/* Top Navbar */}
      <Navbar className="header-bg">
        <NavLeft className="header-detail">
          <Link href='/mywallet/'><img src={coin}></img>
            <span className="header-credits" style={{ 'color': 'white' , 'fontSize':'19px',paddingLeft:'3px' }}>{userData.tokens}</span></Link>
        </NavLeft>
        <div style={{ 'width': '100%', 'display': 'flex', position: 'fixed', 'justifyContent': 'center', alignItems: 'center', }}>
                    <img className="logoservice" src={logo} width="60" onClick={handleClick}></img>
            </div>
      <NavRight className="header-img">
        <Link href='/profile/'>
          <span style={{ color: 'white'}}>
            {userData.firstName  ? userData.firstName + " "  : userData.email}</span>
            <img src={userData.imageUrl ? userData.imageUrl : Avatar}></img></Link>
      </NavRight>
    </Navbar>
    <Toolbar tabbar tabbar-labels bottom className="custom-tabbar">
      <div className="toolbar-inner">
        <Link className="tab-link tab-outer tab-link-active bottom-nav-icon" iconMd="material:home" iconIos="material:home" href="">
          <span className="tabbar-label bottom-nav-text">Home</span>
        </Link>
        {userData.role == 'devotee' ? <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:brightness_7" iconIos="material:brightness_7" href="/temples/">
          <span className="tabbar-label bottom-nav-text">Temples</span>
        </Link> : null}
        {userData.role == 'devotee' ? <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:face" iconIos="material:face" href="/purohits/">
          <span className="tabbar-label bottom-nav-text">Purohits</span>
        </Link> : null}
        <Link className="tab-link tab-outer bottom-nav-icon" iconMd="material:apps" iconIos="material:apps" panelOpen="right" style={{ 'color': '#fff' }} href="">
          <span className="tabbar-label bottom-nav-text">More</span>
        </Link>
      </div>
    </Toolbar>
      {/* Page content */ }
  {
    callStatus ?
      <Row className="justify-content-flex-end display-flex" style={{ 'margin': '5px' }}>
        <button className={"col button button-fill button-round text-color-white"} raised style={{ 'right': '33px', 'top': '69px', 'width': '50px', 'height': '50px', 'backgroundColor': '#000', 'margin': '1px 4px 0px 4px' }} onClick={() => { setCallStatus(!callStatus); }}>X</button>
        <VideoConference roomName={roomName} />
      </Row> :
      list && list.length > 0 && userData.role == 'devotee' ? (
        <Swiper scrollbar autoplay={{ delay: 3000 }} style={{ height: '450px', }} className="home-swiper">
          {list.map((item, i) => (
            <SwiperSlide className="home-slider" style={{ maxHeight: '100%' }}>
              <img src={item.Image_URL[0].url} style={{ zIndex: '1', width: '100%', height: '100%' }} onClick={() => navigateService(item)} >
              </img>
              <span style={{ position: 'absolute', bottom: '330px', fontSize: '25px', left: '10px', color: '#ff9500' }}>{item.name}
              </span>
              <span style={{ position: 'absolute', bottom: '300px', left: '10px', color: 'orange', fontSize: '15px' }}>{item.city.name + "," + item.state.name + "," + item.country.name}
              </span>
              {item.defaultService ?
                <span onClick={() => navigateService(item)} style={{ cursor: 'pointer', position: 'absolute', top: '80px', left: '10px', fontSize: '25px', color: '#d951db', }}><button className="col button button-fill button-round color-green text-color-white">{item.defaultService}</button>
                </span> : null}
              <Button className="col button button-fill button-round color-yello text-color-white" onClick={() => donateTokens(item, "callToAction")} style={{ cursor: 'pointer', position: 'absolute', left: '10px', top: '140px', width: '100px' }}>Donate</Button>

            </SwiperSlide>
          ))}
        </Swiper>
      ) : null
  }
  { userData.role == 'devotee' ? <BlockTitle className="card-badge">Latest Updates</BlockTitle> : null }
  {
    userData.role == 'devotee' ? <Card className="home-card">
      <CardContent padding={false}>
            <List mediaList className="list-homepage" >

          {latestUpdates && latestUpdates.length > 0 ?
            latestUpdates.map((item, index) => (
              (index < 2) || latestUpdateShowData ?
                <Block >
                  
                  <Row style={{ 'borderBottom': ' 0.5px solid #ccc', paddingTop:'7px'}}>
                    <Col>
                      <Row className="justify-content-start display-flex" >
                        <Link href="#" className="link-data" style={{ 'margin': '1px' }}>{item.name ? item.name : (item.firstName + item.lastName)}</Link>
                        {item.templeservices ? < p style={{ 'margin': '1px'}}>onboarded to telepuja</p> : <p style={{ 'margin': '1px' }}>joined Telepuja</p>}
                      </Row>
                      {/* <p style={{ 'margin': '1px' }}>{item.name ? item.name : (item.firstName + item.lastName)}</p> */}
                      <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{(moment(item.createdAt).format("MMMM DD,YYYY"))}</p>
                    </Col>
                    </Row>
                    
                </Block> : null
            ))
            : <List>
              <ListItem
                title="No Events" style={{ paddingTop: '15px' }}>
              </ListItem>
            </List>
          }
        </List>
        {!latestUpdates && latestUpdates.length > 2 ?
          <Row className="justify-content-start display-flex" >
            <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700' }} onClick={() => updatelatestUpdateShowData(!latestUpdateShowData)}>See More  </p>
            <i className="material-icons md-only display-flex" style={{ 'marginTop': '3px', 'color': 'blue' }}>arrow_drop_down</i>
          </Row> : null}
        {latestUpdates && latestUpdates.length > 2 ?
          <Row className="justify-content-start display-flex" >
            <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700' }} onClick={() => updatelatestUpdateShowData(!latestUpdateShowData)}>Back  </p>
            <i className="material-icons md-only display-flex" style={{ 'marginTop': '2px', 'color': 'blue' }}>arrow_drop_up</i>
          </Row> : null}

      </CardContent>
    </Card> : null
  }
  { userData.role == 'devotee' ? <BlockTitle className="card-badge">Upcoming Events</BlockTitle> : null }
  {
    userData.role == 'devotee' ? <Card className="home-card">
      <CardContent padding={false}>
            <List mediaList className="list-homepage" style={{objectFit:'cover', overflowY:'auto', height: '145px'}}>

          {upcomingEventsDevotee && upcomingEventsDevotee.length > 0 ?
            upcomingEventsDevotee.map((item, index) => (
              (index < 2) || upcomingEventsShowData ?
                <Block >
                  <Row style={{ 'borderBottom': ' 0.5px solid #ccc', paddingTop:'7px' }}>
                    <Col>
                      <Row className="justify-content-start display-flex">
                        <p style={{ 'margin': '1px','fontSize':'15px' }}>{item.purohithServiceId ? item.purohithServiceId.name : item.templeServiceId.name}</p><p style={{ 'margin': '1px','fontSize':'15px' }}>{item.requestType == "PurohithService" ? (" by " + item.purohithName) : "at " + item.purohithName} </p>
                      </Row>
                      <Row className="justify-content-start display-flex">
                        <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{(moment(item.requestedDate).format("MMMM DD,YYYY")) + " " + item.requestedTime}</p>
                        {item.status == 'Requested' ?
                          <p style={{ 'fontSize': '12px', 'color': '#b568a0', 'margin': '1px 4px 0px 4px' }}>Pending Confirmation</p>
                          : null}
                      </Row>

                    </Col>
                    <Row style={{ 'marginTop': '5px' }}>
                      {item.requestType == "PurohithService" && item.status == 'Accepted' ? <Link popoverOpen=".popover-menu" onClick={() => getKitDetails(item)}><span title="Puja Kit"><Icon className="material-icons md-only" style={{ 'fontSize': '27px', 'marginTop': '3px' }} >info</Icon> </span></Link> : null}

                      {item.status == 'Accepted' ? true ? <button title="Join Puja" className={"col button button-fill button-round text-color-white bg-green"} raised style={{ 'width': '80px', 'height': '30px', 'margin': '1px 4px 0px 4px' }} onClick={() => { setCallStatus(!callStatus); setRoomName(item._id) }}>Join</button>
                        : <button title="Join Puja" className={"col button button-fill button-round text-color-white bg-grey"} raised style={{ 'width': '80px', 'height': '30px', 'margin': '1px 4px 0px 4px' }} >Join</button> : null}
                      <button title="Cancel Puja" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '80px', 'height': '30px', 'backgroundColor': '#f05929', 'margin': '1px 4px 0px 4px' }} onClick={() => cancelPuja(item._id)}>Cancel</button>
                      {item.requestType == "PurohithService" && item.status == 'Accepted' ?
                        <button title="Dakshina" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px 4px 0px 4px' }} onClick={() => donateTokens(item)}>Dakshina</button>
                        : null}
                      {item.requestType != "PurohithService" && item.status == 'Accepted' ?
                        <button title="Donate" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px 4px 0px 4px' }} onClick={() => donateTokens(item)}>Donate</button>
                        : null}
                    </Row>
                  </Row>
                </Block> : null
            ))
            : <List>
              <ListItem
                title="No Events" style={{ paddingTop: '15px' }}>
              </ListItem>
            </List>
          }
        </List>
        {!upcomingEventsShowData && upcomingEventsDevotee.length > 2 ?
          <Row className="justify-content-start display-flex" >
            <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700' }} onClick={() => updateUpcomingEventsShowData(!upcomingEventsShowData)}>See More  </p>
            <i className="material-icons md-only display-flex" style={{ 'marginTop': '3px', 'color': 'blue' }}>arrow_drop_down</i>
          </Row> : null}
        {upcomingEventsShowData && upcomingEventsDevotee.length > 2 ?
          <Row className="justify-content-start display-flex" >
            <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700' }} onClick={() => updateUpcomingEventsShowData(!upcomingEventsShowData)}>Back  </p>
            <i className="material-icons md-only display-flex" style={{ 'marginTop': '2px', 'color': 'blue' }}>arrow_drop_up</i>
          </Row> : null}

      </CardContent>
    </Card> : null
  }
  { userData.role == 'devotee' ? <BlockTitle className="card-badge">Recent Events</BlockTitle> : null }
  {
    userData.role == 'devotee' ? <Card className="home-card">
      <CardContent padding={false}>
        <List mediaList className="list-homepage">

          {recentEventsDevotee && recentEventsDevotee.length > 0 ?
            recentEventsDevotee.map((item, index) => (
              (index < 2) || recentEventsShowData ?
                <Block>
                  <Row style={{ 'borderBottom': ' 0.5px solid #ccc' }}>
                    <Col style={{ paddingTop: '10px' }} >
                      <p style={{ 'margin': '1px', }}>{item.purohithServiceId ? item.purohithServiceId.name : item.templeServiceId.name}</p>
                      <p style={{ 'fontSize': '11px', 'margin': '1px' }}>{(moment(item.requestedDate).format("MMMM DD,YYYY")) + " " + item.requestedTime}</p>
                    </Col>
                    <Row className="justify-content-center display-flex" style={{ 'marginTop': '5px' }}>
                      {item.requestType == "PurohithService" ?
                        <button title="Dakshina" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px' }} onClick={() => donateTokens(item)}>Dakshina</button>
                        : null}
                      {item.requestType != "PurohithService" ?
                        <button title="Donate" className={"col button button-fill button-round text-color-white"} raised style={{ 'width': '100px', 'height': '30px', 'margin': '1px' }} onClick={() => donateTokens(item)}>Donate</button>
                        : null}
                    </Row>
                  </Row>

                </Block> : null
            ))

            : <List>
              <ListItem
                title="No Events" style={{ paddingTop: '15px' }}>
              </ListItem>
            </List>
          }
        </List>
        {!recentEventsShowData && recentEventsDevotee.length > 2 ?
          <Row className="justify-content-start display-flex" >
            <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700' }} onClick={() => updateRecentEventsShowData(!recentEventsShowData)}>See More  </p>
            <i class="material-icons md-only display-flex" style={{ 'marginTop': '3px', 'color': 'blue' }}>arrow_drop_down</i>
          </Row> : null}
        {recentEventsShowData && recentEventsDevotee.length > 2 ?
          <Row className="justify-content-start display-flex" >
            <p style={{ 'margin': '5px 0em 0px 1em', 'color': 'Blue', 'fontSize': '12px', 'fontWeight': '700' }} onClick={() => updateRecentEventsShowData(!recentEventsShowData)}>Back  </p>
            <i class="material-icons md-only display-flex" style={{ 'marginTop': '2px', 'color': 'blue' }}>arrow_drop_up</i>
          </Row> : null}

      </CardContent>
    </Card> : null
  }
  { (userData.role == 'purohit' || userData.role == 'temple') ? <BlockTitle className="card-badge">Devotee Request</BlockTitle> : null }
  {
    (userData.role == 'purohit' || userData.role == 'temple') ? <Card className="home-card" style={{ 'maxHeight': 'none', }}>
      <CardContent padding={false} style={{ 'marginTop': '10px' }}>
        {notifications && notifications.length > 0 ? (
          notifications.map((item, index) => (
            item.requestId.status == 'Requested' ?
              (<Block>
                <Block strong className="justify-content-space-between display-flex">
                  <Col>
                    <Row >
                      <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Name: </p> <p style={{ 'margin': '2px' }}>{item.requestId.devoteeId.firstName} {item.requestId.devoteeId.lastName}</p>
                    </Row>
                    <Row >
                      <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Puja: </p> <p style={{ 'margin': '2px' }}>{(item.requestId.templeServiceId && item.requestId.templeServiceId.name) ? item.requestId.templeServiceId.name : item.requestId.purohithServiceId.name}</p>
                    </Row>
                    {/* <Row >
                    <p className="strong" style={{'font-weight': '700', 'margin': '2px' }}> Email: </p> <p style={{  'margin': '2px' }}>{notifications[index].requestId.devoteeId.email}</p>
                  </Row> */}
                    <Row>
                      <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Date: </p> <p style={{ 'margin': '2px' }}>{" " + moment(item.requestId.requestedDate).format("MMMM DD,YYYY")}{" "}</p>
                    </Row>
                    <Row>
                      <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Timings: </p> <p style={{ 'margin': '2px' }}>{" " + item.requestId.requestedTime} {" "}</p>
                    </Row>
                    <Row >
                      <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Tokens: </p> <p style={{ 'margin': '2px' }}>{item.requestId.tokens}</p>
                    </Row>
                  </Col>
                  <Row className="justify-content-center display-flex">
                    <Button fill round style={{ 'width': '100px', 'backgroundColor': '#f27d0d', 'margin': '2px' }} onClick={() => handleUpdateReq(item, 'Accepted')}>
                      Accept
                    </Button>
                    <Button fill round style={{ 'width': '100px', 'backgroundColor': '#b568a0', 'margin': '2px' }} onClick={() => handleUpdateReq(item, 'Rejected')}>
                      Decline
                    </Button>
                  </Row>
                </Block>

              </Block>) : (
                <List>
                  <ListItem
                    title="No Requests" style={{ paddingTop: '15px' }}>

                  </ListItem>
                </List>
              )

          ))) : (
          <List>
            <ListItem
              title="No Requests">
            </ListItem>
          </List>
        )}
      </CardContent>
    </Card> : null
  }
  { (userData.role == 'purohit' || userData.role == 'temple') ? <BlockTitle className="card-badge">My Pujas</BlockTitle> : null }
  {
    (userData.role == 'purohit' || userData.role == 'temple') ? <Card className="home-card" style={{ 'maxHeight': 'none', }}>
      <CardContent padding={false} style={{ 'marginTop': '10px' }}>
        {purohitPujas && purohitPujas.length > 0 ? (
          purohitPujas.map((item, index) => (
            item.requestId.status == 'Accepted' ?
              (<Block>
                {/* <ListItem>{notifications[index].requestId.devoteeId.firstName}{index}</ListItem> */}

                {/* <ListItem>{item.requestId.tokens}</ListItem>  */}
                <Block strong className="justify-content-space-between display-flex">
                  <Col>
                    <Row >
                      <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Name: </p> <p style={{ 'margin': '2px' }}>{item.requestId.devoteeId.firstName} {item.requestId.devoteeId.lastName}</p>
                    </Row>
                    <Row >
                      <p className="strong" style={{ 'font-weight': '700', 'margin': '2px' }}> Puja: </p> <p style={{ 'margin': '2px' }}>{(item.requestId.templeServiceId && item.requestId.templeServiceId.name) ? item.requestId.templeServiceId.name : item.requestId.purohithServiceId.name}</p>
                    </Row>
                    {/* <Row >
                    <p className="strong" style={{'font-weight': '700', 'margin': '2px' }}> Email: </p> <p style={{  'margin': '2px' }}>{notifications[index].requestId.devoteeId.email}</p>
                  </Row> */}
                    <Row>
                      <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Date: </p> <p style={{ 'margin': '2px' }}>{" " + moment(item.requestId.requestedDate).format("MMMM DD,YYYY")}{" "}</p>
                    </Row>
                    <Row>
                      <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Timings: </p> <p style={{ 'margin': '2px' }}>{" " + item.requestId.requestedTime}{" "}</p>
                    </Row>
                    <Row >
                      <p className="strong" style={{ 'fontWeight': '700', 'margin': '2px' }}> Tokens: </p> <p style={{ 'margin': '2px' }}>{item.requestId.tokens}</p>
                    </Row>
                  </Col>
                  <Row className="justify-content-center display-flex">
                    <Button fill className="bg-green" round style={{ 'width': '100px', 'margin': '2px' }} onClick={() => { setCallStatus(!callStatus); setRoomName(item.requestId._id) }}>
                      Join
                    </Button>
                    <Button fill round style={{ 'width': '100px', 'backgroundColor': '#f05929', 'margin': '2px' }} onClick={() => purohithCancelPuja(item.requestId._id)}>
                      Cancel
                    </Button>
                  </Row>
                </Block>

              </Block>) : (
                <List>
                  <ListItem
                    title="No Requests">

                  </ListItem>
                </List>
              )

          ))) : (
          <List>
            <ListItem
              title="No Pujas">
            </ListItem>
          </List>
        )}
      </CardContent>
    </Card> : null
  }
  <Popover className="popover-menu">
    <Block className="tooltip-info">

      <ul>
        {kitData && kitData.length > 0 ?
          kitData.map((item) => (
            <li>{item}</li>
          ))
          : null}
      </ul>
    </Block>


  </Popover>
    </Page >
  );
};

export default HomePage;