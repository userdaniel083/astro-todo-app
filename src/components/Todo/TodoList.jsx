import { useState, useEffect } from 'preact/hooks';

const getTasksFromStorage = () => {
  const stored = localStorage.getItem('astro_vr_todo_tasks');
  return stored ? JSON.parse(stored) : [];
};
const saveTasksToStorage = (tasks) => localStorage.setItem('astro_vr_todo_tasks', JSON.stringify(tasks));

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => setTasks(getTasksFromStorage()), []); 

  const addTask = (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // 10 task limit
    if (tasks.length >= 10) {
      alert('Je kan maximaal 10 taken toevoegen');
      return;
    }
    
    const newTask = {
      id: Date.now(),
      text: input,
      completed: false
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    setInput('');
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  return (
    // De Kaart Container: Schaduw en afgeronde hoeken
    <div className="shadow-2xl rounded-2xl overflow-hidden mx-auto mt-8 max-w-lg">
      
      {/* 1. DONKERE BOVENKANT (Header & Input) */}
      <div className="bg-vr-dark p-8">
        <h2 className="text-purple-400 text-sm font-semibold mb-1 uppercase tracking-wider">Nieuwe taak toevoegen...</h2>
        
        <form onSubmit={addTask} className="flex flex-col gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Schrijf hier"
            // Input styling
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-vr-accent"
          />
          <button
            type="submit"
            // Knop styling
            className="w-full bg-vr-accent text-vr-dark font-bold p-3 rounded-lg hover:bg-white transition duration-200"
          >
            Toevoegen
          </button>
        </form>
      </div>

      {/* 2. DONKERE ONDERKANT (De Lijst) */}
      <div className="bg-purple p-6 min-h-[300px]">
        
        <div className="mb-4 flex justify-between items-center border-b pb-2">
            <span className="text-gray-500 font-bold text-sm uppercase">Jouw Taken</span>
            <div className="flex items-center gap-3">
              {/* Progress bar */}
              <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-vr-accent transition-all duration-300"
                  style={{ width: `${(tasks.length / 10) * 100}%` }}
                />
              </div>
              <span className="bg-gray-200 text-gray-600 text-xs py-1 px-2 rounded-full whitespace-nowrap">{tasks.length}/10</span>
            </div>
        </div>

        {tasks.length === 0 ? (
           <div className="text-center py-10">
              <p className="text-400 italic">Nog geen taken </p>
           </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                // Lijst item styling: Lichtgrijs (niet donker)
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    task.completed ? 'bg-green-50 border-green-200 opacity-60' : 'bg-gray-50 border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center flex-grow gap-3 min-w-0">
                  {/* Checkbox Custom Style */}
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${
                        task.completed ? 'bg-vr-accent border-vr-accent' : 'border-gray-300'
                    }`}
                  >
                    {task.completed && <span className="text-vr-dark font-bold text-xs">✓</span>}
                  </div>

                  <span 
                    onClick={() => toggleTask(task.id)}
                    className={`text-lg font-medium cursor-pointer select-none truncate flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                  >
                    {task.text}
                  </span>
                </div>
                
                <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 transition ml-3 flex-shrink-0">

                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.728-1.447A1 1 0 0011 2H9zM7 6v10h6V6H7z" clipRule="evenodd" />
                    <path d="M10 12.586l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 11 6.293 8.707a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414L11.414 11l2.293 2.293a1 1 0 01-1.414 1.414L10 12.586z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}