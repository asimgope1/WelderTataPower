import { useState, useCallback } from 'react';
import { BAS_URL } from '../../../constants/url';
import { GETNETWORK } from '../../../utils/Network';

export const useDashboardData = () => {
    const [jobList, setJobList] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getJobList = useCallback(async () => {
        setIsLoading(true);
        try {
            const url = `${BAS_URL}welding/jobmaster/joblist/`;
            const response = await GETNETWORK(url, true);
            if (response.status === 'success') {
                setJobList(response.data);
            } else {
                console.log('Error:', response.message);
            }
        } catch (error) {
            console.error('Failed to fetch job list:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getDashboard = useCallback(async () => {
        try {
            const url = `${BAS_URL}welding/api/v1/dashboard/`;
            const response = await GETNETWORK(url, true);
            if (response.status === 'success') {
                setDashboardData(response.data);
            } else {
                console.log('Error:', response.message);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        }
    }, []);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([getDashboard(), getJobList()]);
        setRefreshing(false);
    }, [getDashboard, getJobList]);

    return {
        jobList,
        dashboardData,
        isLoading,
        refreshing,
        getJobList,
        getDashboard,
        refresh
    };
};
