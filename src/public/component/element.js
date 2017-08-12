let Graph = class Graph
{
    constructor()
    {
        this.Nodes = [];
    }
    CreateNode(_location)
    {
        this.Nodes.push(new Node(_location));
        return this.Nodes.length - 1;
    }
    RegisterNode(_node)
    {
        this.Nodes.push(_node);
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
        for (let i = 0; i < this.SelectedPath.length; i++)
        {
            console.log(this.SelectedPath[i].Name);
        }
    }
    Render(ME, z_rotation)
    {
        for (let i = 0; i < this.Nodes.length; i++)
        {
            let p = ME.ProjectVertex(this.Nodes[i].Location, z_rotation);
            let selected = false;
            for (let j = 0; j < this.SelectedPath.length; j++)
            {
                if (this.SelectedPath[j] == this.Nodes[i])
                {
                    selected = true;
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
            ME.Device2D.arc(p.X, p.Y, 2, 0, Math.PI * 2, true);
            let selected = false;
            for (let j = 0; j < this.SelectedPath.length; j++)
            {
                if (this.SelectedPath[j] == this.Nodes[i])
                {
                    selected = true;
                    if (j == 0)
                    {
                        ME.Device2D.fillStyle = '#9ACD32';      
                    }
                    else if (j == this.SelectedPath.length - 1)
                    {
                        ME.Device2D.fillStyle = '#B22222';                              
                    }
                    else
                    {
                        ME.Device2D.fillStyle = '#4682B4';                        
                    }
                }
            }
            ME.Device2D.fill();
            ME.Device2D.font = "15px Calibri";
            ME.Device2D.textAlign="center"; 
            ME.Device2D.fillText("'" + this.Nodes[i].Name + "' = (" + this.Nodes[i].Location.X + ", " + this.Nodes[i].Location.Y + ", " + this.Nodes[i].Location.Z + ")", p.X, p.Y + 3.5);
            ME.Device2D.fillStyle = '#000000';
        }
    }
}
let Node = class Node
{
    constructor(_name, _location)
    {
        this.Name = _name;
        this.Location = _location;
        this.Neighbors = [];
        this._previous = null;
        this._distance = Number.MAX_SAFE_INTEGER;
        this.Enabled = true;
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
let element = class Element
{
    constructor(_object)
    {
        this.Object = _object;
    }
    BindToNode(_node)
    {
        this.Node = _node;
    }
}