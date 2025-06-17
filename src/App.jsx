import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentJob, setCurrentJob] = useState(null)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 读取 CSV 文件
    fetch('/data/----_副本.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        console.log('CSV文件内容:', csvText.substring(0, 200)); // 打印前200个字符用于调试
        
        // 使用 PapaParse 解析 CSV
        Papa.parse(csvText, {
          header: false, // CSV 没有标题行
          skipEmptyLines: true, // 跳过空行
          complete: (results) => {
            console.log('解析结果:', results.data.slice(0, 2)); // 打印前两行用于调试
            
            // 将 CSV 数据转换为结构化对象
            const jobsData = results.data.slice(1).map((row, index) => ({
              id: row[0]?.trim() || '',
              name: row[1]?.trim() || '',
              description: row[2]?.trim() || '',
              salary: row[3]?.trim() || '',
              experience: row[4]?.trim() || ''
            })).filter(job => job.name && job.name.length > 0); // 过滤掉空行

            console.log('加载的职业数据数量:', jobsData.length);
            console.log('第一个职业数据:', jobsData[0]);
            setJobs(jobsData);
            setIsLoading(false);
          },
          error: (error) => {
            console.error('解析 CSV 失败:', error);
            setError('数据加载失败');
            setIsLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('加载 CSV 文件失败:', error);
        setError('数据加载失败: ' + error.message);
        setIsLoading(false);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault()
    if (username && password) {
      setIsLoggedIn(true)
    }
  }

  const getRandomJob = () => {
    if (jobs.length > 0) {
      const randomIndex = Math.floor(Math.random() * jobs.length)
      const selectedJob = jobs[randomIndex]
      console.log('随机选择的职业:', {
        id: selectedJob.id,
        name: selectedJob.name
      })
      setCurrentJob(selectedJob)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">冷门职业图鉴</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">职业探索</h2>
            <button
              onClick={getRandomJob}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || error}
            >
              随机探索职业
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">正在加载职业数据...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : currentJob ? (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentJob.name}</h3>
                <p className="text-gray-600 leading-relaxed">{currentJob.description}</p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">薪资区间</h4>
                  <p className="text-blue-600">{currentJob.salary}</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-2">从业者经验</h4>
                  <p className="text-gray-600 italic">{currentJob.experience}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">点击"随机探索职业"按钮，发现有趣的职业</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
