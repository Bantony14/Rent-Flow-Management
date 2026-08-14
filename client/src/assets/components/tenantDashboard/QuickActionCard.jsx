import { Zap, CreditCard, Download, MessageSquare, PhoneCall } from "lucide-react";

const quickActions = [
    {
        icon: <CreditCard size={18} />,
        label: "Pay rent",
        style: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
        onClick: () => console.log("Pay rent clicked"),
    },
    {
        icon: <Download size={18} />,
        label: "Receipt",
        style: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
        onClick: () => console.log("Receipt clicked"),
    },
    {
        icon: <MessageSquare size={18} />,
        label: "Complaint",
        style: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200",
        onClick: () => console.log("Complaint clicked"),
    },
    {
        icon: <PhoneCall size={18} />,
        label: "Contact owner",
        style: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
        onClick: () => console.log("Contact owner clicked"),
    },
];

function QuickActionsCard() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-800">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((a, i) => (
                    <button
                        key={i}
                        onClick={a.onClick}
                        className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5 ${a.style}`}
                    >
                        {a.icon} {a.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActionsCard;