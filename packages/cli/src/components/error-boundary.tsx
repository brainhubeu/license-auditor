import { BaseException } from "@brainhubeu/license-auditor-core";
import { Box, Text } from "ink";
import type { ReactNode } from "react";
import React from "react";

import { z } from "zod";

interface ErrorBoundaryState {
  isCrashed: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  originalErrorMessage: string | null;
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
    errorCode: null,
    errorMessage: null,
    originalErrorMessage: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      isCrashed: true,
      errorCode: null,
      errorMessage: error.message,
      originalErrorMessage: null,
    };
  }

  override render() {
    if (this.state.isCrashed) {
      return (
        <Box flexDirection="column">
          <Text backgroundColor="red">
            Oh no, license-auditor crashed with error:
          </Text>
          <Text color="red">
            {this.state.errorCode ? `[${this.state.errorCode}] ` : ""}
            {this.state.errorMessage}
          </Text>
          {this.state.originalErrorMessage && (
            <Text color="red">{this.state.originalErrorMessage}</Text>
          )}
        </Box>
      );
    }

    return this.props.children;
  }

  override componentDidCatch(error: Error) {
    this.setState({
      isCrashed: true,
      errorCode: null,
      errorMessage: error.message,
      originalErrorMessage: null,
    });
  }

  override componentDidMount() {
    process.setUncaughtExceptionCaptureCallback(this.crashed);
  }

  override componentWillUnmount() {
    process.setUncaughtExceptionCaptureCallback(null);
  }

  private crashed = (...args: unknown[]) => {
    if (args[0] instanceof BaseException) {
      this.setState({
        isCrashed: true,
        errorCode: args[0].errorCode,
        errorMessage: args[0].message,
        originalErrorMessage: hasMessage(args[0].originalError)
          ? args[0].originalError.message
          : null,
      });
    } else {
      this.setState({
        isCrashed: true,
        errorCode: null,
        errorMessage: hasMessage(args[0]) ? args[0].message : "Unknown error",
        originalErrorMessage: null,
      });
    }

    process.exitCode = 1;
  };
}
