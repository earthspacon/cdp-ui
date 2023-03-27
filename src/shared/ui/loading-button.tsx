import {
  Button,
  ButtonProps,
  CircularProgress,
  CircularProgressProps,
} from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  loadingProps?: CircularProgressProps;
  component?: React.ElementType;
}

export function LoadingButton({
  loading,
  children,
  loadingProps,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || props.disabled}
      startIcon={
        loading ? (
          <CircularProgress sx={{ mr: '10px' }} size={22} {...loadingProps} />
        ) : null
      }
      {...props}
    >
      {children}
    </Button>
  );
}
