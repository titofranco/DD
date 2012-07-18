
var current_sb_item=false;
var arrow_marker;
var initial_marker;
var final_marker;
var route_marker;

var polyline;
var selected_polyline;
var polyline_metro;
var polyline_bus;


/*Pinta el trayecto seleccionado en sidebar, crea el marker y pinta una flecha
 dependiento hacia donde se debe girar*/
function focusPoint(id){
    //Pinta de nuevo toda la ruta y el trayecto seleccionado en sidebar
    map.addOverlay(polyline);
    if(selected_polyline){map.removeOverlay(selected_polyline);}
    selected_polyline = getSelectedPolyline(id);
    map.addOverlay(selected_polyline);

    //Pinta una flecha verde, para indicar la posición elegida en sidebar
    //Url para arrow: http://maps.google.com/mapfiles/arrow.png  http://maps.google.com/mapfiles/arrowshadow.png
    var current_loc_icon = new GIcon();
    current_loc_icon.image = "http://www.google.com/mapfiles/ms/micons/blue-pushpin.png";
    current_loc_icon.shadow = "http://www.google.com/mapfiles/ms/micons/pushpin_shadow .png";
    current_loc_icon.iconAnchor = new GPoint(9,34);
    current_loc_icon.shadowSize = new GSize(37,34);

    //Si el marker existe entonces hay que quitarlo del mapa
    if(route_marker != null){
        map.removeOverlay(route_marker);
    }
    //Obtiene la posición lat-lng y pinta el pin marker y una flecha indicando hacia donde debe girar, l
    //Luego enfoca el mapa hacia ese punto
    var latlng_current_loc = new GLatLng(infoRouteHash[id].lat_start,infoRouteHash[id].long_start);
    route_marker = new GMarker(latlng_current_loc,{icon:current_loc_icon});
    map.panTo(latlng_current_loc);
    map.addOverlay(route_marker);
    midArrows(id);
    //Se cambia el CSS del sidebar-item-id
    addClassSidebar('#sidebar-item-',id);


}


//Enfoca la linea del metro cuando se hace clic sobre el sidebar-item-id correspondiente
function focusMetro(id_metro_related){
    var selected_station=[];
    map.addOverlay(polyline);

    for(var i=0;i<size_infoHash;i++){
        if(infoRouteHash[i].related_id==id_metro_related){
            selected_station.push(new GLatLng(infoRouteHash[i].lat_start,infoRouteHash[i].long_start));
            selected_station.push(new GLatLng(infoRouteHash[i].lat_end,infoRouteHash[i].long_end));
        }
    }

    var polyline_metro=new GPolyline(selected_station);
    map.addOverlay(polyline_metro);
}


//Obtiene la polilinea conformada por un conjunto de trayectos, basada en el id_related
function getSelectedPolyline(id){
    var pointSelectedPolyline=[];
    var id_related;
    for(var i=0;i<size_infoHash;i++){
        id_related=infoRouteHash[id].related_id;
        if(infoRouteHash[i].related_id==id_related){
            pointSelectedPolyline.push(new GLatLng(infoRouteHash[i].lat_start,infoRouteHash[i].long_start));
            pointSelectedPolyline.push(new GLatLng(infoRouteHash[i].lat_end,infoRouteHash[i].long_end));
        }
    }
    var selectedPolyline = new GPolyline(pointSelectedPolyline,'#FFFFFF',3,0.8);
    return selectedPolyline;
}


//Funcion que dibuja triangulos hacia la dirección que se va.
function midArrows(id) {
    var last_id;
    var related_id = infoRouteHash[id].related_id;
    if(arrow_marker){
        map.removeOverlay(arrow_marker);
    }
    arrowIcon = new GIcon();
    arrowIcon.iconSize = new GSize(24,24);
    arrowIcon.shadowSize = new GSize(1,1);
    arrowIcon.iconAnchor = new GPoint(12,12);
    arrowIcon.infoWindowAnchor = new GPoint(0,0);

    for(var i=0;i<size_infoHash;i++){
        if(related_id == infoRouteHash[i].related_id){
            last_id=i;
        }
    }
    //Pintar la flecha de la próxima dirección
    if(infoRouteHash[last_id+1]){
        // == round it to a multiple of 3 and cast out 120s
        var dir = Math.round(infoRouteHash[last_id+1].bearing/3) * 3;
        while (dir >= 120) {dir -= 120;}
    }
    // == use the corresponding triangle marker
    arrowIcon.image = "http://www.google.com/intl/en_ALL/mapfiles/dir_"+dir+".png";
    arrow_marker= new GMarker(
        new GLatLng(infoRouteHash[last_id].lat_end,infoRouteHash[last_id].long_end),arrowIcon);
    map.addOverlay(arrow_marker);
}

