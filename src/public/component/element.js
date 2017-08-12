let Node = class Node
{
    constructor(_x, _y, _z)
    {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.element = null;
        this.bounded = null;
    }
    Render(ME, z_rotation)
    {
        if (this.element)
        {
            this.element.Render(ME);
        }
        else
        {
            let p = ME.ProjectVertex(new Vertex(this.x, this.y, this.z), z_rotation);
            ME.Device2D.beginPath();
            ME.Device2D.arc(p.X, p.Y, 5, 0, Math.PI * 2, true);
            ME.Device2D.fill();
        }
    }
}
let Path = class Path
{
    constructor(_node1, _node2, _distance)
    {
        this.node1 = _node1;
        this.node2 = _node2;
        this.distance = _distance;
        this.element = null;

        this.node1.bounded = this;
        this.node2.bounded = this;
    }
    BindObject(_element)
    {
        this.element = _element;
    }
    Render(ME, z_rotation)
    {
        if (this.element)
        {
            this.element.Render(ME);
        }
        else
        {            
            let p1 = ME.ProjectVertex(new Vertex(this.node1.x, this.node1.y, this.node1.z), z_rotation);
            let p2 = ME.ProjectVertex(new Vertex(this.node2.x, this.node2.y, this.node2.z), z_rotation);
            ME.Device2D.beginPath();
            ME.Device2D.moveTo(p1.X, p1.Y);
            ME.Device2D.lineTo(p2.X, p2.Y);
            ME.Device2D.stroke();
        }    
        this.node1.Render(ME, z_rotation);
        this.node2.Render(ME, z_rotation);
    }
}
let Element = class Element
{
    constructor(_name, _object)
    {
        this.name = _name;
        this.object = _object;
    }
    Render(ME)
    {
        this.object.Render(ME);
    }
}