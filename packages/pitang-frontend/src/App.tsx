import { useState, useEffect, useCallback } from 'react';

type Task = {
    completed: boolean;
    id: string;
    title: string;
};

type TimerMode = 'work' | 'break' | 'longBreak';

const TIMER_CONFIG = {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
};

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const modeLabel = {
    work: 'Focus',
    break: 'Short Break',
    longBreak: 'Long Break',
};

const modeColors = {
    work: 'text-red-400',
    break: 'text-green-400',
    longBreak: 'text-blue-400',
};

function Timer({ onComplete }: { onComplete: () => void }) {
    const [mode, setMode] = useState<TimerMode>('work');
    const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.work);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_CONFIG[newMode]);
        setIsRunning(false);
    }, []);

    const handleComplete = useCallback(() => {
        onComplete();
        if (mode === 'work') {
            const newSessions = sessions + 1;
            setSessions(newSessions);
            if (newSessions % 4 === 0) {
                switchMode('longBreak');
            } else {
                switchMode('break');
            }
        } else {
            switchMode('work');
        }
    }, [mode, sessions, switchMode, onComplete]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, handleComplete]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(TIMER_CONFIG[mode]);
    };

    return (
        <div className="flex flex-col items-center py-8">
            <div className="mb-6 flex gap-2">
                {(['work', 'break', 'longBreak'] as TimerMode[]).map((m) => (
                    <button
                        key={m}
                        className={`rounded-full px-3 py-1 text-sm transition-colors ${
                            mode === m
                                ? 'bg-white/20 text-white'
                                : 'text-white/50 hover:text-white/70'
                        }`}
                        onClick={() => switchMode(m)}
                    >
                        {modeLabel[m]}
                    </button>
                ))}
            </div>

            <div
                className={`mb-6 text-8xl font-light tabular-nums ${modeColors[mode]}`}
            >
                {formatTime(timeLeft)}
            </div>

            <div className="flex gap-3">
                <button
                    className="rounded-full bg-white px-8 py-3 font-medium text-slate-900 transition-colors hover:bg-gray-100"
                    onClick={toggleTimer}
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                    className="rounded-full border border-white/30 px-6 py-3 font-medium transition-colors hover:bg-white/10"
                    onClick={resetTimer}
                >
                    Reset
                </button>
            </div>

            <p className="mt-4 text-sm text-white/40">Session {sessions + 1}</p>
        </div>
    );
}

function Tasks() {
    const [input, setInput] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    function onSaveTask() {
        if (!input.trim()) return;
        setTasks([
            ...tasks,
            { completed: false, id: crypto.randomUUID(), title: input },
        ]);
        setInput('');
    }

    function completeTask({ id }: Task) {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task,
            ),
        );
    }

    function deleteTask({ id }: Task) {
        setTasks(tasks.filter((task) => task.id !== id));
    }

    return (
        <div className="mx-auto max-w-md px-4">
            <div className="mb-6 flex gap-2">
                <input
                    className="flex-1 rounded-lg border border-white/20 bg-white/10 p-3 text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
                    placeholder="Add a task..."
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSaveTask()}
                />
                <button
                    className="rounded-lg bg-white px-5 py-3 font-medium text-slate-900 transition-colors hover:bg-gray-100"
                    onClick={onSaveTask}
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {tasks.map((task) => (
                    <li
                        className={`flex cursor-pointer items-center justify-between rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10 ${
                            task.completed ? 'opacity-50' : ''
                        }`}
                        key={task.id}
                    >
                        <span
                            className={`flex-1 ${task.completed ? 'text-white/50 line-through' : ''}`}
                            onClick={() => completeTask(task)}
                        >
                            {task.title}
                        </span>
                        <button
                            className="px-2 text-white/30 hover:text-red-400"
                            onClick={() => deleteTask(task)}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>

            {tasks.length === 0 && (
                <p className="py-8 text-center text-white/30">No tasks yet</p>
            )}
        </div>
    );
}

export default function Pomodoro() {
    const [key, setKey] = useState(0);

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white">
            <Timer onComplete={() => setKey((k) => k + 1)} key={key} />

            <div className="mt-4 border-t border-white/10">
                <h2 className="py-6 text-center text-xl font-light text-white/70">
                    Tasks
                </h2>
                <Tasks />
            </div>
        </div>
    );
}
