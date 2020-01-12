import React, { Component } from 'react'
import MainLayout from "layouts/Main.jsx";
import { Switch, Route } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <div id="App">
                <Switch>
                    <Route path="/" render={props => <MainLayout {...props} />} />
                </Switch>
            </div>
        )
    }
}

export default App
