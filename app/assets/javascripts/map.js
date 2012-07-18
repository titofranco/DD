// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
// 6.2645966700,-75.5877166080;
// The Javascript Menu and its functions is based on code provided by the
// Community Church Javascript Team
// http://econym.org.uk/gmap/context.htm
// http://econym.org.uk/gmap/
// Arrow function: http://econym.org.uk/gmap/arrows.htm
// Cliente location: http://designshack.co.uk/articles/javascript/detecting-location-using-google-ajax-api

var map;
//Guardan las coordenadas de las rutas a pintar
var latlng_street = [];
var latlng_metro = [];
//Guarda todos los datos enviados desde map_controller
var infoRouteHash = {};
var buses_hash = {};
var overlay_buses_hash = {};
//Variables que guardan la lat-lng inicial-final de los markers
var init_lat;
var init_lng;
var end_lat;
var end_lng;
var size_infoHash; /*Funcion para obtener el tamaño de la ventana*/

function windowHeight() {
    //Standard browsers (Mozilla,Safari,etc.)
    if (self.innerHeight) return self.innerHeight;
    // IE 6
    if (document.documentElement && document.documentElement.clientHeight) return y = document.documentElement.clientHeight;
    //IE 5
    if (document.body) return document.body.clientHeight;
    //Just in case
    return 0;
}

/* The offsetHeight and offsetWidth properties are provided by the browser,
 and return—in pixels—the dimensions of their element, including any padding.*/
/* Redimensiona el tamño del mapa y de la barra lateral*/

function handleResize() {
    var height = windowHeight() - document.getElementById('toolbar').offsetHeight - 45;
    document.getElementById('map').style.height = height + 'px';
    document.getElementById('sidebar').style.height = (height - 18) + 'px';
}


//Valida y si todo está correcto, procede a hacer la llama asincrona al server


function validar(form) {
    var validate = checkform(form);
    if (validate) {
        findRoute();
    }
}

//Valida que los campos no estén vacios


function checkform(form) {
    if (form.initial_point.value == "" && form.end_point.value == "") {
        alert("Debe elegir punto inicial y punto final");
        return false;
    } else if (form.initial_point.value == null || form.initial_point.value == "") {
        form.initial_point.focus();
        alert("Debe elegir un punto inicial");
        return false;
    } else if (form.end_point.value == null || form.end_point.value == "") {
        form.end_point.focus();
        alert("Debe elegir un punto final");
        return false;
    }
    return true;
}


