export default function AppointmentsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 text-3xl">📅</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h2>
      <p className="text-gray-500 max-w-md">Your upcoming and past appointments will appear here. This feature is currently under development.</p>
    </div>
  );
}
