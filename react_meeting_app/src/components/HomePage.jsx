import Header from "./Header";
import FeatureList from "./FeatureList";
import AboutMeeting from "./AboutMeeting";
import { useState } from "react";

export default function HomePage() {
  const [viewMeeting, setViewMeeting] = useState(false);

  return (
    <div>
      <Header />
      <AboutMeeting viewMeeting={(viewMeeting, setViewMeeting)} />
      <FeatureList />
    </div>
  );
}
