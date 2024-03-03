declare namespace google {
  namespace script {
    interface Run {
      withSuccessHandler: (callback: (response: unknown) => void) => Run;
      withFailureHandler: (callback: (error: unknown) => void) => Run;
      [key: string]: (...args: unknown[]) => void;
    }
    const run: Run;
  }
}
