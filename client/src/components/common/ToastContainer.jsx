import { ToastContainer } from 'react-toastify'
import { toastConfig } from '../../utils/toastUtils'
import 'react-toastify/dist/ReactToastify.css'
import './ToastContainer.css'

const AppToastContainer = () => {
  return <ToastContainer {...toastConfig} />
}

export default AppToastContainer
