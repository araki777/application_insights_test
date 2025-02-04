import useTrackingPageView from "../hooks/useTrackPageView";

const NotFound = () => {
  useTrackingPageView();

  return (
    <h1>404 Not Found</h1>
  )
}

export default NotFound