let ME;
let obj;
let url_base
let clrcol = [0.875, 0.875, 0.875, 1];
let param = [];
function Main()
{
    url = ParseURL();
    let RC3 = document.getElementById("studios.vanish.component.3D");
    let RC2 = document.getElementById("studios.vanish.component.2D");
    RC2.addEventListener("mousedown", Event_Down);
    RC2.addEventListener("touchstart", Event_TDown);
    RC2.addEventListener("mouseup", Event_Up);
    RC2.addEventListener("touchend", Event_Up);
    RC2.addEventListener("mousemove", Event_Move);
    RC2.addEventListener("mouseover", Event_Move);
    RC2.addEventListener("touchmove", Event_TMove);
    RC2.addEventListener("mousewheel", Event_Wheel);
    RC2.addEventListener("DOMMouseScroll", Event_Wheel);
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
            tmp_location = new Vertex(0, 0, 100);
            tmp_rotation = new Vertex(0, 0, 0);
            RenderedFloor = 0;
        }
    }
    else
    {
        tmp_location = new Vertex(0, 0, 100);
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
}
function Event_Down(event)
{

}
function Event_TDown(event)
{

}
function Event_Up(event)
{

}
function Event_Move(event)
{

}
function Event_TMove(event)
{

}
function Event_Wheel(event)
{

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
    ME.Device2D.lineWidth = 0.5;
    ME.Device2D.beginPath();
    ME.Device2D.moveTo(ME.Device.viewportWidth / 2, 0);
    ME.Device2D.lineTo(ME.Device.viewportWidth / 2, ME.Device.viewportHeight);
    ME.Device2D.stroke();
    ME.Device2D.beginPath();
    ME.Device2D.moveTo(0, ME.Device.viewportHeight / 2);
    ME.Device2D.lineTo(ME.Device.viewportWidth, ME.Device.viewportHeight / 2);
    ME.Device2D.stroke();
    obj.Render(ME);
}
