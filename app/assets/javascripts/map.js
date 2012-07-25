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
var bus;
var route;

$(document).ready(function() {
    window.onresize = handleResize;
    handleResize();
    map = new Map();
    map.initialize();
    bus = new Bus();
    route = Route();

    /* The offsetHeight and offsetWidth properties are provided by the browser,
     and return—in pixels—the dimensions of their element, including any padding.*/
    /* Redimensiona el tamño del mapa y de la barra lateral*/
    function handleResize() {
        var height = windowHeight() - $('#toolbar')[0].offsetHeight - 45;
        $('#map').height(height);
        $('#sidebar').height(height - 18);
    }

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

});

var Map = function() {

    var self = this;
    var obj;
    var lat;
    var lng;
    //Variables utilizadas para limitar a que se cree sólo un marker
    var countInitial = 0;
    var countFinal = 0;
    var point;
    var startMarker;
    var endMarker;

    self.initialize = initialize;
    self.obj = obj;
    self.startMarker = startMarker;
    self.endMarker = endMarker;
    self.randomColor = randomColor;

    function initialize() {
        if (GBrowserIsCompatible) {
            obj = new GMap2(document.getElementById("map"));
            customizeUI();
            customizeContextMenu();
        } else {
            alert("Your Browser Is Not Compatible");
        }
    }

    function customizeUI() {
        //6.2201673770;-75.6076627160; Joan's home
        var centerLatitude = 6.27488;
        var centerLongitude = -75.56817;
        var startZoom = 15;
        //If ClientLocation was filled in by the loader, use that info instead
        /*if (google.loader.ClientLocation) {
         centerLatitude = google.loader.ClientLocation.latitude;
         centerLongitude = google.loader.ClientLocation.longitude;
         }
         */
        obj.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
        //        obj.setMapType(G_HYBRID_MAP);
        obj.setUIToDefault();
    }

    //It creates a context menu when user tap right click
    function customizeContextMenu() {
        var contextMenu = $("#contextMenu")[0];
        obj.getContainer().appendChild(contextMenu);

        //Evento para desplegar menú cuando se hace click izquierdo
        GEvent.addListener(obj, "singlerightclick", function (pixel, tile) {
            // store the "pixel" info in case we need it later
            // adjust the context menu location if near an egde
            // create a GControlPosition
            // apply it to the context menu, and make the context menu visible
            var clickedPixel = pixel;
            var x = pixel.x;
            var y = pixel.y;

            if (x > obj.getSize().width - 120) {
                x = obj.getSize().width - 120;
            }

            if (y > obj.getSize().height - 100) {
                y = obj.getSize().height - 100;
            }

            var pos = new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(x, y));
            pos.apply(contextMenu);
            $("#contextMenu").show();
            point = obj.fromContainerPixelToLatLng(clickedPixel);
            lat = point.lat();
            lng = point.lng();
        });

        //Funcion para que se no muestre el menu desplegable si se hace click en otra parte del mapa
        GEvent.addListener(obj, 'click', function (overlay, latlng) {
            $("#contextMenu").hide();
        });
    }

    function createIcon(file) {
        // endMarker.setImage({url:'http://googlemapsbook.com/chapter4/StoreLocationMap/ronjonsurfshoplogo.png'});
        var icon = new GIcon();
        icon.image = "http://www.google.com/mapfiles/" + file;
        icon.shadow = "http://www.google.com/mapfiles/shadow50.png";
        icon.iconSize = new GSize(20, 34);
        icon.iconAnchor = new GPoint(9, 34);
        icon.shadowSize = new GSize(37, 34);
        icon.infoWindowAnchor = new GPoint(24, 24);
        return icon;
    }

    //Obtiene el punto inicial del field, crea el marker y lo habilita para que se pueda arrastrar
    function getInitialPoint() {
        if (countInitial == 0) {
            createStartMarker();
            fillCoordinates(lat, lng, 0);
            countInitial = 1;
            GEvent.addListener(startMarker, "dragend", function () {
                var latitude = startMarker.getPoint().lat();
                var longitude = startMarker.getPoint().lng();
                fillCoordinates(latitude, longitude, 0);
            });
        }
    }

    function createStartMarker() {
        var icon = createIcon("dd-start.png");
        startMarker = new GMarker(point, {
            draggable: true,
            icon: icon
        });
        obj.addOverlay(startMarker);
    }

    function startMarker() {
        return startMarker;
    }

    //Obtiene el punto final del field, crea el marker y lo habilita para que se pueda arrastrar
    function getFinalPoint() {
        if (countFinal == 0) {
            createEndMarker();
            fillCoordinates(lat, lng, 1);
            countFinal = 1;
            GEvent.addListener(endMarker, "dragend", function () {
                var latitude = endMarker.getPoint().lat();
                var longitude = endMarker.getPoint().lng();
                fillCoordinates(latitude, longitude, 1);
            });
        }
    }

    function createEndMarker() {
        var icon = createIcon("dd-end.png");
        endMarker = new GMarker(point, {
            draggable: true,
            icon: icon
        });
        obj.addOverlay(endMarker);
    }

    function endMarker() {
        return endMarker;
    }

    function fillCoordinates(lat, lng, pos) {
        var latitude = String(lat).substring(0, 7);
        var longitude = String(lng).substring(0, 9);
        var value = latitude + "," + longitude;
        pos === 0 ? $("#start_point").val(value) : $("#end_point").val(value);
    }

    //Borra todos los overlays del mapa, es decir, la ruta,los markers, las flechas.
    function clearMarkers() {
        obj.clearOverlays();
        countInitial = 0;
        countFinal = 0;
        $("#start_point").val('');
        $("#end_point").val('');
        $("#contextMenu").hide();
    }

    $('#setStartPoint').live('click', function() {
        getInitialPoint();
        $("#contextMenu").hide();
    });

    $('#setEndPoint').live('click', function () {
        getFinalPoint();
        $("#contextMenu").hide();
    });

    //Aumenta el zoom al mapa
    $('#zoomIn').live('click', function () {
        obj.zoomIn();
        $("#contextMenu").hide();
    });

    $('#zoomOut').live('click', function () {
        obj.zoomOut();
        $("#contextMenu").hide();
    });

    $('#centerMap').live('click', function () {
        obj.setCenter(point);
    });

    $('#clearMarkers').live('click', function () {
        clearMarkers();
    });

    $("#form").submit(function() {
        if($(".start_point").val() == "" || $(".end_point").val() == "") {
            alert("Debe elegir punto inicial y punto final");
            return false;
        }
        findRoute();
        return false;
    });

    //Metodo que hace la llamada asincrona al controlador, pasando los parametros
    //correspondientes y evaluando la respuesta dada por este
    function findRoute() {

        var startLatLng = startMarker.getPoint().lat() + "," + startMarker.getPoint().lng();
        var endLatLng = endMarker.getPoint().lat() + "," + endMarker.getPoint().lng();
        var q = "?start_point=" + startLatLng + "&end_point=" + endLatLng;
        var request = GXmlHttp.create();

        request.open('GET', 'map/find_route' + q, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {

                var success = false;
                var content = "Error contacting web service";
                try {
                    res = eval("(" + request.responseText + ")");
                    content = res.content;
                    success = res.success;
                    var routeExplain = res.route_explain;
                    clearExistingOverlays();

                } catch (e) {
                    success = false;
                }
                if (success) {
                    route.initialize(content, routeExplain);
                    findBusRoute();
                } else {
                    alert(content);
                    //Si se hace de nuevo una peticion y hay error entonces esconder panel
                    $('#explain').show();
                    $('#sidebar').hide();
                }
            }
        };
        request.send(null);
        return false;
    }

    function findBusRoute() {
        var q = "?roadmap_id=" + route.obj()[0].roadmap_id + "," + route.obj()[route.objSize()-1].roadmap_id;
        var request = GXmlHttp.create();
        request.open('GET', 'map/find_bus_route' + q, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                var success = false;
                var content = "Error contacting web service";
                try {
                    res = eval("(" + request.responseText + ")");
                    success = res.success;
                } catch (e) {
                    success = false;
                }
                if (success) {
                    var busRoute = res.bus;
                    var busExplain = res.bus_explain;
                    bus.initialize(busRoute, busExplain);
                } else {
                    $('#sidebar-bus-list').hide();
                }
            }
        };
        request.send(null);
        return false;
    }

    function randomColor() {
        var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        while(color.length <= 6) {
            color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        return color;
    }

    //Se eliminar los overlays existentes, en caso tal se haga otro llamado al controlador
    function clearExistingOverlays() {
        route.clearOverlays();
        bus.clearOverlays();
    }

    function obj() {
        return obj;
    }

    return self;
};

//Obtenido de http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
//Método para obtener el tamaño de un hash
Object.size = function (obj) {
    var size = 0,key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//Valida y si todo está correcto, procede a hacer la llama asincrona al server
//function validar(form) {
//    var validate = checkform(form);
//    if (validate) {
//   }
//}

//Valida que los campos no estén vacios
/*
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
 */

//}
//Pagina 9 capitulo 3 para retornar la latitud longitud del marker
//overlay y latlng son variables ya definidas por google
//allow the user to click the map to create a marker
