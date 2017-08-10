import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { Breadcrumb } from 'react-bootstrap'
import { Alert } from 'react-bootstrap'

const navigation = require('./configuration/navigation.json');

class App extends Component
{
    constructor(props)
    {
        super(props);
        this._event_onResize = this._event_onResize.bind(this);
    }
    componentWillMount()
    {
        this.setState({
            NavigationHeight: 0,
            BreadHeight: 0
        });        
    }
    componentDidMount()
    {
        window.addEventListener("resize", this._event_onResize);
        this._event_onResize();
    }
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
    _event_onResize(e)
    {
        this.setState({
            NavigationHeight: ReactDOM.findDOMNode(this.NavigationBar).offsetHeight,
            BreadHeight: ReactDOM.findDOMNode(this.BreadBar).offsetHeight
        });
    }
    updateSize()
    {
        this._event_onResize();
        return null;
    }
    GetStyle()
    {
        return {
            position: "fixed",
            top: this.state.NavigationHeight + this.state.BreadHeight,
            width: "100%",
            height: window.innerHeight - this.state.NavigationHeight - this.state.BreadHeight,
            border: 0,
            padding: 0,
            margin: 0
        };
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
                <Navbar style={{ position: "fixed", top: 0 }} ref={(e) => this.NavigationBar = e} fixedTop>
                    <Navbar.Header>
                        <Navbar.Brand> {navigation["header"]} </Navbar.Brand>
                    </Navbar.Header>
                    {this.NavigationCollapse()}
                </Navbar>
                <Breadcrumb style={{paddingTop: this.state.NavigationHeight + 5 }} ref={(e) => this.BreadBar = e}>
                    <Breadcrumb.Item active>
                        bench
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="#">
                        Untitled Document
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div id="renderer" style={this.GetStyle()}>
                    <canvas id="studios.vanish.component.3D" style={this.GetStyle()}></canvas>
                    <canvas id="studios.vanish.component.2D" style={this.GetStyle()}></canvas>
                </div>
            </div>
        );
    }
}

export default App;
