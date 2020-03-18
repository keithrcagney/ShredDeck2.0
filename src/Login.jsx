import React, { useState, useEffect } from 'react';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';

const Login = () => {
  const [noInput, setNoInput] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const promptArea = document.getElementById("user_prompt");
    if (noInput === true){ 
      const prompt = document.createElement("p");
      prompt.className = "prompt";
      prompt.innerHTML = "Please fill out all fields to log in.";
      promptArea.appendChild(prompt);
    }
  }, [noInput])

  const handleTypeAfterPrompt = () => {
    if (noInput === true){
      const promptArea = document.getElementById("user_prompt");
      while (promptArea.firstChild){
        promptArea.removeChild(promptArea.lastChild);
      }
      return setNoInput(false);
    }
  }

  const handleDenial = () => {
    const promptArea = document.getElementById("user_prompt");
    const prompt = document.createElement("p");
    prompt.className = "prompt";
    prompt.innerHTML = "No such user found. Please try again.";
    return promptArea.appendChild(prompt);
  }

  const handleClick = () => {
    const emailField = document.getElementById("emailField");
    const passwordField = document.getElementById("passwordField");
    const email = emailField.value;
    const password = passwordField.value;

    if (!email || !password){
      return setNoInput(true);
    }

    const body = {
      email,
      password
    }

    fetch("/login", {
      method: "POST",
      mode: "cors",
      cache: "reload",
      credentials: "include",
      redirect: "follow",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success") {
        setIsLoggedIn(true);
      } else if (res.status === "denied"){
        handleDenial();
      }
    })

    emailField.value = null;
    passwordField.value = null;
  }

  return (
    <>
    { isLoggedIn ? (
      <Redirect to="/deckDash"/>
    ) : (
        <div className="container">
          <nav className="redirect_nav">
            <Link to="/signup">Sign up</Link>
          </nav>
          <div className="login_panel">
            <input className="text_input" id="emailField" type="text" placeholder="e-mail" onChange={handleTypeAfterPrompt}></input>
            <input className="text_input" id="passwordField" type="password" placeholder="password" onChange={handleTypeAfterPrompt}></input>
            <button className="button_input" onClick={handleClick}><span>Log in</span></button>
          </div>
          <div id="user_prompt"></div>
        </div>
      )
    }
    </>
  );
};

export default Login;