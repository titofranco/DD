# -*- coding: utf-8 -*-
module SidePannel

  #With this I'll know where to turn given 2 cardinal points
  def self.eval_direction(comes_from, goes_to)
    case comes_from
    when "Norte"
      tell = where_to_turn_n(goes_to)
    when "Sur"
      tell = where_to_turn_s(goes_to)
    when "Oriente"
      tell = where_to_turn_e(goes_to)
    when "Occidente"
      tell = where_to_turn_w(goes_to)
    when "Nororiente"
      tell = where_to_turn_ne(goes_to)
    when "Noroccidente"
      tell = where_to_turn_nw(goes_to)
    when "Suroriente"
      tell = where_to_turn_se(goes_to)
    when "Suroccidente"
      tell = where_to_turn_sw(goes_to)
    end
    tell
  end

  #NORTE - NORTH
  def self.where_to_turn_n(goes_to)
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
    turn
  end

  #OCCIDENTE - WEST
  def self.where_to_turn_w(goes_to)
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
    turn
  end

  #ORIENTE - EAST
  def self.where_to_turn_e(goes_to)
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
    turn
  end

  #SUR - SOUTH
  def self.where_to_turn_s(goes_to)
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
    turn
  end

  #SUROCCIDENTE - SOUTHWEST
  def self.where_to_turn_sw(goes_to)
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
    turn
  end

  #SURORIENTE - SOUTHEAST
  def self.where_to_turn_se(goes_to)
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
    turn
  end

  #NOROCCIDENTE - NORTHWEST
  def self.where_to_turn_nw(goes_to)
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
    turn
  end

  #NORORIENTE - NORTHEAST
  def self.where_to_turn_ne(goes_to)
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
    turn
  end

  def self.explain_route(route)

    continueStraight, metro_station = false
    first_node = true
    i = 0
    j = 1
    size = route.length
    explain, turn, curr_dir, prev_dir, curr_stretch_type, prev_stretch_type, curr_bearing, prev_bearing = nil

    total_distance = total_distance(route)

    explain =
      '<div class="route-explain">
         <span class="header">Indicaciones de ruta a pie para llegar a tu lugar de destino</span>
         <table>
           <tr>
             <td class="b">Distancia aproximada:</td>
             <td>' + total_distance + ' metros</td>
           </tr>
           <tr>
             <td class="b">Tiempo aproximado caminando a 3km/h:</td>
             <td>'+ avg_time(total_distance) + ' minutos</td>
           </tr>
         </table>
       </div>'

    for i in 0 ... route.length - 1
      #It assigns (direction and stretch_type) current and previous
      if i > 0
        prev_stretch_type = route[i-1][:stretch_type].to_s
        curr_stretch_type = route[i][:stretch_type].to_s
        prev_dir = route[i-1][:new_direction].to_s
        curr_dir = route[i][:new_direction].to_s
      end

      if first_node
        explain +=
          '<li class=sidebar-item>
             <a href="#" data-index=' + i.to_s + '>' +
             j.to_s + ". Dirigete en dirección
             <span class='b'>" + route[i][:direction] + "</span> hacia la
             <span>" + route[i][:way_type_b] +  " " + route[i][:street_name_b] +
             " (metros: " + distance(i, route) + ")</span>
             </a>
          </li>"
        first_node = false
        j = j+1
      elsif prev_dir != curr_dir and curr_stretch_type.eql?("1")
        turn = eval_direction(prev_dir, curr_dir)

        explain +=
          '<li class=sidebar-item>
             <a href="#" data-index=' + i.to_s + '>' +
             j.to_s + ". Voltear <span class='b'> " + turn + "</span> por
             <span class='b'>" + route[i][:way_type_b] + " " + route[i][:street_name_b] + "</span>"

        if route[i][:has_relation]
          intersection = route[i][:street_name_b].index('-')
          explain +=
             'y continúa por <span class="b">' + route[i][:way_type_b] + ' ' + route[i][:street_name_b].slice(0, intersection) if intersection
        end
        explain +=
           "  <span class='b'> (metros: " + distance(i, route) + ")</span>
            </a>
          </li>"
        j = j+1
        #Here for the metro station
        #If the algorithm choose stretch_type 4 and then 3 it means the next nodes are type 2
        #therefore a metro's station has been choosen
      elsif prev_stretch_type.eql?("4") and curr_stretch_type.eql?("3")
        metro_station = true

      elsif prev_stretch_type.eql?("3") and curr_stretch_type.eql?("2") and metro_station

        explain +=
          '<li class=sidebar-item>
             <a href="#" onclick="javascript:focusMetro(' + route[i-1][:related_id] + ')">' +
             j.to_s + ". Ve de la estación <span class='b'> " + route[i-1][:common_name_a]
        j = j+1

        #if it finds a stretch_type 3 it means it reached the end of the metro station
      elsif metro_station and (prev_stretch_type.eql?("2") and curr_stretch_type.eql?("3"))
        explain +=
          ' hasta la estación' + route[i].common_name_a + '</span>
            </a>
          </li>'

        #if it finds a stretch_type 4 is because he got off the train and is going to some street
      elsif prev_stretch_type.eql?("3") and curr_stretch_type.eql?("4")

        explain +=
          '<li class=sidebar-item>
             <a href="#" data-index=' + i.to_s + '>' +
            j.to_s + ". Baja de la estación " + route[i-1][:common_name_a] +
            " dirigete por el <span class='b'> " + route[i][:common_name_b] +  " " +
          route[i][:street_name_a] + " (metros:" + route[i][:distance] + ")</span>
            </a>
          </li>"
        metro_station = false
        j = j+1
      end
      #end for
    end

    #If we have more than 2 nodes then we proceed to end of the explanation
    if size > 1
      final = nil
      if route[size-2][:direction] == route[size-1][:direction]

        final = j.to_s + ". " +'Continúa hasta encontrar tu lugar de destino' +
          "<span class='b'> (metros: " + distance(i+1, route) + ")</span>"

      else
        turn = eval_direction(route[size-2][:direction],route[size-1][:direction])

        final = j.to_s + ". " + 'Voltea <span class="b"> ' + turn + '</span>
           hasta llegar a tu lugar destino' +
          "<span class='b'> (metros: " + distance(i+1, route) + ")</span>"

      end

      explain +=
        '<li class=sidebar-item>' +
         '<a href="#" data-index=' + (i+1).to_s + '>' + final + '
          </a>
        </li>'
    else
      explain +=
        '<li class=sidebar-item>
           <a href="#" data-index=0>' +
          '1. Dirigete en dirección <span class="b">' + route[i][:direction] + "</span>
          hacia la <span class='b'>" + route[i][:way_type_b] +  " " + route[i][:street_name_b] + "</span>
          hasta llegar a tu lugar de destino (metros: " + distance(i + 1, route) + ")</span>
          </a>
        </li>"
    end
    explain
  end

  #It gets the distance of a group of trajectories that have the same related_id
  def self.distance(index, route)
    id_related = route[index][:related_id]
    distance = route.sum{ |r| id_related == r[:related_id] ? r[:distance].to_f : 0 }
    sprintf('%.2f', distance)
  end

  def self.total_distance(route)
    sprintf('%2.f', route.sum{ |r| r[:distance].to_f})
  end

  def self.avg_time(total_distance)
    sprintf('%2.f', (total_distance.to_f * 60)/3000)
  end

  def self.explain_bus_route(bus_route)
    buses = bus_route.map{|bus| bus.values_at(:bus_id)}.uniq.flatten
    buses.pop # Last element is a fake record
    explain =
      "<hr>
       <div class='route-explain'>
         <span class='header'>Indicación de ruta de bus cercana</span>
       </div>"
    buses.each do |bus|
      explain +=
        "<span class=buses-checkbox>
           <li class=sidebar-item-bus>
             <input type='checkbox' data-bus_id=" + bus.to_s +
#             '"onClick="javascript:drawSelectedPolyline_bus('"this," + bus.to_s + ')">' +
              "> Ruta numero " + bus.to_s +
           "</li>
        </span>"
    end
    explain
  end

end
