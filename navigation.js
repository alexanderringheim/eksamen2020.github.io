var showing_dropdown = false;
window.onclick = function(e)
{
    //console.log(e.target);
    var can_remove = true;
    for (a of this.document.getElementsByTagName('a'))
    {
        if (e.target === a)
        {
            can_remove = false;
            break;
        }
    }
    for (b of this.document.getElementsByTagName('b'))
    {
        if (e.target === b)
        {
            can_remove = false;
            break;
        }
    }
    if (!(e.target === this.document.getElementById('dropdown') || e.target === this.document.getElementById('nav')) && can_remove && this.showing_dropdown)
    {
        this.document.getElementById('dropdown').style.right = -400 + "px";
        this.showing_dropdown = false;
    }
    else if (e.target === this.document.getElementById('nav') || e.target === this.document.getElementById('nav-icon-img') || e.target === this.document.getElementById('nav-menu'))
    {
        document.getElementById('dropdown').style.right = 8 + "px";
        showing_dropdown = true;
    }
}