//Función que pinta la ruta de buses, la de vias y la del metro
function drawPolyline(latlng_street,latlng_metro){
    polyline = new GPolyline(latlng_street,'#FF6633',7,0.8);
    map.addOverlay(polyline);
    polyline_metro = new GPolyline(latlng_metro,'#FF6633',4,1);
    map.addOverlay(polyline_metro);
}

//Random colors: http://paulirish.com/2009/random-hex-color-code-snippets/
//Función de prueba para pintar varias rutas de buses
/*function drawPolyline_bus(buses_hash){
 var latlng_bus =[];
 var size=Object.size(buses_hash);
 for (var i=0;i<size-1;i++){
 if(buses_hash[i].bus_id == buses_hash[i+1].bus_id){
 latlng_bus.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
 }
 else {
 var color='#'+Math.floor(Math.random()*16777215).toString(16);
 var polyline_bus = new GPolyline(latlng_bus,color,4,1);
 map.addOverlay(polyline_bus);
 latlng_bus=[];
 }
 }
 }*/

//Función para pintar sólo una ruta de bus
function drawSelectedPolyline_bus(checkbox,bus_id){

    //Obtiene el objeto GPolyline para un bus_id especifico y pone su estado en activo
    var polyline_bus = getSingleBusPolyline(bus_id,"active");
    map.addOverlay(polyline_bus);
    //Obtiene la posicion del overlay_buses_hash para saber donde pintar los iconos de los buses
    var pos = getOverlayBusesHashPos(bus_id);
    map.addOverlay(overlay_buses_hash[pos].init_bus_marker);
    map.addOverlay(overlay_buses_hash[pos].end_bus_marker);
    addClassSidebarBus('#sidebar-item-bus',bus_id,checkbox,pos);
}

//Cambia el CSS del sidebar-item-bus-id cuando se hace clic sobre el checkbox
//Crea los markes dependiendo del estado del checkbox
function addClassSidebarBus(element,bus_id,checkbox,pos){
    if(checkbox.checked==false && $(element+''+bus_id).hasClass('current')){
        $(element+''+bus_id).removeClass('current');
        removeSelectedPolyline_bus(bus_id);
        map.removeOverlay(overlay_buses_hash[pos].init_bus_marker);
        map.removeOverlay(overlay_buses_hash[pos].end_bus_marker);
    }else if(checkbox.checked==true){
        $(element+''+bus_id).addClass('current');
    }
}

//Se crean todos los overlays para los buses y se crean datos especificos de cada
//ruta de bus. init_point_bus y end_point_bus es la lat-lng inicial y final de la poliline
//init_bus_marker y end_bus_marker  son los iconos de los buses que indican el inicio
//y el fin de la ruta de bus
function createBusesOverlays(size){
    var j=0;
    var latlng_bus=[];
    for(var i=0;i<size;i++){
        if(buses_hash[i].bus_id == buses_hash[i+1].bus_id){
            latlng_bus.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
        }
        else {
            latlng_bus.push(new GLatLng(buses_hash[i].lat_start,buses_hash[i].long_start));
            var color='#'+Math.floor(Math.random()*16777215).toString(16);
            while(color.length<=6){
                color='#'+Math.floor(Math.random()*16777215).toString(16);
            }
            var polyline_bus = new GPolyline(latlng_bus,color,4,1);
            var infoMarkers=createMarkersBuses(buses_hash[i].bus_id);
            overlay_buses_hash[j]={
                bus_id          :buses_hash[i].bus_id,
                polyline_bus    :polyline_bus,
                init_point_bus  :infoMarkers.init_point_bus,
                end_point_bus   :infoMarkers.end_point_bus,
                init_bus_marker :infoMarkers.init_bus_marker,
                end_bus_marker  :infoMarkers.end_bus_marker
            };
            latlng_bus=[];
            j++;
        }
    }
}

//Crea los markes para el inicio y el fin de la ruta y los retorna para que
//despues sean almacenados en overlay_buses_hash
function createMarkersBuses(bus_id){
    var init_point_bus;
    var end_point_bus;
    var init_bus_marker;
    var end_bus_marker;
    var size=Object.size(buses_hash);
    var bus_icon = new GIcon();
    bus_icon.image = "http://www.google.com/mapfiles/ms/micons/bus.png";
    bus_icon.shadow = "http://www.google.com/mapfiles/ms/micons/bus.shadow.png";
    bus_icon.iconAnchor = new GPoint(9,34);
    bus_icon.shadowSize = new GSize(37,34);

    for (var i=0;i<size;i++){
        if(bus_id == buses_hash[i].bus_id){
            var lat_start=buses_hash[i].lat_start;
            var long_start=buses_hash[i].long_start;
            init_point_bus = new GLatLng(lat_start,long_start);
            init_bus_marker = new GMarker(init_point_bus,bus_icon);
            while(bus_id == buses_hash[i].bus_id ){
                i++;
            }
            var lat_end=buses_hash[i-1].lat_start;
            var long_end=buses_hash[i-1].long_start;
            end_point_bus=new GLatLng(lat_end,long_end);
            end_bus_marker=new GMarker(end_point_bus,bus_icon);
            //console.debug(" el lat_start " + lat_start + " lat end " + lat_end + " bus_id " + buses_hash[i-1].bus_id);
        }
    }
    return{init_point_bus:init_point_bus,  end_point_bus:end_point_bus,
           init_bus_marker:init_bus_marker,end_bus_marker:end_bus_marker};
}

//Obtiene toda la polilinea de un bus en especifico, además pone su estado en
//activo o inactivo dependiendo si se pinta o si se elimina del mapa
function getSingleBusPolyline(bus_id,status){
    var size=Object.size(overlay_buses_hash);
    var polyline_bus;
    for (var i=0;i<size;i++){
        if(bus_id == overlay_buses_hash[i].bus_id){
            polyline_bus=overlay_buses_hash[i].polyline_bus;
            if(status="active"){
                overlay_buses_hash[i].status="active";
            }else{
                overlay_buses_hash[i].status="inactive";
            }
            break;
        }
    }
    return polyline_bus;
}

//Remueve la polylinea del bus seleccionada
function removeSelectedPolyline_bus(bus_id){
    var polyline_bus = getSingleBusPolyline(bus_id,"inactive");
    map.removeOverlay(polyline_bus);
}

//Asigna un color aleatorio a ultima posicion relativa del arreglo antes de que
//encuentre un nuevo bus_id
/*function AssignRandomColor(size){
 for(var i=0; i<size;i++){
 if(buses_hash[i].bus_id != buses_hash[i+1].bus_id){
 var color='#'+Math.floor(Math.random()*16777215).toString(16);
 //Si el color es de 6 digitos incluye el signo # la ruta no es pintada
 while(color.length<=6){
 color='#'+Math.floor(Math.random()*16777215).toString(16);
 }
 buses_hash[i].color=color;
 }
 }
 }*/

//Cambia el CSS del sidebar-item-id cuando se hace clic sobre este
function addClassSidebar(element,id){
    if($(element+''+current_sb_item).hasClass('current')){
        $(element+''+current_sb_item).removeClass('current');
    } $(element+''+id).addClass('current');
    current_sb_item=id;
}


//Obtiene la posicion del overlay_buses_hash dado el bus_id
function getOverlayBusesHashPos(bus_id){
    var size=Object.size(overlay_buses_hash);
    var pos;
    for(var i=0;i<size;i++){
        if(overlay_buses_hash[i].bus_id==bus_id){
            pos=i;
            break;
        }
    }
    return pos;
}


//Elimina todos los overlays existentes en el mapa
function clearExistingOverlays(){
    var size=Object.size(overlay_buses_hash);

    if(polyline_metro){map.removeOverlay(polyline_metro);}
    if(polyline){ map.removeOverlay(polyline);}
    if(selected_polyline){map.removeOverlay(selected_polyline);}
    if(route_marker){map.removeOverlay(route_marker);}
    if(arrow_marker){map.removeOverlay(arrow_marker);}
    //Remueve todas las polilineas y markers de rutas de buses activos
    for(var i=0;i<size;i++){
        if (overlay_buses_hash[i].status == "active"){
            map.removeOverlay(overlay_buses_hash[i].init_bus_marker);
            map.removeOverlay(overlay_buses_hash[i].end_bus_marker);
            removeSelectedPolyline_bus(overlay_buses_hash[i].bus_id);
        }
    }
}

