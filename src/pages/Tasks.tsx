import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import {
  getCurrentUser, getTasksByLevel, solveTask,
  type User, type Level, type Task, type TaskCategory
} from '@/lib/store';

interface TasksProps { level: Level; }

// Категории для фильтрации
const CATEGORIES: { id: TaskCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'web', label: 'Web' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'stego', label: 'Stego' },
  { id: 'linux', label: 'Linux' },
  { id: 'pwn', label: 'Pwn' },
  { id: 'reverse', label: 'Reverse' },
  { id: 'forensics', label: 'Forensics' },
];

// Компонент уведомления о начислении очков
function PointsToast({ points, onDone }: { points: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-up">
      <div
        className="px-6 py-4 rounded flex items-center gap-3 font-mono font-bold text-black text-lg"
        style={{ background: 'var(--neon)', boxShadow: '0 0 30px rgba(0,255,153,0.5)' }}
      >
        <Icon name="Zap" size={20} />
        +{points} ОЧКОВ!
      </div>
    </div>
  );
}

// Карточка задачи
function TaskCard({ task, user, onSolve }: { task: Task; user: User; onSolve: (id: string, pts: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'solved'>('idle');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSolved = user.solvedTasks.includes(task.id);

  useEffect(() => {
    if (isSolved) setStatus('solved');
  }, [isSolved]);

  const submit = () => {
    if (status === 'solved') return;
    const val = flagInput.trim();
    if (!val) return;

    if (val === task.flag) {
      setStatus('solved');
      onSolve(task.id, task.points);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStatus('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 400);
      // Подсказка после 3 попыток
      if (newAttempts >= 3 && task.hints.length > 0) {
        const hintIdx = Math.min(Math.floor((newAttempts - 3) / 2), task.hints.length - 1);
        setHint(task.hints[hintIdx]);
      }
      setTimeout(() => setStatus('idle'), 1200);
    }
    setFlagInput('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={`cyber-card transition-all ${isSolved ? 'opacity-80' : ''}`}
      style={{ borderColor: isSolved ? 'rgba(0,255,153,0.3)' : undefined }}
    >
      {/* Заголовок */}
      <button
        className="w-full p-4 text-left flex items-start gap-3"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`w-8 h-8 rounded flex-shrink-0 flex items-center justify-center mt-0.5 ${isSolved ? 'bg-neon bg-opacity-20' : 'border border-gray-700'}`}>
          {isSolved
            ? <Icon name="Check" size={14} className="neon-text" />
            : <Icon name="Flag" size={14} className="text-gray-500" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <span className={`font-mono font-semibold ${isSolved ? 'neon-text' : 'text-white'}`}>
              {task.title}
            </span>
            <div className="flex items-center gap-2">
              <span className={`tag-badge tag-${task.difficulty}`}>
                {task.difficulty === 'easy' ? 'EASY' : task.difficulty === 'medium' ? 'MEDIUM' : 'HARD'}
              </span>
              <span className="text-sm font-mono font-bold neon-text">+{task.points}</span>
              <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="tag-badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.1)' }}>
              {task.category.toUpperCase()}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {task.solvedCount} решений
            </span>
          </div>
        </div>
      </button>

      {/* Раскрытый контент */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white border-opacity-5 pt-4">
          {/* Описание */}
          <p className="text-sm leading-relaxed" style={{ color: '#aaa' }}>
            {task.description}
          </p>

          {/* Подсказка */}
          {hint && !isSolved && (
            <div className="p-3 rounded text-sm" style={{ background: 'rgba(255,193,0,0.05)', border: '1px solid rgba(255,193,0,0.2)', color: '#ffc100' }}>
              <span className="font-bold">💡 Подсказка:</span> {hint}
            </div>
          )}

          {/* Ввод флага */}
          {!isSolved ? (
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-dim)', letterSpacing: '0.1em' }}>ВВЕДИ ФЛАГ</div>
              <div className={`flex gap-2 ${shake ? 'animate-glitch' : ''}`}>
                <input
                  ref={inputRef}
                  type="text"
                  className="terminal-input flex-1"
                  placeholder="flag{...}"
                  value={flagInput}
                  onChange={e => setFlagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  style={status === 'wrong' ? { borderColor: 'rgba(255,50,50,0.6)', color: '#ff3232' } : undefined}
                />
                <button
                  onClick={submit}
                  className="cyber-btn-solid px-4 flex-shrink-0"
                >
                  <Icon name="Send" size={14} />
                </button>
              </div>
              {status === 'wrong' && (
                <div className="text-xs mt-1.5" style={{ color: '#ff3232' }}>
                  ✗ Неверный флаг. Попыток: {attempts}
                  {attempts >= 3 ? ' (подсказка активирована)' : ` (подсказка через ${3 - attempts})`}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded" style={{ background: 'rgba(0,255,153,0.05)', border: '1px solid rgba(0,255,153,0.2)' }}>
              <div className="flex items-center gap-2 neon-text font-mono text-sm font-bold mb-1">
                <Icon name="CheckCircle" size={14} /> ФЛАГ ПРИНЯТ! +{task.points} очков
              </div>
              <div className="font-mono text-xs" style={{ color: 'rgba(0,255,153,0.6)' }}>{task.flag}</div>
            </div>
          )}

          {/* Райтап — только после решения */}
          {isSolved && (
            <div className="space-y-3 pt-2 border-t border-white border-opacity-5">
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>
                📖 Райтап
              </div>
              <div className="text-sm font-display font-semibold text-white">{task.writeup.title}</div>
              <p className="text-sm leading-relaxed" style={{ color: '#aaa' }}>{task.writeup.explanation}</p>
              <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(0,255,153,0.15)' }}>
                <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: 'rgba(0,255,153,0.05)' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
                  <span className="text-xs ml-1" style={{ color: 'var(--text-dim)' }}>exploit.py</span>
                </div>
                <pre className="p-4 text-xs overflow-x-auto neon-text leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace', background: '#0d0d0d' }}>
                  {task.writeup.code}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Tasks({ level }: TasksProps) {
  const [user, setUser] = useState<User>(getCurrentUser());
  const [category, setCategory] = useState<TaskCategory | 'all'>('all');
  const [toast, setToast] = useState<number | null>(null);
  const tasks = getTasksByLevel(level);

  const filtered = category === 'all' ? tasks : tasks.filter(t => t.category === category);
  const solvedCount = tasks.filter(t => user.solvedTasks.includes(t.id)).length;
  const totalPts = tasks.filter(t => user.solvedTasks.includes(t.id)).reduce((s, t) => s + t.points, 0);

  const handleSolve = (id: string, pts: number) => {
    const updated = solveTask(id, pts);
    setUser(updated);
    setToast(pts);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {toast !== null && <PointsToast points={toast} onDone={() => setToast(null)} />}

      {/* Шапка */}
      <div className="cyber-card p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Icon name="Flag" size={20} className="neon-text" />
              CTF ЗАДАЧИ
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
              {level === 'beginner' ? 'Задачи для новичков' : 'Задачи для опытных'}
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-2xl font-mono font-bold neon-text">{solvedCount}/{tasks.length}</div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>решено</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-white">{totalPts}</div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>очков</div>
            </div>
          </div>
        </div>
        {/* Прогресс */}
        <div className="mt-4 progress-bar">
          <div className="progress-fill" style={{ width: `${tasks.length ? (solvedCount / tasks.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.filter(c => c.id === 'all' || tasks.some(t => t.category === c.id)).map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id as TaskCategory | 'all')}
            className={`tag-badge cursor-pointer transition-all py-1.5 px-3 ${category === cat.id ? 'tag-beginner' : ''}`}
            style={category !== cat.id ? { background: 'rgba(255,255,255,0.05)', color: '#666', border: '1px solid rgba(255,255,255,0.1)' } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Список задач */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="cyber-card p-8 text-center" style={{ color: 'var(--text-dim)' }}>
            Нет задач в этой категории
          </div>
        ) : (
          filtered.map(task => (
            <TaskCard key={task.id} task={task} user={user} onSolve={handleSolve} />
          ))
        )}
      </div>
    </div>
  );
}
