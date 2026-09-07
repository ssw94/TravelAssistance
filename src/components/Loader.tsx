import { Box } from '@mui/material';
import { memo, useCallback, useEffect,useState } from 'react';
import loaderService from '../services/loader';

const Loader = () => {
  const [loading, setLoading] = useState(false);

  const registerLoader = useCallback((v:boolean) => {
    setLoading(v);
    return () => {
      setLoading(false);
    };
  }, [setLoading])

  useEffect(() => {
    return loaderService().registerLoader(registerLoader);
  }, [registerLoader])
  if(!loading) return null;
  return <Box className="w-full h-full flex items-center justify-center">
    <Box className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></Box>
  </Box>
};

export default memo(Loader);
