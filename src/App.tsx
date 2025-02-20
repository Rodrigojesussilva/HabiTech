import './App.css'
import LoginPage from './app/login/page'
import Header from './components/header'
import Structure from './app/strucuture/structure'

function App() {

  return (
    <>
      <div className="relative flex h-screen flex-col bg-background">
        {false && (<LoginPage />)}
        {true && (
          <Header>
            <Structure>
              <LoginPage />
            </Structure>
          </Header>)}
      </div>
    </>

  )
}

export default App
