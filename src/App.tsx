import './App.css'
import LoginPage from './app/login/page'
import Header from './components/header'
import Structure from './app/strucuture/structure'
import FormularioContainer from './components/form-controller/form-controller'

function App() {

  return (
    <>
      <div className="relative flex h-screen flex-col bg-background">
        {false && (<LoginPage />)}
        {true && (
          <Header>
            <Structure>
              <FormularioContainer/>
            </Structure>
          </Header>)}
      </div>
    </>

  )
}

export default App
