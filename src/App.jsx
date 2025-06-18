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
    // 从public/data目录加载CSV数据
    fetch('/data/----_副本.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('数据加载失败')
        }
        return response.text()
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const formattedJobs = results.data.map(job => ({
              id: parseInt(job['序号']),
              name: job['职业名称'],
              description: job['简介'],
              salary: {
                min: parseInt(job['薪资区间'].split('-')[0].replace(/[^0-9]/g, '')),
                max: parseInt(job['薪资区间'].split('-')[1].replace(/[^0-9]/g, '')),
                unit: job['薪资区间'].match(/[^0-9-]+/)[0]
              },
              experience: job['从业者自述/经验'].replace(/[""]/g, ''),
              requirements: [] // CSV中没有技能要求字段，暂时留空
            }))
            console.log('加载的职业数据:', formattedJobs)
            setJobs(formattedJobs)
          },
          error: (error) => {
            console.error('CSV解析错误:', error)
            setError('数据解析失败，请刷新页面重试')
          }
        })
      })
      .catch(error => {
        console.error('Error loading jobs data:', error)
        setError('数据加载失败，请刷新页面重试')
      })
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username && password) {
      setIsLoggedIn(true)
    }
  }

  const getRandomJob = () => {
    if (jobs.length === 0) {
      console.log('没有可用的职业数据')
      return
    }
    
    setIsLoading(true)
    // 模拟加载延迟
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * jobs.length)
      console.log('随机选择的职业:', jobs[randomIndex])
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
        {error && (
          <div className="text-center text-red-600 my-4">
            {error}
          </div>
        )}
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
