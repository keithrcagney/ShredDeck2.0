import React, {useState } from 'react';
import classNames from 'classnames';

const Deck = (props) => {

  const [expanded, setExpanded] = useState(false);

  // const shredTiles = props.shreds.map((shred) => {
  //   return <div className="shred_tile">{shred.plot_action}</div>
  // })

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
        <span className="deck_title">{props.title}</span>
        <span className="deck_type">{props.project_type}</span>
        <span className="deck_date"> Created at:</span>
      </button>
      {/* {expanded === true && shredTiles} */}
    </div>
  )
};

export default Deck;