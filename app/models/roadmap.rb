# -*- coding: utf-8 -*-
class Roadmap < ActiveRecord::Base

  #DIST = 0.310685596 #Equivalent to 500 meters
  #TO_RAD = (Math::PI/180) #Queries need coordinates given in radians

  def self.route
    @route ||= Array.new
  end

  #Method to get the street between two coordenates or the error message
  #if there's any using a hash table while we find a better way to do
  #the response
  def self.get_path(init_lat, init_long, final_lat, final_long)
    route.clear
    response = {:msg_error => "", :info_path => []}
    closest_initial = closest_point(init_lat, init_long)
    closest_final = closest_point(final_lat, final_long)

    response[:msg_error]  = "Debe elegir un punto inicial más cercano \n" if closest_initial.to_s.empty?
    response[:msg_error] += "Debe elegir un punto final más cercano." if closest_final.to_s.empty?
    return response if closest_initial.nil? || closest_final.nil?

    streets = Parser.get_graph
    path_dijkstra = Dijkstra.find_path(streets, closest_initial.id, closest_final.id)

    if path_dijkstra.empty?
      response[:msg_error] = "Ruta no encontrada."
      return response
    end

    find_route(path_dijkstra)
    response[:info_path] = route
    response
  end

  #Get the closest point given lat_start, long_start
  def self.closest_point(lat_start, long_start)
    lon1, lon2, lat1, lat2 = split_coordinates(lat_start, long_start)
    #POSTGRESQL
    find_by_sql(["
      SELECT * FROM
        (SELECT id, dest.lat_start, dest.long_start,
         3956 * 2 * ASIN(SQRT(POWER(SIN(( :lat_start - dest.lat_start) * pi()/180 / 2), 2) +
         COS( :lat_start * pi()/180 ) * COS (dest.lat_start * pi()/180) *
         POWER(SIN( (:long_start - dest.long_start) * pi()/180 / 2), 2) )) AS distance
         FROM roadmaps dest
         WHERE stretch_type = '1' AND has_relation = 'S'
         AND dest.long_start BETWEEN :lon1 AND :lon2
         AND dest.lat_start BETWEEN :lat1 AND :lat2
        )AS dest
      WHERE distance < :dist
      ORDER BY distance
      LIMIT 1", {:lat_start => lat_start, :long_start => long_start, :lon1 => lon1, :lat1 => lat1, :lon2 => lon2, :lat2 => lat2, :dist => DIST }]).first
  end

  #Get variables used in all queries
  def self.split_coordinates(lat_start, long_start)
    lon1 = long_start.to_f - DIST/(Math.cos(TO_RAD * lat_start.to_f) * 69).abs
    lon2 = long_start.to_f + DIST/(Math.cos(TO_RAD * lat_start.to_f) * 69).abs
    lat1 = lat_start.to_f  - (DIST/69)
    lat2 = lat_start.to_f  + (DIST/69)
    [lon1, lon2, lat1, lat2]
  end

  #Get all the data from Dijkstra algorithm result
  def self.find_route(nodes)
    for i in 0 ...nodes.length-1
      street = StreetRelation.street_info(nodes[i], nodes[i+1])
      route.push(street) unless street.nil?
    end
    reassign_cardinal_direction
    relate_streets
  end

  #It compares the degrees that are between a record and another.
  #If (i-1) index has 22.5 degrees and (i) has 22 degrees
  #then when the app explains to the user where to turn it tells:
  #'turn in (that direction)' when actually it has to tell
  #'go straight'. I take a base value of +- 15 degrees
  def self.reassign_cardinal_direction
    for i in 1 ... route.length - 1
      route[i][:new_direction ] = new_direction(route[i-1][:new_direction], route[i][:direction], route[i-1][:bearing], route[i][:bearing])
    end
  end

  def self.new_direction(prev_dir, curr_dir, prev_bearing, curr_bearing)
    return curr_dir if curr_dir.eql?(prev_dir)
    bearing_dif = curr_bearing - prev_bearing
    new_direction = bearing_dif.between?(-15, 15) ? prev_dir : curr_dir
  end

  #Based on the cardinality of the current and the next trajectory,
  #what it does is to relate them, therefore when I render the
  #polyline I will know which trajects have the same cardinality.
  def self.relate_streets
    for i in 0 ... route.length - 2
      if route[i][:new_direction].eql?(route[i+1][:new_direction])
         route[i+1][:related_id] = route[i][:related_id]
         route[i][:has_relation], route[i+1][:has_relation] = true, true
      end
    end
  end

=begin
  def self.find_closest_point_by_id(id)
    r = Roadmap.select("lat_start, long_start").where(:id => id).first
    closest_point(r.lat_start, r.long_start)
  end
=end
end