//Este metodo es para asignar la lat-lng más cercana al marker a el initial_marker y al final_marker
function setLatLngMarkers(lat_start,long_start,lat_end,long_end){
    initial_marker.setLatLng(new GLatLng(lat_start,long_start));
    final_marker.setLatLng(new GLatLng(lat_end,long_end));
}


//Adiciona el li correspondiente a cada ruta de bus al panel derecho (sidebar)
/*function addBusesSidebar(buses_hash){
 var explain ='';
 var size = Object.size(buses_hash);
 explain = '<hr><li class="route-explain">'+
 '<b class="header">Indicación de ruta de bus cercana</b></li>';
 for(var i=0;i<size-1;i++){
 if(buses_hash[i].bus_id != buses_hash[i+1].bus_id){

 explain += '<span class=buses-checkbox> <li id=sidebar-item-bus'+(buses_hash[i].bus_id)+' >'+
 '<input type="checkbox" name="chk'+buses_hash[i].bus_id+'"' +
 ' onClick="javascript:drawSelectedPolyline_bus('+"this,"+buses_hash[i].bus_id+')">'+
 " Ruta numero " + buses_hash[i].bus_id + "</li></span>";
 }
 }
 var div_sidebar_bus_list = document.getElementById("sidebar-bus-list");
 div_sidebar_bus_list.innerHTML=explain;
 }*/

function createBusesSidebar(bus_explain){
    var div_sidebar_bus_list = document.getElementById("sidebar-bus-list");
    div_sidebar_bus_list.innerHTML=bus_explain;
}

function createSideBarPannel(explain){
    var div_sidebar_list = document.getElementById("sidebar-list");
    div_sidebar_list.innerHTML=explain;

}

//Crea el menú desplegable cuando se hace click derecho sobre el mapa
function createContextMenu(){
    var contextmenu=document.createElement("div");

    contextmenu.style.visibility="hidden";
    contextmenu.style.background="#ffffff";
    contextmenu.style.border="1px solid #8888FF";
    contextmenu.innerHTML =
        '<a href="javascript:void(0)"  id="initial_point_func"><div class="context">Ruta desde aquí</div></a>'
        +'<a href="javascript:void(0)" id="end_point_func"><div class="context">Ruta hasta aquí</div></a>'
        +'<hr>'
        +'<a href="javascript:void(0)" id="zoomin_func"><div class="context">Zoom In</div></a>'
        +'<a href="javascript:void(0)" id="zoomout_func"><div class="context">Zoom Out</div></a>'
        +'<a href="javascript:void(0)" id="centerMap_func"><div class="context">Centrar mapa</div></a>'
        +'<hr>'
        +'<a href="javascript:void(0)" id="clearMarkers_func"><div class="context">Reiniciar origen/destino </div></a>';
    return contextmenu;
}


