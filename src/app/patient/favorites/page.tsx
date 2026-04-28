export default function FavoritesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6 text-3xl">❤️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Doctors</h2>
      <p className="text-gray-500 max-w-md">Doctors you've marked as favorites will appear here. This feature is currently under development.</p>
    </div>
  );
}
