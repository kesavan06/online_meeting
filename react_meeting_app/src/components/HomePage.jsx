import Header from "./Header";
import FeatureList from "./FeatureList";
import AboutMeeting from "./AboutMeeting";
import { useEffect, useState } from "react";
import MeetingSetup from "./MeetingSetup";
import JoinMeeting from "./JoinMeeting";
import Signin from "./Signin";
import Signup from "./Signup";
import Wrapper from "./Wrapper";
import WhiteBoard from "./WhiteBoard";
import Meeting from "./Meeting";
import { useAppContext } from "../Context";
import ShareScreen from "./ShareScreen";
import SignUp from "./SignUp.js";
import "../HomePage.css";
import { useCookies } from "react-cookie";
import MeetingHistory from "./MeetingHistory.jsx";
import BreakOutMeeting from "./BreakOutMeeting";

// setAndReadCookie();

export default function HomePage() {
  <FeatureList displayParent={handleParentShow} />;
  const [viewSetupMeeting, setViewSetupMeeting] = useState(false);
  const [viewJoinMeeting, setViewJoinMeeting] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [displayParent, setDisplayParent] = useState(false);
  const [displayShareScreen, setDisplayShareScreen] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);
  const [showHistory, setHistory] = useState(false);

  const [hasCookie, setHasCookie] = useState(false);
  const [cookie, setCookie, removeCookie] = useCookies([
    "user_name",
    "user_id",
  ]);
  // console.log("Cookie exsisit : ",document.cookie);
  const [oneTimeCookie, setOneTimeCookie] = useState(false);

  function handleShareScreen() {
    setDisplayShareScreen(!displayShareScreen);
  }

  const [name, setName] = useState("");
  const [nameUnique, setNameUnique] = useState("");
  const [password, setPassword] = useState("");

  function handleParentShow() {
    setDisplayParent(!displayParent);
  }

  const [showBreakOutRoom, setShowBreaOutRoom] = useState(false);

  useEffect(() => {
    console.log(
      viewSetupMeeting,
      viewJoinMeeting,
      showSignUp,
      showSignIn,
      displayParent,
      showMeeting,
      showBreakOutRoom
    );
  }, [
    viewSetupMeeting,
    viewJoinMeeting,
    showSignUp,
    showSignIn,
    showMeeting,
    showBreakOutRoom,
  ]);

  if (
    !viewSetupMeeting &&
    !viewJoinMeeting &&
    !showSignUp &&
    !showSignIn &&
    !displayParent &&
    !showMeeting &&
    !showHistory &&
    !showBreakOutRoom
  ) {
    return (
      <div className="homeContainer homePageContainer">
        <Header
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
          showSignIn={showSignIn}
          setShowSignIn={setShowSignIn}
          cookie={cookie}
          setCookie={setCookie}
          removeCookie={removeCookie}
          hasCookie={hasCookie}
          setHasCookie={setHasCookie}
          setHistory={setHistory}
          showHistory={showHistory}
        />

        <AboutMeeting
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
          setShowSignIn={setShowSignIn}
          displayMessage={setDisplayMessage}
          cookie={cookie}
          oneTimeCookie={oneTimeCookie}
          setOneTimeCookie={setOneTimeCookie}
          hasCookie={hasCookie}
          setHasCookie={setHasCookie}
        />

        <FeatureList displayParent={handleParentShow} />
      </div>
    );
  } else if (showSignUp) {
    // console.log("signin"+showSignIn+"\nsignup"+showSignUp);
    return (
      <div className="homeContainer">
        <Header
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
          showSignIn={showSignIn}
          setShowSignIn={setShowSignIn}
        />
        <Wrapper>
          <Signup
            showSignUp={showSignUp}
            setShowSignUp={setShowSignUp}
            setShowSignIn={setShowSignIn}
            name={name}
            setName={setName}
            nameUnique={nameUnique}
            setNameUnique={setNameUnique}
            password={password}
            setPassword={setPassword}
            signUpFunction={SignUp}
            cookie={cookie}
            setCookie={setCookie}
          ></Signup>
        </Wrapper>
        <AboutMeeting
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
          cookie={cookie}
          oneTimeCookie={oneTimeCookie}
          setOneTimeCookie={setOneTimeCookie}
        />
        <FeatureList />
      </div>
    );
  } else if (showSignIn) {
    return (
      <div className="homeContainer">
        <Header
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
          showSignIn={showSignIn}
          setShowSignIn={setShowSignIn}
        />
        <Wrapper>
          <Signin
            showSignIn={showSignIn}
            setShowSignIn={setShowSignIn}
            setShowSignUp={setShowSignUp}
            nameUnique={nameUnique}
            setNameUnique={setNameUnique}
            password={password}
            setPassword={setPassword}
            displayMessage={displayMessage}
            setDisplayMessage={setDisplayMessage}
            cookie={cookie}
            setCookie={setCookie}
          ></Signin>
        </Wrapper>

        <AboutMeeting
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
          cookie={cookie}
          oneTimeCookie={oneTimeCookie}
          setOneTimeCookie={setOneTimeCookie}
        />
        <FeatureList />
      </div>
    );
  } else if (displayParent) {
    return <WhiteBoard parentShow={handleParentShow} />;
  } else if (displayShareScreen) {
    return <ShareScreen></ShareScreen>;
  }
  else if (showHistory) {
    return <MeetingHistory setHistory={setHistory}/>
  }

  else {
    if (viewSetupMeeting) {
      return (
        <MeetingSetup
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          showMeeting={showMeeting}
          setShowMeeting={setShowMeeting}
          cookie={cookie}
        ></MeetingSetup>
      );
    } else if (viewJoinMeeting) {
      return (
        <JoinMeeting
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
          setShowMeeting={setShowMeeting}
          showMeeting={showMeeting}
          cookie={cookie}
        ></JoinMeeting>
      );
    } else if (showMeeting) {
      return (
        <Meeting
          showMeeting={showMeeting}
          setShowMeeting={setShowMeeting}
          setShowSignIn={setShowSignIn}
          setShowSignUp={setShowSignUp}
          setViewJoinMeeting={setViewJoinMeeting}
          setViewSetupMeeting={setViewSetupMeeting}
          setDisplayParent={setDisplayParent}
          setShowBreakOutRoom={setShowBreaOutRoom}
        ></Meeting>
      );
    } else if (showBreakOutRoom) {
      return (
        <BreakOutMeeting
          showMeeting={showMeeting}
          setShowMeeting={setShowMeeting}
          setShowSignIn={setShowSignIn}
          setShowSignUp={setShowSignUp}
          setViewJoinMeeting={setViewJoinMeeting}
          setViewSetupMeeting={setViewSetupMeeting}
          setDisplayParent={setDisplayParent}
          setShowBreakOutRoom={setShowBreaOutRoom}
        ></BreakOutMeeting>
      );
    }
  }
}
