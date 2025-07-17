import { useNavigate } from 'react-router-dom'

interface AppRoute {
  align: string
  drive: string
  pulse: string
  catalyst: string
  flow: string
  foresight: string
}

const APP_PORTS: AppRoute = {
  align: 'http://localhost:5173',
  drive: 'http://localhost:5179',
  pulse: 'http://localhost:5177',
  catalyst: 'http://localhost:5174',
  flow: 'http://localhost:5175',
  foresight: 'http://localhost:5176',
}

export function useNavigation() {
  const navigate = useNavigate()

  const navigateToApp = (app: keyof AppRoute, path: string = '/') => {
    // In development, navigate to different ports
    if (process.env.NODE_ENV === 'development') {
      window.location.href = `${APP_PORTS[app]}${path}`
    } else {
      // In production, navigate to subdomains or paths
      window.location.href = `https://${app}.aesyros.com${path}`
    }
  }

  const navigateWithinApp = (path: string) => {
    navigate(path)
  }

  return {
    navigateToApp,
    navigateWithinApp,
    navigate,
  }
}