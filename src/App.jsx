import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './App.css'
import Header from './components/Header'
import JobCard from './components/JobCard'
import RandomButton from './components/RandomButton'
import Footer from './components/Footer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentJob, setCurrentJob] = useState(null)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 从public目录加载职业数据
    fetch('/data/rareJobs.json')
      .then(response => response.json())
      .then(data => {
        setJobs(data.jobs)
      })
      .catch(error => {
        console.error('Error loading jobs data:', error)
      })
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username && password) {
      setIsLoggedIn(true)
    }
  }

  const getRandomJob = () => {
    if (jobs.length === 0) return
    
    setIsLoading(true)
    // 模拟加载延迟
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * jobs.length)
      setCurrentJob(jobs[randomIndex])
      setIsLoading(false)
    }, 1000)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">冷门职业图鉴</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
              />
            </div>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              type="submit"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!currentJob && (
          <div className="text-center text-gray-600 my-8">
            点击下方按钮，探索一个有趣的冷门职业
          </div>
        )}
        <RandomButton onClick={getRandomJob} isLoading={isLoading} />
        <JobCard job={currentJob} />
      </main>
      <Footer />
    </div>
  )
}

export default App
