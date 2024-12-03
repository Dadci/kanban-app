// src/components/Analytics.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  HiClipboardList, 
  HiCheckCircle, 
  HiChartPie, 
  HiCollection,
  HiTrendingUp,
  HiClock,
  HiLightningBolt,
  HiExclamation
} from 'react-icons/hi';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
    const boards = useSelector(state => state.boards.boards);
    
    // Basic metrics
    const totalBoards = boards.length;
    const totalTasks = boards.reduce((acc, board) => 
        acc + board.columns.reduce((colAcc, col) => colAcc + col.tasks.length, 0), 0);
    const completedTasks = boards.reduce((acc, board) => 
        acc + board.columns.reduce((colAcc, col) => 
            colAcc + col.tasks.filter(task => task.subtasks.every(st => st.isCompleted)).length, 0), 0);
    
    // Task priority distribution
    const tasksByPriority = boards.reduce((acc, board) => {
        board.columns.forEach(col => {
            col.tasks.forEach(task => {
                acc[task.priority] = (acc[task.priority] || 0) + 1;
            });
        });
        return acc;
    }, {});

    // Calculate average subtasks per task
    const totalSubtasks = boards.reduce((acc, board) => {
        return acc + board.columns.reduce((colAcc, col) => {
            return colAcc + col.tasks.reduce((taskAcc, task) => {
                return taskAcc + task.subtasks.length;
            }, 0);
        }, 0);
    }, 0);
    const avgSubtasksPerTask = totalTasks ? (totalSubtasks / totalTasks).toFixed(1) : 0;

    // Task completion by column (progress overview)
    const taskProgressByColumn = boards.reduce((acc, board) => {
        board.columns.forEach(col => {
            const total = col.tasks.length;
            const completed = col.tasks.filter(task => 
                task.subtasks.every(st => st.isCompleted)
            ).length;
            if (total > 0) {
                acc[col.name] = Math.round((completed / total) * 100);
            }
        });
        return acc;
    }, {});

    // Most active board
    const mostActiveBoard = boards.reduce((acc, board) => {
        const taskCount = board.columns.reduce((sum, col) => sum + col.tasks.length, 0);
        if (taskCount > acc.count) {
            return { name: board.name, count: taskCount };
        }
        return acc;
    }, { name: '', count: 0 });

    // Task age distribution
    const taskAgeMetrics = boards.reduce((acc, board) => {
        board.columns.forEach(col => {
            col.tasks.forEach(task => {
                const creationDate = new Date(task.creationDate);
                const daysSinceCreation = Math.floor((new Date() - creationDate) / (1000 * 60 * 60 * 24));
                if (daysSinceCreation <= 7) acc.thisWeek++;
                else if (daysSinceCreation <= 30) acc.thisMonth++;
                else acc.older++;
            });
        });
        return acc;
    }, { thisWeek: 0, thisMonth: 0, older: 0 });

    // Task complexity (based on subtasks count)
    const taskComplexityMetrics = boards.reduce((acc, board) => {
        board.columns.forEach(col => {
            col.tasks.forEach(task => {
                const subtaskCount = task.subtasks.length;
                if (subtaskCount <= 2) acc.simple++;
                else if (subtaskCount <= 5) acc.medium++;
                else acc.complex++;
            });
        });
        return acc;
    }, { simple: 0, medium: 0, complex: 0 });

    // Column efficiency (completion rate by column)
    const columnEfficiency = boards.reduce((acc, board) => {
        board.columns.forEach(col => {
            if (!acc[col.name]) {
                acc[col.name] = {
                    total: 0,
                    completed: 0
                };
            }
            col.tasks.forEach(task => {
                acc[col.name].total++;
                if (task.subtasks.every(st => st.isCompleted)) {
                    acc[col.name].completed++;
                }
            });
        });
        return acc;
    }, {});

    // Most efficient column
    const mostEfficientColumn = Object.entries(columnEfficiency).reduce((acc, [name, data]) => {
        const rate = data.total ? (data.completed / data.total) * 100 : 0;
        return rate > acc.rate ? { name, rate } : acc;
    }, { name: '', rate: 0 });

    const pieData = {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
            data: [
                tasksByPriority.high || 0,
                tasksByPriority.medium || 0,
                tasksByPriority.low || 0
            ],
            backgroundColor: ['#635FC7', '#EA5555', '#67E2AE'], // Primary, Danger, Success
            borderWidth: 0
        }]
    };

    const progressData = {
        labels: Object.keys(taskProgressByColumn),
        datasets: [{
            label: 'Completion %',
            data: Object.values(taskProgressByColumn),
            backgroundColor: '#635FC7',
            borderRadius: 8,
        }]
    };

    const ageData = {
        labels: ['This Week', 'This Month', 'Older'],
        datasets: [{
            data: [
                taskAgeMetrics.thisWeek,
                taskAgeMetrics.thisMonth,
                taskAgeMetrics.older
            ],
            backgroundColor: ['#22c55e', '#f59e0b', '#dc2626'],
            borderWidth: 0
        }]
    };

    const complexityData = {
        labels: ['Simple', 'Medium', 'Complex'],
        datasets: [{
            data: [
                taskComplexityMetrics.simple,
                taskComplexityMetrics.medium,
                taskComplexityMetrics.complex
            ],
            backgroundColor: ['#67E2AE', '#FFAB4A', '#635FC7'], // Success, Warning, Primary
            borderWidth: 0
        }]
    };

    return (
        <div className="p-8 bg-background dark:bg-background-dark min-h-screen flex-1 overflow-y-auto pb-8">
            <div className="mb-8">
                
                <p className="text-text-secondary">Track your project progress and task metrics</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">Total Tasks</h3>
                            <p className="text-3xl font-bold text-text dark:text-white">{totalTasks}</p>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-full">
                            <HiClipboardList className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                        <HiTrendingUp className="w-4 h-4 mr-1" />
                        <span>+{boards.length} boards</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">Completion Rate</h3>
                            <p className="text-3xl font-bold text-text dark:text-white">
                                {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                            </p>
                        </div>
                        <div className="p-4 bg-green-100 rounded-full">
                            <HiCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                            className="bg-green-600 h-1.5 rounded-full" 
                            style={{ width: `${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">Avg Subtasks</h3>
                            <p className="text-3xl font-bold text-text dark:text-white">{avgSubtasksPerTask}</p>
                        </div>
                        <div className="p-4 bg-purple-100 rounded-full">
                            <HiChartPie className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">per task</p>
                </div>

                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">Most Active</h3>
                            <p className="text-xl font-bold text-text dark:text-white truncate">{mostActiveBoard.name || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-blue-100 rounded-full">
                            <HiCollection className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">{mostActiveBoard.count} tasks</p>
                </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">New Tasks</h3>
                            <p className="text-3xl font-bold text-text dark:text-white">{taskAgeMetrics.thisWeek}</p>
                        </div>
                        <div className="p-4 bg-green-100 rounded-full">
                            <HiLightningBolt className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">this week</p>
                </div>

                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">Complex Tasks</h3>
                            <p className="text-3xl font-bold text-text dark:text-white">{taskComplexityMetrics.complex}</p>
                        </div>
                        <div className="p-4 bg-orange-100 rounded-full">
                            <HiExclamation className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">high priority</p>
                </div>

                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">Most Efficient</h3>
                            <p className="text-xl font-bold text-text dark:text-white truncate">
                                {mostEfficientColumn.name || 'N/A'}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-100 rounded-full">
                            <HiClock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                        {mostEfficientColumn.rate.toFixed(0)}% completion
                    </p>
                </div>

                <div className="bg-white dark:bg-background-darkCard p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-text-secondary text-sm mb-1">Task Age</h3>
                            <p className="text-3xl font-bold text-text dark:text-white">
                                {taskAgeMetrics.older}
                            </p>
                        </div>
                        <div className="p-4 bg-red-100 rounded-full">
                            <HiClock className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">older than 30 days</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-background-darkCard p-4 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-text dark:text-white mb-2">Tasks by Priority</h3>
                    <div className="w-full h-52"> {/* Reduced height */}
                        <Pie data={pieData} options={{ 
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 12, // Reduced padding
                                        usePointStyle: true,
                                        font: { size: 11 }, // Smaller font
                                        color: '#828FA3' // Text secondary color
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
                
                <div className="bg-white dark:bg-background-darkCard p-4 rounded-lg shadow">
                    <h3 className="text-lg font-bold text-text dark:text-white mb-2">Task Complexity</h3>
                    <div className="w-full h-52"> {/* Reduced height */}
                        <Pie data={complexityData} options={{ 
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 12,
                                        usePointStyle: true,
                                        font: { size: 11 },
                                        color: '#828FA3'
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
          
        </div>
    );
};

export default Analytics;