//Explica la ruta a tomar y la pone en el panel derecho (sidebar), lo hace paso por paso
/*function explainRoute(infoRouteHash){
 var continueStraight=false;
 var size = Object.size(infoRouteHash);
 var explain;
 var turn;
 var first_node=true;
 var estacion_metro=false;
 var curr_dir;
 var prev_dir;
 var curr_stretch_type;
 var prev_stretch_type;
 var curr_bearing;
 var prev_bearing;
 var total_distance = getTotalDistanceRoute(infoRouteHash,size);
 var total_time = getTimeAprox(total_distance);
 //La variable j indica el número de pasos que requiere el algoritmo
 var j=1;
 //Estas son las estadisticas de la ruta
 explain = '<li class="route-explain">'
 +'<b class="header">Indicaciones de ruta a pie para llegar a tu lugar de destino</b>'
 +'<table><br><tr><td><b>Distancia aproximada: </b></td><td>' + total_distance + ' metros</td></tr>'
 +'<tr><td><b>Tiempo aproximado caminando a 3km/h: </b></td><td>' + total_time + ' minutos</td></tr>'
 +'</table></li>';
 for(var i=0;i<size-1;i++){
 //Asigno (direccion y stretch_type) actual y anterior
 //evaluo debo seguir derecho
 if(i>0){
 prev_stretch_type = infoRouteHash[i-1].stretch_type;
 curr_stretch_type = infoRouteHash[i].stretch_type;
 prev_bearing = infoRouteHash[i-1].bearing;
 curr_bearing = infoRouteHash[i].bearing;
 prev_dir = infoRouteHash[i-1].direction;
 curr_dir = reAssingDirection(prev_dir,infoRouteHash[i].direction,prev_bearing,curr_bearing);

 if(prev_dir==curr_dir){
 continueStraight=true;
 }
 }

 if(first_node){
 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'
 +j + ". " + "Dirigete en dirección <b>" + infoRouteHash[i].direction + "</b> hacia la "
 +"<b>"+ infoRouteHash[i].way_type_b +  " "
 +infoRouteHash[i].street_name_b +  " (metros: " + infoRouteHash[i].distance + ")" + "</b></a></li>";
 first_node=false;
 }
 /*else if((prev_dir==curr_dir) && continueStraight==false && curr_stretch_type=='1'){
 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
 j + ". " + "Sigue derecho en dirección: <b> " + infoRouteHash[i].direction + "</b> por la: " +
 "<b>"+ infoRouteHash[i].way_type_b +  " " +
 infoRouteHash[i].street_name_b + " (metros:" + infoRouteHash[i].distance + ")" +"</b></a></li>" ;

 if(curr_dir==infoRouteHash[i+1].direction)
 continueStraight=true;
 }*/

/*  else if(continueStraight==true && (prev_dir==curr_dir) && curr_stretch_type=='1'){
 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+(i)+')">'
 +j + ". Continúa por: " + "<b>"+ infoRouteHash[i].way_type_b +  " "
 +infoRouteHash[i].street_name_b + " (metros: " + infoRouteHash[i].distance + ")</b></a></li>";
 }
 else if ( (prev_dir != curr_dir) && curr_stretch_type=='1'){
 turn = eval_direction(infoRouteHash[i-1].direction,infoRouteHash[i].direction)

 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+(i)+')">'
 +j + ". Voltear " + "<b>"+ turn+"</b> por <b>"+ infoRouteHash[i].way_type_b +  " "
 +infoRouteHash[i].street_name_b + " (metros: " + infoRouteHash[i].distance + ")</b></a></li>";
 continueStraight = false;
 }

 //SE EXPLICA RUTA PARA ESTACION DEL METRO
 //Este primer else if no es viable porque despues de un tipo 4 puede haber un tipo 1
 /*else if(prev_stretch_type=='1' && curr_stretch_type=='4'){
 explain += '<li><a href="#" onclick="javascript:focusPoint('+(i)+')">' +
 "Dirigete hacia el <b>" + infoRouteHash[i].street_name_a + "</b></a></li>" ;
 }*/
