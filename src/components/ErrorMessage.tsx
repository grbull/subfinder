import { Text } from 'ink';
import React, { ReactElement } from 'react';

interface Props {
  error: string;
}

export function ErrorMessage({ error }: Props): ReactElement {
  return <Text color="red">Error: {error}</Text>;
}
