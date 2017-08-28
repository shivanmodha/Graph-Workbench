let Graph = class Graph
{
    constructor()
    {
        this.Nodes = [];
        this.Elements = [];
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
    Render(ME, z_rotation)
    {
        for (let i = 0; i < this.Elements.length; i++)
        {
            this.Elements[i].Render(ME);
        }
        for (let i = 0; i < this.Nodes.length; i++)
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
        for (let i = 0; i < this.Nodes.length; i++)
        {
            ME.Device2D.beginPath();
            let p = ME.ProjectVertex(this.Nodes[i].Location, z_rotation);
            this.Nodes[i].ProjectedLocation = new Vertex(p.X, p.Y, p.Z);
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
    constructor(_object)
    {
        this.Object = _object;
    }
    BindToNode(_node)
    {
        this.Node = _node;
    }
    Render(ME)
    {
        this.Object.Render(ME);
    }
}