function JobCard({ job }) {
  if (!job) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full transform transition-all duration-300 hover:scale-[1.02]">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">{job.name}</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">职业简介</h3>
          <p className="text-xl text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">薪资范围</h3>
          <p className="text-xl text-gray-600">
            {job.salary.min} - {job.salary.max} {job.salary.unit}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">从业者自述</h3>
          <p className="text-xl text-gray-600 leading-relaxed">{job.experience}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">技能要求</h3>
            <ul className="list-disc list-inside space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-xl text-gray-600">{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobCard; 