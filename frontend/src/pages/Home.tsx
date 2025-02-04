import useTrackingPageView from "../hooks/useTrackPageView";

const Home = () => {
  useTrackingPageView();

  return <h1>Home Page</h1>
};

export default Home;