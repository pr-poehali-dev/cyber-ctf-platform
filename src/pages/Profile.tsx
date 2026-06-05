import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  getCurrentUser, saveCurrentUser, resetAllData, getLeaderboard,
  getTasksByLevel, getCoursesByLevel, getCourseProgress,
  ALL_TASKS, type User, type Level
} from '@/lib/store';

interface ProfileProps { level: Level; onLevelChange: (l: Level) => void; }

const AVATARS = ['🛡️', '🐉', '⚡', '🔐', '💀', '🤖', '👾', '🕵️', '🦊', '🐺', '🔴', '🧠'];

export default function Profile({ level, onLevelChange }: ProfileProps) {
  const [user, setUser] = useState<User>(getCurrentUser());
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [showReset, setShowReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [tab, setTab] = useState<'stats' | 'settings'>('stats');

  const leaderboard = getLeaderboard();
  const myRank = leaderboard.findIndex(u => u.id === 'current' || u.name === user.name) + 1;

  const beginnerTasks = getTasksByLevel('beginner');
  const advancedTasks = getTasksByLevel('advanced');
  const beginnerCourses = getCoursesByLevel('beginner');
  const advancedCourses = getCoursesByLevel('advanced');

  const solvedBeginner = beginnerTasks.filter(t => user.solvedTasks.includes(t.id)).length;
  const solvedAdvanced = advancedTasks.filter(t => user.solvedTasks.includes(t.id)).length;

  const saveName = () => {
    if (!nameInput.trim()) return;
    const updated = { ...user, name: nameInput.trim() };
    saveCurrentUser(updated);
    setUser(updated);
    setEditName(false);
  };

  const selectAvatar = (av: string) => {
    const updated = { ...user, avatar: av };
    saveCurrentUser(updated);
    setUser(updated);
  };

  const handleReset = () => {
    resetAllData();
    setResetDone(true);
    setTimeout(() => window.location.reload(), 1500);
  };

  const joinDate = new Date(user.joinDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  // Статистика по категориям
  const catStats = ['web', 'crypto', 'stego', 'linux', 'pwn', 'reverse', 'forensics'].map(cat => ({
    cat,
    total: ALL_TASKS.filter(t => t.category === cat).length,
    solved: ALL_TASKS.filter(t => t.category === cat && user.solvedTasks.includes(t.id)).length,
  })).filter(s => s.total > 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Шапка профиля */}
      <div className="cyber-card p-6 scan-line overflow-hidden relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 flex items-start gap-5 flex-wrap">
          {/* Аватар */}
          <div className="text-6xl">{user.avatar}</div>

          <div className="flex-1 min-w-0">
            {/* Имя */}
            {editName ? (
              <div className="flex gap-2 mb-2">
                <input
                  className="terminal-input flex-1 text-lg"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  autoFocus
                />
                <button onClick={saveName} className="cyber-btn-solid px-3"><Icon name="Check" size={14} /></button>
                <button onClick={() => setEditName(false)} className="cyber-btn px-3"><Icon name="X" size={14} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-display font-bold text-white">{user.name}</h1>
                <button onClick={() => setEditName(true)} className="text-gray-600 hover:text-neon transition-colors">
                  <Icon name="Pencil" size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`tag-badge ${level === 'beginner' ? 'tag-beginner' : 'tag-advanced'}`}>
                {level === 'beginner' ? '🌱 НОВИЧОК' : '⚡ ОПЫТНЫЙ'}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                На платформе с {joinDate}
              </span>
            </div>
          </div>

          {/* Очки и ранг */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded" style={{ background: 'rgba(0,255,153,0.06)', border: '1px solid rgba(0,255,153,0.15)' }}>
              <div className="text-3xl font-mono font-bold neon-text">{user.score}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>ОЧКОВ</div>
            </div>
            <div className="text-center p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-3xl font-mono font-bold text-white">#{myRank || '—'}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>МЕСТО</div>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="flex gap-1 p-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[{ id: 'stats', icon: 'BarChart2', label: 'Статистика' }, { id: 'settings', icon: 'Settings', label: 'Настройки' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-mono rounded transition-all ${tab === t.id ? 'bg-neon text-black font-bold' : 'text-gray-500 hover:text-white'}`}
          >
            <Icon name={t.icon} fallback="Circle" size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Статистика */}
      {tab === 'stats' && (
        <div className="space-y-4">
          {/* Сводка */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Задач решено', value: user.solvedTasks.length, icon: 'Flag', color: 'var(--neon)' },
              { label: 'Курсов пройдено', value: user.completedCourses.length, icon: 'BookOpen', color: '#60a5fa' },
              { label: 'Модулей изучено', value: user.completedModules.length, icon: 'CheckSquare', color: '#a3e635' },
              { label: 'Общий балл', value: user.score, icon: 'Star', color: '#fbbf24' },
            ].map(item => (
              <div key={item.label} className="cyber-card p-4 text-center">
                <Icon name={item.icon} fallback="Circle" size={18} style={{ color: item.color, margin: '0 auto 8px' }} />
                <div className="text-2xl font-mono font-bold text-white">{item.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Прогресс по уровням */}
          <div className="cyber-card p-5">
            <h3 className="text-white font-display font-bold mb-4">Прогресс по уровням</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="neon-text">🌱 Новичок — задачи</span>
                  <span className="text-white">{solvedBeginner}/{beginnerTasks.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${beginnerTasks.length ? (solvedBeginner / beginnerTasks.length) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#f97316' }}>⚡ Опытный — задачи</span>
                  <span className="text-white">{solvedAdvanced}/{advancedTasks.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${advancedTasks.length ? (solvedAdvanced / advancedTasks.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #f97316, #f9731690)' }} />
                </div>
              </div>
              {beginnerCourses.map(c => {
                const prog = getCourseProgress(user, c.id);
                return (
                  <div key={c.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-dim)' }}>📚 {c.title}</span>
                      <span className="text-white">{prog}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${prog}%`, background: 'linear-gradient(90deg, #60a5fa, #60a5fa90)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Статистика по категориям */}
          <div className="cyber-card p-5">
            <h3 className="text-white font-display font-bold mb-4">По категориям</h3>
            <div className="space-y-3">
              {catStats.map(({ cat, total, solved }) => {
                const pct = total ? Math.round((solved / total) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="w-20 text-xs font-mono uppercase" style={{ color: 'var(--text-dim)' }}>{cat}</span>
                    <div className="flex-1 progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-right text-xs font-mono text-white">{solved}/{total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Настройки */}
      {tab === 'settings' && (
        <div className="space-y-4">
          {/* Выбор аватара */}
          <div className="cyber-card p-5">
            <h3 className="text-white font-display font-bold mb-3">Аватар</h3>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map(av => (
                <button
                  key={av}
                  onClick={() => selectAvatar(av)}
                  className={`w-10 h-10 rounded text-xl transition-all ${user.avatar === av ? 'ring-2 ring-neon scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                  style={{ background: user.avatar === av ? 'rgba(0,255,153,0.1)' : 'rgba(255,255,255,0.05)' }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Переключение уровня */}
          <div className="cyber-card p-5">
            <h3 className="text-white font-display font-bold mb-1">Режим обучения</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>Выбери уровень контента, который ты хочешь видеть</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'beginner', label: '🌱 Новичок', desc: 'Основы: крипто, веб, Linux' },
                { id: 'advanced', label: '⚡ Опытный', desc: 'PWN, Reverse, форензика' },
              ].map(l => (
                <button
                  key={l.id}
                  onClick={() => {
                    onLevelChange(l.id as Level);
                    const updated = { ...user, level: l.id as Level };
                    saveCurrentUser(updated);
                    setUser(updated);
                  }}
                  className={`p-4 rounded text-left transition-all ${level === l.id ? 'border-neon' : 'border-transparent hover:border-white hover:border-opacity-20'}`}
                  style={{ background: level === l.id ? 'rgba(0,255,153,0.08)' : 'rgba(255,255,255,0.03)', border: `2px solid ${level === l.id ? 'rgba(0,255,153,0.5)' : 'transparent'}` }}
                >
                  <div className="text-base font-bold text-white font-display">{l.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{l.desc}</div>
                  {level === l.id && <div className="text-xs neon-text mt-1">✓ Активен</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Опасная зона */}
          <div className="p-5 rounded" style={{ border: '1px solid rgba(255,50,50,0.2)', background: 'rgba(255,50,50,0.03)' }}>
            <h3 className="text-red-400 font-display font-bold mb-1 flex items-center gap-2">
              <Icon name="AlertTriangle" size={14} /> Опасная зона
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
              Сброс удалит весь прогресс, очки и решённые задачи. Действие необратимо.
            </p>
            {!showReset ? (
              <button
                onClick={() => setShowReset(true)}
                className="cyber-btn py-2 px-5 text-xs"
                style={{ borderColor: 'rgba(255,50,50,0.4)', color: '#ff3232' }}
              >
                Сбросить все данные
              </button>
            ) : resetDone ? (
              <div className="text-neon font-mono text-sm">✓ Данные сброшены. Перезагрузка...</div>
            ) : (
              <div className="space-y-3">
                <p className="text-red-400 text-xs font-bold">Ты уверен? Это действие нельзя отменить!</p>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="cyber-btn py-2 px-4 text-xs" style={{ borderColor: 'rgba(255,50,50,0.6)', color: '#ff3232', background: 'rgba(255,50,50,0.08)' }}>
                    Да, сбросить
                  </button>
                  <button onClick={() => setShowReset(false)} className="cyber-btn py-2 px-4 text-xs">
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
