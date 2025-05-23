"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '@/services/axios';

// Import typů a rozhraní
import { Goal, Progress, UserCourse } from "./interfaces";

// Import offlineStorage služby
import { 
  isOnline, 
  saveDashboardDataOffline, 
  getOfflineDashboardData,
  getOfflineMode,
  setOfflineMode,
  addOfflineModeListener
} from '@/services/offlineStorage';

// Import komponent
import MotivationalModal from "./MotivationalModal";
import GoalProgress from "./GoalProgress";
import GoalList from "./GoalList";
import DailyTasksSection from "./DailyTasksSection";
import GoalReminder from "./GoalReminder";
import CourseSection from "./CourseSection";
import MotivationStats from "./MotivationStats";
import Header from "./Header";

// Definice typů pro offline data
interface DashboardOfflineData {
  goals: Goal[];
  progress: Progress[];
  userCourses: UserCourse[];
  lastUpdated?: string;
}

// Klientská komponenta pro použití useSearchParams
const SearchParamsWrapper = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    // Získáme courseId z URL parametrů, pokud existuje
    if (searchParams) {
      const courseIdParam = searchParams.get('courseId');
      if (courseIdParam) {
        localStorage.setItem('activeCourseId', courseIdParam);
        router.refresh();
      }
    }
  }, [searchParams, router]);
  
  return null;
};

// ========== Hlavní komponenta DashboardPage ==========

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [activeCourse, setActiveCourse] = useState<UserCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNetworkOffline, setIsNetworkOffline] = useState(false);
  const [offlineDataAvailable, setOfflineDataAvailable] = useState(false);

  // State pro modální okno s motivací
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState("✨");

  // State pro sledování aktuálně vybraného cíle
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);

  // Funkce pro ukládání dat dashboardu offline
  const saveDashboardOffline = useCallback((dashboardData: DashboardOfflineData) => {
    try {
      const existingDataRaw = localStorage.getItem('offline_dashboard');
      if (existingDataRaw) {
        try {
          const existingData = JSON.parse(existingDataRaw);
          const now = Date.now();
          
          if (existingData.timestamp && (now - existingData.timestamp < 5 * 60 * 1000)) {
            const lastLog = sessionStorage.getItem('dashboard_check_log');
            if (!lastLog || (now - parseInt(lastLog, 10) > 10000)) { // 10 sekund mezi logy
              console.log("Dashboard data jsou již aktuální, neukládáme znovu");
              sessionStorage.setItem('dashboard_check_log', now.toString());
            }
            
            setOfflineDataAvailable(true);
            return;
          }
        } catch {
        }
      }
      
      saveDashboardDataOffline({
        goals: dashboardData.goals || [],
        progress: dashboardData.progress || [],
        userCourses: dashboardData.userCourses || [],
        lastUpdated: new Date().toISOString()
      });
      setOfflineDataAvailable(true);
    } catch (error) {
      console.error("Chyba při ukládání dashboard dat offline:", error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    const now = Date.now();
    const lastFetchLog = sessionStorage.getItem('dashboard_fetch_log');
    const shouldLog = !lastFetchLog || (now - parseInt(lastFetchLog, 10) > 10000); // 10 sekund mezi logy
    
    if (shouldLog) {
      sessionStorage.setItem('dashboard_fetch_log', now.toString());
    }
    
    if (!isOnline()) {
      if (shouldLog) console.log("Jsme offline, zkusíme načíst data z lokálního úložiště");
      const offlineData = await getOfflineDashboardData();
      
      if (offlineData && offlineData.goals && offlineData.progress && offlineData.userCourses) {
        if (shouldLog) console.log("Načítám dashboard data z offline úložiště");
        setGoals(offlineData.goals as Goal[]);
        setProgress(offlineData.progress as Progress[]);
        setUserCourses(offlineData.userCourses as UserCourse[]);
        
        if (offlineData.userCourses && Array.isArray(offlineData.userCourses) && offlineData.userCourses.length > 0) {
          const activeCourseId = localStorage.getItem('activeCourseId');
          if (activeCourseId) {
            const courseId = parseInt(activeCourseId);
            const courseById = (offlineData.userCourses as UserCourse[]).find(
              (c: UserCourse) => c.course.id === courseId
            );
            
            if (courseById) {
              setActiveCourse(courseById);
            } else {
              setActiveCourse((offlineData.userCourses as UserCourse[])[0]);
            }
          } else {
            setActiveCourse((offlineData.userCourses as UserCourse[])[0]);
          }
        }
        
        setOfflineDataAvailable(true);
        setLoading(false);
        return;
      } else {
        if (shouldLog) console.log("Offline data nejsou k dispozici");
        setOfflineDataAvailable(false);
        setIsNetworkOffline(true);
      }
    }
    
      const token = Cookies.get("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
      if (shouldLog) console.log("Načítám data z API...");
        const [resGoals, resProgress, resUserCourses] = await Promise.all([
          axiosInstance.get('/goals'),
          axiosInstance.get('/goals/progress'),
          axiosInstance.get('/courses/my/courses'),
        ]);

        const goalsData = resGoals.data;
        const progressData = resProgress.data;
        const userCoursesData = resUserCourses.data;

        setGoals(goalsData);
        setProgress(progressData);
        setUserCourses(userCoursesData);

      saveDashboardOffline({
        goals: goalsData,
        progress: progressData,
        userCourses: userCoursesData
      });

        if (userCoursesData.length > 0) {
          const activeCourses = userCoursesData.filter(
            (course: UserCourse) => !course.completedAt
          );

          if (activeCourses.length > 0) {
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const courseIdParam = urlParams.get('courseId');

            if (courseIdParam) {
              const courseId = parseInt(courseIdParam);
              const courseById = activeCourses.find(
                (c: UserCourse) => c.course.id === courseId
              );

              if (courseById) {
                setActiveCourse(courseById);
              } else {
                setActiveCourse(activeCourses[0]);
              }
            } else {
              setActiveCourse(activeCourses[0]);
            }
          } else {
              setActiveCourse(activeCourses[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      
      const offlineData = await getOfflineDashboardData();
      if (offlineData && offlineData.goals && offlineData.progress && offlineData.userCourses) {
        if (shouldLog) console.log("Online fetch selhal, načítám dashboard data z offline úložiště");
        setGoals(offlineData.goals as Goal[]);
        setProgress(offlineData.progress as Progress[]);
        setUserCourses(offlineData.userCourses as UserCourse[]);
        setOfflineDataAvailable(true);
      } else {
        setOfflineDataAvailable(false);
      }
      } finally {
        setLoading(false);
    }
  }, [router, saveDashboardOffline]);

  useEffect(() => {
    const getLogPermission = () => {
      const now = Date.now();
      const lastOfflineLog = sessionStorage.getItem('offline_state_log');
      const shouldLog = !lastOfflineLog || (now - parseInt(lastOfflineLog, 10) > 10000); // 10 sekund mezi logy
      
      if (shouldLog) {
        sessionStorage.setItem('offline_state_log', now.toString());
      }
      
      return shouldLog;
    };
    
    const handleOfflineModeChange = (isOffline: boolean) => {
      const shouldLog = getLogPermission();
      if (shouldLog) {
        console.log(`🔄 Změna stavu offline v dashboardu: ${isOffline ? 'offline' : 'online'}`);
      }
      
      setIsNetworkOffline(isOffline);
      
      if (!isOffline && offlineDataAvailable) {
        if (shouldLog) {
          console.log("Jsme zpět online, zkusíme aktualizovat data");
        }
        fetchAllData();
      }
    };
    
    const offline = getOfflineMode();
    setIsNetworkOffline(offline);
    console.log(`📱 Počáteční stav připojení v dashboardu: ${offline ? "offline" : "online"}`);
    
    const removeListener = addOfflineModeListener(handleOfflineModeChange);
    
    if (navigator.onLine) {
      setOfflineMode(false);
    }
    
    return () => {
      removeListener();
    };
  }, [offlineDataAvailable, fetchAllData]);
  
  useEffect(() => {
    let isInitialDataFetchDone = false;
    
    const loadData = async () => {
      if (isInitialDataFetchDone) {
        return;
      }
      
      const now = Date.now();
      const lastInitLog = sessionStorage.getItem('dashboard_init_log');
      if (!lastInitLog || (now - parseInt(lastInitLog, 10) > 10000)) {
        console.log("Komponenta dashboardu se načítá - zahajuji načítání dat");
        sessionStorage.setItem('dashboard_init_log', now.toString());
      }
      
      await fetchAllData();
      isInitialDataFetchDone = true;
    };
    
    loadData();
    
    return () => {
      isInitialDataFetchDone = false;
    };
  }, [fetchAllData]);

  useEffect(() => {
    // Motivační citáty
    const motivationalQuotes = [
      "Každý krok, který děláš, tě přibližuje k tvému cíli. Jsem na tebe hrdý!",
      "Tvoje vytrvalost je obdivuhodná. Pokračuj dál, dokážeš to!",
      "I malý pokrok každý den vede k velkým výsledkům. Skvělá práce!",
      "Tvoje odhodlání je inspirací. Nevzdávej se, jsi na správné cestě!",
      "To, že jsi dnes tady, ukazuje, jak silnou vůli máš. Gratuluji!",
      "Překážky jsou jen výzvou pro tvou sílu. Jsi skvělý, že pokračuješ!",
      "Úspěch není cíl, ale cesta. A ty jdeš tou cestou skvěle!",
      "Sebedisciplína je tvůj klíč k úspěchu. A ty ji máš!",
    ];

    // Motivační emoji
    const motivationalEmojis = [
      "✨", "🌟", "💪", "🚀", "🏆", "🔥", "💯", "⭐", "🌈", "🌻",
    ];

    const checkMotivationModal = () => {
      const today = new Date().toDateString();
      const motivationData = localStorage.getItem("motivationModalData");
      let count = 0;
      let lastDate = "";

      if (motivationData) {
        const data = JSON.parse(motivationData);
        lastDate = data.date;
        count = data.count;
      }

      if (lastDate !== today || count < 3) {
        if (lastDate !== today) {
          count = 0;
        }

        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        setMotivationalQuote(motivationalQuotes[randomIndex]);

        const randomEmojiIndex = Math.floor(Math.random() * motivationalEmojis.length);
        setCurrentEmoji(motivationalEmojis[randomEmojiIndex]);

        setShowMotivationModal(true);

        localStorage.setItem(
          "motivationModalData",
          JSON.stringify({
            date: today,
            count: count + 1,
          })
        );
      }
    };

    if (!loading) {
      checkMotivationModal();
    }
  }, [loading]);

  const closeMotivationModal = () => {
    setShowMotivationModal(false);
  };

  const navigateToNextGoal = () => {
    if (goals.length > 0) {
      setActiveGoalIndex((prevIndex) =>
        prevIndex === goals.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const navigateToPreviousGoal = () => {
    if (goals.length > 0) {
      setActiveGoalIndex((prevIndex) =>
        prevIndex === 0 ? goals.length - 1 : prevIndex - 1
      );
    }
  };

  const handleDailyTasksComplete = useCallback(async (goalId: number) => {
    try {
      const currentProgress = progress.find(p => p.goalId === goalId);
      const today = new Date().toISOString();
      
      const updatedProgress: Progress = {
        id: currentProgress?.id || Math.random(),
        userId: parseInt(Cookies.get('userId') || '0'),
        goalId: goalId,
        completedDays: (currentProgress?.completedDays || 0) + 1,
        lastCompletionDate: today,
        streak: currentProgress?.lastCompletionDate ? 
          (new Date(currentProgress.lastCompletionDate).toDateString() === new Date(Date.now() - 86400000).toDateString() ? 
            currentProgress.streak + 1 : 1) : 1
      };

      if (isNetworkOffline) {
        setProgress(prev => {
          const index = prev.findIndex(p => p.goalId === goalId);
          if (index === -1) {
            return [...prev, updatedProgress];
          }
          const newProgressArray = [...prev];
          newProgressArray[index] = updatedProgress;
          return newProgressArray;
        });

        saveDashboardOffline({
          goals,
          progress: progress.map(p => p.goalId === goalId ? updatedProgress : p),
          userCourses
        });

        return;
      }
      
      const token = Cookies.get("token");
      if (!token) return;

      const res = await axiosInstance.post(`/goals/progress/${goalId}/complete`);
      
      const serverProgress: Progress = res.data;

      setProgress((prev) => {
        const index = prev.findIndex((p) => p.goalId === goalId);
        if (index === -1) {
          return [...prev, serverProgress];
        }
        const newProgressArray = [...prev];
        newProgressArray[index] = serverProgress;
        return newProgressArray;
      });

      saveDashboardOffline({
        goals,
        progress: progress.map(p => p.goalId === goalId ? serverProgress : p),
        userCourses
      });
    } catch (error) {
      console.error("Error completing daily tasks:", error);
    }
  }, [goals, isNetworkOffline, progress, saveDashboardOffline, userCourses]);

  const totalDuration = goals.reduce((sum, g) => sum + g.duration, 0);

  const totalCompletedDays = progress.reduce(
    (sum, p) => sum + p.completedDays,
    0
  );

  const overallProgress =
    totalDuration > 0 ? (totalCompletedDays / totalDuration) * 100 : 0;

  const dayStreak =
    progress.length > 0 ? Math.max(...progress.map((p) => p.completedDays)) : 0;

  // ====== Render UI ======
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-purple-600 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-700 rounded mb-3"></div>
            <div className="h-3 w-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isNetworkOffline && !offlineDataAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-5xl mb-4" />
          <h2 className="text-2xl font-bold mb-3">Není připojení k internetu</h2>
          <p className="text-gray-300 mb-6">
            Pro zobrazení dashboardu potřebujete připojení k internetu nebo mít již dříve načtená data.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Zkusit znovu
          </button>
        </div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
            Nemáte žádné cíle
          </h2>
          {isNetworkOffline && (
            <div className="mb-4 p-3 bg-yellow-800 rounded-lg text-yellow-200 flex items-center justify-center">
              <FontAwesomeIcon icon={faWifi} className="mr-2" />
              Offline režim - některé funkce nejsou dostupné
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Vytvořte si svůj první cíl a začněte svou cestu k úspěchu.
          </p>
          <button
            onClick={() => router.push("/GoalFormPage")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
            disabled={isNetworkOffline}
          >
            Vytvořit cíl
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Tato komponenta zajišťuje, že useSearchParams je obaleno v Suspense */}
      <Suspense fallback={<div>Načítání...</div>}>
        <SearchParamsWrapper />
      </Suspense>

      {/* Pozadí */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/app-image/background.png')",
            opacity: 1,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
          </div>

      <div className="flex flex-col items-center min-h-screen text-white font-sans mb-20 md:mt-20">
        {/* Offline banner */}
        {isNetworkOffline && (
          <div className="w-full max-w-4xl mx-auto mb-4 p-3 bg-yellow-800 rounded-lg text-yellow-200 flex items-center justify-center">
            <FontAwesomeIcon icon={faWifi} className="mr-2" />
            Offline režim - některé funkce nejsou dostupné
          </div>
        )}
        
        {/* Modální okno s motivací */}
        <MotivationalModal
          isOpen={showMotivationModal}
          onClose={closeMotivationModal}
          quote={motivationalQuote}
          emoji={currentEmoji}
        />

        <div className="w-full max-w-4xl mx-auto p-2">
          {/* Header s logem a profilem */}
          <Header />

        {/* Wrapper s kartami */}
        <div className="flex flex-col items-center space-y-4 my-4 w-full">
            {/* Goals a Day Streaks */}
            <GoalProgress
              overallProgress={overallProgress}
              dayStreak={dayStreak}
            />
            {/* Připomenutí cíle */}
            <GoalReminder
              goals={goals}
              progress={progress}
              activeGoalIndex={activeGoalIndex}
              onPrevious={navigateToPreviousGoal}
              onNext={navigateToNextGoal}
            />
          {/* Dnešní úkoly */}
            <DailyTasksSection
              goals={goals}
                  onComplete={handleDailyTasksComplete}
              isOffline={isNetworkOffline}
            />
            {/* Seznam cílů */}
            <GoalList goals={goals} />

          {/* Sekce kurzů */}
            <CourseSection
              activeCourse={activeCourse}
              userCourses={userCourses}
              isOffline={isNetworkOffline}
            />

            {/* Motivace a statistika */}
            <MotivationStats
              totalCompletedDays={totalCompletedDays}
              overallProgress={overallProgress}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
