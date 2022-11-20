import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import logo from "./logo.svg";
import { API, Storage } from "aws-amplify";
import {
  withAuthenticator,
  Button,
  View,
  Heading,
  Flex,
  TextField,
  Text,
  Image,
} from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

interface signOutInterface {
  signOut?: () => {};
}

function App({ signOut }: signOutInterface) {
  // TODO big one.... fix any on usestate
  const [notes, setNotes] = useState<any>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    // TODO fix any
    const apiData: any = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      //TODO fix any
      notesFromAPI.map(async (note: any) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }
  //TODO fix any
  async function createNote(event: any) {
    event.preventDefault();
    const form = new FormData(event.target);
    // TODO fix any
    const image: any = form.get("image");
    // TODO fix any
    const data: any = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await Storage.put(data.name, image);
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }
  // TODO fix double any :(:(:(:(:()))))
  async function deleteNote({ id, name }: any) {
    const newNotes = notes.filter((note: any) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Heading level={1}>Note Paddington</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {/* TODO fix any */}
        {notes.map((note: any) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
            <Text as="span">{note.description}</Text>
            {note.image && (
              <Image
                src={note.image}
                alt={`visual aid for ${notes.name}`}
                style={{ width: 400 }}
              />
            )}
            <Button variation="link" onClick={() => deleteNote(note)}>
              Delete Note
            </Button>
          </Flex>
        ))}
      </View>
      <View
        name="image"
        as="input"
        type="file"
        style={{ alignSelf: "end" }}
      ></View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );

  //OG RETURN
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //
  //       <div>Beep Boop</div>
  //       <Button marginTop={25} color="white" onClick={signOut}>
  //         logout
  //       </Button>
  //     </header>
  //   </div>
  // );
}

export default withAuthenticator(App);
