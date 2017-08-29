import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Button, ButtonGroup, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Grid, Row, Col } from 'react-bootstrap';
import { Well } from 'react-bootstrap';
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
        this._event_onSignalNeighbor = this._event_onSignalNeighbor.bind(this);
        this._event_onURLChange = this._event_onURLChange.bind(this);
        this._event_modal_onNameChanged = this._event_modal_onNameChanged.bind(this);
        this._event_modal_onIDChanged = this._event_modal_onIDChanged.bind(this);
        this._event_modal_onLocationX = this._event_modal_onLocationX.bind(this);
        this._event_modal_onLocationY = this._event_modal_onLocationY.bind(this);
        this._event_modal_onLocationZ = this._event_modal_onLocationZ.bind(this);
        this._event_modal_onOk = this._event_modal_onOk.bind(this);
        this._event_modal_onDelete = this._event_modal_onDelete.bind(this);
        this._event_modal_onCreateNeighbor = this._event_modal_onCreateNeighbor.bind(this);
        this._event_modal_onDeleteNeighbor = this._event_modal_onDeleteNeighbor.bind(this);
        this._event_modal_onIsolateNeighbors = this._event_modal_onIsolateNeighbors.bind(this);
        this.CreateNeighbor = this.CreateNeighbor.bind(this);
        this.CreateNeighbors = this.CreateNeighbors.bind(this);
        window.addEventListener("_event_onSignalProperties", this._event_onSignalProperties);
        window.addEventListener("_event_onSignalNeighbor", this._event_onSignalNeighbor);
        window.addEventListener("_event_onURLChange", this._event_onURLChange);
    }
    componentWillMount()
    {
        this.setState({
            NavigationHeight: 0,
            BreadHeight: 0,
            Properties: false,
            SelectedNode: null,
            Camera: "0, 0, 0"
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
    CreateNeighbor(int, node)
    {
        return (            
            <InputGroup style={{ paddingBottom: 10 }}>
                <InputGroup.Addon>{int + 1}</InputGroup.Addon>
                <FormControl type="text" value={"pathTo={" + node.Neighbors[int].EndNode.ID + ", " + node.Neighbors[int].EndNode.Name + "}, distance={" + node.Neighbors[int].Distance + "}"} readOnly />
                <InputGroup.Button>
                    <Button href="#" bsStyle="danger" onClick={() => this._event_modal_onDeleteNeighbor(int)}><Glyphicon glyph="minus" /></Button>
                </InputGroup.Button>
            </InputGroup>
        )
    }
    CreateNeighbors()
    {
        if (this.state.Properties && this.state.SelectedNode.Neighbors.length > 0)
        {
            let node = this.state.SelectedNode;
            let itms = [];
            for (let i = 0; i < node.Neighbors.length; i++)
            {
                itms.push(this.CreateNeighbor(i, node));
            }
            return (
                <div>
                    {itms}
                </div>
            );
        }
        else
        {
            return (<p style={{ paddingTop: 10 }}>Looks like this node is a bit lonely. Add a neighbor association by clicking on the {"\""}+{"\""} button below and selecting another node.</p>)
        }
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
        let details = {
            key: eventKey
        };
        if (eventKey === "_navigation_node_bulkcreate")
        {
            let prompt = window.prompt("Shivan", 5);
            let num = 5;
            if (prompt == null || prompt == "")
            {
                num = 0;
            }
            else
            {
                num = parseInt(prompt);
            }
            details["number"] = num;
        }
        window.dispatchEvent(new CustomEvent("_event_navigation_select_", { detail: details }));
    }
    _event_onSignalProperties(event)
    {
        this.setState({
            Properties: true,
            SelectedNode: event.detail.node,
            SelectedNodeOldName: event.detail.node.Name,
            SelectedNodeOldID: event.detail.node.ID
        });
    }
    _event_onSignalNeighbor(event)
    {
        this.setState({
            Properties: true
        });
    }
    _event_onURLChange(event)
    {
        this.setState({
            Camera: event.detail.camera
        });
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
        this._event_modal_onIsolateNeighbors();
        window.dispatchEvent(new CustomEvent("_event_modal_delete_", { detail: {} }));
        this.setState({
            Properties: false,
            SelectedNode: null,
            SelectedNodeOldName: null,
            SelectedNodeOldID: null
        });
    }
    _event_modal_onCreateNeighbor(event)
    {
        window.dispatchEvent(new CustomEvent("_event_modal_createneighbor_", { detail: {} }));
        this.setState({
            Properties: false
        });
    }
    _event_modal_onDeleteNeighbor(event)
    {
        let node = this.state.SelectedNode;
        let endNode = node.Neighbors[event].EndNode;
        node.Neighbors.splice(event, 1);
        for (let i = 0; i < endNode.Neighbors.length; i++)
        {
            if (endNode.Neighbors[i].EndNode === node)
            {
                endNode.Neighbors.splice(i, 1);
                break;
            }
        }
        this.setState({
            SelectedNode: this.state.SelectedNode
        });
    }
    _event_modal_onIsolateNeighbors(event)
    {
        let node = this.state.SelectedNode;
        while (node.Neighbors.length > 0)
        {
            this._event_modal_onDeleteNeighbor(0);
        }
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
            top: this.state.NavigationHeight,
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
                <Well bsSize="small" style={{ position: "fixed", top: window.innerHeight - this.state.BreadHeight, width: "100%", borderRadius: 0, boxShadow: "none", textAlign: "right" }} ref={(e) => this.BreadBar = e}>
                    <div style={{ display: "inline", position: "relative", right: 10 }}>
                        {this.state.Camera}
                    </div>
                </Well>
                <div id="renderer" style={this.GetStyle()}>
                    <canvas id="studios.vanish.component.3D" style={this.GetStyle()}></canvas>
                    <canvas id="studios.vanish.component.2D" style={this.GetStyle()}></canvas>
                </div>
                <Modal bsSize="large" show={false}>
                    <Modal.Header closeButton>
                            <Modal.Title>Element Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <p>General</p>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Element
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>name</InputGroup.Addon>
                                        <FormControl type="text" value={""} placeholder={"name"} onChange={null} />
                                        <InputGroup.Addon>type</InputGroup.Addon>
                                        <FormControl type="text" value={""} placeholder={"type"} onChange={null} />
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Node
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>name</InputGroup.Addon>
                                        <FormControl type="text" value={""} placeholder={"name"} onChange={null} />
                                        <InputGroup.Addon>type</InputGroup.Addon>
                                        <FormControl type="text" value={""} placeholder={"type"} onChange={null} />
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(10, 10, 10, 0.10)" }}></FormGroup>
                            <p>Object</p>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Vertices
                                </Col>
                                <Col sm={10}>
                                    <InputGroup style={{ paddingBottom: 10 }}>
                                        <InputGroup.Addon>01</InputGroup.Addon>
                                        <InputGroup style={{ boxShadow: "none" }}>
                                            <InputGroup.Addon style={{ borderRadius: 0 }}>x</InputGroup.Addon>
                                            <FormControl type="text" value={""} placeholder={"0"} onChange={null} />
                                            <InputGroup.Addon>y</InputGroup.Addon>
                                            <FormControl type="text" value={""} placeholder={"0"} onChange={null} />
                                            <InputGroup.Addon>z</InputGroup.Addon>
                                            <FormControl style={{ borderRadius: 0 }} type="text" value={""} placeholder={"0"} onChange={null} />
                                        </InputGroup>
                                        <InputGroup style={{ boxShadow: "none" }}>
                                            <InputGroup.Addon style={{ paddingLeft: 13, paddingRight: 13, borderRadius: 0, }}>r</InputGroup.Addon>
                                            <FormControl type="text" value={""} placeholder={"0"} onChange={null} />
                                            <InputGroup.Addon style={{ paddingLeft: 12, paddingRight: 11 }}>g</InputGroup.Addon>
                                            <FormControl type="text" value={""} placeholder={"0"} onChange={null} />
                                            <InputGroup.Addon style={{ paddingLeft: 12, paddingRight: 11 }}>b</InputGroup.Addon>
                                            <FormControl style={{ borderRadius: 0 }} type="text" value={""} placeholder={"0"} onChange={null} />
                                        </InputGroup>
                                        <InputGroup.Button>
                                            <Button style={{ height: 68, paddingTop: "60%" }} href="#" bsStyle="danger" onClick={null}><Glyphicon glyph="minus" /></Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                    <div style={{ textAlign: "right", paddingTop: 0 }}>
                                        <ButtonGroup>
                                            <Button href="#" onClick={null}>Clear</Button>
                                            <Button href="#" onClick={null}>Create</Button>
                                            <Button href="#" bsStyle="success" onClick={null}><Glyphicon glyph="plus" /></Button>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Faces
                                </Col>
                                <Col sm={10}>
                                    <InputGroup style={{ paddingBottom: 10 }}>
                                        <InputGroup.Addon>index 01</InputGroup.Addon>
                                        <FormControl type="text" value={""} placeholder={""} onChange={null} />
                                        <InputGroup.Addon>index 02</InputGroup.Addon>
                                        <FormControl type="text" value={""} placeholder={""} onChange={null} />
                                        <InputGroup.Addon>index 03</InputGroup.Addon>
                                        <FormControl type="text" value={""} placeholder={""} onChange={null} />
                                        <InputGroup.Button>
                                            <Button href="#" bsStyle="danger" onClick={null}><Glyphicon glyph="minus" /></Button>
                                        </InputGroup.Button>
                                    </InputGroup>
                                    <div style={{ textAlign: "right", paddingTop: 0 }}>
                                        <ButtonGroup>
                                            <Button href="#" onClick={null}>Clear</Button>
                                            <Button href="#" bsStyle="success" onClick={null}><Glyphicon glyph="plus" /></Button>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(10, 10, 10, 0.10)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="danger" href="#" onClick={null}>Delete</Button>
                                    <Button bsStyle="success" href="#" onClick={null}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
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
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(10, 10, 10, 0.10)" }}></FormGroup>
                            <p>Advanced</p>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Neighbors
                                </Col>
                                <Col sm={10}>
                                    {this.CreateNeighbors()}    
                                    <div style={{ textAlign: "right", paddingTop: 0 }}>
                                        <ButtonGroup>
                                            <Button href="#" onClick={this._event_modal_onIsolateNeighbors}>Isolate</Button>
                                            <Button href="#" bsStyle="success" onClick={this._event_modal_onCreateNeighbor}><Glyphicon glyph="plus" /></Button>
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
