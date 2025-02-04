import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import appInsights from "../telemetry";

const useTrackingPageView = () => {
  const location = useLocation();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    appInsights.trackEvent({
      name: `${location.pathname} page access`,
      properties: { timestamp },
    })
  }, [location.pathname]);
}

export default useTrackingPageView;