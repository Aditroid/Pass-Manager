import './App.css'
import Footer from './components/Footer'
import Manager from './components/Manager'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-0 flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Manager />
        <Footer className="mt-auto" />
      </div>
    </div>
  )
}

export default App
