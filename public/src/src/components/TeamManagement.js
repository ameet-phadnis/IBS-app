import React, { useState, useEffect } from "react";
import { SCRUM_TEAMS } from "../App";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TeamManagement() {
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem("teams");
    if (saved) return JSON.parse(saved);
    // Initialize teams empty
    const emptyTeams = {};
    SCRUM_TEAMS.forEach((team) => {
      emptyTeams[team] = { members: [], stars: 0 };
    });
    return emptyTeams;
  });

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const handleStudentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target.result;
      const students = content
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      distributeStudents(students);
    };
    reader.readAsText(file);
  };

  const distributeStudents = (students) => {
    const newTeams = {};
    SCRUM_TEAMS.forEach((team) => {
      newTeams[team] = { members: [], stars: teams[team]?.stars || 0 };
    });

    students.forEach((student, index) => {
      const teamName = SCRUM_TEAMS[index % SCRUM_TEAMS.length];
      newTeams[teamName].members.push(student);
    });
    setTeams(newTeams);
  };

  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setTeams((prev) => {
      const sourceTeam = prev[source.droppableId];
      const destTeam = prev[destination.droppableId];
      const member = sourceTeam.members[source.index];

      // Remove from source
      const newSourceMembers = Array.from(sourceTeam.members);
      newSourceMembers.splice(source.index, 1);

      // Insert into destination
      const newDestMembers = Array.from(destTeam.members);
      newDestMembers.splice(destination.index, 0, member);

      return {
        ...prev,
        [source.droppableId]: { ...sourceTeam, members: newSourceMembers },
        [destination.droppableId]: { ...destTeam, members: newDestMembers }
      };
    });
  }

  const removeMember = (teamName, idx) => {
    setTeams((prev) => {
      const newMembers = [...prev[teamName].members];
      newMembers.splice(idx, 1);
      return {
        ...prev,
        [teamName]: { ...prev[teamName], members: newMembers }
      };
    });
  };

  return (
    <div>
      <p>
        Upload a student list (.txt or .csv, one student name per line). Students will be equally
        divided into Scrum teams named after Scrum ceremonies.
      </p>
      <input type="file" accept=".txt,.csv" onChange={handleStudentUpload} />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {SCRUM_TEAMS.map((teamName) => {
            const team = teams[teamName];
            return (
              <Droppable droppableId={teamName} key={teamName}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      width: 180,
                      minHeight: 300,
                      backgroundColor: snapshot.isDraggingOver ? "#e3f2fd" : "#f9f9f9",
                      padding: 8,
                      borderRadius: 4,
                      boxShadow: "0 0 5px rgba(0,0,0,0.1)"
                    }}
                  >
                    <h3 style={{textAlign:'center'}}>{teamName}</h3>
                    {team.members.length === 0 && <p style={{fontSize: '0.9em', color:'#666'}}>No members</p>}
                    {team.members.map((member, idx) => (
                      <Draggable key={member + idx} draggableId={member + idx} index={idx}>
                        {(providedDrag, snapshotDrag) => (
                          <div
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            {...providedDrag.dragHandleProps}
                            style={{
                              userSelect: "none",
                              padding: 8,
                              marginBottom: 6,
                              backgroundColor: snapshotDrag.isDragging ? "#bbdefb" : "#ffffff",
                              borderRadius: 4,
                              fontSize: 14,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              ...providedDrag.draggableProps.style
                            }}
                          >
                            <span>{member}</span>
                            <button
                              onClick={() => removeMember(teamName, idx)}
                              title="Remove member"
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#e53935",
                                fontWeight: "bold",
                                cursor: "pointer"
                              }}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
