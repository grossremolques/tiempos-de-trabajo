import { RouterProvider, createHashRouter } from "react-router-dom"
import Home from "./pages/Home"
import Sectores from "./pages/Sectores"
import CodigoTareas from "./pages/CodigosTareas"
import { Layout } from "./components/Layout"
import { AuthContextProvider } from "./context/AuthContext"
import { GlobalProvider } from "./context/Global/GlobalContext"
import packageJson from "../package.json"

function App() {
  const {version} = packageJson
  const router = createHashRouter([
    {path:'/', element: <Layout/>, children: [
      {path: '/', element: <Home/>},
      {path: '/sectores', element: <Sectores/>},
      {path: '/codigo-tareas', element: <CodigoTareas/>},
    ]},
    {path:'*', element: <h1>Error</h1>}
  ])
    return (
    <AuthContextProvider>
      <GlobalProvider>
        <RouterProvider router={router} />
        <span className="small" style={{position: 'absolute', bottom: '10px', left: '10px'}}>Versión: {version}</span>
      </GlobalProvider>
    </AuthContextProvider>
  )
}
export default App
