import React from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { WorkCenterLayout } from './WorkCenterLayout';
import { WorkCenterPage } from './index';
import { TasksPage } from './TasksPage';
import { TrackersPage } from './TrackersPage';
import { SessionsPage } from './SessionsPage';
import { TaskDetailPage } from './components/TaskDetailPage';
import { TrackerDetailPage } from './components/TrackerDetailPage';
import { dummyProjects } from './TasksPage';
import { dummyTrackers } from './TrackersPage';

export function WorkCenterRouter() {
  return (
    <WorkCenterLayout>
      <Routes>
        {/* Main Work Center page with tabs */}
        <Route index element={<WorkCenterPage />} />
        
        {/* Sessions */}
        <Route path="sessions" element={<SessionsPage searchQuery="" />} />
        
        {/* Projects */}
        <Route path="projects" element={<TasksPage searchQuery="" />} />
        <Route 
          path="projects/:projectId" 
          element={<TasksPage searchQuery="" />} 
        />
        <Route 
          path="projects/:projectId/tasks/:taskId" 
          element={<TaskDetailWrapper />} 
        />
        
        {/* Trackers */}
        <Route path="trackers">
          <Route index element={<TrackersPage searchQuery="" />} />
          <Route path=":trackerId" element={<TrackerDetailWrapper />} />
        </Route>
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/work-center" replace />} />
      </Routes>
    </WorkCenterLayout>
  );
}

// Wrapper component to load task detail
function TaskDetailWrapper() {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const navigate = useNavigate();
  
  const project = dummyProjects.find(p => p.id === projectId);
  const task = project?.workItems.find(t => t.id === taskId);
  
  if (!project || !task) {
    return <Navigate to="/work-center/projects" replace />;
  }
  
  return (
    <TaskDetailPage
      task={task}
      project={project}
      onBack={() => navigate(`/work-center/projects/${projectId}`)}
    />
  );
}

// Wrapper component to load tracker detail
function TrackerDetailWrapper() {
  const { trackerId } = useParams<{ trackerId: string }>();
  const navigate = useNavigate();
  
  const tracker = dummyTrackers.find(t => t.id === trackerId);
  
  if (!tracker) {
    return <Navigate to="/work-center/trackers" replace />;
  }
  
  return (
    <TrackerDetailPage
      tracker={tracker}
      onBack={() => navigate('/work-center/trackers')}
    />
  );
}
