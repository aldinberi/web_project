import React, { Component } from 'react'
import AdminLayout from "layouts/Admin.jsx";
import { Switch, Route, Redirect } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <div id="App">
                <Switch>
                    <Route path="/admin" render={props => <AdminLayout {...props} />} />
                    <Redirect from="/" to="/admin/dashboard" />
                </Switch>
            </div>
        )
    }
}

export default App
