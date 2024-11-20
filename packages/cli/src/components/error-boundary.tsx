import { Box, Text } from "ink";
import type { ReactNode } from "react";
import React from "react";
import { z } from "zod";

interface ErrorBoundaryState {
  isCrashed: boolean;
  errorMessage: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

const HasMessageSchema = z.object({
  message: z.string(),
});

const hasMessage = (arg: unknown): arg is z.infer<typeof HasMessageSchema> =>
  HasMessageSchema.safeParse(arg).success;

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = {
    isCrashed: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      isCrashed: true,
      errorMessage: error.message,
    };
  }

  override render() {
    if (this.state.isCrashed) {
      return (
        <Box flexDirection="column">
          <Text backgroundColor="red">Oh no, license-auditor crashed</Text>
          <Text color="red">{this.state.errorMessage}</Text>
        </Box>
      );
    }

    return this.props.children;
  }

  override componentDidCatch(error: Error) {
    console.error("componentDidCatch", error);
    this.setState({
      isCrashed: true,
      errorMessage: error.message,
    });
  }

  override componentDidMount() {
    process.setUncaughtExceptionCaptureCallback(this.crashed);
  }

  override componentWillUnmount() {
    process.setUncaughtExceptionCaptureCallback(null);
  }

  private crashed = (...args: unknown[]) => {
    this.setState({
      isCrashed: true,
      errorMessage: hasMessage(args[0]) ? args[0].message : "Unknown error",
    });

    process.exitCode = 1;
  };
}
