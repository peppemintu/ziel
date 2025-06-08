// src/hooks/useCourseCatalog.js
import { useState, useEffect } from 'react';
import authAxios from '../../auth/utils/authFetch.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { API_BASE } from '../utils/constants';

const useCourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCourseCatalog = async () => {
      try {
        const courseRes = await authAxios.get(`${API_BASE}/course`);
        const courseList = await courseRes.data;

        const enrichedCourses = await Promise.all(courseList.map(async (course) => {
          const courseInfo = { ...course };

          try {
            const planRes = await authAxios.get(`${API_BASE}/plan/${course.studyPlanId}`);
            const studyPlan = planRes.data;
            courseInfo.studyPlan = studyPlan;

            const disciplineRes = await authAxios.get(`${API_BASE}/discipline/${studyPlan.disciplineId}`);
            courseInfo.discipline = disciplineRes.data;

            const specialtyRes = await authAxios.get(`${API_BASE}/specialty/${studyPlan.specialtyId}`);
            courseInfo.specialty = specialtyRes.data;
          } catch (err) {
            console.warn(`Failed to fetch enrichment data for course ${course.id}:`, err.message);
            // You can optionally continue without enrichment
          }

          return courseInfo;
        }));

        setCourses(enrichedCourses);
      } catch (err) {
        console.error('Error fetching course catalog:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseCatalog();
  }, [isAuthenticated, user?.role]);

  return { courses, loading };
};

export default useCourseCatalog;
