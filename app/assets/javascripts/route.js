var Route = function() {

    //It stores all route's geographics coordinates
    var latLng;
    var metroLatLng;
    var pin;
    var arrow;
    var polyline;
    var selectedPath;
    var metroPolyline;
    var obj;
    var self = this;

    self.initialize = initialize;
    self.clearOverlays = clearOverlays;
    self.obj = obj;
    self.objSize = objSize;

    function initialize(route, explain) {
        latLng = [];
        metroLatLng = [];
        obj = {};
        $('#explain').hide();
        $('#sidebar').show();
        $("#sidebar-list").html(explain);
        parse(route);
        //Posiciona el init_marker y el end_marker en base a la coordenada más cercana que se encontró
        setLatLngMarkers();
        renderPolyline();
        updateFieldCoordinates();
    }

    //Obtiene el resultado enviado por el controlador, lo pone en un hash, luego llama al metodo
    //drawPolyline para pintar la ruta
    function parse(route) {
        for (var i = 0; i < route.length; i++) {
            //type 3: start of a metro station
            if (route[i].stretch_type == '3') {
                metroRelatedId = id;
                route[i].related_id = metroRelatedId;
            }
            //type 2: metro station's path
            if (route[i].stretch_type == '2') { route[i].related_id = metroRelatedId; }
            /* console.debug("\ni: "+i+ " el ID: " + id + " INIT: " + lat_start+"," + long_start +
             " END: " + lat_end + "," + long_end + " BEARING: " + bearing + " DIRECTION: " + direction  +
             " STREET_NAME_A: " + way_type_a + street_name_a +
             " COMMON_A: " +common_name_a+ " STREET_NAME_B: "+ way_type_b + street_name_b + " STRETCH_TYPE: " + stretch_type+
             " COMMON_B: " +common_name_b + " RELATED " +route[i].related_id + " DISTANCE: " + distance);
             */
            //Se pone en este array todas las coordenadas que se van a pintar
            latLng.push(new GLatLng(route[i].lat_start, route[i].long_start));
            if (parseInt(route[i].stretch_type) >= 2) {
                metroLatLng.push(new GLatLng(route[i].lat_start, route[i].long_start));
            }
        }
        obj = route;
        //Se adiciona el ulitmo trayecto
        latLng.push(new GLatLng(route[objSize() - 1].lat_end, route[objSize() - 1].long_end));
    }

    //Este metodo es para asignar la lat-lng más cercana al marker a el startMarker y al endMarker
    function setLatLngMarkers() {
        var size = Object.size(obj);
        var lat_start = obj[0].lat_start;
        var long_start = obj[0].long_start;
        var lat_end = obj[objSize()-1].lat_end;
        var long_end = obj[objSize()-1].long_end;

        map.startMarker().setLatLng(new GLatLng(lat_start, long_start));
        map.endMarker().setLatLng(new GLatLng(lat_end, long_end));
    }


    function renderPolyline() {
        polyline = new GPolyline(latLng, '#FF6633', 7, 0.8);
        map.obj().addOverlay(polyline);
        metroPolyline = new GPolyline(metroLatLng, '#FF6633', 4, 1);
        map.obj().addOverlay(metroPolyline);
    }

    function updateFieldCoordinates() {
        $("#start_point").val(obj[0].way_type_a + ' ' + obj[0].street_name_a);
        $("#end_point").val(obj[objSize() - 1].way_type_b + ' ' + obj[objSize() - 1].street_name_b);
    }

    /*Pinta el trayecto seleccionado en sidebar, crea el marker y pinta una flecha
     dependiento hacia donde se debe girar*/
    $('.sidebar-item a').live('click', function() {
        var id = $(this).data('index');
        renderSelectedPath(id);
        renderPin(id);
        renderArrow(id);
        $(".sidebar-item").removeClass("current");
        $(this).parent().addClass("current");
    });

    //Obtiene la polilinea conformada por un conjunto de trayectos, basada en el id_related
    function renderSelectedPath(id) {
        var pLatLng = [];
        var id_related = obj[id].related_id;
        for (var i = 0; i < objSize(); i++) {
            if (obj[i].related_id == id_related) {
                pLatLng.push(new GLatLng(obj[i].lat_start, obj[i].long_start));
                pLatLng.push(new GLatLng(obj[i].lat_end, obj[i].long_end));
            }
        }

        //Pinta de nuevo toda la ruta y el trayecto seleccionado en sidebar
        map.obj().addOverlay(polyline);
        if (selectedPath) { map.obj().removeOverlay(selectedPath); }
        selectedPath = new GPolyline(pLatLng, '#FFFFFF', 3, 0.8);
        map.obj().addOverlay(selectedPath);
    }

    //Pinta una flecha verde, para indicar la posición elegida en sidebar
    //Url para arrow: http://maps.google.com/mapfiles/arrow.png  http://maps.google.com/mapfiles/arrowshadow.png
    function renderPin(id) {
        var icon = new GIcon();
        icon.image = "http://www.google.com/mapfiles/ms/micons/blue-pushpin.png";
        icon.shadow = "http://www.google.com/mapfiles/ms/micons/pushpin_shadow.png";
        icon.iconAnchor = new GPoint(9, 34);
        icon.shadowSize = new GSize(37, 34);
       //Si el marker existe entonces hay que quitarlo del mapa
        if(pin) { map.obj().removeOverlay(pin); }
        //Obtiene la posición lat-lng y pinta el pin marker y una flecha indicando hacia donde debe girar, l
        //Luego enfoca el mapa hacia ese punto
        var latLngPin = new GLatLng(obj[id].lat_start, obj[id].long_start);
        pin = new GMarker(latLngPin, {
            icon: icon
        });
        map.obj().panTo(latLngPin);
        map.obj().addOverlay(pin);
    }

    //Funcion que dibuja triangulos hacia la dirección que se va.
    function renderArrow(id) {
        var last_id;
        var related_id = obj[id].related_id;

        for(var i = 0; i < objSize(); i++) {
            if (related_id == obj[i].related_id) {
                last_id = i;
            }
        }
        //Pintar la flecha de la próxima dirección
        if(obj[last_id + 1]) {
            // == round it to a multiple of 3 and cast out 120s
            var dir = Math.round(obj[last_id + 1].bearing/3) * 3;
            while (dir >= 120) {dir -= 120;}
        }

        if (arrow) {  map.obj().removeOverlay(arrow); }

        if (typeof dir !== "undefined") {
            var arrowIcon = createArrow(dir);
            arrow = new GMarker( new GLatLng(obj[last_id].lat_end, obj[last_id].long_end), arrowIcon);
            map.obj().addOverlay(arrow);
        }
    }

    function createArrow(direction) {
        var arrowIcon = new GIcon();
        arrowIcon.iconSize = new GSize(24, 24);
        arrowIcon.shadowSize = new GSize(1, 1);
        arrowIcon.iconAnchor = new GPoint(12, 12);
        arrowIcon.infoWindowAnchor = new GPoint(0, 0);
        // == use the corresponding triangle marker
        arrowIcon.image = "http://www.google.com/intl/en_ALL/mapfiles/dir_"+direction+".png";
        return arrowIcon;
    }

    //Enfoca la linea del metro cuando se hace clic sobre el sidebar-item-id correspondiente
    function focusMetro(metroRelatedId){
        var selected_station = [];
        map.obj().addOverlay(polyline);

        for (var i = 0; i < objSize(); i++) {
            if (obj[i].related_id == metroRelatedId) {
                selected_station.push(new GLatLng(obj[i].lat_start, obj[i].long_start));
                selected_station.push(new GLatLng(obj[i].lat_end, obj[i].long_end));
            }
        }

        metroPolyline = new GPolyline(selected_station);
        map.obj().addOverlay(metroPolyline);
    }

    function clearOverlays() {
        if (metroPolyline) {map.obj().removeOverlay(metroPolyline);}
        if (polyline) { map.obj().removeOverlay(polyline);}
        if (selectedPath) {map.obj().removeOverlay(selectedPath);}
        if (pin) {map.obj().removeOverlay(pin);}
        if (arrow) {map.obj().removeOverlay(arrow);}
    }

    function obj() {
        return obj;
    }

    function objSize() {
        return Object.size(obj);
    }

    return self;
};
