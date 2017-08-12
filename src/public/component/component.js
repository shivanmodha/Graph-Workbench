let ME;
let url_base
let clrcol = [0.875, 0.875, 0.875, 1];
let param = [];
let MousePosition = new Point(0, 0);
let offsetY = 0;

let g;
function Main()
{
    url = ParseURL();
    let RC3 = document.getElementById("studios.vanish.component.3D");
    let RC2 = document.getElementById("studios.vanish.component.2D");
    window.addEventListener("_event_navigation_select_", _event_onNavigationSelect);
    RC2.addEventListener("mousedown", _event_onMouseDown);
    RC2.addEventListener("touchstart", _event_onTouchDown);
    RC2.addEventListener("mouseup", _event_onMouseUp);
    RC2.addEventListener("touchend", _event_onTouchUp);
    RC2.addEventListener("mousemove", _event_onMouseMove);
    RC2.addEventListener("mouseover", _event_onMouseMove);
    RC2.addEventListener("touchmove", _event_onTouchMove);
    RC2.addEventListener("mousewheel", _event_onMouseWheel);
    RC2.addEventListener("DOMMouseScroll", _event_onMouseWheel);
    offsetY = RC2.style.top;
    offsetY = offsetY.substring(0, offsetY.length - 2);
    offsetY = parseInt(offsetY);
    ME = new Engine(RC2, RC3);
    ME.Camera.Location = tmp_location;
    ME.Camera.Rotation = tmp_rotation;
    Initialize();
    MainLoop();
    UpdateURL();
}
function UpdateURL()
{
    let url = "@" + round(ME.Camera.Location.X, 2) + "," + round(ME.Camera.Location.Y, 2) + "," + round(ME.Camera.Location.Z, 2) + "z" + ((RenderedFloor / 2) + 1);
    window.history.replaceState({ "html": url }, "", url)
}
function round(num, p)
{
    return "" + parseFloat(Number(Math.round(num + 'e' + p) + 'e-' + p));
}
function ParseURL()
{
    let url = document.URL;
    if (url.includes("@"))
    {
        let paramstr = url.substring(url.indexOf("@") + 1);
        while (paramstr.includes(","))
        {
            param.push(paramstr.substring(0, paramstr.indexOf(",")));
            paramstr = paramstr.substring(paramstr.indexOf(",") + 1);
        }
        param.push(paramstr);
        if (param.length == 3)
        {
            tmp_location = new Vertex(parseFloat(param[0]), parseFloat(param[1]), parseFloat(param[2].substring(0, param[2].indexOf("z"))));
            tmp_rotation = new Vertex(0, 0, 0);
            RenderedFloor = (parseInt(param[2].substring(param[2].indexOf("z") + 1)) - 1) * 2;
        }
        else
        {
            tmp_location = new Vertex(0, 0, 5);
            tmp_rotation = new Vertex(0, 0, 0);
            RenderedFloor = 0;
        }
    }
    else
    {
        tmp_location = new Vertex(0, 0, 5);
        tmp_rotation = new Vertex(0, 0, 0);
        RenderedFloor = 0;
    }
    let url_search = new URL(url);
    url = url.substring(url.indexOf("/") + 1);
    if (url.includes("?")) url = url.substring(0, url.indexOf("?"));
    if (url.endsWith("/")) url = url.substring(0, url.length - 1);
    url_base = url.substring(url.indexOf("/") + 1);
    url_base = url_base.substring(url_base.indexOf("/"));
    url = url.substring(url.indexOf("/") + 1, url.lastIndexOf("/") + 1);
    url = url.substring(url.indexOf("/"));
    return url;
}
function Initialize()
{
    let Vertices = [
        new GraphicsVertex(-1.0, +1.0, +1.0, +1.0, +1.0, +1.0, +1.0),
        new GraphicsVertex(+1.0, +1.0, +1.0, +1.0, +1.0, +1.0, +1.0),
        new GraphicsVertex(+1.0, -1.0, +1.0, +1.0, +1.0, +1.0, +1.0),
        new GraphicsVertex(-1.0, -1.0, +1.0, +1.0, +1.0, +1.0, +1.0),

        new GraphicsVertex(-1.0, +1.0, -1.0, +1.0, +1.0, +1.0, +1.0),
        new GraphicsVertex(+1.0, +1.0, -1.0, +1.0, +1.0, +1.0, +1.0),
        new GraphicsVertex(+1.0, -1.0, -1.0, +1.0, +1.0, +1.0, +1.0),
        new GraphicsVertex(-1.0, -1.0, -1.0, +1.0, +1.0, +1.0, +1.0),
    ]
    let Indices = [
        new Index(0, 1, 2),
        new Index(0, 2, 3),

        new Index(4, 5, 6),
        new Index(4, 6, 7)
    ]
    obj = new Object3D(ME, Vertices, Indices, "OBJ");

    g = new Graph();
    let A = new Node("A", new Vertex(0, 3, 0));
    let B = new Node("B", new Vertex(3, 0, 0));
    let C = new Node("C", new Vertex(-3, 0, 0));
    let D = new Node("D", new Vertex(0, -3, 0));

    A.CreatePathTo(B, true);
    A.CreatePathTo(C, true);
    B.CreatePathTo(C, true);
    B.CreatePathTo(D, true);
    C.CreatePathTo(D, true);

    g.RegisterNode(A);
    g.RegisterNode(B);
    g.RegisterNode(C);
    g.RegisterNode(D);
    
    g.GetPath(A, D);
}
function Element_New()
{
    
}
function _event_onNavigationSelect(event)
{
    let navigation = event.detail.key;
    if (navigation === "_navigation_element_create")
    {
        Element_New();
    }
}
function _event_onMouseDown(event)
{

}
function _event_onTouchDown(event)
{

}
function _event_onMouseUp(event)
{

}
function _event_onTouchUp(event)
{

}
function _event_onMouseMove(event)
{
    MousePosition = new Point(event.clientX, event.clientY - offsetY);
}
function _event_onTouchMove(event)
{

}
function _event_onMouseWheel(event)
{
    let e = window.event || event;
    let speed = 0.1;
    let delta = Math.max(-speed, Math.min(speed, (e.wheelDelta || -e.detail)));
    ME.Camera.Location.Z -= (delta);
    UpdateURL();
}
function MainLoop()
{
    requestAnimFrame(MainLoop);
    Render();
    Update();
}
function Update()
{
    obj.Rotation.X += 1;
}
function Render()
{
    ME.Clear(clrcol[0], clrcol[1], clrcol[2], clrcol[3]);
    ME.Device2D.lineWidth = 0.15;
    ME.Device2D.beginPath();
    ME.Device2D.moveTo(MousePosition.X, 0);
    ME.Device2D.lineTo(MousePosition.X, ME.Device.viewportHeight);
    ME.Device2D.stroke();
    ME.Device2D.beginPath();
    ME.Device2D.moveTo(0, MousePosition.Y);
    ME.Device2D.lineTo(ME.Device.viewportWidth, MousePosition.Y);
    ME.Device2D.stroke();
    ME.Device2D.lineWidth = 0.3;
    g.Render(ME, 0);
}
