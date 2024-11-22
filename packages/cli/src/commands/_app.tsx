import type { AppProps } from "pastel";
import { ErrorBoundary } from "../components/error-boundary.js";

export default function App({ Component, commandProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...commandProps} />
    </ErrorBoundary>
  );
}
