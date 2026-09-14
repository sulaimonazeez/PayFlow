import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("PayFlow render error:", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Something went wrong.</h1>
          <p className="mt-2 text-sm text-ink/60">We couldn't load this page.</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-6 rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
