import React, {useState } from 'react';
import classNames from 'classnames';
import { useEffect } from 'react';

const Deck = (props) => {

  const [expanded, setExpanded] = useState(false);
  const [shreds, setShreds] = useState([]);

  useEffect(() => {
    if (expanded === false) {
      let isFetching = true;

      const { deck_id } = props;
      // not sending the shred ID!
      fetch('/shred/get', {
        method: 'POST',
        mode: "cors",
        cache: "reload",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ deck_id })
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
    return <div className="shred_tile">{shred.plot_action.slice(0, 30) + '...'}<br/><span className="separator">~</span><br/></div>
  }) : null;

  const handleSendID = (e) => {
    const sendingDeck = e.target;
    const { id } = sendingDeck;
    return props.handleSetDeckPreview(id);
  }

  const handleDeleteDeck = (e) => {
    const sendingDeck = e.target;
    const { id } = sendingDeck;
    return props.handleDeleteDeck(id);
  }

  const expandAccordion = (e) => {
    console.log(props);
    setExpanded(!expanded);
  }

  const accordionClass = classNames({
    'accordion': true,
    'expanded': expanded
  })

  return (
    <>
      <div className="deck">
        <div className="edit_panel">
          <button  className="open_deck" onClick={(e) => handleSendID(e)}>Open</button>
          <button className="delete_deck" id={props.deck_id} onClick = {(e) => handleDeleteDeck(e)}>Delete</button>
        </div>
        <button className={accordionClass} onClick={(e) => expandAccordion(e)}>
          <p className="deck_title">{props.title}</p>
          <p className="deck_type">{props.project_type}</p>
          <p className="deck_date">{props.created_at}</p>
        </button>
      </div>
      {/* Make this a popup window that can be clicked away */}
      <aside className="shred_tile_preview">
        {expanded === true && shredTiles}
      </aside>
      
    </>
  )
};

export default Deck;