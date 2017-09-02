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
        this._event_onSignalElements = this._event_onSignalElements.bind(this);
        this._event_onSignalBind = this._event_onSignalBind.bind(this);
        this._event_onSignalURL = this._event_onSignalURL.bind(this);
        this._event_onSignalAbout = this._event_onSignalAbout.bind(this);
        this._event_onSignalCodeInjection = this._event_onSignalCodeInjection.bind(this);
        this._event_onSignalShowInject = this._event_onSignalShowInject.bind(this);
        this._event_onSignalCamera = this._event_onSignalCamera.bind(this);
        this._event_onSignalFloors = this._event_onSignalFloors.bind(this);
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
        this._event_modal_onElementNameChange = this._event_modal_onElementNameChange.bind(this);
        this._event_modal_onElementTypeChange = this._event_modal_onElementTypeChange.bind(this);
        this._event_modal_onElementAddVertex = this._event_modal_onElementAddVertex.bind(this);
        this._event_modal_onElementAddIndex = this._event_modal_onElementAddIndex.bind(this);
        this._event_modal_onElementToggle = this._event_modal_onElementToggle.bind(this);
        this._event_modal_onDeleteElement = this._event_modal_onDeleteElement.bind(this);
        this._event_modal_onElementBind = this._event_modal_onElementBind.bind(this);
        this.CreateNeighbor = this.CreateNeighbor.bind(this);
        this.CreateNeighbors = this.CreateNeighbors.bind(this);
        this.CreateVertex = this.CreateVertex.bind(this);
        this.CreateVertices = this.CreateVertices.bind(this);
        this.CreateVerticesContainer = this.CreateVerticesContainer.bind(this);
        this.CreateIndex = this.CreateIndex.bind(this);
        this.CreateIndices = this.CreateIndices.bind(this);
        this.CreateIndicesContainer = this.CreateIndicesContainer.bind(this);
        this.CreateFloor = this.CreateFloor.bind(this);
        this.CreateFloors = this.CreateFloors.bind(this);
        window.addEventListener("_event_onSignalProperties", this._event_onSignalProperties);
        window.addEventListener("_event_onSignalNeighbor", this._event_onSignalNeighbor);
        window.addEventListener("_event_onURLChange", this._event_onURLChange);
        window.addEventListener("_event_onSignalElements", this._event_onSignalElements);
        window.addEventListener("_event_onSignalBind", this._event_onSignalBind);
        window.addEventListener("_event_onSignalURL", this._event_onSignalURL);
        window.addEventListener("_event_onSignalAbout", this._event_onSignalAbout);
        window.addEventListener("_event_onSignalCodeInjection", this._event_onSignalCodeInjection);
        window.addEventListener("_event_onSignalShowInject", this._event_onSignalShowInject);
        window.addEventListener("_event_onSignalCamera", this._event_onSignalCamera);
        window.addEventListener("_event_onSignalFloors", this._event_onSignalFloors);
    }
    componentWillMount()
    {
        let wlc = true;
        if (window.location.href.includes("graph"))
        {
            wlc = false;
        }
        this.setState({
            NavigationHeight: 0,
            BreadHeight: 0,
            Properties: false,
            SelectedNode: null,
            Camera: "0, 0, 0",
            StartNode: null,
            EndNode: null,
            Element_Properties: false,
            SelectedElement: null,
            Element_CodeCreate: false,
            Welcome: wlc,
            showurl: false,
            url: "",
            about: false,
            bulkcreate: false,
            number: 5,
            ShowCodeInjection: false,
            CodeInjection: false,
            cinj: "",
            cam: null,
            showCamera: false,
            floor: 1,
            floors: [["Default", -100, 100]],
            showFloor: false
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
    CreateVertex(int, element)
    {
        return (
            <InputGroup style={{ paddingBottom: 10 }}>
                <InputGroup.Addon>{int}</InputGroup.Addon>
                <InputGroup style={{ boxShadow: "none" }}>
                    <InputGroup.Addon style={{ borderRadius: 0 }}>x</InputGroup.Addon>
                    <FormControl type="number" value={element.Object.Vertices[int].X} onChange={(event) =>
                    {
                        element.Object.Vertices[int].X = event.target.value;
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }} />
                    <InputGroup.Addon>y</InputGroup.Addon>
                    <FormControl type="number" value={element.Object.Vertices[int].Y} onChange={(event) =>
                    {
                        element.Object.Vertices[int].Y = event.target.value;
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }} />
                    <InputGroup.Addon>z</InputGroup.Addon>
                    <FormControl style={{ borderRadius: 0 }} type="number" value={element.Object.Vertices[int].Z} onChange={(event) =>
                    {
                        element.Object.Vertices[int].Z = event.target.value;
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }} />
                </InputGroup>
                <InputGroup style={{ boxShadow: "none" }}>
                    <InputGroup.Addon style={{ paddingLeft: 13, paddingRight: 13, borderRadius: 0 }}>r</InputGroup.Addon>
                    <FormControl type="number" value={element.Object.Vertices[int].R} onChange={(event) =>
                    {
                        element.Object.Vertices[int].R = event.target.value;
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }} />
                    <InputGroup.Addon style={{ paddingLeft: 12, paddingRight: 11 }}>g</InputGroup.Addon>
                    <FormControl type="number" value={element.Object.Vertices[int].G} onChange={(event) =>
                    {
                        element.Object.Vertices[int].G = event.target.value;
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }} />
                    <InputGroup.Addon style={{ paddingLeft: 12, paddingRight: 11 }}>b</InputGroup.Addon>
                    <FormControl style={{ borderRadius: 0 }} type="number" value={element.Object.Vertices[int].B} onChange={(event) =>
                    {
                        element.Object.Vertices[int].B = event.target.value;
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }} />
                </InputGroup>
                <InputGroup.Button>
                    <Button style={{ height: 68, paddingTop: "65%" }} href="#" bsStyle="danger" onClick={(event) =>
                    {
                        element.Object.Vertices.splice(int, 1);
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }}><Glyphicon glyph="minus" /></Button>
                </InputGroup.Button>
            </InputGroup>
        )
    }
    CreateVertices()
    {
        if (this.state.Element_Properties && this.state.SelectedElement.Object.Vertices.length > 0)
        {
            let element = this.state.SelectedElement;
            let itms = [];
            for (let i = 0; i < element.Object.Vertices.length; i++)
            {
                itms.push(this.CreateVertex(i, element));
            }
            return (
                <div>
                    {itms}
                </div>
            )
        }
        else
        {
            return (<p style={{ paddingTop: 10 }}>Add vertices by clicking on the "+" button below</p>)
        }
    }
    CreateVerticesContainer()
    {
        if (!this.state.Element_CodeCreate)
        {
            return (
                <div>
                    {this.CreateVertices()}
                    <div style={{ textAlign: "right", paddingTop: 0 }}>
                        <ButtonGroup>
                            <Button href="#" bsStyle="success" onClick={this._event_modal_onElementAddVertex}><Glyphicon glyph="plus" /></Button>
                        </ButtonGroup>
                    </div >
                </div>
            );
        }
        else
        {
            return (
                <FormControl style={{ resize: "vertical", height: 200, fontFamily: "monospace" }} componentClass="textarea" type="text" value={this.state.Element_Vertex_Code} placeholder="vertex code here" onChange={(event) =>
                {
                    window.dispatchEvent(new CustomEvent("_event_element_executevertexcode_", { detail: { element: this.state.SelectedElement, code: event.target.value } }));
                    this.setState({
                        Element_Vertex_Code: event.target.value
                    });
                }} />
            );
        }
    }
    CreateIndex(int, element)
    {
        return (
            <InputGroup style={{ paddingBottom: 10 }}>
                <InputGroup.Addon>index 01</InputGroup.Addon>
                <FormControl type="number" value={element.Object.Indices[int].indices[0]} placeholder={""} onChange={(event) =>
                {
                    element.Object.Indices[int].indices[0] = event.target.value;
                    window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                    this.setState({
                        SelectedElement: this.state.SelectedElement
                    });
                }} />
                <InputGroup.Addon>index 02</InputGroup.Addon>
                <FormControl type="number" value={element.Object.Indices[int].indices[1]} placeholder={""} onChange={(event) =>
                {
                    element.Object.Indices[int].indices[1] = event.target.value;
                    window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                    this.setState({
                        SelectedElement: this.state.SelectedElement
                    });
                }} />
                <InputGroup.Addon>index 03</InputGroup.Addon>
                <FormControl type="number" value={element.Object.Indices[int].indices[2]} placeholder={""} onChange={(event) =>
                {
                    element.Object.Indices[int].indices[2] = event.target.value;
                    window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                    this.setState({
                        SelectedElement: this.state.SelectedElement
                    });
                }} />
                <InputGroup.Button>
                    <Button href="#" bsStyle="danger" onClick={(event) =>
                    {
                        element.Object.Indices.splice(int, 1);
                        window.dispatchEvent(new CustomEvent("_event_rebuild_element_", { detail: {element: element} }));
                        this.setState({
                            SelectedElement: this.state.SelectedElement
                        });
                    }}><Glyphicon glyph="minus" /></Button>
                </InputGroup.Button>
            </InputGroup>
        )
    }
    CreateIndices()
    {
        if (this.state.Element_Properties && this.state.SelectedElement.Object.Indices.length > 0)
        {
            let element = this.state.SelectedElement;
            let itms = [];
            for (let i = 0; i < element.Object.Indices.length; i++)
            {
                itms.push(this.CreateIndex(i, element));
            }
            return (
                <div>
                    {itms}
                </div>
            )
        }
        else
        {
            return (<p style={{ paddingTop: 10 }}>Add indices by clicking on the "+" button below</p>)
        }
    }
    CreateIndicesContainer()
    {
        if (!this.state.Element_CodeCreate)
        {
            return (
                <div>
                    {this.CreateIndices()}
                    <div style={{ textAlign: "right", paddingTop: 0 }}>
                        <ButtonGroup>
                            <Button href="#" bsStyle="success" onClick={this._event_modal_onElementAddIndex}><Glyphicon glyph="plus" /></Button>
                        </ButtonGroup>
                    </div>
                </div>
            );
        }
        else
        {
            return (
                <FormControl style={{ resize: "vertical", height: 200, fontFamily: "monospace" }} componentClass="textarea" type="text" value={this.state.Element_Index_Code} placeholder="index code here" onChange={(event) =>
                {
                    window.dispatchEvent(new CustomEvent("_event_element_executeindexcode_", { detail: { element: this.state.SelectedElement, code: event.target.value } }));
                    this.setState({
                        Element_Index_Code: event.target.value
                    });
                }} />
            );
        }
    }
    CreateFloor(i)
    {
        return (
            <InputGroup style={{ paddingBottom: 10 }}>
                <InputGroup.Addon>Name</InputGroup.Addon>
                <FormControl type="text" value={this.state.floors[i][0]} placeholder={"name"} onChange={(event) => { this.state.floors[i][0] = event.target.value; this.setState({ floors: this.state.floors }); }} />
                <InputGroup.Addon>Min Z</InputGroup.Addon>
                <FormControl type="text" value={this.state.floors[i][1]} placeholder={"minimum z"} onChange={(event) => { this.state.floors[i][1] = event.target.value; this.setState({ floors: this.state.floors }); }} />
                <InputGroup.Addon>Max Z</InputGroup.Addon>
                <FormControl type="text" value={this.state.floors[i][2]} placeholder={"maximum z"} onChange={(event) => { this.state.floors[i][2] = event.target.value; this.setState({ floors: this.state.floors }); }} />
                <InputGroup.Button>
                    <Button href="#" bsStyle="danger" onClick={() => { if (i != 0) { this.state.floors.splice(i, 1); } this.setState({ floors: this.state.floors }); }}><Glyphicon glyph="minus" /></Button>
                </InputGroup.Button>
            </InputGroup>
        );
    }
    CreateFloors()
    {
        let itms = [];
        for (let i = 0; i < this.state.floors.length; i++)
        {
            itms.push(this.CreateFloor(i));
        }
        return (
            <div>
                {itms}
            </div>
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
        if (this.state.CodeInjection)
        {
            links["right"].push(<NavItem eventKey={"_navigation_inject"} href={"#"}>{"Inject"}</NavItem>);
        }
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
            /*let prompt = window.prompt("How many nodes do you want to create?", 5);
            let num = 5;
            if (prompt == null || prompt == "")
            {
                num = 0;
            }
            else
            {
                num = parseInt(prompt);
            }*/
            this.setState({
                bulkcreate: true,
                number: 5
            });
            details["key"] = "NOTHING TO SEE HERE! XD";
        }
        else if (eventKey === "_navigation_node_bulkcreate_post")
        {
            details["key"] = "_navigation_node_bulkcreate";
            details["number"] = this.state.number;
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
            Camera: event.detail.camera,
            StartNode: event.detail.startNode,
            EndNode: event.detail.endNode
        });
    }
    _event_onSignalElements(event)
    {
        this.setState({
            Element_Properties: true,
            SelectedElement: event.detail.element,
            SelectedElementOldName: event.detail.element.Name,
            SelectedElementOldType: event.detail.element.Type
        });
        if (this.state.Element_CodeCreate)
        {
            let vCode = "";
            for (let i = 0; i < event.detail.element.Object.Vertices.length; i++)
            {
                let child = event.detail.element.Object.Vertices[i];
                if (i > 0)
                {
                    vCode += ",\n";
                }
                vCode += "[" + child.X + ", " + child.Y + ", " + child.Z + ", " + child.R + ", " + child.G + ", " + child.B + ", " + child.A + "]";
            }
            let iCode = "";
            for (let i = 0; i < event.detail.element.Object.Indices.length; i++)
            {
                let child = event.detail.element.Object.Indices[i];
                if (i > 0)
                {
                    iCode += ",\n";
                }
                iCode += "[" + child.indices[0] + ", " + child.indices[1] + ", " + child.indices[2] + "]";
            }
            this.setState({
                Element_CodeCreate: true,
                Element_Vertex_Code: vCode,
                Element_Index_Code: iCode
            });
        }
    }
    _event_onSignalBind(event)
    {
        this.state.SelectedElement.BindToNode(event.detail.node);
        this.setState({
            Element_Properties: true
        });
    }
    _event_onSignalURL(event)
    {
        this.setState({
            showurl: true,
            url: event.detail.url
        });
    }
    _event_onSignalAbout(event)
    {
        this.setState({
            about: true
        });
    }
    _event_onSignalCodeInjection(event)
    {
        this.setState({
            CodeInjection: true
        });
    }
    _event_onSignalShowInject(event)
    {
        this.setState({
            ShowCodeInjection: true,
            cinj: event.detail.cinj
        });
    }
    _event_onSignalCamera(event)
    {
        this.setState({
            showCamera: true,
            cam: event.detail.camera
        });
    }
    _event_onSignalFloors(event)
    {
        this.setState({
            showFloor: true,
            floor: event.detail.floor,
            floors: event.detail.floors
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
            SelectedNodeOldID: null,
            Element_Properties: false,
            SelectedElement: null,
            SelectedElementOldName: null,
            SelectedElementOldID: null
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
    _event_modal_onElementNameChange(event)
    {
        this.state.SelectedElement.Name = event.target.value;
        this.setState({
            SelectedElement: this.state.SelectedElement
        });
    }
    _event_modal_onElementTypeChange(event)
    {
        this.state.SelectedElement.Type = event.target.value;
        this.setState({
            SelectedElement: this.state.SelectedElement
        });
    }
    _event_modal_onElementAddVertex(event)
    {
        window.dispatchEvent(new CustomEvent("_event_element_addvertex_", { detail: { element: this.state.SelectedElement } }));
        this.setState({
            SelectedElement: this.state.SelectedElement
        });
    }
    _event_modal_onElementAddIndex(event)
    {
        window.dispatchEvent(new CustomEvent("_event_element_addindex_", { detail: { element: this.state.SelectedElement } }));
        this.setState({
            SelectedElement: this.state.SelectedElement
        });
    }
    _event_modal_onElementToggle(event)
    {
        let cm = false;
        let wf = false;
        for (let i = 0; i < event.length; i++)
        {
            if (event[i] === 1)
            {
                wf = true;
                this.state.SelectedElement.Object.RenderMode = "WireFrame";
            }
            else if (event[i] === 2)
            {
                cm = true;
                let vCode = "";
                for (let i = 0; i < this.state.SelectedElement.Object.Vertices.length; i++)
                {
                    let child = this.state.SelectedElement.Object.Vertices[i];
                    if (i > 0)
                    {
                        vCode += ",\n";
                    }
                    vCode += "[" + child.X + ", " + child.Y + ", " + child.Z + ", " + child.R + ", " + child.G + ", " + child.B + ", " + child.A + "]";
                }
                let iCode = "";
                for (let i = 0; i < this.state.SelectedElement.Object.Indices.length; i++)
                {
                    let child = this.state.SelectedElement.Object.Indices[i];
                    if (i > 0)
                    {
                        iCode += ",\n";
                    }
                    iCode += "[" + child.indices[0] + ", " + child.indices[1] + ", " + child.indices[2] + "]";
                }
                this.setState({
                    Element_CodeCreate: true,
                    Element_Vertex_Code: vCode,
                    Element_Index_Code: iCode
                });
            }
        }
        if (!wf)
        {
            this.state.SelectedElement.Object.RenderMode = "Solid";
        }
        if (!cm)
        {
            this.setState({
                Element_CodeCreate: false,
            });
        }
    }
    _event_modal_onDeleteElement(event)
    {
        window.dispatchEvent(new CustomEvent("_event_modal_element_delete_", { detail: {} }));
        this.setState({
            Element_Properties: false,
            SelectedElement: null,
            SelectedElementOldName: null,
            SelectedElementOldID: null
        });
    }
    _event_modal_onElementBind(event)
    {
        window.dispatchEvent(new CustomEvent("_event_modal_bindtonode_", { detail: { element: this.state.SelectedElement} }));
        this.setState({
            Element_Properties: false
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
            top: this.state.NavigationHeight,
            width: "100%",
            height: window.innerHeight - this.state.NavigationHeight - this.state.BreadHeight,
            border: 0,
            padding: 0,
            margin: 0,
            cursor: "none"
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
        let tbgdefault = [];
        let element_name = "";
        let element_name_old = "";
        let element_type = "";
        let element_type_old = "";
        let element_node_id = "";
        let element_node_name = "";
        let element_node_location = "";
        let warning = "This element is not binded to a node!";
        if (this.state.SelectedElement)
        {
            if (this.state.SelectedElement.Object.RenderMode === "WireFrame")
            {
                tbgdefault.push(1);
            }
            element_name_old = this.state.SelectedElementOldName;
            element_type_old = this.state.SelectedElementOldType;
            if (this.state.SelectedElement.Name === this.state.SelectedElementOldName)
            {
                element_name = "";
            }
            else if (this.state.SelectedElement.Name === "")
            {
                element_name = "";
                this.state.SelectedElement.Name = this.state.SelectedElementOldName;
            }
            else
            {
                element_name = this.state.SelectedElement.Name;
            }
            if (this.state.SelectedElement.Type === this.state.SelectedElementOldType)
            {
                element_type = "";
            }
            else if (this.state.SelectedElement.Type === "")
            {
                element_type = "";
                this.state.SelectedElement.Type = this.state.SelectedElementOldType;
            }
            else
            {
                element_type = this.state.SelectedElement.Type;
            }
            if (this.state.SelectedElement.Node)
            {
                warning = "";
                element_node_id = this.state.SelectedElement.Node.ID;
                element_node_name = this.state.SelectedElement.Node.Name;
                element_node_location = "(" + this.state.SelectedElement.Node.Location.X + ", " + this.state.SelectedElement.Node.Location.Y + ", " + this.state.SelectedElement.Node.Location.Z + ")";
            }
            if (this.state.Element_CodeCreate)
            {
                tbgdefault.push(2);
            }
        }
        let sn = "null";
        let en = "null";
        if (this.state.StartNode)
        {
            sn = this.state.StartNode.Name;
        }
        if (this.state.EndNode)
        {
            en = this.state.EndNode.Name;
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
                    <div style={{ display: "inline", position: "absolute", right: 5, bottom: 0 }}>
                        {this.state.Camera}
                    </div>
                    <div style={{ display: "inline", position: "absolute", right: 175, bottom: 0 }}>
                        {/*|*/}
                    </div>
                    <div style={{ display: "inline", position: "absolute", left: 5, bottom: 0 }}>
                        Start: {sn}
                    </div>
                    <div style={{ display: "inline", position: "absolute", left: 150, bottom: 0 }}>
                        End: {en}
                    </div>
                </Well>
                <div id="renderer" style={this.GetStyle()}>
                    <canvas id="studios.vanish.component.3D" style={this.GetStyle()}></canvas>
                    <canvas id="studios.vanish.component.2D" style={this.GetStyle()}></canvas>
                </div>
                <Modal show={this.state.showCamera} onHide={() => { this.state.cam.Location.X = parseFloat(this.state.cam.Location.X); this.state.cam.Location.Y = parseFloat(this.state.cam.Location.Y); this.state.cam.Location.Z = parseFloat(this.state.cam.Location.Z); this.state.cam.Rotation.X = parseFloat(this.state.cam.Rotation.X); this.state.cam.Rotation.Y = parseFloat(this.state.cam.Rotation.Y); this.state.cam.Rotation.Z = parseFloat(this.state.cam.Rotation.Z); this.setState({ showCamera: false }); }}>
                    <Modal.Header>
                        <Modal.Title>Camera</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Location
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>x</InputGroup.Addon>
                                        <FormControl type="text" value={(() => { if (this.state.cam) { return this.state.cam.Location.X; } else { return ""; } })()} placeholder={node_id_old} onChange={(event) => { try { this.state.cam.Location.X = event.target.value; } catch (e) { } this.setState({ cam: this.state.cam }); }} />
                                        <InputGroup.Addon>y</InputGroup.Addon>
                                        <FormControl type="text" value={(() => { if (this.state.cam) { return this.state.cam.Location.Y; } else { return ""; } })()} placeholder={node_name_old} onChange={(event) => { try { this.state.cam.Location.Y = event.target.value; } catch (e) { } this.setState({ cam: this.state.cam }); }} />
                                        <InputGroup.Addon>z</InputGroup.Addon>
                                        <FormControl type="text" value={(() => { if (this.state.cam) { return this.state.cam.Location.Z; } else { return ""; } })()} placeholder={node_name_old} onChange={(event) => { try { this.state.cam.Location.Z = event.target.value; } catch (e) { } this.setState({ cam: this.state.cam }); }} />
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Rotation
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>x</InputGroup.Addon>
                                        <FormControl type="text" value={(() => { if (this.state.cam) { return this.state.cam.Rotation.X; } else { return ""; } })()} placeholder={node_id_old} onChange={(event) => { try { this.state.cam.Rotation.X = event.target.value; } catch (e) { } this.setState({ cam: this.state.cam }); }} />
                                        <InputGroup.Addon>y</InputGroup.Addon>
                                        <FormControl type="text" value={(() => { if (this.state.cam) { return this.state.cam.Rotation.Y; } else { return ""; } })()} placeholder={node_name_old} onChange={(event) => { try { this.state.cam.Rotation.Y = event.target.value; } catch (e) { } this.setState({ cam: this.state.cam }); }} />
                                        <InputGroup.Addon>z</InputGroup.Addon>
                                        <FormControl type="text" value={(() => { if (this.state.cam) { return this.state.cam.Rotation.Z; } else { return ""; } })()} placeholder={node_name_old} onChange={(event) => { try { this.state.cam.Rotation.Z = event.target.value; } catch (e) { } this.setState({ cam: this.state.cam }); }} />
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ marginTop: 10, height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="success" href="#" onClick={() => { this.state.cam.Location.X = parseFloat(this.state.cam.Location.X); this.state.cam.Location.Y = parseFloat(this.state.cam.Location.Y); this.state.cam.Location.Z = parseFloat(this.state.cam.Location.Z); this.state.cam.Rotation.X = parseFloat(this.state.cam.Rotation.X); this.state.cam.Rotation.Y = parseFloat(this.state.cam.Rotation.Y); this.state.cam.Rotation.Z = parseFloat(this.state.cam.Rotation.Z); this.setState({ showCamera: false }); }}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showFloor} onHide={() => { this.setState({ showFloor: false }); }}>
                    <Modal.Header>
                        <Modal.Title>Floors</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Selected Floor
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="number" value={this.state.floor} placeholder={"floor number"} onChange={(event) => { this.setState({ floor: event.target.value }); window.dispatchEvent(new CustomEvent("_event_onSignalFloorChange", { detail: { floor: event.target.value } })); }} />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Floors
                                </Col>
                                <Col sm={10}>
                                    {this.CreateFloors()}
                                    <div style={{ textAlign: "right" }}>
                                        <ButtonGroup>
                                            <Button bsStyle="success" href="#" onClick={() => { this.state.floors.push(["New Floor", -1, 1]); this.setState({ floors: this.state.floors }); }}><Glyphicon glyph="plus" /></Button>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ marginTop: 10, height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="success" href="#" onClick={() => { this.setState({ showFloor: false }); }}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.ShowCodeInjection} onHide={() => { this.setState({ ShowCodeInjection: false }); }}>
                    <Modal.Header>
                        <Modal.Title>Inject</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Code
                                </Col>
                                <Col sm={10}>
                                    <FormControl style={{ resize: "vertical", height: 200, fontFamily: "monospace" }} componentClass="textarea" type="text" value={this.state.cinj} placeholder="inject code directly to the renderer here" onChange={(event) => { this.setState({ cinj: event.target.value }); window.dispatchEvent(new CustomEvent("_event_onInjectChange", { detail: { cinj: event.target.value } })); }} />
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ marginTop: 10, height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="success" href="#" onClick={() => { this.setState({ ShowCodeInjection: false }); }}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.bulkcreate} onHide={() => { this.setState({ bulkcreate: false }); }}>
                    <Modal.Header>
                        <Modal.Title>Bulk Create</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Nodes
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="number" value={this.state.number} placeholder="How many nodes do you want to create?" onChange={(event) => { this.setState({ number: event.target.value }); }} />
                                    <FormControl style={{ display: "none" }} type="number" value={this.state.number} placeholder="How many nodes do you want to create?" onChange={(event) => { this.setState({ number: event.target.value }); }} />
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ marginTop: 10, height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="danger" href="#" onClick={() => { this.setState({ bulkcreate: false }); }}>Cancel</Button>
                                    <Button bsStyle="success" href="#" onClick={() => { this.setState({ bulkcreate: false }); this._event_onNavigationSelect("_navigation_node_bulkcreate_post"); }}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showurl} onHide={() => { this.setState({ showurl: false }); }}>
                    <Modal.Header>
                        <Modal.Title>Link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormControl style={{ resize: "vertical", height: 200, fontFamily: "monospace" }} componentClass="textarea" type="text" value={this.state.url} placeholder="vertex code here" readOnly />
                            <FormGroup style={{ marginTop: 10, height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="success" href="#" onClick={() => { this.setState({ showurl: false }); }}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.about} onHide={() => { this.setState({ about: false }); }}>
                    <Modal.Header>
                        <Modal.Title>About</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <div style={{ color: "#66afe9", paddingTop: 0, marginTop: 0 }}>
                                <h3 style={{ paddingTop: 0, marginTop: 0 }}>Release Notes</h3>
                                <p>Version: 1.0.4</p>
                                <h4>New Features</h4>
                                <ul>
                                    <li>Graph Floor Implementation</li>
                                    <li>Camera Control</li>
                                </ul>
                                <h4>Bug Fixes</h4>
                                <ul>
                                    <li>Unclickable Node Elements</li>
                                </ul>
                                <p style={{ textAlign: "left" }}>Developed by Shivan Modha, <i>Vanish Studios</i></p>
                            </div>
                            <FormGroup style={{ marginTop: 10, height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button href="https://shivanmodha.github.io/">Home</Button>
                                    <Button href="https://github.com/shivanmodha/">GitHub</Button>
                                    <Button bsStyle="success" href="#" onClick={() => { this.setState({ about: false }); }}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.Welcome}>
                    <Modal.Header>
                        <Modal.Title>Welcome to Graph Workbench</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <div style={{ color: "#66afe9", paddingTop: 0, marginTop: 0 }}>
                                <h3 style={{ paddingTop: 0, marginTop: 0 }}>Getting Started</h3>
                                <p style={{ textAlign: "justify" }}>
                                    Welcome to Graph Workbench, an online utility for creating 3D graphs.
                                    To get started, click on the "Blank Template" button below, and create a few
                                    nodes (<kbd>Node > Create</kbd>). Move them around and arrange them
                                    in anyway possible by using the arrow keys, or defining their location
                                    through the porperties window (<kbd>i</kbd> keyboard shortcut or
                                    navigation link <kbd>Node > Inspect</kbd>).You can also add neighbor
                                    associations through the node property window as well.
                                </p>
                                <h3>Templates</h3>
                                <h4>Standard</h4>
                            </div>
                            <ButtonGroup>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#" onClick={() => { this.setState({ Welcome: false }); }}>Blank</Button>
                            </ButtonGroup>
                            {/*<code>
                                <h4>Grids</h4>
                            </code>
                            <ButtonGroup>
                                <Button style={{ borderRadius: 0, width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">2 x 2</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">3 x 3</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">4 x 4</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">5 x 5</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">10 x 10</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">2 x 2 x 2</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">3 x 3 x 3</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">4 x 4 x 4</Button>
                                <Button style={{ width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">5 x 5 x 5</Button>
                                <Button style={{ borderRadius: 0, width: 100, height: 100, textAlign: "center", verticalAlign: "middle" }} href="#">10 x 10 x 10</Button>
                            </ButtonGroup>*/}
                            <FormGroup style={{ marginTop: 10, height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button href="https://shivanmodha.github.io/">Home</Button>
                                    <Button href="https://github.com/shivanmodha/">GitHub</Button>
                                    <Button href="#" onClick={() => { this.setState({ Welcome: false }); this._event_onNavigationSelect("_navigation_file_open"); }}>Open</Button>
                                    <Button bsStyle="success" href="#" onClick={() => { this.setState({ Welcome: false }); }}>Blank Template</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal bsSize="large" show={this.state.Element_Properties} onHide={this._event_modal_onOk}>
                    <Modal.Header>
                            <Modal.Title>Element Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Element
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>name</InputGroup.Addon>
                                        <FormControl type="text" value={element_name} placeholder={element_name_old} onChange={this._event_modal_onElementNameChange} />
                                        <InputGroup.Addon>type</InputGroup.Addon>
                                        <FormControl type="text" value={element_type} placeholder={element_type_old} onChange={this._event_modal_onElementTypeChange} />
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Node
                                </Col>
                                <Col sm={10}>
                                    <InputGroup>
                                        <InputGroup.Addon>id</InputGroup.Addon>
                                        <FormControl type="text" value={element_node_id} placeholder={"bind"} onChange={null} readOnly />
                                        <InputGroup.Addon>name</InputGroup.Addon>
                                        <FormControl type="text" value={element_node_name} placeholder={"to"} onChange={null} readOnly />
                                        <InputGroup.Addon>location</InputGroup.Addon>
                                        <FormControl type="text" value={element_node_location} placeholder={"node!"} onChange={null} readOnly />
                                    </InputGroup>
                                    <div style={{ textAlign: "left", paddingTop: 10 }}>
                                        <ButtonGroup>
                                            <Button href="#" onClick={this._event_modal_onElementBind}>Bind To Node</Button>
                                            <p style={{ paddingLeft: 10, display: "inline", color: "red" }}>{warning}</p>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Options
                                </Col>
                                <Col sm={10}>
                                    <div style={{ textAlign: "left", paddingBottom: 10 }}>
                                        <ToggleButtonGroup type="checkbox" defaultValue={tbgdefault} onChange={this._event_modal_onElementToggle}>
                                            <ToggleButton value={1}>Wireframe</ToggleButton>
                                            <ToggleButton value={2}>Text Mode</ToggleButton>
                                        </ToggleButtonGroup>
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Vertices
                                </Col>
                                <Col sm={10}>
                                    {this.CreateVerticesContainer()}
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col sm={2} style={{ textAlign: "right", paddingTop: 5 }}>
                                    Faces
                                </Col>
                                <Col sm={10}>
                                    {this.CreateIndicesContainer()}
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
                            <FormGroup style={{ textAlign: "right", marginRight: 0 }}>
                                <ButtonGroup>
                                    <Button bsStyle="danger" href="#" onClick={this._event_modal_onDeleteElement}>Delete</Button>
                                    <Button bsStyle="success" href="#" onClick={this._event_modal_onOk}>Ok</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.Properties} onHide={this._event_modal_onOk}>
                    <Modal.Header>
                        <Modal.Title>Node Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
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
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
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
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(150, 150, 150, 0.50)" }}></FormGroup>
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
