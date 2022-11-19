import logo from "./logo.svg";
import "./App.css";
import { withAuthenticator, Button } from "@aws-amplify/ui-react";

interface signOutInterface {
  signOut?: Function;
}

function App({ signOut }: signOutInterface) {
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
