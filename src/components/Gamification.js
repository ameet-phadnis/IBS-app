import React, { useState, useEffect } from "react";
import { SCRUM_TEAMS } from "../App";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

import ActivityFeed from "./ActivityFeed";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Gamification() {
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem("teams");
    if (saved) return JSON.parse(saved);
    const emptyTeams = {};
    SCRUM_TEAMS.forEach((team) => {
      emptyTeams[team] = { members: [], stars: 0 };
    });
    return emptyTeams;
  });

  const [feed, setFeed] = useState([]);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const giveStar = (teamName) => {
    setTeams((prev) => {
      const newStars = (prev[teamName]?.stars || 0) + 1;
      return {
        ...prev,
        [teamName]: { ...prev[teamName], stars: newStars }
      };
    });
    setFeed((prevFeed) => [
      { id: Date.now(), text: `Team ${teamName} received a ⭐!` },
      ...prevFeed
    ]);
  };

  const leaderTeam = Object.entries(teams).reduce((maxTeam, [teamName, team]) => {
    const maxStars = teams[maxTeam]?.stars || 0;
    return team.stars > maxStars ? teamName : maxTeam;
  }, SCRUM_TEAMS[0]);

  const chartData = {
    labels: SCRUM_TEAMS,
    datasets: [
      {
        label: "Stars",
        data: SCRUM_TEAMS.map((team) => teams[team]?.stars || 0),
        backgroundColor: SCRUM_TEAMS.map((team) =>
          team === leaderTeam ? "rgba(255, 206, 86, 0.8)" : "rgba(54, 162, 235, 0.7)"
        )
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    animation: { duration: 500 },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1
      }
    }
  };

  return (
    <div>
      <p>Assign stars to teams to encourage gamification!</p>

      {SCRUM_TEAMS.map((teamName) => {
        const stars = teams[teamName]?.stars || 0;
        const isLeader = teamName === leaderTeam;
        return (
          <div
            key={teamName}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              padding: 10,
              backgroundColor: isLeader ? "#fff8e1" : "#f2f2f2",
              borderRadius: 6,
              boxShadow: isLeader
                ? "0 0 12px 2px rgba(255, 193, 7, 0.8)"
                : "none",
              fontWeight: isLeader ? "bold" : "normal"
            }}
          >
            <div style={{ flexGrow: 1, fontSize: 18 }}>
              {teamName} {isLeader && "🏆"}
            </div>
            <div style={{ margin: "0 15px", fontSize: 16 }}>Stars: {stars}</div>
            <button onClick={() => giveStar(teamName)} style={{fontSize:16}}>Give Star ⭐</button>
          </div>
        );
      })}

      <div style={{ marginTop: 30, maxWidth: 600 }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <ActivityFeed feed={feed} />
    </div>
  );
}
