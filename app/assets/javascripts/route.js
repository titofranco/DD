var Route = function() {

    //It stores all route's geographics coordinates
    var latLng;
    var metroLatLng;
    var marker;
    var arrow;
    var polyline;
    var selectedPolyline;
    var metroPolyline;
    var obj;
    var self = this;

    self.initialize = initialize;
    self.clearOverlays = clearOverlays;

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
    }

    function objSize() {
        return Object.size(obj);
    }

    function renderPolyline() {
        polyline = new GPolyline(latLng, '#FF6633', 7, 0.8);
        map.obj().addOverlay(polyline);
        metroPolyline = new GPolyline(metroLatLng, '#FF6633', 4, 1);
        map.obj().addOverlay(metroPolyline);
    }

    //Este metodo es para asignar la lat-lng más cercana al marker a el startMarker y al endMarker
    function setLatLngMarkers() {
        var size = Object.size(obj);
        var lat_start = obj[0].lat_start;
        var long_start = obj[0].long_start;
        var lat_end = obj[objSize()-1].lat_end;
        var long_end = obj[objSize()-1].long_end;
//        console.log("lat_end " );
        map.startMarker().setLatLng(new GLatLng(lat_start, long_start));
        map.endMarker().setLatLng(new GLatLng(lat_end, long_end));
    }


    /*Pinta el trayecto seleccionado en sidebar, crea el marker y pinta una flecha
     dependiento hacia donde se debe girar*/
    $('.sidebar-item a').live('click', function() {
        var id = $(this).data('index') ;
        //Pinta de nuevo toda la ruta y el trayecto seleccionado en sidebar
        map.obj().addOverlay(polyline);
        if (selectedPolyline) { map.obj().removeOverlay(selectedPolyline); }
        selectedPolyline = getSelectedPolyline(id);
        map.obj().addOverlay(selectedPolyline);

        //Pinta una flecha verde, para indicar la posición elegida en sidebar
        //Url para arrow: http://maps.google.com/mapfiles/arrow.png  http://maps.google.com/mapfiles/arrowshadow.png
        var current_loc_icon = new GIcon();
        current_loc_icon.image = "http://www.google.com/mapfiles/ms/micons/blue-pushpin.png";
        current_loc_icon.shadow = "http://www.google.com/mapfiles/ms/micons/pushpin_shadow.png";
        current_loc_icon.iconAnchor = new GPoint(9, 34);
        current_loc_icon.shadowSize = new GSize(37, 34);

        //Si el marker existe entonces hay que quitarlo del mapa
        if(marker != null) {
            map.obj().removeOverlay(marker);
        }
        //Obtiene la posición lat-lng y pinta el pin marker y una flecha indicando hacia donde debe girar, l
        //Luego enfoca el mapa hacia ese punto
        var latlng_current_loc = new GLatLng(obj[id].lat_start, obj[id].long_start);
        marker = new GMarker(latlng_current_loc, {
            icon:current_loc_icon
        });
        map.obj().panTo(latlng_current_loc);
        map.obj().addOverlay(marker);
        midArrows(id);
    });

    $(".sidebar-item").live('click', function() {
        $(".sidebar-item").removeClass("current");
        $(this).addClass("current");
    });



    //Obtiene el resultado enviado por el controlador, lo pone en un hash, luego llama al metodo
    //drawPolyline para pintar la ruta
    function parse(route) {
        var size = route.length;

        for (var i = 0; i < size; i++) {
            var id = route[i].id;
            var lat_start = route[i].lat_start;
            var long_start = route[i].long_start;
            var lat_end = route[i].lat_end;
            var long_end = route[i].long_end;
            var stretch_type = route[i].stretch_type;
            var way_type_a = route[i].way_type_a;
            var street_name_a = route[i].street_name_a;
            var prefix_a = route[i].prefix_a;
            var common_name_a = route[i].common_name_a;
            var distance = parseFloat(route[i].distance);
            var label_a = route[i].label_a;
            var way_type_b = route[i].way_type_b;
            var street_name_b = route[i].street_name_b;
            var prefix_b = route[i].prefix_b;
            var label_b = route[i].label_b;
            var common_name_b = route[i].common_name_b;
            var bearing = parseFloat(route[i].bearing);
            var direction = route[i].direction;
            var new_direction = route[i].new_direction;
            var related_id = route[i].related_id;
            var has_relation = route[i].has_relation;

            //getBearing(lat_start,long_start,lat_end,long_end);
            obj[i] = {
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
                obj[i].related_id = id_metro_related;
            }
            //type 2: metro station's path
            if (stretch_type == '2') {
                obj[i].related_id = id_metro_related;
            }

            /* console.debug("\ni: "+i+ " el ID: " + id + " INIT: " + lat_start+"," + long_start +
             " END: " + lat_end + "," + long_end + " BEARING: " + bearing + " DIRECTION: " + direction  +
             " STREET_NAME_A: " + way_type_a + street_name_a +
             " COMMON_A: " +common_name_a+ " STREET_NAME_B: "+ way_type_b + street_name_b + " STRETCH_TYPE: " + stretch_type+
             " COMMON_B: " +common_name_b + " RELATED " +obj[i].related_id + " DISTANCE: " + distance);
             */
            //Se pone en este array todas las coordenadas que se van a pintar
            latLng.push(new GLatLng(lat_start, long_start));
            if (parseInt(stretch_type) >= 2) {
                metroLatLng.push(new GLatLng(lat_start, long_start));
            }
        }
        //Se adiciona el ulitmo trayecto
        latLng.push(new GLatLng(lat_end, long_end));

        $("#start_point").val(obj[0].way_type_a + ' ' + obj[0].street_name_a);
        $("#end_point").val(way_type_b + ' ' + street_name_b);

    }


    //Obtiene la polilinea conformada por un conjunto de trayectos, basada en el id_related
    function getSelectedPolyline(id) {
        var pointSelectedPolyline = [];
        var id_related;
        for (var i = 0; i < objSize(); i++) {
            id_related = obj[id].related_id;
            if (obj[i].related_id == id_related) {
                pointSelectedPolyline.push(new GLatLng(obj[i].lat_start, obj[i].long_start));
                pointSelectedPolyline.push(new GLatLng(obj[i].lat_end, obj[i].long_end));
            }
        }
        var selectedPolyline = new GPolyline(pointSelectedPolyline, '#FFFFFF', 3, 0.8);
        return selectedPolyline;
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

    //Funcion que dibuja triangulos hacia la dirección que se va.
    function midArrows(id) {
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

        var arrowIcon = createArrow(dir);
        if (arrow) {  map.obj().removeOverlay(arrow); }
        arrow = new GMarker( new GLatLng(obj[last_id].lat_end, obj[last_id].long_end), arrowIcon);
        map.obj().addOverlay(arrow);
    }

    //Enfoca la linea del metro cuando se hace clic sobre el sidebar-item-id correspondiente
    function focusMetro(id_metro_related){
        var selected_station = [];
        map.obj().addOverlay(polyline);

        for (var i = 0; i < objSize(); i++) {
            if (obj[i].related_id == id_metro_related) {
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
        if (selectedPolyline) {map.obj().removeOverlay(selectedPolyline);}
        if (marker) {map.obj().removeOverlay(marker);}
        if (arrow) {map.obj().removeOverlay(arrow);}
    }

    return self;
};
