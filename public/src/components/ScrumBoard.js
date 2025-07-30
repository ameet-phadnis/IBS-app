import React, { useState, useEffect } from "react";
import { STATUSES } from "../App";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const generateId = () => Math.floor(Math.random() * 1000000);

const initialTickets = [
  { id: "1", title: "Design login page", status: "To Do" },
  { id: "2", title: "Setup CI pipeline", status: "In Progress" }
];

export default function ScrumBoard() {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("tickets");
    return saved ? JSON.parse(saved) : initialTickets;
  });
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [editTicket, setEditTicket] = useState(null); // object {id, title} or null

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    // If dropped in same column and position, ignore
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setTickets((prev) => {
      const ticket = prev.find((t) => t.id === draggableId);
      if (!ticket) return prev;

      // Update status to new droppable id if changed
      if (ticket.status !== destination.droppableId) {
        return prev.map((t) =>
          t.id === draggableId ? { ...t, status: destination.droppableId } : t
        );
      }
      // Else reorder within the same list, keep order simple for demo by repositioning IDs
      return prev;
    });
  }

  const addTicket = () => {
    if (!newTicketTitle.trim()) return;
    setTickets((prev) => [
      ...prev,
      { id: generateId().toString(), title: newTicketTitle.trim(), status: "To Do" }
    ]);
    setNewTicketTitle("");
  };

  const deleteTicket = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const startEdit = (ticket) => {
    setEditTicket(ticket);
  };

  const saveEdit = () => {
    if (!editTicket.title.trim()) return;
    setTickets((prev) =>
      prev.map((t) => (t.id === editTicket.id ? { ...t, title: editTicket.title.trim() } : t))
    );
    setEditTicket(null);
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="New ticket title"
          value={newTicketTitle}
          onChange={(e) => setNewTicketTitle(e.target.value)}
          style={{ width: 300, padding: "6px 10px", fontSize: 16 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTicket();
          }}
        />
        <button onClick={addTicket} style={{ marginLeft: 10, padding: "6px 12px" }}>
          Add Ticket
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          {STATUSES.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? "#e0f7fa" : "#f0f0f0",
                    padding: 8,
                    width: 300,
                    minHeight: 400,
                    borderRadius: 4,
                    boxShadow: "0 0 5px rgba(0,0,0,0.1)"
                  }}
                >
                  <h3>{status}</h3>
                  {tickets
                    .filter((ticket) => ticket.status === status)
                    .map((ticket, index) => (
                      <Draggable draggableId={ticket.id} index={index} key={ticket.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: "none",
                              padding: 10,
                              margin: "0 0 8px 0",
                              minHeight: "50px",
                              backgroundColor: snapshot.isDragging ? "#80deea" : "#ffffff",
                              color: "black",
                              borderRadius: 4,
                              boxShadow: "0 0 3px rgba(0,0,0,0.1)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              ...provided.draggableProps.style
                            }}
                          >
                            {editTicket && editTicket.id === ticket.id ? (
                              <>
                                <input
                                  type="text"
                                  value={editTicket.title}
                                  onChange={(e) =>
                                    setEditTicket({ ...editTicket, title: e.target.value })
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEdit();
                                  }}
                                  style={{ flexGrow: 1, marginRight: 10, fontSize: 16 }}
                                  autoFocus
                                />
                                <button onClick={saveEdit} style={{ marginRight: 5 }}>
                                  Save
                                </button>
                                <button onClick={() => setEditTicket(null)}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <span style={{ flexGrow: 1 }}>{ticket.title}</span>
                                <button onClick={() => startEdit(ticket)} title="Edit" style={{marginRight:5}}>✏️</button>
                                <button onClick={() => deleteTicket(ticket.id)} title="Delete">🗑️</button>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
