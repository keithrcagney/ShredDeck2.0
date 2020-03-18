import React, { useState, useEffect } from "react";
import DeckDashboard from './DeckDashboard.jsx';

const PrivateRoute = (props) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/deckDash', {
      method: "GET",
      mode: "cors",
      cache: "reload",
      credentials: "include",
      redirect: "follow",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success"){
        setIsLoggedIn(true);
      }
    })
  }, [])

  return (
    <>
    { isLoggedIn ? (
      <DeckDashboard/>
    ) : (
      <p>Please wait while your dashboard loads.</p>
    )}
    </>
  )
};

export default PrivateRoute;