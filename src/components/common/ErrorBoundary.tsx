import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught an error in [${this.props.name || 'Component'}]:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs backdrop-blur-md shadow-2xl max-w-md">
          <div className="font-bold flex items-center justify-between mb-1 text-red-400">
            <span>Notice: UI Component Recovered</span>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-2 py-0.5 rounded bg-red-800/60 hover:bg-red-700 text-white font-mono text-[10px]"
            >
              Retry
            </button>
          </div>
          <p className="text-[11px] text-red-300/80 font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
