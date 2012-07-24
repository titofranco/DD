var Bus = function() {

    var self = this;
    var obj;
    var overlay;

    self.initialize = initialize;
    self.clearOverlays = clearOverlays;
    self.obj = obj;

    function initialize(route, explanation) {
        overlay = [];
        obj = {};
        $('#sidebar-bus-list').show();
        $("#sidebar-bus-list").html(explanation);
        parse(route);
        createOverlays(route.length - 1);
    }

    function parse(route) {
        var size = route.length - 1;
        for (var i = 0; i <= size; i++) {
            var id = route[i].id;
            var bus_id = route[i].bus_id;
            var lat_start = route[i].lat_start;
            var long_start = route[i].long_start;
            var status = route[i].status;

            obj[i] = {
                id: id,
                bus_id: bus_id,
                lat_start: lat_start,
                long_start: long_start,
                status: status
            };
        }
    }

    //Función para pintar sólo una ruta de bus
    $(".sidebar-item-bus input").live('click', function() {
        var bus_id = $(this).data('bus_id');
        //Obtiene el objeto GPolyline para un bus_id especifico y pone su estado en activo
        var polyline = getPolyline(bus_id, "active");
        map.obj().addOverlay(polyline);
        //Obtiene la posicion del overlay para saber donde pintar los iconos de los buses
        var pos = overlayPosition(bus_id);

        if ($(this).parent().hasClass("current")) {
            $(this).parent().removeClass("current");
            removePolyline(bus_id);
            map.obj().removeOverlay(overlay[pos].initMarker);
            map.obj().removeOverlay(overlay[pos].endMarker);
        } else {
            $(this).parent().addClass("current");
            map.obj().addOverlay(overlay[pos].initMarker);
            map.obj().addOverlay(overlay[pos].endMarker);

        }
    });

    //Obtiene toda la polilinea de un bus en especifico, además pone su estado en
    //activo o inactivo dependiendo si se pinta o si se elimina del mapa
    function getPolyline(bus_id, status) {
        var size = Object.size(overlay);
        var polyline;
        for (var i = 0; i < size; i++) {
            if (bus_id == overlay[i].bus_id) {
                polyline = overlay[i].polyline;
                if (status == "active") {
                    overlay[i].status = "active";
                } else {
                    overlay[i].status = "inactive";
                }
                break;
            }
        }
        return polyline;
    }

    //Se crean todos los overlays para los buses y se crean datos especificos de cada
    //ruta de bus. initLatLng y endLatLng es la lat-lng inicial y final de la poliline
    //initMarker y endMarker  son los iconos de los buses que indican el inicio
    //y el fin de la ruta de bus
    function createOverlays(size) {
        var j = 0;
        var latLng = [];
        for(var i = 0; i < size; i++){
            if(obj[i].bus_id == obj[i+1].bus_id) {
                latLng.push(new GLatLng(obj[i].lat_start, obj[i].long_start));
            }
            else {
                latLng.push(new GLatLng(obj[i].lat_start, obj[i].long_start));
                var polyline = new GPolyline(latLng, color(), 4, 1);
                var markers = createMarkers(obj[i].bus_id);
                overlay[j] = {
                    bus_id     :obj[i].bus_id,
                    polyline   :polyline,
                    initLatLng :markers.initLatLng,
                    endLatLng  :markers.endLatLng,
                    initMarker :markers.initMarker,
                    endMarker  :markers.endMarker
                };
                latLng = [];
                j++;
            }
        }
    }

    function color() {
        var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        while(color.length <= 6) {
            color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        return color;
    }


    function clearOverlays() {
        var size = Object.size(overlay);
        //Remueve todas las polilineas y markers de rutas de buses activos
        for (var i=0; i<size; i++) {
            if (overlay[i].status == "active") {
                map.obj().removeOverlay(overlay[i].initMarker);
                map.obj().removeOverlay(overlay[i].endMarker);
                removePolyline(overlay[i].bus_id);
            }
        }
    }

    //Remueve la polylinea del bus seleccionada
    function removePolyline(bus_id) {
        var polyline = getPolyline(bus_id, "inactive");
        map.obj().removeOverlay(polyline);
    }

    //Obtiene la posicion del overlay dado el bus_id
    function overlayPosition(bus_id){
        var size = Object.size(overlay);
        var pos;
        for (var i=0; i<size; i++) {
            if (overlay[i].bus_id == bus_id) {
                pos = i;
                break;
            }
        }
        return pos;
    }

    //Crea los markes para el inicio y el fin de la ruta y los retorna para que
    //despues sean almacenados en overlay
    function createMarkers(bus_id) {
        var initLatLng;
        var endLatLng;
        var initMarker;
        var endMarker;
        var size = Object.size(obj);
        var icon = createIcon();

        for (var i = 0; i < size; i++) {
            if (bus_id == obj[i].bus_id) {
                var lat_start = obj[i].lat_start;
                var long_start = obj[i].long_start;
                initLatLng = new GLatLng(lat_start, long_start);
                initMarker = new GMarker(initLatLng, icon);
                while (bus_id == obj[i].bus_id) {
                    i++;
                }
                var lat_end = obj[i-1].lat_start;
                var long_end = obj[i-1].long_start;
                endLatLng = new GLatLng(lat_end, long_end);
                endMarker = new GMarker(endLatLng, icon);
                //console.debug(" el lat_start " + lat_start + " lat end " + lat_end + " bus_id " + buses[i-1].bus_id);
            }
        }
        return {initLatLng:initLatLng, endLatLng:endLatLng,
                initMarker:initMarker, endMarker:endMarker};
    }

    function createIcon() {
        var icon = new GIcon();
        icon.image = "http://www.google.com/mapfiles/ms/micons/bus.png";
        icon.shadow = "http://www.google.com/mapfiles/ms/micons/bus.shadow.png";
        icon.iconAnchor = new GPoint(9, 34);
        icon.shadowSize = new GSize(37, 34);
        return icon;
    }

    function obj() {
        return obj;
    }

    return self;
};
