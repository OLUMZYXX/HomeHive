import { useLocation } from 'react-router-dom'

export const useSmartNavigation = () => {
  const location = useLocation()

  const getHomePath = () => {
    // Check if current path is host-related
    const hostPaths = ['/host', '/hostlogin', '/host-signup', '/host-dashboard']
    const isHostRoute = hostPaths.some((path) =>
      location.pathname.startsWith(path)
    )

    // If on host-related page, return host landing page, otherwise return main landing page
    return isHostRoute ? '/host' : '/'
  }

  return { getHomePath }
}

export const navigateToHome = (navigate, location) => {
  const hostPaths = ['/host', '/hostlogin', '/host-signup', '/host-dashboard']
  const isHostRoute = hostPaths.some((path) =>
    location.pathname.startsWith(path)
  )

  const homePath = isHostRoute ? '/host' : '/'
  navigate(homePath)
}
