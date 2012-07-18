# -*- coding: utf-8 -*-
module SidePannel

  #With this I'll know where to turn given 2 cardinal points
  def SidePannel.eval_direction(comes_from, goes_to)
    tell=nil
    case comes_from
    when "Norte"
      tell=where_to_turn_n(goes_to)
    when "Sur"
      tell=where_to_turn_s(goes_to)
    when "Oriente"
      tell=where_to_turn_e(goes_to)
    when "Occidente"
      tell=where_to_turn_w(goes_to)
    when "Nororiente"
      tell=where_to_turn_ne(goes_to)
    when "Noroccidente"
      tell=where_to_turn_nw(goes_to)
    when "Suroriente"
      tell=where_to_turn_se(goes_to)
    when "Suroccidente"
      tell=where_to_turn_sw(goes_to)
    end

    return tell
  end

  #NORTE - NORTH
  def SidePannel.where_to_turn_n(goes_to)

    case goes_to
    when "Oriente"
      turn = "a la derecha"
    when "Noroccidente", "Suroccidente"
      turn = "ligeramente a la izquierda en dirección " + goes_to
    when "Nororiente", "Suroriente"
      turn = "ligeramente a la derecha en dirección " + goes_to
    when "Occidente"
      turn = "a la izquierda"
    when "Sur"
      turn = "en giro en U"
    end
    return turn
  end

  #OCCIDENTE - WEST
  def SidePannel.where_to_turn_w(goes_to)

    case goes_to
    when "Norte"
      turn = "a la derecha"
    when "Noroccidente", "Nororiente"
      turn = "ligeramente a la derecha en dirección " + goes_to
    when "Sur"
      turn = "a la izquierda"
    when "Suroccidente", "Suroriente"
      turn = "ligeramente a la izquierda en dirección " + goes_to
    when "Oriente"
      turn = "en giro en U"
    end
    return turn
  end

  #ORIENTE - EAST
  def SidePannel.where_to_turn_e(goes_to)

    case goes_to
    when "Norte"
      turn = "a la izquierda"
    when "Noroccidente", "Nororiente"
      turn = "ligeramente a la izquierda en dirección " + goes_to
    when "Sur"
      turn = "a la derecha"
    when "Suroccidente", "Suroriente"
      turn = "ligeramente a la derecha en dirección " + goes_to
    when "Occidente"
      turn = "en giro en U"
    end
    return turn
  end

  #SUR - SOUTH
  def SidePannel.where_to_turn_s(goes_to)

    case goes_to

    when "Oriente"
      turn = "a la izquierda"
    when "Noroccidente", "Suroccidente"
      turn = "ligeramente a la derecha en dirección " + goes_to
    when "Nororiente", "Suroriente"
      turn = "ligeramente a la izquierda en dirección " + goes_to
    when "Occidente"
      turn = "a la derecha"
    when "Norte"
      turn = "en giro en U"
    end
    return turn
  end

  #SUROCCIDENTE - SOUTHWEST
  def SidePannel.where_to_turn_sw(goes_to)

    case goes_to
    when "Norte"
      turn = "a la derecha"
    when "Noroccidente", "Occidente"
      turn = "ligeramente a la derecha en dirección " + goes_to

    when "Sur", "Suroriente"
      turn = "ligeramente a la izquierda en dirección " + goes_to

    when "Oriente"
      turn = "a la izquierda"

    when "Nororiente"
      turn = "en giro en U"
    end
    return turn
  end

  #SURORIENTE - SOUTHEAST
  def SidePannel.where_to_turn_se(goes_to)

    case goes_to
    when"Norte"
      turn = "a la izquierda"
    when "Nororiente", "Oriente"
      turn = "ligeramente a la izquierda en dirección " + goes_to
    when "Sur", "Suroccidente"
      turn = "ligeramente a la derecha en dirección " + goes_to
    when "Occidente"
      turn = "a la derecha"
    when "Noroccidente"
      turn = "en giro en U"
    end
    return turn
  end

  #NOROCCIDENTE - NORTHWEST
  def SidePannel.where_to_turn_nw(goes_to)

    case goes_to
    when"Oriente"
      turn = "a la derecha"
    when "Occidente", "Suroccidente"
      turn = "ligeramente a la izquierda en dirección " + goes_to
    when "Norte", "Nororiente"
      turn = "ligeramente a la derecha en dirección " + goes_to
    when "Sur"
      turn = "a la izquierda"
    when "Suroriente"
      turn = "en giro en U"
    end
    return turn
  end

  #NORORIENTE - NORTHEAST
  def SidePannel.where_to_turn_ne(goes_to)

    case goes_to
    when"Sur"
      turn = "a la derecha"
    when "Norte", "Noroccidente"
      turn = "ligeramente a la izquierda en dirección " + goes_to
    when "Oriente", "Suroriente"
      turn = "ligeramente a la derecha en dirección " + goes_to
    when "Occidente"
      turn = "a la izquierda"
    when "Suroccidente"
      turn = "en giro en U"
    end
    return turn
  end


  def SidePannel.explainRoute(infoRoute)

    continueStraight, estacion_metro = false
    first_node = true
    i=0
    j=1
    size = infoRoute.length
    explain, turn, curr_dir, prev_dir, curr_stretch_type, prev_stretch_type, curr_bearing, prev_bearing = nil

    total_distance = getTotalDistanceRoute(infoRoute)
    total_time = getTimeAprox(total_distance)

    explain = '<li class="route-explain">' +
      '<b class="header">Indicaciones de ruta a pie para llegar a tu lugar de destino</b>' +
      '<table><br><tr><td><b>Distancia aproximada: </b></td><td>' + total_distance.to_s +
      ' metros</td></tr>' +'<tr><td><b>Tiempo aproximado caminando a 3km/h: </b></td><td>' +
      total_time.to_s + ' minutos</td></tr>' +
      '</table></li>'

    for i in 0 ... infoRoute.length - 1
      #I assign (direction and stretch_type) current and previous
      if i>0
        prev_stretch_type = infoRoute[i-1][:stretch_type]
        curr_stretch_type = infoRoute[i][:stretch_type]
        prev_dir = infoRoute[i-1][:new_direction]
        curr_dir = infoRoute[i][:new_direction]
      end

      if first_node

        explain += '<li id=sidebar-item-' + i.to_s + ' >' +
          '<a href="#" onclick="javascript:focusPoint(' + i.to_s + ')">' +
          j.to_s + ". " + "Dirigete en dirección <b>" + infoRoute[i][:direction] +
          "</b> hacia la " +"<b>"+ infoRoute[i][:way_type_b] +  " " +
          infoRoute[i][:street_name_b] + " (metros: " + getDistance(i,infoRoute) + ")" +
          "</b></a></li>"

        first_node = false
        j = j+1
      elsif prev_dir != curr_dir && curr_stretch_type==1
        turn = eval_direction(prev_dir, curr_dir)

        explain += '<li id=sidebar-item-' + i.to_s+' >' +
          '<a href="#" onclick="javascript:focusPoint(' + i.to_s + ')">' +
          j.to_s + ". Voltear " + "<b>"+ turn + "</b> por <b>" +
          infoRoute[i][:way_type_b] +  " " + infoRoute[i][:street_name_b]

        if infoRoute[i][:has_relation]
          intersection = infoRoute[i][:street_name_b].index('-')

          if intersection
            explain += '</b> y continúa por <b>' + infoRoute[i][:way_type_b] +
              ' ' + infoRoute[i][:street_name_b].slice(0, intersection)

          end
        end
        explain +=  " (metros: " + getDistance(i, infoRoute) + ")</b></a></li>"
        j = j+1
        #Here for the metro station
        #If the algorithm choose stretch_type 4 and then 3 it means the next nodes are type 2
        #therefore a metro's station has been choosen
      elsif prev_stretch_type==4 && curr_stretch_type==3
        estacion_metro = true

      elsif prev_stretch_type==3 && curr_stretch_type==2 && estacion_metro==true

        explain += '<li id=sidebar-item-' + i.to_s + ' >' +
          '<a href="#" onclick="javascript:focusMetro(' + infoRoute[i-1][:related_id] + ')">' +
          j.to_s + ". Ve de la estación <b> " + infoRoute[i-1][:common_name_a]

        j = j+1

        #if it finds a stretch_type 3 it means it reached the end of the metro station
      elsif estacion_metro && (prev_stretch_type==2 && curr_stretch_type==3)
        explain += ' hasta la estación <b>' + infoRoute[i].common_name_a + '</b></a></li>'

        #if it finds a stretch_type 4 is because he got off the train and is going to some street
      elsif prev_stretch_type==3 && curr_stretch_type==4

        explain += '<li id=sidebar-item-' + i.to_s+' >' +
          '<a href="#" onclick="javascript:focusPoint(' + i.to_s + ')">'+ j.to_s +
          ". Baja de la estación " + infoRoute[i-1][:common_name_a] +
          " dirigete por el <b>"+ infoRoute[i][:common_name_b] +  " " +
          infoRoute[i][:street_name_a] + " (metros:" + infoRoute[i][:distance] + ")</b></a></li>"

        estacion_metro = false
        j = j+1
      end
      #end for
    end

    #If we have more than  2 nodes then we proceed to end the explanation
    if size > 1
      final = nil
      if infoRoute[size-2][:direction] == infoRoute[size-1][:direction]

        final = j.to_s + ". " +'Continúa hasta encontrar tu lugar de destino' +
          "<b> (metros: " + getDistance(i+1, infoRoute) + ")</b>"

      else
        turn = eval_direction(infoRoute[size-2][:direction],infoRoute[size-1][:direction])

        final = j.to_s + ". " + 'Voltea <b> '+ turn +
          '</b> hasta llegar a tu lugar destino </b>' +
          "<b> (metros: " + getDistance(i+1, infoRoute) + ")</b>"

      end

      explain += '<li id=sidebar-item-'+(i+1).to_s+' >' +
        '<a href="#" onclick="javascript:focusPoint('+(i+1).to_s+')">' +
        final + '</a></li>'
    else
      explain += '<li id=sidebar-item-'+ 0 +' >' +
        '<a href="#" onclick="javascript:focusPoint('+ 0 +')">'+
        "1. Dirigete en dirección <b>" + infoRoute[i][:direction] +
        "</b> hacia la <b>" + infoRoute[i][:way_type_b] +  " " + infoRoute[i][:street_name_b] +
        "</b> hasta llegar a tu lugar de destino (metros: "+ getDistance(i+1,infoRoute) +
        ")</b></a></li>"
    end
    explain
  end

  #It gets the distance of a group of trajectories that have the same related_id
  def SidePannel.getDistance(index, infoRoute)
    total_distance = 0
    for i in 0 ... infoRoute.length
      id_related = infoRoute[index][:related_id]
      if infoRoute[i][:related_id] == id_related
        total_distance += infoRoute[i][:distance].to_f
      end
    end
    return sprintf('%.2f', total_distance).to_s
  end

  def SidePannel.getTotalDistanceRoute(infoRoute)
    total_distance = 0
    infoRoute.each{ |ir| total_distance += ir[:distance].to_f }
    return sprintf('%2.f',total_distance).to_s
  end

  def SidePannel.getTimeAprox(total_distance)
    time_aprox= (total_distance.to_f * 60)/3000
    return sprintf('%2.f', time_aprox)
  end


  def SidePannel.explainBusRoute(infoBuses)

    explain = '<hr><li class="route-explain">'+
      '<b class="header">Indicación de ruta de bus cercana</b></li>'
    for i in 0 ... infoBuses.length - 1
      if(infoBuses[i][:bus_id] != infoBuses[i+1][:bus_id])
        explain += '<span class=buses-checkbox> <li id=sidebar-item-bus'+ infoBuses[i][:bus_id].to_s+' >'+
          '<input type="checkbox" name="chk'+infoBuses[i][:bus_id].to_s+'"' +
          ' onClick="javascript:drawSelectedPolyline_bus('+"this,"+infoBuses[i][:bus_id].to_s+')">' +
          " Ruta numero " + infoBuses[i][:bus_id].to_s + "</li></span>"
      end
    end
    explain
  end

end
