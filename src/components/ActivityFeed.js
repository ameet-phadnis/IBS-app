import React from "react";

export default function ActivityFeed({ feed }) {
  return (
    <div style={{
      marginTop: 30,
      maxHeight: 150,
      overflowY: "auto",
      backgroundColor: "#fafafa",
      padding: 10,
      borderRadius: 6,
      boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)"
    }}>
      <h4>Activity Feed</h4>
      {feed.length === 0 && <p style={{color:"#555"}}>No recent activity</p>}
      <ul style={{listStyle: "none", paddingLeft: 0}}>
        {feed.map((item) => (
          <li key={item.id} style={{marginBottom: 6}}>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
