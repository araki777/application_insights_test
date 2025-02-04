import useTrackingPageView from "../hooks/useTrackPageView";

const About = () => {
  useTrackingPageView();

  return (
    <h1>About</h1>
  )
}

export default About