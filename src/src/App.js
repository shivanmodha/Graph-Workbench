import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'

const navigation = require('./configuration/navigation.json');

class App extends Component
{
    CreateDropdown(element, title)
    {
        let links = [];
        Object.keys(element["children"]).forEach((key) =>
        {
            if (element["children"][key] != "divider")
            {
                links.push(<MenuItem eventKey={element["children"][key]}>{key}</MenuItem>);
            }
            else
            {
                links.push(<MenuItem divider />);
            }
        });
        return (
            <NavDropdown title={title} eventKey={element["eventKey"]} id={element["id"]}>{links}</NavDropdown>
        );
    }
    NavigationCollapse()
    {
        let links = {
            "left": [],
            "right": []
        }
        Object.keys(navigation["links"]).forEach((key) =>
        {
            let child = navigation["links"][key];
            if (child["type"] === "link")
            {
                links[child["side"]].push(<NavItem eventKey={child["eventKey"]} href={child["href"]}>{key}</NavItem>);
            }
            else if (child["type"] === "dropdown")
            {
                links[child["side"]].push(this.CreateDropdown(child, key));
            }
        });
        return (
            <Navbar.Collapse>
                <Nav pullLeft> {links["left"]} </Nav>
                <Nav pullRight> {links["right"]} </Nav>
            </Navbar.Collapse>
        );
    }
    render()
    {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand> {navigation["header"]} </Navbar.Brand>
                </Navbar.Header>
                {this.NavigationCollapse()}
            </Navbar>
        );
    }
}

export default App;
