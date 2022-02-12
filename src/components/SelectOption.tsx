import { Box, Spacer, Text, useInput } from 'ink';
import React, { ReactElement, useState } from 'react';

import { Option } from '../Option';

interface Props {
  options: Option[];
  onSelect: (result: Option) => void;
}

export function SelectOption({ onSelect, options }: Props): ReactElement {
  const [selected, setSelected] = useState(0);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(options.length / 5);

  useInput((_input, key) => {
    if (key.return) {
      const selectedIndex = page * 5 + selected;
      if (options[selectedIndex]) {
        onSelect(options[selectedIndex]);
      }
    }

    if (key.leftArrow || key.pageDown) {
      if (page === 0) {
        setPage(pages - 1);
      } else {
        setPage((page) => page - 1);
      }
    }
    if (key.rightArrow || key.pageUp) {
      if (page + 1 === pages) {
        setPage(0);
      } else {
        setPage((page) => page + 1);
      }
    }
    if (key.upArrow) {
      if (selected === 0) {
        page === 0 ? setPage(pages - 1) : setPage((page) => page - 1);
        setSelected(4);
      } else {
        setSelected((selected) => selected - 1);
      }
    }
    if (key.downArrow) {
      if (selected === 4) {
        page + 1 === pages ? setPage(0) : setPage((page) => page + 1);
        setSelected(0);
      } else {
        setSelected((selected) => selected + 1);
      }
    }
  });

  function ratingColor(rating: number): string {
    if (rating >= 70) {
      return 'green';
    }
    if (rating >= 40) {
      return 'yellow';
    }
    return 'red';
  }

  return (
    <>
      <Box flexDirection="column" height={5} width={80}>
        {options.slice(page * 5, page * 5 + 5).map((result, index) => (
          <Box height={1} key={result.url} width={80}>
            <Text color={selected === index ? 'green' : 'white'}>
              {result.title.padEnd(75)}
            </Text>
            <Spacer />
            <Text color={ratingColor(result.rating)}>{result.rating}%</Text>
          </Box>
        ))}
      </Box>

      <Box flexDirection="column" height={2} width={80}>
        <Spacer />
        <Box height={1} width={80}>
          <Spacer />
          <Text color="green" dimColor>
            ↑ / ↓ Item: {page * 5 + selected + 1}/{options.length}
          </Text>
          <Spacer />
          <Text color="green" dimColor>
            ← / → Page: {page + 1}/{pages}
          </Text>
          <Spacer />
        </Box>
      </Box>
    </>
  );
}
