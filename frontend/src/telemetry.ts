import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const instrumentationKey = import.meta.env.VITE_INSTRUMENTATION_KEY as string;

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: instrumentationKey,
    enableAutoRouteTracking: true
  }
});

appInsights.loadAppInsights();

export default appInsights;