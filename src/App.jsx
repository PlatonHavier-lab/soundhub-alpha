import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const musicItems = [
  {
    id: 'track-1',
    title: 'Северный свет',
    artist: 'Mira Vale',
    type: 'песня',
    genre: 'поп',
    mood: 'вдохновение',
    bpm: 104,
    key: 'Am',
    price: 1490,
    licenses: ['неисключительная лицензия', 'коммерческое использование', 'личное использование'],
    gradient: 'cover-coral',
  },
  {
    id: 'track-2',
    title: 'Midnight Drive',
    artist: 'KITO',
    type: 'бит',
    genre: 'хип-хоп',
    mood: 'ночь',
    bpm: 88,
    key: 'F#m',
    price: 3900,
    licenses: ['аренда', 'эксклюзивные права'],
    gradient: 'cover-blue',
  },
  {
    id: 'track-3',
    title: 'Glass Room Vox',
    artist: 'Lena Z',
    type: 'сэмпл',
    genre: 'электроника',
    mood: 'воздух',
    bpm: 126,
    key: 'Cm',
    price: 790,
    licenses: ['личное использование', 'коммерческое использование'],
    gradient: 'cover-mint',
  },
  {
    id: 'track-4',
    title: 'Velvet Loop 07',
    artist: 'Beatport Studio',
    type: 'луп',
    genre: 'r&b',
    mood: 'мягко',
    bpm: 96,
    key: 'Gm',
    price: 590,
    licenses: ['аренда', 'неисключительная лицензия'],
    gradient: 'cover-violet',
  },
]

const studios = [
  {
    id: 'studio-1',
    name: 'Red Room Audio',
    city: 'Москва',
    address: 'ул. Правды, 24',
    price: 2600,
    equipment: 'Neumann U87, SSL, Apollo x8',
    rating: 4.9,
    slots: ['10:00', '13:00', '17:00', '21:00'],
  },
  {
    id: 'studio-2',
    name: 'Nevsky Sound',
    city: 'Санкт-Петербург',
    address: 'Лиговский пр., 71',
    price: 2200,
    equipment: 'Genelec, Avalon, Nord Stage',
    rating: 4.8,
    slots: ['11:00', '15:00', '19:00'],
  },
  {
    id: 'studio-3',
    name: 'Qazan Beat Lab',
    city: 'Казань',
    address: 'ул. Баумана, 9',
    price: 1800,
    equipment: 'AKG C414, RME, MPC Live',
    rating: 4.7,
    slots: ['09:00', '12:00', '18:00'],
  },
  {
    id: 'studio-4',
    name: 'Ural Mix House',
    city: 'Екатеринбург',
    address: 'пр. Ленина, 50',
    price: 1900,
    equipment: 'Focal, Universal Audio, Prophet',
    rating: 4.6,
    slots: ['12:00', '16:00', '20:00'],
  },
  {
    id: 'studio-5',
    name: 'Siberia Records',
    city: 'Новосибирск',
    address: 'Красный пр., 88',
    price: 1700,
    equipment: 'TLM 103, Yamaha HS8, Moog',
    rating: 4.8,
    slots: ['10:30', '14:30', '19:30'],
  },
]

const serviceItems = ['Сведение', 'Мастеринг', 'Запись вокала', 'Аранжировка', 'Обложки', 'Продвижение', 'Сессионные музыканты']
const platforms = ['Spotify', 'Apple Music', 'YouTube Music', 'Яндекс Музыка', 'VK Музыка', 'SoundCloud', 'Deezer']
const rightsOptions = ['неисключительная лицензия', 'эксклюзивные права', 'аренда', 'личное использование', 'коммерческое использование']
const heroCards = [
  {
    title: 'Купить музыку',
    text: 'Выбирайте треки, биты, сэмплы и права для личных или коммерческих проектов.',
    cta: 'В каталог',
    page: 'music',
    tone: 'visual-red',
  },
  {
    title: 'Забронировать студию',
    text: 'Сравнивайте студии по городу, цене, оборудованию и свободным слотам.',
    cta: 'Найти слот',
    page: 'studios',
    tone: 'visual-cyan',
  },
  {
    title: 'Выпустить релиз',
    text: 'Соберите метаданные, выберите площадки и отправьте релиз на модерацию.',
    cta: 'Создать релиз',
    page: 'publish',
    tone: 'visual-violet',
  },
]

const navItems = [
  ['home', 'Главная'],
  ['music', 'Музыка'],
  ['studios', 'Студии'],
  ['services', 'Услуги'],
  ['publish', 'Публикация'],
  ['dashboard', 'Кабинет'],
  ['moderation', 'Модерация'],
]

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

function money(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}

function App() {
  const [page, setPage] = useState('home')
  const [mode, setMode] = useState('Пользователь')
  const [dashboardTab, setDashboardTab] = useState('Обзор')
  const [playingId, setPlayingId] = useState(null)
  const [purchaseItem, setPurchaseItem] = useState(null)
  const [bookingStudio, setBookingStudio] = useState(null)
  const [filters, setFilters] = useState({ type: 'все', genre: 'все', mood: 'все' })
  const [purchases, setPurchases] = useStoredState('soundhub-purchases', [])
  const [bookings, setBookings] = useStoredState('soundhub-bookings', [])
  const [releaseRequests, setReleaseRequests] = useStoredState('soundhub-releases', [])
  const [ownerStudios, setOwnerStudios] = useStoredState('soundhub-owner-studios', [])
  const [moderation, setModeration] = useStoredState('soundhub-moderation', [
    { id: 'mod-1', type: 'music', title: 'Бит Blue Smoke', author: 'Northside', status: 'Новая' },
    { id: 'mod-2', type: 'studio', title: 'Loft 808', author: 'Москва', status: 'Новая' },
    { id: 'mod-3', type: 'complaint', title: 'Жалоба на обложку', author: 'Пользователь #1024', status: 'Новая' },
  ])
  const audioRef = useRef(null)

  const filteredMusic = useMemo(() => {
    return musicItems.filter((item) => {
      return (
        (filters.type === 'все' || item.type === filters.type) &&
        (filters.genre === 'все' || item.genre === filters.genre) &&
        (filters.mood === 'все' || item.mood === filters.mood)
      )
    })
  }, [filters])

  function go(nextPage) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function playDemo(item) {
    if (playingId === item.id) {
      audioRef.current?.close()
      audioRef.current = null
      setPlayingId(null)
      return
    }

    audioRef.current?.close()
    const context = new AudioContext()
    audioRef.current = context
    const now = context.currentTime
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
    gain.connect(context.destination)

    ;[0, 0.22, 0.44, 0.72].forEach((offset, index) => {
      const oscillator = context.createOscillator()
      oscillator.type = index % 2 ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(180 + item.bpm * (index + 1), now + offset)
      oscillator.connect(gain)
      oscillator.start(now + offset)
      oscillator.stop(now + offset + 0.18)
    })

    setPlayingId(item.id)
    window.setTimeout(() => setPlayingId(null), 1300)
  }

  function submitPurchase(rightType) {
    setPurchases([
      {
        id: crypto.randomUUID(),
        track: purchaseItem,
        rightType,
        status: 'Оплачено в демо-режиме',
        date: new Date().toLocaleDateString('ru-RU'),
      },
      ...purchases,
    ])
    setPurchaseItem(null)
    setPage('dashboard')
    setDashboardTab('Мои покупки')
  }

  function submitBooking(data) {
    setBookings([
      {
        id: crypto.randomUUID(),
        studio: bookingStudio,
        ...data,
        status: 'Ожидает подтверждения студии',
      },
      ...bookings,
    ])
    setBookingStudio(null)
    setPage('dashboard')
    setDashboardTab('Мои бронирования')
  }

  function submitRelease(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const release = {
      id: crypto.randomUUID(),
      title: form.get('title'),
      artist: form.get('artist'),
      genre: form.get('genre'),
      language: form.get('language'),
      date: form.get('date'),
      platforms: form.getAll('platforms'),
      label: form.get('label'),
      status: 'На модерации',
    }
    setReleaseRequests([release, ...releaseRequests])
    event.currentTarget.reset()
    setPage('dashboard')
    setDashboardTab('Публикации')
  }

  function addOwnerStudio(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setOwnerStudios([
      {
        id: crypto.randomUUID(),
        name: form.get('name'),
        description: form.get('description'),
        city: form.get('city'),
        address: form.get('address'),
        price: form.get('price'),
        schedule: form.get('schedule'),
        status: 'Черновик студии',
      },
      ...ownerStudios,
    ])
    event.currentTarget.reset()
  }

  function updateModeration(id, status) {
    setModeration(moderation.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  function updateBooking(id, status) {
    setBookings(bookings.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  return (
    <div className="app-shell">
      <Header page={page} setPage={go} />
      <main>
        {page === 'home' && <Home setPage={go} />}
        {page === 'music' && (
          <MusicCatalog
            filters={filters}
            filteredMusic={filteredMusic}
            setFilters={setFilters}
            playingId={playingId}
            playDemo={playDemo}
            setPurchaseItem={setPurchaseItem}
          />
        )}
        {page === 'studios' && <StudioCatalog setBookingStudio={setBookingStudio} />}
        {page === 'services' && <Services />}
        {page === 'publish' && <Publish submitRelease={submitRelease} />}
        {page === 'dashboard' && (
          <Dashboard
            bookings={bookings}
            purchases={purchases}
            releaseRequests={releaseRequests}
            mode={mode}
            setMode={setMode}
            tab={dashboardTab}
            setTab={setDashboardTab}
            ownerStudios={ownerStudios}
            addOwnerStudio={addOwnerStudio}
            updateBooking={updateBooking}
          />
        )}
        {page === 'moderation' && (
          <Moderation
            moderation={moderation}
            releaseRequests={releaseRequests}
            updateModeration={updateModeration}
            updateReleaseStatus={(id, status) =>
              setReleaseRequests(releaseRequests.map((item) => (item.id === id ? { ...item, status } : item)))
            }
          />
        )}
      </main>
      <BottomTabs page={page} setPage={go} />
      {purchaseItem && <PurchaseModal item={purchaseItem} onClose={() => setPurchaseItem(null)} onSubmit={submitPurchase} />}
      {bookingStudio && <BookingModal studio={bookingStudio} onClose={() => setBookingStudio(null)} onSubmit={submitBooking} />}
    </div>
  )
}

function Header({ page, setPage }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setPage('home')} type="button">
        <span className="brand-mark">SH</span>
        <span>SoundHub</span>
      </button>
      <nav className="desktop-nav" aria-label="Основная навигация">
        {navItems.map(([key, label]) => (
          <button className={page === key ? 'active' : ''} key={key} onClick={() => setPage(key)} type="button">
            {label}
          </button>
        ))}
      </nav>
    </header>
  )
}

function Home({ setPage }) {
  return (
    <section className="hero-section">
      <div className="hero-top">
        <div className="hero-copy">
          <div className="eyebrow">Премиальный альфа-маркетплейс</div>
          <h1>Маркетплейс музыки, студий и релизов</h1>
          <p>Покупайте права на треки, бронируйте студии и отправляйте релизы на модерацию в одном кабинете.</p>
          <div className="hero-actions">
            <button onClick={() => setPage('music')} type="button">Открыть каталог</button>
            <button className="secondary" onClick={() => setPage('studios')} type="button">Найти студию</button>
            <button className="secondary" onClick={() => setPage('publish')} type="button">Выпустить релиз</button>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="player-glass">
            <span className="pulse-dot"></span>
            <div>
              <strong>Альфа в работе</strong>
              <p>Каталог, сделки, студии, релизы</p>
            </div>
          </div>
          <div className="wave-grid">
            {Array.from({ length: 30 }).map((_, index) => (
              <span key={index} style={{ '--height': `${22 + ((index * 17) % 70)}px` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="hero-product-grid">
        {heroCards.map((card) => (
          <article className="product-card glass-panel" key={card.title}>
            <div className={`product-visual ${card.tone}`} aria-hidden="true">
              <span></span>
            </div>
            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
            <button className="secondary" onClick={() => setPage(card.page)} type="button">{card.cta}</button>
          </article>
        ))}
      </div>
      <div className="stats-strip">
        {[
          ['12 840', 'треки'],
          ['420', 'студии'],
          ['3 180', 'релизы'],
          ['18 600', 'сделки'],
        ].map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function MusicCatalog({ filters, filteredMusic, setFilters, playingId, playDemo, setPurchaseItem }) {
  const select = (key) => (event) => setFilters({ ...filters, [key]: event.target.value })

  return (
    <section className="page-section">
      <SectionTitle kicker="Маркетплейс" title="Музыка для покупки и лицензирования" text="Биты, песни, сэмплы и лупы с демо-покупкой прав." />
      <div className="filters glass-panel">
        <Select label="Тип" value={filters.type} onChange={select('type')} options={['все', 'песня', 'бит', 'сэмпл', 'луп']} />
        <Select label="Жанр" value={filters.genre} onChange={select('genre')} options={['все', 'поп', 'хип-хоп', 'электроника', 'r&b']} />
        <Select label="Настроение" value={filters.mood} onChange={select('mood')} options={['все', 'вдохновение', 'ночь', 'воздух', 'мягко']} />
      </div>
      <div className="music-grid">
        {filteredMusic.map((item) => (
          <article className="music-card glass-panel" key={item.id}>
            <div className={`cover ${item.gradient}`}>
              <span>{item.type}</span>
            </div>
            <div className="card-main">
              <div>
                <h3>{item.title}</h3>
                <p>{item.artist}</p>
              </div>
              <strong>{money(item.price)}</strong>
            </div>
            <div className="tags">
              <span>{item.genre}</span>
              <span>{item.mood}</span>
              <span>{item.bpm} BPM</span>
              <span>{item.key}</span>
            </div>
            <div className="license-line">{item.licenses.join(' / ')}</div>
            <div className="card-actions">
              <button className="secondary" onClick={() => playDemo(item)} type="button">
                {playingId === item.id ? 'Пауза' : 'Воспроизвести'}
              </button>
              <button onClick={() => setPurchaseItem(item)} type="button">Купить</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function StudioCatalog({ setBookingStudio }) {
  return (
    <section className="page-section">
      <SectionTitle kicker="Студии" title="Бронируй запись в городах России" text="Демо-каталог студий с расписанием, оборудованием и расчетом стоимости." />
      <div className="studio-layout">
        <div className="map-card glass-panel">
          <div className="map-grid"></div>
          <div className="map-pin pin-one">Москва</div>
          <div className="map-pin pin-two">Казань</div>
          <div className="map-pin pin-three">СПб</div>
          <div className="map-caption">Интерактивная карта появится после подключения реального геосервиса</div>
        </div>
        <div className="studio-list">
          {studios.map((studio) => (
            <article className="studio-card glass-panel" key={studio.id}>
              <div>
                <span className="city-chip">{studio.city}</span>
                <h3>{studio.name}</h3>
                <p>{studio.address}</p>
              </div>
              <div className="studio-meta">
                <span>{money(studio.price)} / час</span>
                <span>★ {studio.rating}</span>
              </div>
              <p className="equipment">{studio.equipment}</p>
              <div className="slot-row">{studio.slots.map((slot) => <span key={slot}>{slot}</span>)}</div>
              <button onClick={() => setBookingStudio(studio)} type="button">Забронировать</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="page-section">
      <SectionTitle kicker="Скоро" title="Услуги для выпуска музыки" text="В следующих версиях SoundHub здесь появится маркетплейс профессионалов." />
      <div className="service-grid">
        {serviceItems.map((item) => (
          <article className="service-card glass-panel" key={item}>
            <span>Скоро</span>
            <h3>{item}</h3>
            <p>Подбор исполнителя, бриф, безопасная сделка и контроль результата.</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Publish({ submitRelease }) {
  return (
    <section className="page-section">
      <SectionTitle kicker="Публикация" title="Мастер выпуска релиза" text="Заполните карточку релиза. После отправки заявка попадет на модерацию." />
      <form className="wizard glass-panel" onSubmit={submitRelease}>
        <div className="form-group">
          <h3>Основное</h3>
          <div className="form-grid">
            <Input name="title" label="Название релиза" required />
            <Input name="artist" label="Исполнитель" required />
            <Input name="contributors" label="Участники" />
            <Input name="genre" label="Жанр" required />
            <Input name="language" label="Язык" />
            <label className="field">
              Версия
              <select name="explicit">
                <option>Без маркировки</option>
                <option>18+</option>
              </select>
            </label>
            <Input name="date" label="Дата релиза" type="date" required />
          </div>
        </div>
        <div className="form-group">
          <h3>Файлы</h3>
          <div className="form-grid">
            <div className="upload-box">Обложка: демо-загрузка</div>
            <div className="upload-box">Аудиофайл: демо-загрузка</div>
          </div>
        </div>
        <div className="form-group">
          <h3>Площадки</h3>
          <div className="platform-box">
            {platforms.map((platform) => (
              <label key={platform}>
                <input name="platforms" type="checkbox" value={platform} defaultChecked={platform.includes('Music') || platform.includes('Музыка')} />
                {platform}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <h3>Права и метаданные</h3>
          <div className="form-grid">
            <Input name="rights" label="Права" />
            <Input name="label" label="Лейбл" />
            <Input name="isrc" label="ISRC" />
            <Input name="upc" label="UPC" />
          </div>
        </div>
        <div className="form-group">
          <h3>Комментарий</h3>
          <label className="field">
            Комментарий для модератора
            <textarea name="comment" rows="4" />
          </label>
        </div>
        <div className="form-footer">
          <button type="submit">Отправить на модерацию</button>
        </div>
      </form>
    </section>
  )
}

function Dashboard({ bookings, purchases, releaseRequests, mode, setMode, tab, setTab, ownerStudios, addOwnerStudio, updateBooking }) {
  const tabs = ['Обзор', 'Моя музыка', 'Мои покупки', 'Мои бронирования', 'Мои студии', 'Публикации', 'Доходы', 'Настройки']
  return (
    <section className="page-section">
      <div className="dashboard-head">
        <SectionTitle kicker="Личный кабинет" title="Аккаунт SoundHub" text="Единая панель для музыканта, покупателя, студии и модератора." />
        <div className="mode-switch glass-panel">
          {['Пользователь', 'Исполнитель', 'Студия', 'Модератор'].map((item) => (
            <button className={mode === item ? 'active' : ''} onClick={() => setMode(item)} type="button" key={item}>{item}</button>
          ))}
        </div>
      </div>
      <div className="dashboard-tabs">
        {tabs.map((item) => (
          <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} type="button" key={item}>{item}</button>
        ))}
      </div>
      {tab === 'Обзор' && <Overview />}
      {tab === 'Мои покупки' && <Purchases purchases={purchases} />}
      {tab === 'Мои бронирования' && <Bookings bookings={bookings} />}
      {tab === 'Мои студии' && <OwnerStudios ownerStudios={ownerStudios} addOwnerStudio={addOwnerStudio} bookings={bookings} updateBooking={updateBooking} />}
      {tab === 'Публикации' && <Publications releaseRequests={releaseRequests} />}
      {['Моя музыка', 'Доходы', 'Настройки'].includes(tab) && <EmptyPanel title={tab} />}
    </section>
  )
}

function Overview() {
  const analytics = [
    ['Выручка', '128 400 ₽'],
    ['Продажи', '86'],
    ['Просмотры', '42 900'],
    ['Бронирования', '19'],
    ['Заявки на публикацию', '7'],
    ['Конверсия', '8,4%'],
  ]
  return (
    <div className="analytics-grid">
      {analytics.map(([label, value]) => (
        <div className="metric glass-panel" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function Purchases({ purchases }) {
  if (!purchases.length) return <EmptyPanel title="Мои покупки" text="Покупки появятся после демо-оплаты трека." />
  return (
    <div className="record-list">
      {purchases.map((purchase) => (
        <article className="record glass-panel" key={purchase.id}>
          <div>
            <h3>{purchase.track.title}</h3>
            <p>{purchase.track.artist} · {purchase.rightType}</p>
            <span>{purchase.status} · {purchase.date}</span>
          </div>
          <button type="button">Скачать демо-файл</button>
        </article>
      ))}
    </div>
  )
}

function Bookings({ bookings }) {
  if (!bookings.length) return <EmptyPanel title="Мои бронирования" text="Бронирования появятся после выбора студии." />
  return (
    <div className="record-list">
      {bookings.map((booking) => (
        <article className="record glass-panel" key={booking.id}>
          <div>
            <h3>{booking.studio.name}</h3>
            <p>{booking.date} · {booking.slot} · {money(booking.total)}</p>
            <span>{booking.status}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function OwnerStudios({ ownerStudios, addOwnerStudio, bookings, updateBooking }) {
  return (
    <div className="owner-grid">
      <form className="owner-form glass-panel" onSubmit={addOwnerStudio}>
        <div>
          <span className="mini-label">Профиль студии</span>
          <h3>Добавить студию</h3>
        </div>
        <Input name="name" label="Название" required />
        <Input name="description" label="Описание" />
        <Input name="city" label="Город" required />
        <Input name="address" label="Адрес" required />
        <Input name="price" label="Цена за час" type="number" required />
        <Input name="schedule" label="Расписание" />
        <div className="upload-box">Фото студии: демо-загрузка</div>
        <button type="submit">Сохранить студию</button>
      </form>
      <div className="owner-panel glass-panel">
        <div className="owner-panel-head">
          <div>
            <span className="mini-label">Управление</span>
            <h3>Мои студии и бронирования</h3>
          </div>
          <span className="count-badge">{ownerStudios.length + bookings.length}</span>
        </div>
        <div className="record-list">
          {!ownerStudios.length && !bookings.length && (
            <EmptyPanel title="Студий пока нет" text="Добавьте первую студию, чтобы увидеть здесь карточку профиля и входящие бронирования." />
          )}
          {ownerStudios.map((studio) => (
            <article className="studio-preview" key={studio.id}>
              <div className="preview-art" aria-hidden="true"></div>
              <div>
                <h3>{studio.name}</h3>
                <p>{studio.city} · {studio.address}</p>
                <span>{studio.status} · {studio.schedule || 'Расписание не указано'}</span>
              </div>
            </article>
          ))}
          {bookings.map((booking) => (
            <article className="record booking-record" key={booking.id}>
              <div>
                <h3>{booking.studio.name}</h3>
                <p>{booking.date} · {booking.slot}</p>
                <span>{booking.status}</span>
              </div>
              <div className="split-actions">
                <button onClick={() => updateBooking(booking.id, 'Подтверждено студией')} type="button">Подтвердить</button>
                <button className="secondary" onClick={() => updateBooking(booking.id, 'Отклонено студией')} type="button">Отклонить</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function Publications({ releaseRequests }) {
  if (!releaseRequests.length) return <EmptyPanel title="Публикации" text="Заявки появятся после отправки релиза." />
  return (
    <div className="record-list">
      {releaseRequests.map((release) => (
        <article className="record glass-panel" key={release.id}>
          <div>
            <h3>{release.title}</h3>
            <p>{release.artist} · {release.platforms.join(', ') || 'Платформы не выбраны'}</p>
            <span>{release.status}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function Moderation({ moderation, releaseRequests, updateModeration, updateReleaseStatus }) {
  const releases = releaseRequests.map((release) => ({ id: release.id, type: 'release', title: release.title, author: release.artist, status: release.status }))
  const allItems = [...releases, ...moderation]
  return (
    <section className="page-section">
      <SectionTitle kicker="Модерация" title="Очередь проверок" text="Музыка, студии, релизы и жалобы с визуальным обновлением статусов." />
      <div className="moderation-grid">
        {allItems.map((item) => (
          <article className="moderation-card glass-panel" key={item.id}>
            <span className={`status-pill ${item.status.includes('Отклон') ? 'danger' : ''}`}>{item.status}</span>
            <h3>{item.title}</h3>
            <p>{labelType(item.type)} · {item.author}</p>
            {item.type === 'release' ? (
              <div className="card-actions">
                <button onClick={() => updateReleaseStatus(item.id, 'Одобрено')} type="button">Одобрить</button>
                <button className="secondary" onClick={() => updateReleaseStatus(item.id, 'Отклонено')} type="button">Отклонить</button>
                <button className="secondary" onClick={() => updateReleaseStatus(item.id, 'Запрошены правки')} type="button">Запросить правки</button>
              </div>
            ) : (
              <div className="card-actions">
                <button onClick={() => updateModeration(item.id, 'Одобрено')} type="button">Одобрить</button>
                <button className="secondary" onClick={() => updateModeration(item.id, 'Отклонено')} type="button">Отклонить</button>
                <button className="secondary" onClick={() => updateModeration(item.id, 'Запрошены правки')} type="button">Запросить правки</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function PurchaseModal({ item, onClose, onSubmit }) {
  const [rightType, setRightType] = useState(rightsOptions[0])
  const price = item.price + (rightType === 'эксклюзивные права' ? 9000 : rightType === 'коммерческое использование' ? 2500 : 0)
  return (
    <div className="modal-backdrop">
      <div className="modal glass-panel">
        <button className="close" onClick={onClose} type="button">×</button>
        <span className="eyebrow">Демо-покупка</span>
        <h2>{item.title}</h2>
        <p>{item.artist} · {item.genre} · {item.bpm} BPM</p>
        <div className="choice-grid">
          {rightsOptions.map((option) => (
            <button className={rightType === option ? 'active' : ''} onClick={() => setRightType(option)} type="button" key={option}>{option}</button>
          ))}
        </div>
        <div className="payment-state">
          <span>Оплата</span>
          <strong>{money(price)}</strong>
          <p>Демо-режим: реальные платежи не выполняются.</p>
        </div>
        <button onClick={() => onSubmit(rightType)} type="button">Подтвердить покупку</button>
      </div>
    </div>
  )
}

function BookingModal({ studio, onClose, onSubmit }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [slot, setSlot] = useState(studio.slots[0])
  const [hours, setHours] = useState(2)
  const total = studio.price * hours
  return (
    <div className="modal-backdrop">
      <div className="modal glass-panel">
        <button className="close" onClick={onClose} type="button">×</button>
        <span className="eyebrow">Бронирование студии</span>
        <h2>{studio.name}</h2>
        <p>{studio.city} · {studio.address}</p>
        <Input label="Дата" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <label className="field">
          Слот
          <select value={slot} onChange={(event) => setSlot(event.target.value)}>
            {studio.slots.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <Input label="Часы" type="number" min="1" max="8" value={hours} onChange={(event) => setHours(Number(event.target.value))} />
        <div className="payment-state">
          <span>Демо-оплата</span>
          <strong>{money(total)}</strong>
          <p>После подтверждения бронь попадет в кабинет.</p>
        </div>
        <button onClick={() => onSubmit({ date, slot, hours, total })} type="button">Подтвердить бронирование</button>
      </div>
    </div>
  )
}

function SectionTitle({ kicker, title, text }) {
  return (
    <div className="section-title">
      <span>{kicker}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function Select({ label, options, ...props }) {
  return (
    <label className="field">
      {label}
      <select {...props}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="field">
      {label}
      <input {...props} />
    </label>
  )
}

function EmptyPanel({ title, text = 'Раздел готов для следующих сценариев альфа-версии.' }) {
  return (
    <div className="empty-panel glass-panel">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function BottomTabs({ page, setPage }) {
  const tabs = [
    ['home', 'Главная', '⌂'],
    ['music', 'Музыка', '♪'],
    ['studios', 'Студии', '⌖'],
    ['publish', 'Релиз', '+'],
    ['dashboard', 'Профиль', '◉'],
  ]
  return (
    <nav className="bottom-tabs" aria-label="Мобильная навигация">
      {tabs.map(([key, label, icon]) => (
        <button className={page === key ? 'active' : ''} onClick={() => setPage(key)} type="button" key={key}>
          <span>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  )
}

function labelType(type) {
  return {
    music: 'Музыка',
    studio: 'Студия',
    release: 'Релиз',
    complaint: 'Жалоба',
  }[type]
}

export default App
