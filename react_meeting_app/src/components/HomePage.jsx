import Header from "./Header";
import FeatureList from "./FeatureList";
import AboutMeeting from "./AboutMeeting";
import { useState } from "react";
import MeetingSetup from "./MeetingSetup";
import JoinMeeting from "./JoinMeeting";
import Signin from "./Signin";
import Signup from "./Signup";
import Wrapper from "./Wrapper";
import WhiteBoard from "./WhiteBoard";
import Meeting from "./Meeting";
import { useAppContext } from "../Context";
import ShareScreen from "./ShareScreen";

export default function HomePage() {
  const [viewSetupMeeting, setViewSetupMeeting] = useState(false);
  const [viewJoinMeeting, setViewJoinMeeting] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [displayParent, setDisplayParent] = useState(false);
  const [displayShareScreen,setDisplayShareScreen] = useState(false);

  function handleShareScreen()
  {
    setDisplayShareScreen(!displayShareScreen);
  }

  function handleParentShow() {
    setDisplayParent(!displayParent);
  }

  if (
    !viewSetupMeeting &&
    !viewJoinMeeting &&
    !showSignUp &&
    !showSignIn &&
    !displayParent &&
    !showMeeting
  ) {
    return (
      <div className="homeContainer">
        <Header
          showSignUp={showSignUp}
          setShowSignUp={setShowSignUp}
          showSignIn={showSignIn}
          setShowSignIn={setShowSignIn}
        />
        <AboutMeeting
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
        />

        <FeatureList displayParent={handleParentShow} displayScreenShare={handleShareScreen} />
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
          ></Signup>
        </Wrapper>
        <AboutMeeting
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
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
          ></Signin>
        </Wrapper>
        <AboutMeeting
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
        />
        <FeatureList />
      </div>
    );
  } else if (displayParent) {
    return <WhiteBoard parentShow={handleParentShow} />;
  }
  else if(displayShareScreen)
  {
    return <ShareScreen></ShareScreen>
  } 
  else {
    if (viewSetupMeeting) {
      return (
        <MeetingSetup
          view={viewSetupMeeting}
          setView={setViewSetupMeeting}
          showMeeting={showMeeting}
          setShowMeeting={setShowMeeting}
        ></MeetingSetup>
      );
    } else if (viewJoinMeeting) {
      return (
        <JoinMeeting
          viewJoinMeeting={viewJoinMeeting}
          setViewJoinMeeting={setViewJoinMeeting}
          setShowMeeting={setShowMeeting}
          showMeeting={showMeeting}
        ></JoinMeeting>
      );
    } else if (showMeeting) {
      return <Meeting></Meeting>;
    }
  }
}

