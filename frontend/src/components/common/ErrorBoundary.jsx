import { Component } from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: var(--surface);
  border-radius: 1rem;
  border: 1px solid var(--border);
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ErrorTitle = styled.h3`
  color: var(--danger);
  margin: 0;
  font-size: 1.5rem;
`;

const ErrorDescription = styled.p`
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
  max-width: 40rem;
`;

const RetryButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: 0.2s;

  &:hover {
    background: var(--primary-hover);
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error Boundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Unable to load this page</ErrorTitle>
          <ErrorDescription>
            {this.props.description ||
              "This page encountered an unexpected error and could not render. Please try again or contact support if the issue persists."}
          </ErrorDescription>
          <RetryButton onClick={this.handleRetry}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
