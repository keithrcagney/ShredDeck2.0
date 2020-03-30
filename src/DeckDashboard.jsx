import React, {useState, useEffect} from 'react';
import Deck from './Deck.jsx';

const DeckDashboard = () => {

  const [decks, setDecks] = useState([]);
  const [rows, setRows] = useState([[],[],[]]);
  const [edits, setEdits] = useState(false);
  const [currentDeckID, setCurrentDeckID] = useState()

  useEffect(() => {
    if (isFetching) return;

    let isFetching = true;
    fetch('/deck', {
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
      if (res.status === "success"){
        setDecks(res.decks)
      }
    })
    return () => {
      isFetching = false;
    }
  }, [edits]);

  useEffect(() => {
    let rowsUpdated = false;

    if (!rowsUpdated) {
      let row1;
      let row2;
      let row3;

      if (decks.length <= 5){
        row1 = decks.slice(0, decks.length);
        row2 = [];
        row3 = [];
      } else if (decks.length > 5 && decks.length <= 10){
        row1 = decks.slice(0, 5);
        row2 = decks.slice(5, decks.length);
        row3 = [];
      } else {
        row1 = decks.slice(0, 6);
        row2 = decks.slice(6, 10);
        row3 = decks.slice(10, decks.length);
      }
      
      setRows([row1, row2, row3]);
    }

    return () => {
      rowsUpdated = true;
    }
  }, [decks]);

  const submitData = () => {
    let title = document.getElementById('titleField');
    let project_type = document.getElementById('projectTypeField').value;
    const data = {
      title: title.value,
      project_type
    }
    title.value = null;
    return createDeck(data);
  };

  async function createDeck(data) {
    const { title, project_type } = data;
    const response = await fetch('/deck', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, project_type })
    })
    .then(res => res.json())
    .then(res => setEdits(!edits))
  };

  const handleSetDeckPreview = (id) => {
    // could mimic logic of getShreds and pass all Shreds down as props
    console.log('handleSetDeckPreview fired with id: ', id);
  };


  // logic to create visual dashboard (bookshelf view)

  const generateRow1 = rows[0].length ? (
    rows[0].map((deck) => <Deck
      key={deck._id}
      deck_id={deck._id}
      project_type={deck.project_type}
      title={deck.title}
      created_at={deck.created_at}
      handleSetDeckPreview={handleSetDeckPreview}
    />)
  ) : null;

  const generateRow2 = rows[1].length ? (
    rows[1].map((deck) => <Deck
      key={deck._id}
      deck_id={deck._id}
      project_type={deck.project_type}
      title={deck.title}
      created_at={deck.created_at}
      handleSetDeckPreview={handleSetDeckPreview}
    />)
  ) : null;

  const generateRow3 = rows[2].length ? (
    rows[2].map((deck) => <Deck
      key={deck._id}
      deck_id={deck._id}
      project_type={deck.project_type}
      title={deck.title}
      created_at={deck.created_at}
      handleSetDeckPreview={handleSetDeckPreview}
    />)
  ) : null;

  return (
    <div className="container">

      <div className="shredPreview">
        {/* Add ShredPreviewComponent 
        
          logic: prop drill a method to update preview to Decks
          use onclick event handler to elevate that state up to here
          it will update a state on the dashboard that passes down to the Preview
          the preview remounts with a fetch to shred as the main page does
          //this leads to overfetching, but ensures accurate info

        
        */}
      </div>


      {decks.length <= 15 && <div id="createDeck">
          <input type="text" id="titleField" placeholder="Deck Title"></input>
          <select id="projectTypeField" size="1">
            <option value="film" defaultValue>Film</option>
            <option value="narrative">Narrative</option>
            <option value="novel">Novel</option>
            <option value="theatre">Theatre</option>
            <option value="television">Television</option>
          </select>
          <button className="submit" onClick={() => submitData()}>Create Deck</button>
      </div>}
      
      <div className="row">
        <div className="rowInnerBox">
          {generateRow1}
        </div>
      </div>

      {rows[1].length !== 0 &&
      <div className="row">
        <div className="rowInnerBox">
          {generateRow2}
        </div>
      </div>}

      {rows[2].length !== 0 &&
      <div className="row">
        <div className="rowInnerBox">
          {generateRow3}
        </div>
      </div>}
    </div>

  )
}

export default DeckDashboard;
