import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { initStore, getCurrentUser, saveCurrentUser, isTestCompleted, completeTest, type Level } from '@/lib/store';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import Courses from '@/pages/Courses';
import Leaderboard from '@/pages/Leaderboard';
import Events from '@/pages/Events';
import Profile from '@/pages/Profile';
import LevelTest from '@/pages/LevelTest';

type Page = 'dashboard' | 'tasks' | 'courses' | 'leaderboard' | 'events' | 'profile';

const NAV_ITEMS: { id: Page; icon: string; label: string }[] = [
  { id: 'dashboard', icon: 'LayoutDashboard', label: 'Дашборд' },
  { id: 'tasks', icon: 'Flag', label: 'Задачи' },
  { id: 'courses', icon: 'BookOpen', label: 'Курсы' },
  { id: 'leaderboard', icon: 'Trophy', label: 'Лидерборд' },
  { id: 'events', icon: 'Swords', label: 'CTF' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
];

// Матричный дождь (декоративный фон)
function MatrixRain() {
  const chars = Array.from({ length: 12 }).map((_, i) =>
    Array.from({ length: 20 }).map(() =>
      String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
    ).join('')
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {chars.map((col, i) => (
        <div
          key={i}
          className="absolute top-0 font-mono leading-tight select-none"
          style={{
            left: `${(i / 12) * 100 + 2}%`,
            color: 'rgba(0,255,153,0.055)',
            animation: `scan ${6 + (i % 4)}s linear ${i * 0.8}s infinite`,
            writingMode: 'vertical-lr',
            fontSize: '10px',
            userSelect: 'none',
          }}
        >
          {col}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [level, setLevel] = useState<Level>('beginner');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [user, setUser] = useState(() => { initStore(); return getCurrentUser(); });

  useEffect(() => {
    initStore();
    const u = getCurrentUser();
    setLevel(u.level);
    setUser(u);
    // Показать тест если ещё не проходил
    if (!isTestCompleted()) {
      setShowTest(true);
    }
  }, []);

  const handleTestComplete = (detectedLevel: Level, _score: number) => {
    completeTest(detectedLevel);
    setLevel(detectedLevel);
    const u = getCurrentUser();
    setUser({ ...u, level: detectedLevel });
    setShowTest(false);
  };

  const handleLevelChange = (newLevel: Level) => {
    setLevel(newLevel);
    const u = getCurrentUser();
    const updated = { ...u, level: newLevel };
    saveCurrentUser(updated);
    setUser(updated);
  };

  const navigate = (p: string) => {
    setPage(p as Page);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard level={level} onNavigate={navigate} />;
      case 'tasks': return <Tasks level={level} />;
      case 'courses': return <Courses level={level} />;
      case 'leaderboard': return <Leaderboard level={level} />;
      case 'events': return <Events level={level} />;
      case 'profile': return <Profile level={level} onLevelChange={handleLevelChange} />;
      default: return <Dashboard level={level} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Входной тест — показывается поверх всего при первом входе */}
      {showTest && <LevelTest onComplete={handleTestComplete} />}

      <MatrixRain />

      {/* ───────── ШАПКА ───────── */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6"
        style={{
          height: '56px',
          background: 'rgba(10,10,10,0.92)',
          borderBottom: '1px solid rgba(0,255,153,0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Логотип */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center font-mono font-black text-black text-sm"
            style={{ background: 'var(--neon)', boxShadow: '0 0 10px rgba(0,255,153,0.4)' }}
          >
            CL
          </div>
          <div>
            <span className="font-display font-bold text-white text-base tracking-wider">CYBER</span>
            <span className="font-display font-bold text-base tracking-wider neon-text">LEARN</span>
          </div>
        </div>

        {/* Переключатель уровня (десктоп) */}
        <div
          className="hidden sm:flex items-center gap-1 p-1 rounded"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={() => handleLevelChange('beginner')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${level === 'beginner' ? 'bg-neon text-black' : 'text-gray-500 hover:text-white'}`}
          >
            🌱 НОВИЧОК
          </button>
          <button
            onClick={() => handleLevelChange('advanced')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${level === 'advanced' ? 'text-black' : 'text-gray-500 hover:text-white'}`}
            style={level === 'advanced' ? { background: '#ff6400' } : undefined}
          >
            ⚡ ОПЫТНЫЙ
          </button>
        </div>

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('profile')}
            className="hidden sm:flex items-center gap-2 text-xs font-mono hover:opacity-80 transition-all"
          >
            <span className="text-lg">{user.avatar}</span>
            <span className="text-white">{user.name}</span>
          </button>

          <button
            className="sm:hidden p-1.5"
            onClick={() => setMobileMenu(m => !m)}
            style={{ color: 'var(--neon)' }}
          >
            <Icon name={mobileMenu ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </header>

      {/* ───────── МОБИЛЬНОЕ МЕНЮ ───────── */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)', paddingTop: '56px' }}
        >
          <div className="p-4 space-y-2">
            <div className="flex gap-2 mb-5">
              {[{ id: 'beginner', label: '🌱 НОВИЧОК' }, { id: 'advanced', label: '⚡ ОПЫТНЫЙ' }].map(l => (
                <button
                  key={l.id}
                  onClick={() => handleLevelChange(l.id as Level)}
                  className={`flex-1 py-2.5 rounded text-xs font-mono font-bold transition-all ${level === l.id ? 'bg-neon text-black' : 'border border-gray-700 text-gray-400'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded font-mono text-sm transition-all ${
                  page === item.id ? 'bg-neon text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5'
                }`}
              >
                <Icon name={item.icon} fallback="Circle" size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ───────── LAYOUT ───────── */}
      <div className="flex" style={{ paddingTop: '56px' }}>
        {/* Сайдбар (десктоп) */}
        <aside
          className="hidden sm:flex flex-col fixed left-0 z-20 py-4"
          style={{
            top: '56px',
            width: '68px',
            height: 'calc(100vh - 56px)',
            background: 'rgba(10,10,10,0.95)',
            borderRight: '1px solid rgba(0,255,153,0.07)',
          }}
        >
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              title={item.label}
              className="relative flex flex-col items-center justify-center gap-1 py-3 mx-2 rounded transition-all"
              style={page === item.id ? { background: 'rgba(0,255,153,0.08)' } : undefined}
            >
              {page === item.id && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r"
                  style={{ background: 'var(--neon)', boxShadow: '0 0 8px rgba(0,255,153,0.6)' }}
                />
              )}
              <Icon
                name={item.icon}
                fallback="Circle"
                size={18}
                style={{ color: page === item.id ? 'var(--neon)' : '#4a7c6a' }}
              />
              <span
                className="text-[8px] font-mono leading-none"
                style={{ color: page === item.id ? 'var(--neon)' : '#4a7c6a' }}
              >
                {item.label.slice(0, 5).toUpperCase()}
              </span>
            </button>
          ))}
        </aside>

        {/* Основной контент */}
        <main className="flex-1 relative z-10 min-h-screen" style={{ paddingBottom: '80px' }}>
          <div className="max-w-3xl mx-auto px-4 py-6 sm:ml-[68px] sm:px-6">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* ───────── НИЖНЯЯ НАВИГАЦИЯ (мобильный) ───────── */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{
          background: 'rgba(10,10,10,0.97)',
          borderTop: '1px solid rgba(0,255,153,0.1)',
          backdropFilter: 'blur(12px)',
          height: '58px',
        }}
      >
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
          >
            <Icon
              name={item.icon}
              fallback="Circle"
              size={17}
              style={{ color: page === item.id ? 'var(--neon)' : '#4a7c6a' }}
            />
            <span
              className="text-[8px] font-mono leading-none"
              style={{ color: page === item.id ? 'var(--neon)' : '#4a7c6a' }}
            >
              {item.label.slice(0, 5).toUpperCase()}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}