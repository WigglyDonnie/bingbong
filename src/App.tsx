import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import logo from "./logo.svg";
import { API } from "aws-amplify";
import { withAuthenticator, Button } from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

interface signOutInterface {
  signOut?: () => {};
}

function App({ signOut }: signOutInterface) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    // TODO fix any
    const apiData: any = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    setNotes(notesFromAPI);
  }
  //TODO fix any
  async function createNote(event: any) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
    };
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }
  // TODO fix double any :(:(:(:(:()))))
  async function deleteNote({ id }: any) {
    const newNotes = notes.filter((note: any) => note.id !== id);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Beep Boop</div>
        <Button marginTop={25} color="white" onClick={signOut}>
          logout
        </Button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
