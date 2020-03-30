import React, {useState } from 'react';
import classNames from 'classnames';
import { useEffect } from 'react';

const Deck = (props) => {

  const [expanded, setExpanded] = useState(false);
  const [shreds, setShreds] = useState([]);

  useEffect(() => {
    if (expanded === false) {
      let isFetching = true;

      fetch('/shred', {
        method: 'GET',
        mode: "cors",
        cache: "reload",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success" && shreds != res.shreds) {
          console.log(res.shreds)
          setShreds(res.shreds);
        }
      })

      return () => {
        isFetching = false;
      }
    }
  }, [expanded]);

  const shredTiles = shreds.length ? shreds.map((shred) => {
    return <div className="shred_tile">{shred.plot_action}</div>
  }) : null;

  // const date = Date.prototype.toDateString(props.created_at);

  const expandAccordion = (e) => {
    console.log(props);
    setExpanded(!expanded);
  }

  const accordionClass = classNames({
    'accordion': true,
    'expanded': expanded
  })

  return (
    <div className="deck">
      <div className="edit_panel">
        <button className="open_deck">Open</button>
        <button className="delete_deck">Delete</button>
      </div>
      <button className={accordionClass} onClick={(e) => expandAccordion(e)}>
        <p className="deck_title">{props.title}</p>
        <p className="deck_type">{props.project_type}</p>
        <p className="deck_date"> Created: {props.created_at}</p>
      </button>
      {expanded === true && shredTiles}
    </div>
  )
};

export default Deck;