//Si va en un trayecto o puente y se encuentre con el inicio de una estación entonces
//indica que el algoritmo cogió por el metro
/*   else if(prev_stretch_type=='4' && curr_stretch_type=='3'){
 estacion_metro=true;
 }
 //El stretch_type 2 indica que está en un tramo del metro
 else if((prev_stretch_type=='3' && curr_stretch_type=='2') && estacion_metro==true){
 explain += '<li id=sidebar-item-'+i+' >'
 +'<a href="#" onclick="javascript:focusMetro('+infoRouteHash[i-1].related_id+')">'
 +j + ". Ve de la estación <b> " + infoRouteHash[i-1].common_name_a;
 }
 //Si encuentró un stretch_type 3 quiere decir que llegó al final de una estación
 else if(estacion_metro==true && (prev_stretch_type=='2' && curr_stretch_type=='3')) {
 explain += ' hasta la estación <b>'+infoRouteHash[i].common_name_a+'</b></a></li>';
 }
 //Si encontró un stretch_type 4 es porque se bajó del metro y va hacia alguna calle
 else if(prev_stretch_type=='3' && curr_stretch_type=='4'){
 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
 j + ". Baja de la estación " + infoRouteHash[i-1].common_name_a +
 " dirigete por el <b>"+ infoRouteHash[i].common_name_b +  " " +
 infoRouteHash[i].street_name_a + " (metros:" + infoRouteHash[i].distance + ")</b></a></li>";
 estacion_metro=false;
 }
 j++;
 }
 //Si se tiene mas de 2 nodos entonces se procede a finalizar la explicacion
 //de la ruta
 if(size>1){
 var end;
 if(infoRouteHash[size-2].direction==infoRouteHash[size-1].direction){
 end = j + ". " +'Continúa hasta encontrar tu lugar de destino' +
 "<b> (metros: " + infoRouteHash[i].distance + ")</b>";
 }
 else {
 turn = eval_direction(infoRouteHash[size-2].direction,infoRouteHash[size-1].direction);
 end = j + ". " + 'Voltea <b> '+ turn +'</b> hasta llegar a tu lugar destino </b>' +
 "<b> (metros: " + infoRouteHash[i].distance + ")</b>" ;
 }
 explain += '<li id=sidebar-item-'+i+' >'+
 '<a href="#" onclick="javascript:focusPoint('+(size-1)+')">'+
 end+'</a></li>';
 }
 //En caso tal la ruta sólo tenga una arista
 else{
 explain += '<li id=sidebar-item-'+0+' >'+
 '<a href="#" onclick="javascript:focusPoint('+0+')">'+
 "1. Dirigete en dirección <b>" + infoRouteHash[i].direction +
 "</b> hacia la <b>" + infoRouteHash[i].way_type_b +  " " +
 infoRouteHash[i].street_name_b + "</b> hasta llegar a tu lugar de destino (metros: "
 + infoRouteHash[i].distance + ")</b></a></li>";
 }

 //Se adiciona el HTML al panel derecho
 var div_sidebar_list = document.getElementById("sidebar-list");
 div_sidebar_list.innerHTML=explain;

 }*/


