import { RouterProvider, createHashRouter } from "react-router-dom"
import Home from "./pages/Home"
import Sectores from "./pages/Sectores"
import CodigoTareas from "./pages/CodigosTareas"
import { Layout } from "./components/Layout"
import { AuthContextProvider } from "./context/AuthContext"
import { GlobalProvider } from "./context/Global/GlobalContext"

function App() {
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
      </GlobalProvider>
    </AuthContextProvider>
  )
}
export default App
