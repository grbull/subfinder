import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import React, { ReactElement } from 'react';

interface Props {
  status: string;
}

export function StatusBar({ status }: Props): ReactElement {
  return (
    <Box height={2} width={80}>
      {/* Only display spinner when there are elipsis */}
      {status.slice(-3) === '...' && (
        <Text color="green">
          <Spinner type="dots" />{' '}
        </Text>
      )}
      <Text>{status}</Text>
    </Box>
  );
}
