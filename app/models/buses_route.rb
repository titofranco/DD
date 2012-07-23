class BusesRoute < ActiveRecord::Base

  def self.route
    @route ||= Array.new
  end

  # Return the closests buses given the start and end points given by
  # the user
  def self.find_route(start_point, end_point)
    buses = []
    initial_buses = find_closer_buses(start_point)
    final_buses = find_closer_buses(end_point)
    return buses if (initial_buses.empty? or final_buses.empty?)

    # Return unique buses routes
    buses  = initial_buses.map(&:id) & final_buses.map(&:id)
    buses |= find_common_bus(initial_buses.map(&:id), final_buses.map(&:id))

    initial_buses.each do |bus|
      buses  |= find_closest_common_bus(bus[:bus_route_id], bus[:id], final_buses.map(&:id))
    end
    parse_route(buses.flatten.uniq)
  end

  def self.parse_route(buses)
    route.clear
    buses_routes = select("id, bus_id, lat_start, long_start").where("bus_id IN (?)", buses)
    buses_routes.each do |bus_route|
      br = bus_route.attributes.inject({}){|memo, (k,v)| memo[k.to_sym] = v; memo}
      route.push(br)
    end
    #This fake record is to make comparisons and to get
    #the lat-lng from the last record
    route.push(:id => -1, :bus_id => 99999, :lat_start => route.last[:lat_start], :long_start => route.last[:long_start], :status => 'inactive') unless route.empty?
    route
  end

  #Given 2 buses id, it checks if they are related by a roadmap_id
  def self.find_common_bus(first_bus, second_bus)
    #POSTGRESQL
    find_by_sql(
      ["SELECT br.bus_id AS initial, br2.bus_id AS final
       FROM buses_routes br
       INNER JOIN buses_routes br2
       ON (br.roadmap_id = br2.roadmap_id)
       WHERE br.bus_id IN (:first_bus) AND br2.bus_id IN (:second_bus)
       GROUP BY br.bus_id, br2.bus_id
       HAVING br.bus_id <> br2.bus_id ",
       {:first_bus => first_bus, :second_bus => second_bus}]).delete_if{ |bus| bus.initial.eql?(bus.final) }.map(&:attributes).map(&:values).flatten.uniq
  end

  #Given an id from buses_routes table and 2 buses routes
  #it checks if they are close to each other by
  #some distance.
  def self.find_closest_common_bus(id, first_bus, second_bus)
    bus = where("id >= :id and bus_id = :first_bus", {:id => id, :first_bus => first_bus}).first
    return [] unless bus.nil?
    lon1, lon2, lat1, lat2 = Roadmap.split_coordinates(bus.lat_start, bus.long_start)
    #POSTGRESQL
    find_by_sql(
      ["SELECT distinct :first_bus AS first_bus, temp.bus_id AS second_bus
        FROM(
          SELECT bus_id, roadmap_id, dest.lat_start, dest.long_start,
          3956 * 2 * ASIN(SQRT(POWER(SIN(( :lat_start  - dest.lat_start) * pi()/180 / 2), 2) +
          COS(:lat_start * pi()/180 ) * COS(dest.lat_start * pi()/180) *
          POWER(SIN(( :long_start - dest.long_start) * pi()/180 / 2), 2) )) AS distance
          FROM buses_routes dest
          WHERE dest.long_start BETWEEN :lon1 AND :lon2
          AND dest.lat_start BETWEEN :lat1 AND :lat2
          AND dest.bus_id IN (:second_bus)
        )TEMP
        WHERE distance < :dist
        limit 10 ", {:first_bus => first_bus, :second_bus => second_bus, :lat_start => bus.lat_start, :long_start => bus.long_start, :lon1 => lon1, :lat1 => lat1, :lon2 => lon2, :lat2 => lat2, :dist => DIST } ]).map(&:attributes).map(&:values).flatten.uniq
  end

  def self.find_closer_buses(roadmap_id)
    roadmap = Roadmap.select("lat_start, long_start").where(:id => roadmap_id).first
    lon1, lon2, lat1, lat2 = Roadmap.split_coordinates(roadmap.lat_start, roadmap.long_start)
    #POSTGRESQL  aliases always in lowercase
    find_by_sql(
      ["SELECT min(id) AS bus_route_id, bus_id AS id, min(distance) AS distance
        FROM(
          SELECT id, bus_id, roadmap_id, dest.lat_start, dest.long_start,
          3956 * 2 * ASIN(SQRT(POWER(SIN(( :lat_start - dest.lat_start) * pi()/180 / 2), 2) +
          COS( :lat_start * pi()/180 ) * COS (dest.lat_start * pi()/180) *
          POWER(SIN(( :long_start - dest.long_start) * pi()/180 / 2), 2) )) AS  distance
          FROM buses_routes dest
          WHERE dest.long_start BETWEEN :lon1 AND :lon2
          AND dest.lat_start BETWEEN :lat1 AND :lat2
          )TEMP
        WHERE distance < :dist
        GROUP BY bus_id limit 20", {:lat_start => roadmap.lat_start, :long_start => roadmap.long_start, :lon1 => lon1, :lat1 => lat1, :lon2 => lon2, :lat2 => lat2, :dist => DIST }])
  end

=begin
  def self.find_bus(start_point, end_point)
    init_buses = find_closer_buses(start_point)
    final_buses = find_closer_buses(end_point)
  end
=end
end
