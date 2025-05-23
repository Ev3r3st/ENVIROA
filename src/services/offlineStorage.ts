// l
interface OfflineData<T> {
  timestamp: number;
  data: T;
  version: number; // 
}

interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  duration: number;
  order: number;
}

interface Course {
  id: number;
  name: string;
  description: string;
  image?: string;
  lessons: Lesson[];
  [key: string]: unknown;
}

interface DashboardData {
  goals?: unknown[];
  courses?: unknown[];
  stats?: Record<string, unknown>;
  lastSyncTimestamp?: number;
  [key: string]: unknown;
}

const CURRENT_DATA_VERSION = 1;
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minut

function shouldLog(storageKey: string, throttleMs: number = 10000): boolean {
  if (typeof window === 'undefined') return false;
  
  const now = Date.now();
  const lastLog = sessionStorage.getItem(storageKey);
  const shouldLog = !lastLog || (now - parseInt(lastLog, 10) > throttleMs);
  
  if (shouldLog) {
    sessionStorage.setItem(storageKey, now.toString());
  }
  
  return shouldLog;
}

function needsSync(timestamp: number | undefined): boolean {
  if (!timestamp) return true;
  return Date.now() - timestamp > SYNC_INTERVAL;
}

export async function saveCourseOffline(courseId: string, courseData: Course): Promise<void> {
  try {
    const data: OfflineData<Course> = {
      timestamp: Date.now(),
      data: courseData,
      version: CURRENT_DATA_VERSION
    };
    
    localStorage.setItem(`offline_course_${courseId}`, JSON.stringify(data));
    
    if (shouldLog('save_course_log')) {
      console.log(`Kurz #${courseId} byl uložen offline`);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Chyba při ukládání kurzu offline:", error);
    return Promise.reject(error);
  }
}

export async function getOfflineCourse(courseId: string): Promise<Course | null> {
  try {
    const dataString = localStorage.getItem(`offline_course_${courseId}`);
    if (!dataString) return null;
    
    const data: OfflineData<Course> = JSON.parse(dataString);
    
    const isExpired = Date.now() - data.timestamp > 30 * 24 * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem(`offline_course_${courseId}`);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error("Chyba při načítání offline kurzu:", error);
    return null;
  }
}

export function isCourseAvailableOffline(courseId: string): boolean {
  return localStorage.getItem(`offline_course_${courseId}`) !== null;
}

export function removeCourseOffline(courseId: string): void {
  localStorage.removeItem(`offline_course_${courseId}`);
}

export function getAllOfflineCourses(): string[] {
  const offlineCourses: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("offline_course_")) {
      offlineCourses.push(key.replace("offline_course_", ""));
    }
  }
  return offlineCourses;
}

export async function saveDashboardDataOffline(data: DashboardData): Promise<void> {
  try {
    const dataToSave = {
      ...data,
      lastSyncTimestamp: Date.now()
    };

    const offlineData: OfflineData<DashboardData> = {
      timestamp: Date.now(),
      data: dataToSave,
      version: CURRENT_DATA_VERSION
    };
    
    localStorage.setItem('offline_dashboard', JSON.stringify(offlineData));
    
    if (shouldLog('dashboard_save_log')) {
      console.log('Dashboard data byla uložena offline');
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error("Chyba při ukládání dashboardu offline:", error);
    return Promise.reject(error);
  }
}

// Funkce načtení dat dashboardu z offline úložiště
export async function getOfflineDashboardData(): Promise<DashboardData | null> {
  try {
    const dataString = localStorage.getItem('offline_dashboard');
    if (!dataString) return null;
    
    const data: OfflineData<DashboardData> = JSON.parse(dataString);
    
    // Kontrola verze dat
    if (data.version !== CURRENT_DATA_VERSION) {
      localStorage.removeItem('offline_dashboard');
      return null;
    }
    
    // Kontrola, zda data nejsou příliš stará (24 hodin)
    const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem('offline_dashboard');
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error("Chyba při načítání offline dat dashboardu:", error);
    return null;
  }
}

// Upravená funkce pro kontrolu připojení k internetu
export function isOnline(): boolean {
  return navigator.onLine && !getOfflineMode();
}

// Funkceping serveru pro skutečnou kontrolu připojení
export async function checkServerConnection(url: string = `${process.env.NEXT_PUBLIC_API_URL}/health`): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    if (shouldLog('server_check_log')) {
      console.log("Server není dosažitelný:", error);
    }
    return false;
  }
}

let _isOfflineMode = false;
const offlineListeners: Array<(isOffline: boolean) => void> = [];

export function setOfflineMode(offline: boolean, force: boolean = false): void {
  if (_isOfflineMode === offline && !force) return;

  if (shouldLog('offline_mode_log')) {
    console.log(`Změna offline režimu: ${offline ? 'offline' : 'online'} ${force ? '(vynuceno)' : ''}`);
  }
  
  _isOfflineMode = offline;
  offlineListeners.forEach(listener => listener(offline));
  localStorage.setItem('app_offline_mode', offline ? 'true' : 'false');
  
  if (!offline) {
    const dashboardData = localStorage.getItem('offline_dashboard');
    if (dashboardData) {
      const data: OfflineData<DashboardData> = JSON.parse(dashboardData);
      if (needsSync(data.data.lastSyncTimestamp)) {
        if (shouldLog('sync_check_log')) {
          console.log('Je potřeba synchronizovat data s serverem');
        }
        offlineListeners.forEach(listener => listener(false));
      }
    }
  }
}

export function getOfflineMode(): boolean {
  const storedMode = localStorage.getItem('app_offline_mode');
  if (storedMode !== null) {
    _isOfflineMode = storedMode === 'true';
  } else {
    _isOfflineMode = !navigator.onLine;
  }
  return _isOfflineMode;
}

export function addOfflineModeListener(listener: (isOffline: boolean) => void): () => void {
  offlineListeners.push(listener);
  return () => {
    const index = offlineListeners.indexOf(listener);
    if (index !== -1) {
      offlineListeners.splice(index, 1);
    }
  };
}

if (typeof window !== 'undefined') {
  const storedMode = localStorage.getItem('app_offline_mode');
  _isOfflineMode = storedMode === 'true';

  window.addEventListener('online', async () => {
    if (shouldLog('online_event_log')) {
      console.log("Browser reportuje online stav");
    }
    
    const isConnected = await checkServerConnection();
    if (isConnected) {
      setOfflineMode(false);
    } else if (shouldLog('server_check_log')) {
      console.log("Server není dosažitelný, zůstáváme v offline režimu");
    }
  });
  
  window.addEventListener('offline', () => {
    if (shouldLog('offline_event_log')) {
      console.log("Browser reportuje offline stav");
    }
    setOfflineMode(true);
  });
  
  window.addEventListener('storage', (event) => {
    if (event.key === 'app_offline_mode') {
      const newOfflineMode = event.newValue === 'true';
      if (_isOfflineMode !== newOfflineMode) {
        _isOfflineMode = newOfflineMode;
        offlineListeners.forEach(listener => listener(newOfflineMode));
      }
    }
  });
} 