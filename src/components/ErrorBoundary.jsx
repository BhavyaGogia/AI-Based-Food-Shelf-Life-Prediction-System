import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 font-body">
          <div className="max-w-md w-full glass-panel p-8 text-center rounded-3xl border border-rose-500/30 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mx-auto mb-6 border border-rose-500/30">
              ⚠️
            </div>
            <h2 className="font-heading font-extrabold text-2xl mb-3 text-white">Something went wrong</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              An unhandled rendering error occurred. The system safely caught this exception to prevent application crash.
            </p>
            {this.state.error && (
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-left text-xs font-mono text-rose-300 mb-6 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="btn-primary w-full py-3 text-sm font-bold rounded-xl shadow-glow"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
