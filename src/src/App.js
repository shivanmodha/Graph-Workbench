import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { Breadcrumb } from 'react-bootstrap'
import { Alert } from 'react-bootstrap'

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
        let div_style = {
            margin: 0,
            width: "100%",
            height: "100%",
        };
        let canvas_style = {
            position: "fixed",
            width: "100%",
            height: "95%",
            border: 0,
            padding: 0,
            margin: 0
        };
        return (
            <div>
                <Navbar style={{ marginBottom: "0px" }}>
                    <Navbar.Header>
                        <Navbar.Brand> {navigation["header"]} </Navbar.Brand>
                    </Navbar.Header>
                    {this.NavigationCollapse()}
                </Navbar>
                <Breadcrumb style={{ marginBottom: "0px" }}>
                    <Breadcrumb.Item active>
                        bench
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="#">
                        Untitled Document
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div id="renderer" style={div_style}>
                    <canvas id="studios.vanish.component.3D" style={canvas_style}></canvas>
                    <canvas id="studios.vanish.component.2D" style={canvas_style}></canvas>
                </div>
            </div>
        );
    }
}

export default App;