function init(){
    handleResize();
    if (GBrowserIsCompatible) {
        //6.2201673770;-75.6076627160; casa de joan
        var centerLatitude = 6.27488;
        var centerLongitude = -75.56817;
        var startZoom = 16;
        var lat;
        var lng;
        //Variables utilizadas para limitar a que se cree sólo un marker
        var countInitial = 0;
        var countFinal = 0;
        var point;

        map = new GMap2(document.getElementById("map"));
        //If ClientLocation was filled in by the loader, use that info instead
        /*if (google.loader.ClientLocation) {
         centerLatitude = google.loader.ClientLocation.latitude;
         centerLongitude = google.loader.ClientLocation.longitude;
         }
         */
        map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
        map.setMapType(G_HYBRID_MAP);
        map.setUIToDefault();

        //Se crea el menu desplegable que se crea cuando se hace click derecho sobre el mapa
        var contextmenu = createContextMenu();
        map.getContainer().appendChild(contextmenu);

        document.getElementById('initial_point_func').onclick = function () {
            getInitialPoint();
            return false;
        };
        document.getElementById('end_point_func').onclick = function () {
            getFinalPoint();
            return false;
        };
        document.getElementById('zoomin_func').onclick = function () {
            zoomIn();
            return false;
        };
        document.getElementById('zoomout_func').onclick = function () {
            zoomOut();
            return false;
        };
        document.getElementById('centerMap_func').onclick = function () {
            setCenter();
            return false;
        };
        document.getElementById('clearMarkers_func').onclick = function () {
            clearMarkers();
            return false;
        };

        //Evento para desplegar menú cuando se hace click izquierdo
        GEvent.addListener(map, "singlerightclick", function (pixel, tile) {
            // store the "pixel" info in case we need it later
            // adjust the context menu location if near an egde
            // create a GControlPosition
            // apply it to the context menu, and make the context menu visible
            var clickedPixel = pixel;
            var x = pixel.x;
            var y = pixel.y;

            if (x > map.getSize().width - 120) {
                x = map.getSize().width - 120;
            }
            if (y > map.getSize().height - 100) {
                y = map.getSize().height - 100;
            }
            var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(x, y));
            pos.apply(contextmenu);
            contextmenu.style.visibility = "visible";
            point = map.fromContainerPixelToLatLng(clickedPixel);
            lat = point.lat();
            lng = point.lng();

        });

        //Obtiene el punto inicial del field, crea el marker y lo habilita para que se pueda arrastrar


        function getInitialPoint() {
            if (countInitial == 0) {
                initial_marker = new GMarker(point, {
                    draggable: true
                });
                var init_icon = new GIcon();
                init_icon.image = "http://www.google.com/mapfiles/dd-start.png";
                init_icon.shadow = "http://www.google.com/mapfiles/shadow50.png";
                init_icon.iconSize = new GSize(20, 34);
                init_icon.iconAnchor = new GPoint(9, 34);
                init_icon.shadowSize = new GSize(37, 34);
                init_icon.infoWindowAnchor = new GPoint(24, 24);
                initial_marker = new GMarker(point, {
                    draggable: true,
                    icon: init_icon
                });
                map.addOverlay(initial_marker);
                //marker.setLatLng(new GLatLng(6.256648053,-75.602324565));
                init_lat = lat;
                init_lng = lng;
                document.getElementById("initial_point").value = String(lat).substring(0, 7) +
                    ',' + String(lng).substring(0, 9);
                contextmenu.style.visibility = "hidden";
                countInitial = 1;

                GEvent.addListener(initial_marker, "dragend", function () {
                    init_lat = initial_marker.getPoint().lat();
                    init_lng = initial_marker.getPoint().lng();
                    document.getElementById("initial_point").value = String(init_lat).substring(0, 7) +
                        "," + String(init_lng).substring(0, 9);
                });
            }
        }

        //Obtiene el punto final del field, crea el marker y lo habilita para que se pueda arrastrar


        function getFinalPoint() {
            if (countFinal == 0) {
                var final_icon = new GIcon();
                final_icon.image = "http://www.google.com/mapfiles/dd-end.png";
                final_icon.shadow = "http://www.google.com/mapfiles/shadow50.png";
                final_icon.iconSize = new GSize(20, 34);
                final_icon.iconAnchor = new GPoint(9, 34);
                final_icon.shadowSize = new GSize(37, 34);
                final_icon.infoWindowAnchor = new GPoint(24, 24);
                final_marker = new GMarker(point, {
                    draggable: true,
                    icon: final_icon
                });
                // final_marker.setImage({url:'http://googlemapsbook.com/chapter4/StoreLocationMap/ronjonsurfshoplogo.png'});
                map.addOverlay(final_marker);
                end_lat = lat;
                end_lng = lng;
                document.getElementById("end_point").value = String(lat).substring(0, 7) + ',' +
                    String(lng).substring(0, 9);
                contextmenu.style.visibility = "hidden";
                countFinal = 1;

                GEvent.addListener(final_marker, "dragend", function () {
                    end_lat = final_marker.getPoint().lat();
                    end_lng = final_marker.getPoint().lng();
                    document.getElementById("end_point").value = String(end_lat).substring(0, 7) +
                        "," + String(end_lng).substring(0, 9);
                });
            }
        }

        //Aumenta el zoom al mapa
        function zoomIn() {
            map.zoomIn();
            contextmenu.style.visibility = "hidden";
        }

        //Disminuye el zoom al mapa
        function zoomOut() {
            map.zoomOut();
            contextmenu.style.visibility = "hidden";
        }

        //Centra el mapa
        function setCenter() {
            map.setCenter(point);
        }

        //Borra todos los overlays del mapa, es decir, la ruta,los markers, las flechas.
        function clearMarkers() {
            map.clearOverlays();
            document.getElementById("initial_point").value = '';
            document.getElementById("end_point").value = '';
            countInitial = 0;
            countFinal = 0;
            contextmenu.style.visibility = "hidden";
        }

        //Funcion para que se no muestre el menu desplegable si se hace click en otra parte del mapa
        GEvent.addListener(map, 'click', function (overlay, latlng) {
            contextmenu.style.visibility = "hidden";
        });

    } else {
        alert("Your Browser Is Not Compatible");
    }
}

//Metodo que hace la llamada asincrona al controlador, pasando los parametros
//correspondientes y evaluando la respuesta dada por este


function findRoute() {
    var init_lat_lng = init_lat + "," + init_lng;
    var end_lat_lng = end_lat + "," + end_lng;
    var bus;
    var getVars = "?initial_point=" + init_lat_lng + "&end_point=" + end_lat_lng;

    var request = GXmlHttp.create();
    request.open('GET', 'map/find_route' + getVars, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {

            var success = false;
            var content = "Error contacting web service";
            try {
                res = eval("(" + request.responseText + ")");
                content = res.content;
                success = res.success;
                bus = res.bus;
                route_explain = res.route_explain;
                bus_explain = res.bus_explain;
            } catch (e) {
                success = false;
            }
            if (!success) {
                alert(content);
                //Si se hace de nuevo una peticion y hay error entonces esconder panel
                $('#sidebar').hide();
                $('#explain').show();
            } else {
                $('#sidebar').show();
                //Esconde la explicación de la aplicación
                $('#explain').hide();
                parseContent(content);
                createSideBarPannel(route_explain);
                if (bus == null || bus.length == 0) {
                    $('#sidebar-bus-list').hide();
                } else {
                    $('#sidebar-bus-list').show();
                    parseContentBuses(bus);
                    createBusesSidebar(bus_explain);
                }
            }
        }
    };
    request.send(null);
    return false;
}


