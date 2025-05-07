import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Container } from "@mui/material";

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
          >
            <img src="/oops.png" alt="Error" style={{ width: "200px", marginBottom: "1rem" }} />
            <Typography variant="h4" gutterBottom>
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              We encountered an unexpected error. Please try refreshing the page.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReload}>
              Reload Page
            </Button>
          </Box>
        </Container>
      );
    }
    return this.props.children;
  }
};

export default ErrorBoundary;
