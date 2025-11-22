import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agentsRes, tasksRes, deptsRes] = await Promise.all([
        axios.get(`${API_URL}/agents`),
        axios.get(`${API_URL}/tasks`),
        axios.get(`${API_URL}/departments`),
      ]);
      
      setAgents(agentsRes.data);
      setTasks(tasksRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getDaysRemaining = () => {
    const deadline = new Date('2025-12-31T23:59:59Z');
    const now = new Date();
    const diff = deadline - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  const { days, hours } = getDaysRemaining();

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 TECH ELDORADO</h1>
        <div className="countdown">
          <strong>{days} дней, {hours} часов</strong> до дедлайна
        </div>
      </header>

      <main className="dashboard">
        <section className="stats">
          <div className="stat-card">
            <h3>Агенты</h3>
            <p className="stat-value">{agents.length} / 22</p>
          </div>
          <div className="stat-card">
            <h3>Задачи</h3>
            <p className="stat-value">{tasks.length}</p>
          </div>
          <div className="stat-card">
            <h3>Отделы</h3>
            <p className="stat-value">{departments.length}</p>
          </div>
        </section>

        <section className="agents-grid">
          <h2>Агенты</h2>
          <div className="grid">
            {agents.map(agent => (
              <div key={agent.id} className="agent-card">
                <h4>{agent.name}</h4>
                <p className="agent-id">{agent.agentId}</p>
                <p className={`status status-${agent.status}`}>{agent.status}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

