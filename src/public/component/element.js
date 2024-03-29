let Graph = class Graph
{
    constructor()
    {
        this.Nodes = [];
        this.Elements = [];
        this.RenderedFloor = 1;
        this.Floors = [
            ["Default", -100, 100]
        ];
    }
    CreateNode(_location)
    {
        this.Nodes.push(new Node(_location));
        return this.Nodes.length - 1;
    }
    GetNode(_name)
    {
        for (let i = 0; i < this.Nodes.length; i++)
        {
            if (this.Nodes[i].Name === _name)
            {
                return this.Nodes[i];
            }
        }
        return null;
    }
    RegisterNode(_node)
    {
        this.Nodes.push(_node);
    }
    RegisterElement(_element)
    {
        this.Elements.push(_element);
    }
    NodeInList(check, list)
    {
        for (let i = 0; i < list.length; i++)
        {
            if (check == list[i])
            {
                return true;
            }
        }
        return false;
    }
    GetDynamicDirections()
    {
        let _return = [];
        let DestCall = false;
        let mag = (a) =>
        {
            return Math.sqrt(Math.pow(a.X, 2) + Math.pow(a.Y, 2) + Math.pow(a.Z, 2));
        }
        let dist = (a, b) =>
        {
            return Math.sqrt(Math.pow(a.X - b.X, 2) + Math.pow(a.Y - b.Y, 2) + Math.pow(a.Z - b.Z, 2));
        }
        let cross = (a, b) =>
        {
            return new Vertex((a.Y * b.Z) - (a.Z * b.Y), (a.Z * b.X) - (a.X * b.Z), (a.X * b.Y) - (a.Y * b.X));
        }
        let dot = (a, b) =>
        {
            return (a.X * b.X) + (a.Y * b.Y) + (a.Z * b.Z);
        }
        let start = false;
        if (!this.SelectedPath[1].Name.includes(this.SelectedPath[0].Name))
        {
            start = true;
            _return.push(new DirectionInstruction(this.SelectedPath[1].Name, "Start", dist(this.SelectedPath[0].Location, this.SelectedPath[1].Location), "Head to " + this.SelectedPath[1].Name));
        }
        for (let i = 1; i < this.SelectedPath.length - 1; i++)
        {
            let verb = "to";
            let parent = this.SelectedPath[i - 1];
            let current = this.SelectedPath[i];
            let child = this.SelectedPath[i + 1];
            if (child.Name.includes("Hall"))
            {
                verb = "on";
            }
            let vector1 = new Vertex(current.Location.X - parent.Location.X, current.Location.Y - parent.Location.Y, 0);
            let vector2 = new Vertex(child.Location.X - current.Location.X, child.Location.Y - current.Location.Y, 0);
            let ang = Math.atan2(mag(cross(vector1, vector2)), dot(vector1, vector2));
            ang *= 180 / Math.PI;
            let StraightOffset = 15;
            if (cross(vector1, vector2).Z > 0)
            {
                ang *= -1;
            }
            if (!start && i === 1)
            {
                _return.push(new DirectionInstruction(child.Name, "Start", dist(current.Location, child.Location), "Head to " + child.Name));
            }
            else
            {
                let displayName = child.Name;
                if (displayName.includes(" Entrance"))
                {
                    displayName = displayName.replace(" Entrance", "");
                }
                if (current.Location.Z === child.Location.Z)
                {
                    if ((ang > -StraightOffset) && (ang < StraightOffset))
                    {
                        console.log(_return[_return.length - 1].NodeName + " | " + child.Name);
                        if (_return[_return.length - 1].NodeName === child.Name && _return[_return.length - 1].Direction != "Straight")
                        {
                            _return.push(new DirectionInstruction(child.Name, "Straight", dist(current.Location, child.Location), "Keep Straight"));
                        }
                        else
                        {
                            if (i !== this.SelectedPath.length - 2)
                            {
                                console.log(_return[_return.length - 1].NodeName + " | " + child.Name);
                                if (_return[_return.length - 1].NodeName !== child.Name)
                                {
                                    _return.push(new DirectionInstruction(child.Name, "Straight", dist(current.Location, child.Location), "Straight to " + displayName));
                                }
                            }    
                            else
                            {
                                DestCall = true;
                                _return.push(new DirectionInstruction(child.Name, "Straight", dist(current.Location, child.Location), "Destination Straight Ahead"));
                            }
                        }
                    }
                    else if (ang < -StraightOffset)
                    {                       
                        _return.push(new DirectionInstruction(child.Name, "Left", dist(current.Location, child.Location), "Left " + verb + " " + displayName));
                    }    
                    else if (ang > StraightOffset)
                    {
                        _return.push(new DirectionInstruction(child.Name, "Right", dist(current.Location, child.Location), "Right " + verb + " " + displayName));
                    }
                }
                else if (current.Location.Z < child.Location.Z)
                {
                    if (!_return[_return.length - 1].NodeName.includes(child.Name) || child.Name.includes("Stairs"))
                    {
                        _return.push(new DirectionInstruction(child.Name, "Up", dist(current.Location, child.Location), "Up " + displayName));
                    }
                }    
                else if (current.Location.Z > child.Location.Z)
                {
                    _return.push(new DirectionInstruction(child.Name, "Down", dist(current.Location, child.Location), "Down " + displayName));
                }
            }    
        }
        if (!DestCall)
        {
            _return.push(new DirectionInstruction(this.SelectedPath[this.SelectedPath.length - 1].Name, "Destination", 0, "Destination"));
        }
        return _return;
    }
    GetPath(start, end)
    {
        let nodePool = [];
        nodePool.push(start);
        for (let i = 0; i < this.Nodes.length; i++)
        {
            this.Nodes[i]._distance = Number.MAX_SAFE_INTEGER;
            this.Nodes[i]._previous = null;
            if (this.Nodes[i] != start)
            {
                nodePool.push(this.Nodes[i]);
            }
        }
        start._distance = 0;
        while (nodePool.length > 0)
        {
            let min = Number.MAX_SAFE_INTEGER;
            let index = -1;
            for (let i = 0; i < nodePool.length; i++)
            {
                if (nodePool[i]._distance <= min)
                {
                    min = nodePool[i]._distance;
                    index = i;
                }
            }
            let n = nodePool.splice(index, 1)[0];
            for (let i = 0; i < n.Neighbors.length; i++)
            {
                let ne = n.Neighbors[i];
                if (this.NodeInList(ne.EndNode, nodePool) && (n.Enabled || n == start))
                {
                    let distance = n._distance + ne.Distance;
                    if (distance < ne.EndNode._distance)
                    {
                        ne.EndNode._distance = distance;
                        ne.EndNode._previous = n;
                    }
                }
            }
        }
        this.SelectedPath = [];
        let n = end;
        while (n != start)
        {
            this.SelectedPath.unshift(n);
            n = n._previous;
        }
        this.SelectedPath.unshift(n);
    }
    NodeInFloor(n)
    {
        if (this.RenderedFloor - 1 >= this.Floors.length)
        {
            return false;
        }
        if (this.RenderedFloor < 1)
        {
            return false;
        }
        if ((n.Location.Z > this.Floors[this.RenderedFloor - 1][1]) && (n.Location.Z < this.Floors[this.RenderedFloor - 1][2]))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    DistanceToNode(i, point)
    {
        if (this.NodeInFloor(this.Nodes[i]))
        {
            if (this.Nodes[i].ProjectedLocation)
            {
                return this.Nodes[i].ProjectedLocation.DistanceTo(point);
            }
            else
            {
                return Number.MAX_SAFE_INTEGER;
            }
        }
        else
        {
            return Number.MAX_SAFE_INTEGER;
        }
    }
    Render(ME, z_rotation)
    {
        for (let i = 0; i < this.Elements.length; i++)
        {
            if (this.Elements[i].Node != null)
            {
                if (this.Elements[i].Node != null && this.NodeInFloor(this.Elements[i].Node))
                {
                    this.Elements[i].Render(ME);
                }
            }
        }
        for (let i = 0; i < this.Nodes.length; i++)
        {
            if (this.NodeInFloor(this.Nodes[i]))
            {
                let p = ME.ProjectVertex(this.Nodes[i].Location, z_rotation);
                let selected = false;
                if (this.SelectedPath)
                {
                    for (let j = 0; j < this.SelectedPath.length; j++)
                    {
                        if (this.SelectedPath[j] == this.Nodes[i])
                        {
                            selected = true;
                        }
                    }
                }
                for (let j = 0; j < this.Nodes[i].Neighbors.length; j++)
                {
                    ME.Device2D.beginPath();
                    ME.Device2D.moveTo(p.X, p.Y);
                    let p1 = ME.ProjectVertex(this.Nodes[i].Neighbors[j].EndNode.Location, z_rotation);
                    ME.Device2D.lineTo(p1.X, p1.Y);
                    if (selected && this.NodeInList(this.Nodes[i].Neighbors[j].EndNode, this.SelectedPath))
                    {
                        ME.Device2D.strokeStyle = '#4682B4';
                    }
                    ME.Device2D.stroke();
                    ME.Device2D.strokeStyle = '#000000';
                }
            }
        }
        for (let i = 0; i < this.Nodes.length; i++)
        {
            let p = ME.ProjectVertex(this.Nodes[i].Location, z_rotation);
            this.Nodes[i].ProjectedLocation = new Vertex(p.X, p.Y, p.Z);
            if (this.NodeInFloor(this.Nodes[i]))
            {
                ME.Device2D.beginPath();
                ME.Device2D.arc(p.X, p.Y, 5, 0, Math.PI * 2, true);
                let selected = false;
                let style = "#000000";
                if (this.SelectedPath)
                {
                    for (let j = 0; j < this.SelectedPath.length; j++)
                    {
                        if (this.SelectedPath[j] == this.Nodes[i])
                        {
                            selected = true;
                            if (j == 0)
                            {
                                style = '#9ACD32';
                            }
                            else if (j == this.SelectedPath.length - 1)
                            {
                                style = '#B22222';
                            }
                            else
                            {
                                style = '#4682B4';
                            }
                            break;
                        }
                    }
                }
                let sel = false;
                if (this.Nodes[i].Selected == true)
                {
                    sel = true;
                    style = '#FFA500';
                }
                else if (this.Nodes[i].Hovered == true)
                {
                    sel = true;
                    style = '#C8A500';
                }
                if (sel || selected)
                {
                    ME.Device2D.fillStyle = style;
                    ME.Device2D.fill();
                }
                else
                {
                    ME.Device2D.strokeStyle = style;
                    ME.Device2D.stroke();
                }
                ME.Device2D.textAlign = "center";
                let x = new Number(this.Nodes[i].Location.X).toFixed(1);
                let y = new Number(this.Nodes[i].Location.Y).toFixed(1);
                let z = new Number(this.Nodes[i].Location.Z).toFixed(1);
                this.Nodes[i].Location = new Vertex(parseFloat(x), parseFloat(y), parseFloat(z));
                ME.Device2D.fillText("'" + this.Nodes[i].Name + "' = (" + x + ", " + y + ", " + z + ")", p.X, p.Y + 20);
                ME.Device2D.fillStyle = '#000000';
                ME.Device2D.strokeStyle = '#000000';
            }
        }
    }
    ToJson()
    {
        let js = {
            "nodes": [],
            "maxid": nID,
            "floors": this.Floors
        };
        for (let i = 0; i < this.Nodes.length; i++)
        {
            let child = {
                "name": this.Nodes[i].Name,
                "id": this.Nodes[i].ID,
                "location": {
                    "x": this.Nodes[i].Location.X,
                    "y": this.Nodes[i].Location.Y,
                    "z": this.Nodes[i].Location.Z
                },
                "enabled": this.Nodes[i].Enabled,
                "neighbors": []
            };
            for (let j = 0; j < this.Nodes[i].Neighbors.length; j++)
            {
                child["neighbors"].push({
                    "distance": this.Nodes[i].Neighbors[j].Distance,
                    "end": this.Nodes[i].Neighbors[j].EndNode.ID,
                });
            }
            js["nodes"].push(child);
        }
        js["elements"] = [];
        for (let i = 0; i < this.Elements.length; i++)
        {
            let id = null;
            if (this.Elements[i].Node)
            {
                id = this.Elements[i].Node.ID;
            }
            let child = {
                "name": this.Elements[i].Name,
                "type": this.Elements[i].Type,
                "node": id,
                "vertices": [],
                "indices": []
            }
            for (let j = 0; j < this.Elements[i].Object.Vertices.length; j++)
            {
                child["vertices"].push([
                    this.Elements[i].Object.Vertices[j].X,
                    this.Elements[i].Object.Vertices[j].Y,
                    this.Elements[i].Object.Vertices[j].Z,
                    this.Elements[i].Object.Vertices[j].R,
                    this.Elements[i].Object.Vertices[j].G,
                    this.Elements[i].Object.Vertices[j].B,
                    this.Elements[i].Object.Vertices[j].A,
                ]);
            }
            for (let j = 0; j < this.Elements[i].Object.Indices.length; j++)
            {
                child["indices"].push(this.Elements[i].Object.Indices[j].indices);
            }
            js["elements"].push(child);
        }
        return js;
    }
    FromJson(ME, js)
    {
        nID = js["maxid"];
        if (js["floors"])
        {
            this.Floors = js["floors"];
        }
        for (let i = 0; i < js["nodes"].length; i++)
        {
            let n = new Node(js["nodes"][i]["name"], new Vertex(js["nodes"][i]["location"]["x"], js["nodes"][i]["location"]["y"], js["nodes"][i]["location"]["z"]));
            n.ID = js["nodes"][i]["id"];
            n.Enabled = js["nodes"][i]["enabled"];
            this.Nodes.push(n);
        }
        for (let i = 0; i < this.Nodes.length; i++)
        {
            let n = this.Nodes[i];
            for (let j = 0; j < js["nodes"][i]["neighbors"].length; j++)
            {
                for (let k = 0; k < this.Nodes.length; k++)
                {
                    if (this.Nodes[k].ID === js["nodes"][i]["neighbors"][j]["end"])
                    {
                        n.Neighbors.push(new Neighbor(this.Nodes[k], js["nodes"][i]["neighbors"][j]["distance"]));
                        break;
                    }
                }
            }
        }
        for (let i = 0; i < js["elements"].length; i++)
        {
            let v = [];
            for (let j = 0; j < js["elements"][i]["vertices"].length; j++)
            {
                let c = js["elements"][i]["vertices"][j];
                v.push(new GraphicsVertex(c[0], c[1], c[2], c[3], c[4], c[5], c[6]));
            }
            let ind = [];
            for (let j = 0; j < js["elements"][i]["indices"].length; j++)
            {
                let c = js["elements"][i]["indices"][j];
                ind.push(new Index(c[0], c[1], c[2]));
            }
            let n = new Element(new Object3D(ME, v, ind, "New Object"), js["elements"][i]["name"], js["elements"][i]["type"]);
            if (js["elements"][i]["node"] != null)
            {
                for (let k = 0; k < this.Nodes.length; k++)
                {
                    if (this.Nodes[k].ID === js["elements"][i]["node"])
                    {
                        n.BindToNode(this.Nodes[k]);
                    }
                }
            }
            this.Elements.push(n);
        }
    }
}
let DirectionInstruction = class DirectionInstruction
{
    constructor(nodeName, direction, distance, instruction)
    {
        this.NodeName = nodeName;
        this.Distance = distance;
        this.Direction = direction;
        this.Instruction = instruction;
    }
}
let nID = 0;
let Node = class Node
{
    constructor(_name, _location)
    {
        this.Name = _name;
        this.ID = nID;
        this.Location = _location;
        this.Neighbors = [];
        this._previous = null;
        this._distance = Number.MAX_SAFE_INTEGER;
        this.Enabled = true;
        this.Selected = false;
        this.Hovered = false;
        nID++;
    }
    CreatePathTo(_node, _reversible)
    {
        let distance = Math.sqrt(Math.pow(this.Location.X - _node.Location.X, 2) + Math.pow(this.Location.Y - _node.Location.Y, 2) + Math.pow(this.Location.Z - _node.Location.Z, 2));
        let neighbor = new Neighbor(_node, distance);
        this.Neighbors.push(neighbor);
        if (_reversible == true)
        {
            _node.CreatePathTo(this, false);
        }
    }
}
let Neighbor = class Neighbor
{
    constructor(_endNode, _distance)
    {
        this.EndNode = _endNode;
        this.Distance = _distance;
    }
}
let Element = class Element
{
    constructor(_object, name, type)
    {
        this.Object = _object;
        this.Name = name;
        this.Type = type;
        this.Node = null;
    }
    BindToNode(_node)
    {
        this.Node = _node;
    }
    Render(ME)
    {
        this.Object.Location = this.Node.Location;
        this.Object.Render(ME);
    }
}