//Esta funcion está diseñada para que explique la ruta en forma más reducida
/*
 function explainRoute(infoRouteHash){
 var continueStraight=false;
 var explain;
 var turn;
 var first_node=true;
 var estacion_metro=false;
 var curr_dir;
 var prev_dir;
 var curr_stretch_type;
 var prev_stretch_type;
 var curr_bearing;
 var prev_bearing;
 var total_distance = getTotalDistanceRoute(infoRouteHash,size);
 var total_time = getTimeAprox(total_distance);
 //La variable j indica el número de pasos que requiere el algoritmo
 var j=1;
 //Estas son las estadisticas de la ruta
 explain = '<li class="route-explain">'
 +'<b class="header">Indicaciones de ruta a pie para llegar a tu lugar de destino</b>'
 +'<table><br><tr><td><b>Distancia aproximada: </b></td><td>' + total_distance + ' metros</td></tr>'
 +'<tr><td><b>Tiempo aproximado caminando a 3km/h: </b></td><td>' + total_time + ' minutos</td></tr>'
 +'</table></li>';
 for(var i=0;i<size_infoHash-1;i++){
 //Asigno (direccion y stretch_type) actual y anterior
 if(i>0){
 prev_stretch_type = infoRouteHash[i-1].stretch_type;
 curr_stretch_type = infoRouteHash[i].stretch_type;
 prev_dir = infoRouteHash[i-1].new_direction;
 curr_dir = infoRouteHash[i].new_direction;
 }

 if(first_node){
 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'
 +j + ". " + "Dirigete en dirección <b>" + infoRouteHash[i].direction + "</b> hacia la "
 +"<b>"+ infoRouteHash[i].way_type_b +  " "
 +infoRouteHash[i].street_name_b +  " (metros: " + getDistance(i) + ")" + "</b></a></li>";
 first_node=false;
 j++;
 }

 else if ( (prev_dir != curr_dir) && curr_stretch_type=='1'){
 turn = eval_direction(prev_dir,curr_dir);

 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'
 +j + ". Voltear " + "<b>"+ turn+"</b> por <b>"+ infoRouteHash[i].way_type_b +  " " + infoRouteHash[i].street_name_b;
 if (infoRouteHash[i].has_relation){
 var index = infoRouteHash[i].street_name_b.indexOf("-");
 if(index != -1){
 explain += '</b> y continúa por <b>' + infoRouteHash[i].way_type_b + ' ' + infoRouteHash[i].street_name_b.substring(0,index);
 }
 }
 explain +=  " (metros: " + getDistance(i) + ")</b></a></li>";
 j++;
 }

 //SE EXPLICA RUTA PARA ESTACION DEL METRO
 //Si va en un trayecto o puente y se encuentre con el inicio de una estación entonces
 //indica que el algoritmo cogió por el metro
 else if(prev_stretch_type=='4' && curr_stretch_type=='3'){
 estacion_metro=true;
 }
 //El stretch_type 2 indica que está en un tramo del metro
 else if((prev_stretch_type=='3' && curr_stretch_type=='2') && estacion_metro==true){
 explain += '<li id=sidebar-item-'+i+' >'
 +'<a href="#" onclick="javascript:focusMetro('+infoRouteHash[i-1].related_id+')">'
 +j + ". Ve de la estación <b> " + infoRouteHash[i-1].common_name_a;
 j++;
 }
 //Si encuentró un stretch_type 3 quiere decir que llegó al final de una estación
 else if(estacion_metro==true && (prev_stretch_type=='2' && curr_stretch_type=='3')) {
 explain += ' hasta la estación <b>'+infoRouteHash[i].common_name_a+'</b></a></li>';
 }
 //Si encontró un stretch_type 4 es porque se bajó del metro y va hacia alguna calle
 else if(prev_stretch_type=='3' && curr_stretch_type=='4'){
 explain += '<li id=sidebar-item-'+i+' >'+'<a href="#" onclick="javascript:focusPoint('+i+')">'+
 j + ". Baja de la estación " + infoRouteHash[i-1].common_name_a +
 " dirigete por el <b>"+ infoRouteHash[i].common_name_b +  " " +
 infoRouteHash[i].street_name_a + " (metros:" + infoRouteHash[i].distance + ")</b></a></li>";
 estacion_metro=false;
 j++;
 }

 }
 //Si se tiene mas de 2 nodos entonces se procede a finalizar la explicacion
 //de la ruta
 if(size>1){
 var end;
 if(infoRouteHash[size-2].direction==infoRouteHash[size-1].direction){
 end = j + ". " +'Continúa hasta encontrar tu lugar de destino' +
 "<b> (metros: " + getDistance(i) + ")</b>";
 }
 else {
 turn = eval_direction(infoRouteHash[size-2].direction,infoRouteHash[size-1].direction);
 end = j + ". " + 'Voltea <b> '+ turn +'</b> hasta llegar a tu lugar destino </b>' +
 "<b> (metros: " + getDistance(i) + ")</b>" ;
 }
 explain += '<li id=sidebar-item-'+i+' >'+
 '<a href="#" onclick="javascript:focusPoint('+(i)+')">'+
 end+'</a></li>';
 }
 //En caso tal la ruta sólo tenga una arista
 else{
 explain += '<li id=sidebar-item-'+0+' >'+
 '<a href="#" onclick="javascript:focusPoint('+0+')">'+
 "1. Dirigete en dirección <b>" + infoRouteHash[i].direction +
 "</b> hacia la <b>" + infoRouteHash[i].way_type_b +  " " +
 infoRouteHash[i].street_name_b + "</b> hasta llegar a tu lugar de destino (metros: "
 + getDistance(i) + ")</b></a></li>";
 }
 //Se adiciona el HTML al panel derecho
 var div_sidebar_list = document.getElementById("sidebar-list");
 div_sidebar_list.innerHTML=explain;

 }*/


//Obtiene la distancia para un conjunto de trayectos que tengan un mismo related_id
/*function getDistance(id){
 var total_distance=0;
 var id_related;
 for (var i=0;i<size_infoHash;i++){
 id_related=infoRouteHash[id].related_id;
 if(infoRouteHash[i].related_id == id_related ){
 total_distance += infoRouteHash[i].distance;
 }
 }
 //console.debug("Para el id " + id + " el related " + id_related + " la distancia " + total_distance);
 return Math.round(total_distance*100)/100;
 }*/

//Obtiene la distancia total de la ruta
/*function getTotalDistanceRoute(infoRouteHash,size){
 var total_distance=0;
 for (var i=0;i<size;i++){
 total_distance+=infoRouteHash[i].distance
 }
 return Math.round(total_distance*100)/100;
 }*/

//Obtiene el tiempo aproximado en minutos que se demora una persona en recorrer
//la ruta
/*function getTimeAprox(total_distance){
 var time_aprox;
 time_aprox=(total_distance*60)/3000;
 return Math.round(time_aprox);
 }*/
