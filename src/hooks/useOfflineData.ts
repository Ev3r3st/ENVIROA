import { useState, useEffect } from 'react';

interface OfflineDataOptions<T> {
  key: string;
  fetchData: () => Promise<T>;
  validateData?: (data: T) => boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    description: string;
  }[];
}

export function useOfflineData<T>({ key, fetchData, validateData }: OfflineDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
       
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
          const parsed = JSON.parse(cachedData) as T;
          if (!validateData || validateData(parsed)) {
            setData(parsed);
            setLoading(false);
          }
        }

        
        const freshData = await fetchData();
        
        
        localStorage.setItem(key, JSON.stringify(freshData));
        
        setData(freshData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Neznámá chyba'));
        setLoading(false);
      }
    }

    loadData();
  }, [key, fetchData, validateData]);

  const updateCache = async (newData: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      console.error('Chyba při ukládání do cache:', err);
    }
  };

  return { data, loading, error, updateCache };
}

export function useOfflineCourses() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadOfflineCourses = async () => {
      try {
        
        const offlineCourses = await localStorage.getItem('offlineCourses');
        if (offlineCourses) {
          setData(JSON.parse(offlineCourses));
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Neznámá chyba'));
        setLoading(false);
      }
    };

    loadOfflineCourses();
  }, []);

  return { data, loading, error };
}


export function useOfflineCourse(courseId: string) {
  return useOfflineData({
    key: `course-${courseId}`,
    fetchData: async () => {
      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Nepodařilo se načíst kurz');
      return response.json();
    },
    validateData: (data) => data && typeof data === 'object' && 'id' in data,
  });
} 