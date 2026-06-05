import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import {
  getCurrentUser, getLeaderboard, getTasksByLevel, getCoursesByLevel,
  getSolvedPercent, type User, type Level
} from '@/lib/store';
import { CTF_EVENTS } from '@/lib/store';

interface DashboardProps {
  level: Level;
  onNavigate: (page: string) => void;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div className="flex gap-2">
      {[['д', timeLeft.d], ['ч', timeLeft.h], ['м', timeLeft.m], ['с', timeLeft.s]].map(([label, val]) => (
        <div key={label as string} className="text-center">
          <div className="text-neon font-mono text-lg font-bold" style={{ textShadow: '0 0 8px rgba(0,255,153,0.5)' }}>
            {String(val).padStart(2, '0')}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ level, onNavigate }: DashboardProps) {
  const [user, setUser] = useState<User>(getCurrentUser());
  const [leaderboard] = useState(getLeaderboard().slice(0, 10));

  useEffect(() => { setUser(getCurrentUser()); }, [level]);

  const tasks = getTasksByLevel(level);
  const courses = getCoursesByLevel(level);
  const solvedPct = getSolvedPercent(user, level);
  const solvedCount = tasks.filter(t => user.solvedTasks.includes(t.id)).length;

  // Ближайший CTF
  const nextEvent = CTF_EVENTS
    .filter(e => e.level === level || e.level === 'all')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  const myRank = leaderboard.findIndex(u => u.id === 'current' || u.name === user.name) + 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Приветствие */}
      <div className="cyber-card p-6 scan-line relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-dim)', letterSpacing: '0.15em' }}>
                ДОБРО ПОЖАЛОВАТЬ
              </div>
              <h1 className="text-3xl font-display font-bold text-white">
                {user.avatar} {user.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`tag-badge ${level === 'beginner' ? 'tag-beginner' : 'tag-advanced'}`}>
                  {level === 'beginner' ? '🌱 НОВИЧОК' : '⚡ ОПЫТНЫЙ'}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  &gt; Рейтинг #{myRank || '—'} из {leaderboard.length}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-mono font-bold neon-text">{user.score}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dim)', letterSpacing: '0.1em' }}>ОЧКОВ</div>
            </div>
          </div>

          {/* Прогресс */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Задач решено', value: `${solvedCount}/${tasks.length}`, pct: solvedPct },
              { label: 'Курсов пройдено', value: `${user.completedCourses.length}/${courses.length}`, pct: Math.round((user.completedCourses.length / Math.max(courses.length, 1)) * 100) },
              { label: 'Общий прогресс', value: `${Math.round((solvedPct + Math.round((user.completedCourses.length / Math.max(courses.length, 1)) * 100)) / 2)}%`, pct: Math.round((solvedPct + Math.round((user.completedCourses.length / Math.max(courses.length, 1)) * 100)) / 2) },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.label}</span>
                  <span className="text-xs neon-text">{item.value}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: 'Flag', label: 'CTF-задачи', sub: `${solvedCount} решено`, page: 'tasks', color: 'var(--neon)' },
          { icon: 'BookOpen', label: 'Курсы', sub: `${courses.length} доступно`, page: 'courses', color: '#60a5fa' },
          { icon: 'Swords', label: 'Соревнования', sub: `${CTF_EVENTS.length} активных`, page: 'events', color: '#f97316' },
          { icon: 'Trophy', label: 'Лидерборд', sub: `#${myRank || '—'} место`, page: 'leaderboard', color: '#fbbf24' },
        ].map(item => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className="cyber-card p-4 text-left transition-all hover:scale-[1.02] group"
          >
            <Icon name={item.icon} fallback="Circle" size={20} style={{ color: item.color }} />
            <div className="text-white text-sm font-display font-semibold mt-2">{item.label}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{item.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Таблица лидеров (топ-5) */}
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-display font-bold text-lg flex items-center gap-2">
              <Icon name="Trophy" size={16} className="neon-text" />
              ТОП ЛИДЕРОВ
            </h2>
            <button onClick={() => onNavigate('leaderboard')} className="text-xs neon-text hover:underline">
              Все →
            </button>
          </div>
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((u, i) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 p-2 rounded transition-all ${u.id === 'current' ? 'bg-neon bg-opacity-5 border border-neon border-opacity-20' : 'hover:bg-white hover:bg-opacity-[0.02]'}`}
              >
                <span className={`w-6 text-center font-mono text-sm font-bold ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'text-gray-500'}`}>
                  {i < 3 ? ['🥇','🥈','🥉'][i] : `${i+1}`}
                </span>
                <span className="text-lg">{u.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-mono truncate ${u.id === 'current' ? 'neon-text' : 'text-white'}`}>{u.name}</div>
                  <span className={`tag-badge ${u.level === 'beginner' ? 'tag-beginner' : 'tag-advanced'}`}>
                    {u.level === 'beginner' ? 'NEW' : 'PRO'}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-white">{u.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ближайший CTF */}
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-display font-bold text-lg flex items-center gap-2">
              <Icon name="Swords" size={16} className="neon-text" />
              СЛЕДУЮЩИЙ CTF
            </h2>
            <button onClick={() => onNavigate('events')} className="text-xs neon-text hover:underline">
              Все →
            </button>
          </div>
          {nextEvent ? (
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-white font-display font-bold">{nextEvent.title}</div>
                  <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                    {nextEvent.description.slice(0, 100)}...
                  </div>
                </div>
                <span className={`tag-badge flex-shrink-0 ${nextEvent.level === 'beginner' ? 'tag-beginner' : nextEvent.level === 'advanced' ? 'tag-advanced' : 'text-blue-400 border border-blue-400 border-opacity-30 bg-blue-400 bg-opacity-10'}`}>
                  {nextEvent.level === 'all' ? 'ALL' : nextEvent.level === 'beginner' ? 'NEW' : 'PRO'}
                </span>
              </div>
              <div className="p-3 rounded" style={{ background: 'rgba(0,255,153,0.03)', border: '1px solid rgba(0,255,153,0.1)' }}>
                <div className="text-xs mb-2" style={{ color: 'var(--text-dim)', letterSpacing: '0.1em' }}>ДО НАЧАЛА</div>
                <Countdown targetDate={nextEvent.startDate} />
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {nextEvent.tags.map(tag => (
                  <span key={tag} className="tag-badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button onClick={() => onNavigate('events')} className="cyber-btn-solid w-full mt-4 py-2.5">
                Зарегистрироваться
              </button>
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: 'var(--text-dim)' }}>
              Нет предстоящих соревнований
            </div>
          )}
        </div>
      </div>

      {/* Задания на сегодня */}
      <div className="cyber-card p-5">
        <h2 className="text-white font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Icon name="Zap" size={16} className="neon-text" />
          ЗАДАНИЯ НА СЕГОДНЯ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tasks.slice(0, 4).map(task => {
            const isSolved = user.solvedTasks.includes(task.id);
            return (
              <button
                key={task.id}
                onClick={() => onNavigate('tasks')}
                className={`p-3 rounded text-left transition-all flex items-start gap-3 ${isSolved ? 'opacity-60' : 'hover:border-neon hover:border-opacity-30'}`}
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${isSolved ? 'rgba(0,255,153,0.2)' : 'rgba(255,255,255,0.05)'}` }}
              >
                <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center mt-0.5 ${isSolved ? 'bg-neon bg-opacity-20' : 'border border-gray-600'}`}>
                  {isSolved && <Icon name="Check" size={12} className="neon-text" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-mono ${isSolved ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`tag-badge tag-${task.difficulty}`}>{task.difficulty}</span>
                    <span className="text-xs neon-text">+{task.points} очков</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}