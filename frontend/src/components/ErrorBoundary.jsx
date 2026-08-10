import React from "react";

/**
 * Last line of defence: without this, any render-time throw unmounts the whole tree
 * and the visitor is left staring at a blank white page.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        data-testid="error-boundary"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          padding: "40px 24px",
          textAlign: "center",
          background: "#060606",
          color: "#F6F0DE",
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
        }}
      >
        <span style={{ letterSpacing: "6px", fontWeight: 700, fontSize: "16px" }}>AADRIQUE</span>
        <h1 style={{ fontSize: "28px", fontWeight: 600, margin: 0 }}>Something went wrong.</h1>
        <p style={{ color: "#9A948A", maxWidth: "460px", lineHeight: 1.6, margin: 0 }}>
          We hit an unexpected error rendering this page. Reloading usually fixes it — if it
          doesn&apos;t, email us at info@aadrique.in and we&apos;ll take a look.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#FA942C",
              color: "#0A0A0A",
              border: "none",
              padding: "14px 32px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            Reload page
          </button>
          <a
            href="/"
            style={{
              border: "1px solid #2A2723",
              color: "#F6F0DE",
              padding: "14px 32px",
              textDecoration: "none",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
