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
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {error && (
          <div className="text-center text-red-600 my-4">
            {error}
          </div>
        )}
        {!currentJob && (
          <div className="text-center text-gray-600 my-12">
            点击下方按钮，探索一个有趣的冷门职业
          </div>
        )}
        <div className="max-w-2xl mx-auto">
          <RandomButton onClick={getRandomJob} isLoading={isLoading} />
          <JobCard job={currentJob} />
        </div>
        
        {/* 留言按钮 */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setShowFeedback(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            给我留言
          </button>
        </div>

        {/* 留言表单 */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
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
