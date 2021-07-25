import { Box, Spacer, Text } from 'ink';
import React, { ReactElement } from 'react';

interface Props {
  version: string;
}

export function TitleBar({ version }: Props): ReactElement {
  return (
    <Box height={2} width={80}>
      <Spacer />
      <Text color="green">Subfinder v{version}</Text>
      <Spacer />
    </Box>
  );
}
