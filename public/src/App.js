import React, { useState } from "react";
import ScrumBoard from "./components/ScrumBoard";
import TeamManagement from "./components/TeamManagement";
import Gamification from "./components/Gamification";

export const SCRUM_TEAMS = [
  "Sprint Planning",
  "Daily Scrum",
  "Sprint Review",
  "Sprint Demo",
  "Backlog Grooming"
];

export const STATUSES = ["To Do", "In Progress", "Done"];

const tabStyle = {
  margin: "0 10px",
  padding: "8px 16px",
  cursor: "pointer",
  borderBottom: "2px solid transparent"
};

const activeTabStyle = {
  ...tabStyle,
  borderBottom: "2px solid #007bff",
  fontWeight: "bold"
};

export default function App() {
  const [activeTab, setActiveTab] = useState("scrumBoard");

  return (
    <div style={{ maxWidth: 1000, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Product Management Workshop Webapp</h1>

      <nav style={{ textAlign: "center", marginBottom: 20 }}>
        <button
          style={activeTab === "scrumBoard" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("scrumBoard")}
        >
          Scrum Board
        </button>
        <button
          style={activeTab === "teams" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("teams")}
        >
          Team Management
        </button>
        <button
          style={activeTab === "gamification" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("gamification")}
        >
          Gamification
        </button>
      </nav>

      {activeTab === "scrumBoard" && <ScrumBoard />}
      {activeTab === "teams" && <TeamManagement />}
      {activeTab === "gamification" && <Gamification />}
    </div>
  );
}
