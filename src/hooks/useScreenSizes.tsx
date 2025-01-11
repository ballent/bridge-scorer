import { useMediaQuery } from 'react-responsive'

const useScreenSizes = () => {
  const isMobile = useMediaQuery({ maxWidth: 700 })
  
  return { isMobile }
}

export default useScreenSizes
