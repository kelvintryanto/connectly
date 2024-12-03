export default function EditChat() {
  return (
    <>
      <>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Room Chat</h1>
        <form id="editRoomForm" method="POST" action="/edit-room" className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
            Room Name:
          </label>
          <input type="text" id="roomName" name="name" placeholder="Enter new room name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
            Update Room
          </button>
        </form>
      </>
    </>
  );
}
