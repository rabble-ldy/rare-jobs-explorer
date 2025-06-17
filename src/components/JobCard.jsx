function JobCard({ job }) {
  if (!job) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{job.name}</h2>
      <p className="text-gray-600 mb-6">{job.description}</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">薪资范围</h3>
          <p className="text-blue-600">
            {job.salary.min} - {job.salary.max} {job.salary.unit}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">从业经验</h3>
          <p className="text-green-600">{job.experience}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-2">技能要求</h3>
        <ul className="list-disc list-inside space-y-1">
          {job.requirements.map((req, index) => (
            <li key={index} className="text-gray-600">{req}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default JobCard; 