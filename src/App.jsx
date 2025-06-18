import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './App.css'
import Header from './components/Header'
import JobCard from './components/JobCard'
import RandomButton from './components/RandomButton'
import Footer from './components/Footer'
import FeedbackForm from './components/FeedbackForm'

function App() {
  const [currentJob, setCurrentJob] = useState(null)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

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
      setHasStarted(true)
    }, 1000)
  }

  // 首页
  if (!hasStarted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F6F2' }}>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-8" style={{ color: '#2C3E35', fontFamily: 'LiSu, "Li Su", "STLiti", serif' }}>冷门职业图鉴</h1>
            <p className="text-4xl text-gray-600 leading-relaxed mb-10">
              我们生活在一个大众的世界里，但总有人在做着小众的事情；发现更多职业的可能，而不是囚禁于"正确社会"的枷锁之中。
            </p>
            <p className="text-3xl text-gray-500 mb-16 italic">
              每一次点击，都是一次对未知的探索；每一个职业，都藏着一段独特的人生故事。
            </p>
            <div className="mb-16">
              <RandomButton onClick={getRandomJob} isLoading={isLoading} />
            </div>
            <p className="text-xl text-gray-400">
              温馨提示：每个职业背后都有其独特的价值，让我们带着开放和好奇的心态去探索吧
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 探索页面
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F6F2' }}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        {error && (
          <div className="text-center text-red-600 my-4 text-2xl">
            {error}
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <RandomButton onClick={getRandomJob} isLoading={isLoading} />
          </div>
          <div className="min-h-[60vh] flex items-center justify-center">
            <JobCard job={currentJob} />
          </div>
        </div>
        
        {/* 留言按钮 */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setShowFeedback(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-xl text-2xl"
          >
            分享你的故事
          </button>
        </div>

        {/* 留言表单 */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-xl w-full">
              <FeedbackForm onClose={() => setShowFeedback(false)} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
