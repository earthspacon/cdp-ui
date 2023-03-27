import { Box, SxProps } from '@mui/material';

import { ChildrenProp } from '../types/utility';

interface HeightWrapperProps extends ChildrenProp {
  isMaxHeight: boolean;
  maxHeight: number | string;
  sx?: SxProps;
}

export function HeightWrapper({
  isMaxHeight,
  maxHeight,
  children,
  sx,
}: HeightWrapperProps) {
  return (
    <Box
      sx={{
        height: isMaxHeight ? maxHeight : 'auto',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
