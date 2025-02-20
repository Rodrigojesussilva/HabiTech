import './App.css'
import LoginPage from './app/login/page'
import Header from './components/header'

function App() {

  return (
    <>
      <div className="relative flex min-h-svh flex-col bg-background">
        <div className="themes-wrapper bg-background">
          <LoginPage />
         
        </div>
      </div>
    </>

  )
}

export default App
