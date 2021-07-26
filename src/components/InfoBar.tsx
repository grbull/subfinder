import { Box, Spacer, Text } from 'ink';
import React, { ReactElement } from 'react';

interface Props {
  fileName: string;
  isInteractive: boolean;
}

export function InfoBar({ fileName, isInteractive }: Props): ReactElement {
  return (
    <Box height={2} width={80}>
      <Text>File: </Text>
      <Text color="green" dimColor>
        {fileName}
      </Text>
      <Spacer />
      <Text>Mode: </Text>
      <Text color={isInteractive ? 'yellow' : 'green'} dimColor>
        {isInteractive ? 'interactive' : 'auto'}
      </Text>
    </Box>
  );
}
