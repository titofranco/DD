//Asigna un color aleatorio a ultima posicion relativa del arreglo antes de que
//encuentre un nuevo bus_id
/*function AssignRandomColor(size){
 for(var i=0; i<size;i++){
 if(buses[i].bus_id != buses[i+1].bus_id){
 var color='#'+Math.floor(Math.random()*16777215).toString(16);
 //Si el color es de 6 digitos incluye el signo # la ruta no es pintada
 while(color.length<=6){
 color='#'+Math.floor(Math.random()*16777215).toString(16);
 }
 buses[i].color=color;
 }
 }
 }*/


//Adiciona el li correspondiente a cada ruta de bus al panel derecho (sidebar)
/*function addBusesSidebar(buses){
 var explain ='';
 var size = Object.size(buses);
 explain = '<hr><li class="route-explain">'+
 '<b class="header">Indicación de ruta de bus cercana</b></li>';
 for(var i=0;i<size-1;i++){
 if(buses[i].bus_id != buses[i+1].bus_id){

 explain += '<span class=buses-checkbox> <li id=sidebar-item-bus'+(buses[i].bus_id)+' >'+
 '<input type="checkbox" name="chk'+buses[i].bus_id+'"' +
 ' onClick="javascript:drawSelectedbusPolyline('+"this,"+buses[i].bus_id+')">'+
 " Ruta numero " + buses[i].bus_id + "</li></span>";
 }
 }
 var div_sidebar_bus_list = document.getElementById("sidebar-bus-list");
 div_sidebar_bus_list.innerHTML=explain;
 }*/

//Random colors: http://paulirish.com/2009/random-hex-color-code-snippets/
//Función de prueba para pintar varias rutas de buses
/*function drawbusPolyline(buses){
 var latLng =[];
 var size=Object.size(buses);
 for (var i=0;i<size-1;i++){
 if(buses[i].bus_id == buses[i+1].bus_id){
 latLng.push(new GLatLng(buses[i].lat_start,buses[i].long_start));
 }
 else {
 var color='#'+Math.floor(Math.random()*16777215).toString(16);
 var busPolyline = new GPolyline(latLng,color,4,1);
 map.addOverlay(busPolyline);
 latLng=[];
 }
 }
 }*/

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
