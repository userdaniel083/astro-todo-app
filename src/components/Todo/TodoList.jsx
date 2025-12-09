import { useState, useEffect } from 'preact/hooks';

const getTasksFromStorage = () => {
  const stored = localStorage.getItem('astro_vr_todo_tasks');
  if (!stored) return [];
  
  const tasks = JSON.parse(stored);
  
  return tasks.map(task => ({
    ...task,
    category: task.category || 'werk'
  }));
};

const saveTasksToStorage = (tasks) => localStorage.setItem('astro_vr_todo_tasks', JSON.stringify(tasks));

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('werk');

  useEffect(() => setTasks(getTasksFromStorage()), []); 

  const addTask = (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    if (tasks.length >= 10) {
      alert('Je kan maximaal 10 taken toevoegen');
      return;
    }
    
    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      category: category
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

  const getTasksByCategory = (cat) => tasks.filter(task => task.category === cat);

  const categories = [
    { id: 'werk', label: 'Werk', emoji: '📋', color: 'bg-blue-100 border-blue-300' },
    { id: 'persoonlijk', label: 'Persoonlijk', emoji: '👤', color: 'bg-purple-100 border-purple-300' },
    { id: 'vrije-tijd', label: 'Vrije Tijd', emoji: '🎮', color: 'bg-pink-100 border-pink-300' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      
      {/* sidebar deskop */}
      <aside className="hidden lg:block lg:w-80 flex-shrink-0">
        <div className="shadow-2xl rounded-2xl overflow-hidden sticky top-20">
          <div className="bg-vr-dark p-8">
            <h2 className="text-purple-400 text-sm font-semibold mb-6 uppercase tracking-wider">Nieuwe taak toevoegen...</h2>
            
            <form onSubmit={addTask} className="flex flex-col gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Schrijf hier"
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-vr-accent"
              />
              
              {/* 3 catory knoppen */}
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
                      category === cat.id
                        ? 'bg-vr-accent text-vr-dark shadow-lg'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-vr-accent text-vr-dark font-bold p-3 rounded-lg hover:bg-white transition duration-200 mt-2"
              >
                Toevoegen
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex-grow">
        
        <div className="lg:hidden shadow-2xl rounded-2xl overflow-hidden mb-8">
          <div className="bg-vr-dark p-8">
            <h2 className="text-purple-400 text-sm font-semibold mb-4 uppercase tracking-wider">Nieuwe taak toevoegen...</h2>
            
            <form onSubmit={addTask} className="flex flex-col gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Schrijf hier"
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-vr-accent"
              />
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-vr-accent"
              >
                <option value="werk">📋 Werk</option>
                <option value="persoonlijk">👤 Persoonlijk</option>
                <option value="vrije-tijd">🎮 Vrije Tijd</option>
              </select>

              <button
                type="submit"
                className="w-full bg-vr-accent text-vr-dark font-bold p-3 rounded-lg hover:bg-white transition duration-200"
              >
                Toevoegen
              </button>
            </form>
          </div>
        </div>

        {/* taak lijst*/}
        <div className="shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-purple p-6 min-h-[300px]">
            
            <div className="mb-6 flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-bold text-sm uppercase">Jouw Taken</span>
                <div className="flex items-center gap-3">
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
              <div className="space-y-6">
                {categories.map((cat) => {
                  const catTasks = getTasksByCategory(cat.id);
                  return (
                    <div key={cat.id}>
                      <h3 className="text-gray-400 font-bold text-sm uppercase mb-3">{cat.label} ({catTasks.length})</h3>
                      {catTasks.length === 0 ? (
                        <p className="text-gray-400 text-sm italic ml-2">Geen taken</p>
                      ) : (
                        <ul className="space-y-3">
                          {catTasks.map((task) => (
                            <li 
                              key={task.id} 
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                  task.completed ? `${cat.color} opacity-60` : `${cat.color} hover:shadow-md`
                              }`}
                            >
                              <div className="flex items-center flex-grow gap-3 min-w-0">
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}