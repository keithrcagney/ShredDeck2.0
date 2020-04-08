import React, { useState, useEffect } from "react";
import { Link, Redirect } from 'react-router-dom';

const Signup = (props) => {
  const [noInput, setNoInput] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const promptArea = document.getElementById("user_prompt");
    if (noInput === true){ 
      const prompt = document.createElement("p");
      prompt.className = "prompt";
      prompt.innerHTML = "Please fill out all fields to sign up.";
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

  const handleClick = () => {
    const nameField = document.getElementById("first_name");
    const lastNameField = document.getElementById("last_name");
    const emailField = document.getElementById("emailField");
    const passwordField = document.getElementById("passwordField");

    const first_name = nameField.value;
    const last_name = lastNameField.value;
    const email = emailField.value;
    const password = passwordField.value;

    if (!first_name || !last_name || !email || !password){
      return setNoInput(true);
    }

    const body = {
      first_name,
      last_name,
      email,
      password
    }

    fetch("/signup", {
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
      } else if (res.status === "redirect"){
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
          body: JSON.stringify(res.body)
        })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "success") {
            setIsLoggedIn(true);
          }
        })
      }
    })

    nameField.value = null;
    lastNameField.value = null;
    emailField.value = null;
    passwordField.value = null;
  }

  return (
    <>
      { isLoggedIn ? (
        <Redirect to="/deckDash"/>
      ) : (
        <div className="container">
          <div className="signup_panel">
            <input className="text_input" id="first_name" type="text" placeholder="first name" onChange={handleTypeAfterPrompt}></input>
            <input className="text_input" id="last_name" type="text" placeholder="surname" onChange={handleTypeAfterPrompt}></input>
            <input className="text_input" id="emailField" type="text" placeholder="e-mail" onChange={handleTypeAfterPrompt}></input>
            <input className="text_input" id="passwordField" type="password" placeholder="password" onChange={handleTypeAfterPrompt}></input>
            <button className="button_input" onClick={handleClick}><span>Sign up</span></button>
          </div>
          <div id="user_prompt"></div>
          <nav className="redirect_nav">
            <Link to="/">Already signed up? Please log in.</Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Signup;