import React, { useState } from "react";
import { Loader } from "../components/common";

export const LoaderDemoPage: React.FC = () => {
  const [showTicketLoader, setShowTicketLoader] = useState(false);
  const [showDotLoader, setShowDotLoader] = useState(false);

  const toggleTicketLoader = () => {
    setShowTicketLoader(!showTicketLoader);
  };

  const toggleDotLoader = () => {
    setShowDotLoader(!showDotLoader);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Loader Demo Page</h1>
      <p>
        This page demonstrates the two types of loaders available in the
        application.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Controls</h2>
        <button
          onClick={toggleTicketLoader}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            background: "#ff5d5d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showTicketLoader ? "Hide" : "Show"} Ticket Animation Loader
        </button>
        <button
          onClick={toggleDotLoader}
          style={{
            padding: "0.5rem 1rem",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showDotLoader ? "Hide" : "Show"} Dot Loader
        </button>
      </div>

      {showTicketLoader && (
        <div
          style={{
            marginBottom: "3rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          <h3>Ticket Animation Loader</h3>
          <p>
            This loader shows a ticket icon moving from left to right with
            customizable text.
          </p>
          <Loader
            centered
            text="Processing Request"
            minHeight="300px"
            useTicketAnimation={true}
            ticketMessage="Please wait while we process your ticket submission..."
            size="large"
          />
        </div>
      )}

      {showDotLoader && (
        <div
          style={{
            marginBottom: "3rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          <h3>Traditional Dot Loader</h3>
          <p>
            This is the traditional bouncing dots loader for simpler loading
            states.
          </p>
          <Loader
            centered
            text="Loading data..."
            minHeight="200px"
            size="large"
            variant="primary"
          />
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>Usage Examples</h2>
        <h3>Ticket Animation Loader</h3>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          {`<Loader 
  centered 
  text="Loading dashboard..." 
  minHeight="60vh" 
  useTicketAnimation={true}
  ticketMessage="Fetching latest ticket data and analytics..."
/>`}
        </pre>

        <h3>Traditional Dot Loader</h3>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
          }}
        >
          {`<Loader 
  centered 
  text="Loading..." 
  size="medium"
  variant="primary"
/>`}
        </pre>
      </div>
    </div>
  );
};

export default LoaderDemoPage;
