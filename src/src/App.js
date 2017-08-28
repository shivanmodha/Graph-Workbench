import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Button, ButtonGroup, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Grid, Row, Col } from 'react-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import { Alert, Glyphicon } from 'react-bootstrap';
import { Modal, FormGroup, FormControl, Form, InputGroup } from 'react-bootstrap';

const navigation = require('./configuration/navigation.json');

class App extends Component
{
    constructor(props)
    {
        super(props);
        this._event_onResize = this._event_onResize.bind(this);
        this._event_onNavigationSelect = this._event_onNavigationSelect.bind(this);
        this._event_onSignalProperties = this._event_onSignalProperties.bind(this);
        this._event_modal_onNameChanged = this._event_modal_onNameChanged.bind(this);
        this._event_modal_onIDChanged = this._event_modal_onIDChanged.bind(this);
        this._event_modal_onLocationX = this._event_modal_onLocationX.bind(this);
        this._event_modal_onLocationY = this._event_modal_onLocationY.bind(this);
        this._event_modal_onLocationZ = this._event_modal_onLocationZ.bind(this);
        this._event_modal_onOk = this._event_modal_onOk.bind(this);
        this._event_modal_onDelete = this._event_modal_onDelete.bind(this);
        window.addEventListener("_event_onSignalProperties", this._event_onSignalProperties);
    }
    componentWillMount()
    {
        this.setState({
            NavigationHeight: 0,
            BreadHeight: 0,
            Properties: false,
            SelectedNode: null
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
                <Nav pullLeft onSelect={this._event_onNavigationSelect}> {links["left"]} </Nav>
                <Nav pullRight onSelect={this._event_onNavigationSelect}> {links["right"]} </Nav>
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
    _event_onNavigationSelect(eventKey)
    {
        window.dispatchEvent(new CustomEvent("_event_navigation_select_", { detail: { key: eventKey } }));
    }
    _event_onSignalProperties(event)
    {
        this.setState({
            Properties: true,
            SelectedNode: event.detail.node,
            SelectedNodeOldName: event.detail.node.Name,
            SelectedNodeOldID: event.detail.node.ID
        });
        console.log(event.detail.node);
    }
    _event_modal_onNameChanged(event)
    {
        this.state.SelectedNode.Name = event.target.value;
        this.setState({
            SelectedNode: this.state.SelectedNode
        });
    }
    _event_modal_onIDChanged(event)
    {
        this.state.SelectedNode.ID = event.target.value;
        this.setState({
            SelectedNode: this.state.SelectedNode
        });
    }
    _event_modal_onLocationX(event)
    {
        this.state.SelectedNode.Location.X = event.target.value;
        this.setState({
            SelectedNode: this.state.SelectedNode
        });
    }
    _event_modal_onLocationY(event)
    {
        this.state.SelectedNode.Location.Y = event.target.value;
        this.setState({
            SelectedNode: this.state.SelectedNode
        });
    }
    _event_modal_onLocationZ(event)
    {
        this.state.SelectedNode.Location.Z = event.target.value;
        this.setState({
            SelectedNode: this.state.SelectedNode
        });
    }
    _event_modal_onOk(event)
    {
        window.dispatchEvent(new CustomEvent("_event_modal_ok_", { detail: {} }));
        this.setState({
            Properties: false,
            SelectedNode: null,
            SelectedNodeOldName: null,
            SelectedNodeOldID: null
        });
    }
    _event_modal_onDelete(event)
    {
        window.dispatchEvent(new CustomEvent("_event_modal_delete_", { detail: {} }));
        this.setState({
            Properties: false,
            SelectedNode: null,
            SelectedNodeOldName: null,
            SelectedNodeOldID: null
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
        let node_name = "";
        let node_name_old = "";
        let node_id = "";
        let node_id_old = "";
        let node_location_x = null;
        let node_location_y = null;
        let node_location_z = null;
        if (this.state.SelectedNode)
        {
            node_name_old = this.state.SelectedNodeOldName;
            node_id_old = this.state.SelectedNodeOldID;
            if (this.state.SelectedNode.Name === this.state.SelectedNodeOldName)
            {
                node_name = "";
            }
            else if (this.state.SelectedNode.Name === "")
            {
                node_name = "";
                this.state.SelectedNode.Name = this.state.SelectedNodeOldName;
            }
            else
            {
                node_name = this.state.SelectedNode.Name;
            }
            if (this.state.SelectedNode.ID === this.state.SelectedNodeOldID)
            {
                node_id = "";
            }
            else if (this.state.SelectedNode.ID === "")
            {
                node_id = "";
                this.state.SelectedNode.ID = this.state.SelectedNodeOldID;
            }
            else
            {
                node_id = this.state.SelectedNode.ID;
            }
            node_location_x = this.state.SelectedNode.Location.X;
            node_location_y = this.state.SelectedNode.Location.Y;
            node_location_z = this.state.SelectedNode.Location.Z;
        }
        return (
            <div>
                <Navbar fluid style={{ position: "fixed", top: 0 }} ref={(e) => this.NavigationBar = e} fixedTop>
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
                <Modal show={this.state.Properties} onHide={this._event_modal_onOk}>
                    <Modal.Header closeButton>
                        <Modal.Title>Node Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <p>General</p>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Node
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>id</InputGroup.Addon>
                                        <FormControl type="text" value={node_id} placeholder={node_id_old} onChange={this._event_modal_onIDChanged} />
                                        <InputGroup.Addon>name</InputGroup.Addon>
                                        <FormControl type="text" value={node_name} placeholder={node_name_old} onChange={this._event_modal_onNameChanged} />
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Location
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>x</InputGroup.Addon>
                                        <FormControl type="number" value={node_location_x} placeholder="x" onChange={this._event_modal_onLocationX} />
                                        <InputGroup.Addon>y</InputGroup.Addon>
                                        <FormControl type="number" value={node_location_y} placeholder="y" onChange={this._event_modal_onLocationY} />
                                        <InputGroup.Addon>z</InputGroup.Addon>
                                        <FormControl type="number" value={node_location_z} placeholder="z" onChange={this._event_modal_onLocationZ} />
                                    </InputGroup>
                                    <div style={{ textAlign: "left", paddingTop: 15 }}>
                                        <ButtonGroup>
                                            <Button href="#">Center Camera</Button>
                                        </ButtonGroup>    
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(10, 10, 10, 0.10)" }}></FormGroup>
                            <p>Advanced</p>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Neighbors
                                </Col>
                                <Col sm={10}>
                                    <InputGroup style={{ paddingBottom: 10 }}>
                                        <InputGroup.Addon>01</InputGroup.Addon>
                                        <FormControl type="text" value="pathTo=n:02, distance=1.0" readonly />
                                        <InputGroup.Button>
                                                <Button href="#"><Glyphicon glyph="edit" /></Button>
                                                <Button href="#" bsStyle="danger"><Glyphicon glyph="remove" /></Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                    <div style={{ textAlign: "left", paddingTop: 0 }}>
                                        <ButtonGroup>
                                            <Button href="#">Clear</Button>
                                            <Button href="#" bsStyle="success">Create</Button>
                                        </ButtonGroup>    
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Element
                                </Col>
                                <Col sm={10}>
                                    <div style={{ textAlign: "right", paddingBottom: 10 }}>
                                        <ButtonGroup>
                                            <Button href="#">Bind Element</Button>
                                        </ButtonGroup>    
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(10, 10, 10, 0.10)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="danger" href="#" onClick={this._event_modal_onDelete}>Delete</Button>
                                    <Button bsStyle="success" href="#" onClick={this._event_modal_onOk}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default App;
