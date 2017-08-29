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
        window.addEventListener("_event_onSignalProperties", this._event_onSignalProperties);
        window.addEventListener("_event_onSignalNeighbor", this._event_onSignalNeighbor);
        window.addEventListener("_event_onURLChange", this._event_onURLChange);
        window.addEventListener("_event_onSignalElements", this._event_onSignalElements);
        window.addEventListener("_event_onSignalBind", this._event_onSignalBind);
    }
    componentWillMount()
    {
        this.setState({
            NavigationHeight: 0,
            BreadHeight: 0,
            Properties: false,
            SelectedNode: null,
            Camera: "0, 0, 0",
            Element_Properties: false,
            SelectedElement: null,
            Element_CodeCreate: false
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
                    <InputGroup.Addon style={{ paddingLeft: 13, paddingRight: 13, borderRadius: 0, }}>r</InputGroup.Addon>
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
                    <Button style={{ height: 68, paddingTop: "60%" }} href="#" bsStyle="danger" onClick={(event) =>
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
            return (<p>No Vertices</p>)
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
                            <Button href="#" onClick={null}>Clear</Button>
                            <Button href="#" onClick={null}>Create</Button>
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
            return (<p>No Indices</p>)
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
                            <Button href="#" onClick={null}>Clear</Button>
                            <Button href="#" bsStyle="success" onClick={this._event_modal_onElementAddIndex}><Glyphicon glyph="plus" /></Button>
                        </ButtonGroup>
                    </div >
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
            let prompt = window.prompt("How many nodes do you want to create?", 5);
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
                vCode += "new GraphicsVertex(" + child.X + ", " + child.Y + ", " + child.Z + ", " + child.R + ", " + child.G + ", " + child.B + ", " + child.A + ")";
            }
            let iCode = "";
            for (let i = 0; i < event.detail.element.Object.Indices.length; i++)
            {
                let child = event.detail.element.Object.Indices[i];
                if (i > 0)
                {
                    iCode += ",\n";
                }
                iCode += "new Index(" + child.indices[0] + ", " + child.indices[1] + ", " + child.indices[2] + ")";
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
                    vCode += "new GraphicsVertex(" + child.X + ", " + child.Y + ", " + child.Z + ", " + child.R + ", " + child.G + ", " + child.B + ", " + child.A + ")";
                }
                let iCode = "";
                for (let i = 0; i < this.state.SelectedElement.Object.Indices.length; i++)
                {
                    let child = this.state.SelectedElement.Object.Indices[i];
                    if (i > 0)
                    {
                        iCode += ",\n";
                    }
                    iCode += "new Index(" + child.indices[0] + ", " + child.indices[1] + ", " + child.indices[2] + ")";
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
        let tbgdefault = [];
        let element_name = "";
        let element_name_old = "";
        let element_type = "";
        let element_type_old = "";
        let element_node_id = "";
        let element_node_name = "";
        let element_node_location = "";
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
                element_node_id = this.state.SelectedElement.Node.ID;
                element_node_name = this.state.SelectedElement.Node.Name;
                element_node_location = "(" + this.state.SelectedElement.Node.Location.X + ", " + this.state.SelectedElement.Node.Location.Y + ", " + this.state.SelectedElement.Node.Location.Z + ")";
            }
            if (this.state.Element_CodeCreate)
            {
                tbgdefault.push(2);
            }
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
                <Modal bsSize="large" show={this.state.Element_Properties} onHide={this._event_modal_onOk}>
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
                                    <div style={{ textAlign: "right", paddingTop: 10 }}>
                                        <ButtonGroup>
                                            <Button href="#" onClick={this._event_modal_onElementBind}>Bind To Node</Button>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                            </FormGroup>
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(10, 10, 10, 0.10)" }}></FormGroup>
                            <p>Object</p>
                            <div style={{ textAlign: "right", paddingBottom: 10 }}>
                                <ToggleButtonGroup type="checkbox" defaultValue={tbgdefault} onChange={this._event_modal_onElementToggle}>
                                    <ToggleButton value={1}>Wireframe</ToggleButton>
                                    <ToggleButton value={2}>Code Mode</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
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
                            <FormGroup style={{ height: 1, backgroundColor: "rgba(10, 10, 10, 0.10)" }}></FormGroup>
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
