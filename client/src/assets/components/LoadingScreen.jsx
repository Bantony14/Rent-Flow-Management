function LoadingScreen({ message }) {
    return (

        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-5">
            <svg className="animate-spin" width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="21" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle cx="26" cy="26" r="21" fill="none" stroke="#185FA5" strokeWidth="3.5"
                    strokeDasharray="40 95" strokeLinecap="round" />
            </svg>
            <div className="text-center">
                <p className="text-base font-medium text-slate-800 mb-1">Checking Authentication</p>
                <p className="text-sm text-slate-500">{message || "Fetching your data"}</p>
            </div>
        </div>
    );
}

export default LoadingScreen;