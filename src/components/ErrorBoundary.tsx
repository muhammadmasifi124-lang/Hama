import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center p-6 text-right" dir="rtl">
          <div className="bg-white rounded-2xl border border-[#E4E0D6] p-8 max-w-lg w-full shadow-lg text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-[#23291F] mb-2">تێبینی: هەڵەیەک ڕوویدا لە بارکردنی خشتەکە</h2>
            <p className="text-sm text-[#6B7263] mb-6 leading-relaxed">
              لەوانەیە داتای کۆن یان پاشەکەوتکراو کێشەی دروست کردبێت. دەتوانیت بە دوگمەی خوارەوە بە ئاسانی بەرنامەکە نوێ بکەیتەوە.
            </p>
            {this.state.error && (
              <pre className="text-[11px] bg-slate-50 p-3 rounded-lg text-red-700 text-left overflow-auto max-h-32 mb-6 border border-slate-200">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-[#2F6B5E] hover:bg-[#25574c] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>دەستپێکردنەوە و چاککردنەوە</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
