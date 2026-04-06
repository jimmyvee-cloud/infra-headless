import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { apiOrigin } from "./lib/apiOrigin";
import {
  AutomationLocaleProvider,
  DeploymentLocaleProvider,
  DevServicesLocaleProvider,
} from "./i18n/devServicesLocale";
import { HomeLocaleProvider } from "./i18n/homeLocale";
import { HomePage } from "./pages/HomePage";
import { ServicesAutomationHtmlPage } from "./pages/ServicesAutomationHtmlPage";
import { ServicesDeploymentHtmlPage } from "./pages/ServicesDeploymentHtmlPage";
import { ServicesDevServicesHtmlPage } from "./pages/ServicesDevServicesHtmlPage";

function DevShell() {
  const [health, setHealth] = useState<string>("…");

  useEffect(() => {
    fetch(`${apiOrigin}/health`)
      .then((r) => r.json())
      .then((j) => setHealth(JSON.stringify(j)))
      .catch(() =>
        setHealth(`(API unreachable — is the API up at ${apiOrigin}?)`)
      );
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: 560 }}>
      <h1>Headless CMS — dev tools</h1>
      <p>
        <Link to="/">Company home</Link>
        {" · "}
        <Link to="/services/dev-services.html">Development</Link>
        {" · "}
        <Link to="/services/deployment.html">Deployment</Link>
        {" · "}
        <Link to="/services/automation.html">Automation</Link>
      </p>
      <p>
        Tenant: <code>infra_guys_website_main</code>
      </p>
      <p>
        <strong>GET /health:</strong> {health}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeLocaleProvider>
            <HomePage />
          </HomeLocaleProvider>
        }
      />
      <Route path="/dev" element={<DevShell />} />
      <Route
        path="/services/dev-services.html"
        element={
          <DevServicesLocaleProvider>
            <ServicesDevServicesHtmlPage />
          </DevServicesLocaleProvider>
        }
      />
      <Route
        path="/services/deployment.html"
        element={
          <DeploymentLocaleProvider>
            <ServicesDeploymentHtmlPage />
          </DeploymentLocaleProvider>
        }
      />
      <Route
        path="/services/automation.html"
        element={
          <AutomationLocaleProvider>
            <ServicesAutomationHtmlPage />
          </AutomationLocaleProvider>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
