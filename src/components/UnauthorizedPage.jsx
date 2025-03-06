import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();


  const handleBackToLogin = () => {

    navigate('/');

  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] dark:bg-[#1D1D1F] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center">
   

        {/* Lock Icon */}
        <div className="my-8">
          <svg className="w-16 h-24  mx-auto text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-6H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2zM6 7V5a6 6 0 1112 0v2" />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-semibold text-[#1D1D1F] dark:text-[#FBFBFD] mb-3">
          Access Denied
        </h2>
        
        <p className="text-[#86868B] text-lg mb-8 max-w-md mx-auto">
          You don't have permission to access this page. Please contact your administrator.
        </p>

        {/* Apple-style Button */}
        <button 
          onClick={handleBackToLogin}
          className="inline-flex items-center justify-center px-7 py-3 
                   rounded-full bg-[#0071E3] hover:bg-[#0077ED] 
                   text-white text-sm font-medium 
                   transition-all duration-200 
                   transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Back 
        </button>

      
      </div>
    </div>
  );
};

export default UnauthorizedPage;