function parseContentBuses(content,bus_explain) {
    buses_hash = {};
    var size = content.length-1;
    for (var i = 0; i <= size; i++) {
        var id = content[i].id;
        var bus_id = content[i].bus_id;
        var lat_start = content[i].lat_start;
        var long_start = content[i].long_start;
        var status = content[i].status;

        buses_hash[i] = {
            id: id,
            bus_id: bus_id,
            lat_start: lat_start,
            long_start: long_start,
            status: status
        };
    }
    //Agrego este ultimo registro falso, ya que debo recorrer el arreglo y comparar el siguiente id del bus
    /*   buses_hash[size] = {
     id: -1,
     bus_id: 99999,
     lat_start: content[size - 1].lat_start,
     long_start: content[size - 1].long_start,
     status: "inactive"
     };*/
    //AssignRandomColor(size);
    //addBusesSidebar(buses_hash);
    createBusesOverlays(size);
    //drawPolyline_bus(buses_hash);
}

//Obtiene el resultado enviado por el controlador, lo pone en un hash, luego llama al metodo
//drawPolyline para pintar la ruta
function parseContent(content) {

    infoRouteHash = {};
    latlng_street = [];
    latlng_metro = [];
    size = content.length;

    for (var i = 0; i < size; i++) {
        var id = content[i].id;
        var lat_start = content[i].lat_start;
        var long_start = content[i].long_start;
        var lat_end = content[i].lat_end;
        var long_end = content[i].long_end;
        var stretch_type = content[i].stretch_type;
        var way_type_a = content[i].way_type_a;
        var street_name_a = content[i].street_name_a;
        var prefix_a = content[i].prefix_a;
        var common_name_a = content[i].common_name_a;
        var distance = parseFloat(content[i].distance);
        var label_a = content[i].label_a;
        var way_type_b = content[i].way_type_b;
        var street_name_b = content[i].street_name_b;
        var prefix_b = content[i].prefix_b;
        var label_b = content[i].label_b;
        var common_name_b = content[i].common_name_b;
        var bearing = parseFloat(content[i].bearing);
        var direction = content[i].direction;
        var new_direction = content[i].new_direction;
        var related_id = content[i].related_id;
        var has_relation = content[i].has_relation;

        //getBearing(lat_start,long_start,lat_end,long_end);
        infoRouteHash[i] = {
            id: id,
            lat_start: lat_start,
            long_start: long_start,
            lat_end: lat_end,
            long_end: long_end,
            stretch_type: stretch_type,
            way_type_a: way_type_a,
            street_name_a: street_name_a,
            prefix_a: prefix_a,
            common_name_a: common_name_a,
            distance: distance,
            label_a: label_a,
            way_type_b: way_type_b,
            street_name_b: street_name_b,
            prefix_b: prefix_b,
            label_b: label_b,
            common_name_b: common_name_b,
            bearing: bearing,
            direction: direction,
            related_id: related_id,
            new_direction: new_direction,
            has_relation: has_relation
        };

        //type 3: start of a metro station
        if (stretch_type == '3') {
            id_metro_related = id;
            infoRouteHash[i].related_id = id_metro_related;
        }
        //type 2: metro station's path
        if (stretch_type == '2') {
            infoRouteHash[i].related_id = id_metro_related;
        }

        /* console.debug("\ni: "+i+ " el ID: " + id + " INIT: " + lat_start+"," + long_start +
         " END: " + lat_end + "," + long_end + " BEARING: " + bearing + " DIRECTION: " + direction  +
         " STREET_NAME_A: " + way_type_a + street_name_a +
         " COMMON_A: " +common_name_a+ " STREET_NAME_B: "+ way_type_b + street_name_b + " STRETCH_TYPE: " + stretch_type+
         " COMMON_B: " +common_name_b + " RELATED " +infoRouteHash[i].related_id + " DISTANCE: " + distance);
         */
        //Se pone en este array todas las coordenadas que se van a pintar
        latlng_street.push(new GLatLng(lat_start, long_start));
        if (parseInt(stretch_type) >= 2) {
            latlng_metro.push(new GLatLng(lat_start, long_start));
        }
    }
    //Se adiciona el ulitmo trayecto
    latlng_street.push(new GLatLng(lat_end, long_end));

    document.getElementById("initial_point").value = infoRouteHash[0].way_type_a + ' ' + infoRouteHash[0].street_name_a;
    document.getElementById("end_point").value = way_type_b + ' ' + street_name_b;
    //Se eliminar los overlays existentes, en caso tal se haga otro llamado al controlador
    clearExistingOverlays();
    //Posiciona el init_marker y el end_marker en base a la coordenada más cercana que se encontró
    setLatLngMarkers(infoRouteHash[0].lat_start, infoRouteHash[0].long_start, infoRouteHash[size - 1].lat_end, infoRouteHash[size - 1].long_end);
    drawPolyline(latlng_street, latlng_metro);
    size_infoHash = Object.size(infoRouteHash);
}

//Obtenido de http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
//Método para obtener el tamaño de un hash
Object.size = function (obj) {
    var size = 0,key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//}
//Si el usuario redimensiona la página, el mapa y otros elementos se deben redimensionar
window.onresize = handleResize;
window.onload = handleResize;
window.onload = init;
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker
