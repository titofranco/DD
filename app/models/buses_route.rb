class BusesRoute < ActiveRecord::Base
  # attr_accessible :title, :body

  #DIST = 0.310685596 #Equivalent to 500 meters
  #TO_RAD = (Math::PI/180) #Queries need coordinates given in radians

  def self.get_bus_route(init, final)
    bus_init = get_closest_bus_id(init)
    bus_final = get_closest_bus_id(final)
    bus_suggest = Array.new

    return bus_suggest if (bus_init.empty? || bus_final.empty?)

    init_bus_id = bus_init.collect{ |b| b.bus_id.to_s }
    final_bus_id = bus_final.collect{ |b| b.bus_id.to_s }
    bus_suggest = init_bus_id & final_bus_id
    # return bus_suggest unless bus_suggest.empty?

    connection = get_common_bus(init_bus_id.join(","), final_bus_id.join(","))
    if !connection.empty?
      for con in connection
        connection.delete_if{ |con_id|
          con_id.bus_id_A.eql? con_id.bus_id_B
        }
      end
      bus_suggest.push(con.bus_id_A)
      bus_suggest.push(con.bus_id_B)
      # return bus_suggest.uniq

    end

    result = Array.new
    for bus in bus_init
      temp = Array.new
      r = get_closest_common_bus(bus[:busrouteid], bus[:bus_id], final_bus_id.join(','))
      temp = temp | r
      temp.each{ |h| result = result | h.values }
    end
    bus_suggest = bus_suggest | result

    return bus_suggest.uniq
  end

  def self.parser_route_bus(bus_route)
    resultado = Array.new
    for idBus in bus_route
      buses = find(:all, :select => "id, bus_id, lat_start, long_start", :conditions=>["bus_id = ?", idBus])
      for bus in buses
        resultado.push(:id => bus.id,
                       :bus_id => bus.bus_id,
                       :lat_start => bus.lat_start,
                       :long_start => bus.long_start
                      )
      end
    end
    #This fake record is to make comparisons and for getting the lat-lng from
    #the last record
    if !resultado.empty?
      resultado.push( :id => -1,
                      :bus_id => 99999,
                      :lat_start => resultado.last[:lat_start],
                      :long_start => resultado.last[:long_start],
                      :status => 'inactive'
                    )
    end

    return resultado
  end


  #Get variables used in all queries
  def self.get_coordinates(lat_start, long_start)
    lon1 = long_start.to_f - DIST/(Math.cos(TO_RAD * lat_start.to_f) * 69).abs
    lon2 = long_start.to_f + DIST/(Math.cos(TO_RAD * lat_start.to_f) * 69).abs
    lat1 = lat_start.to_f - (DIST/69)
    lat2 = lat_start.to_f + (DIST/69)
    return [lon1, lon2, lat1, lat2]
  end

  def self.find_bus(init, final)
    init_buses = get_closest_bus_id(init)
    final_buses = get_closest_bus_id(final)
  end


  # def self.getOneBus
  #    resultado=Array.new
  #    sql = "Select br.id,br.bus_id,br.lat_start,br.long_start from buses_routes br"
  #    @buses = find_by_sql(sql)

  #    for bus in @buses
  #      resultado.push(:id=>bus.id,
  #                     :bus_id=>bus.bus_id,
  #                     :lat_start=>bus.lat_start,
  #                     :long_start=>bus.long_start)
  #    end
  #    resultado
  # end


  #Dado un conjunto de buses, examina si estos tienen una conexion directa por un roadmap_id
  def self.get_common_bus(bus_id_A, bus_id_B)
    #POSTGRESQL
    sql = "Select  br.bus_id AS bus_id_A, br2.bus_id AS bus_id_B
          from buses_routes br
          inner join buses_routes br2
          On (br.roadmap_id = br2.roadmap_id)
          where br.bus_id in (" + bus_id_A.to_s + ") and br2.bus_id in (" + bus_id_B + ")" +
      " GROUP BY br.bus_id , br2.bus_id HAVING br.bus_id <> br2.bus_id "

    r = find_by_sql(sql)
  end


  #Dado un id de la tabla buses_routes, dos conjuntos de buses, mira si hay conexion entre estos a una distancia determinada
  def self.get_closest_common_bus(id_table, bus_id_A, bus_id_B)
    result = Array.new
    busRoute = find(:all, :conditions => ["id >= ? and bus_id = ? ", id_table, bus_id_A])

    for record in busRoute
      lat_start = record.lat_start
      long_start = record.long_start
      lon1, lon2, lat1, lat2 = get_coordinates(lat_start, long_start)

      #POSTGRESQL
      sql  = "Select distinct " + bus_id_A.to_s + " as bus_a, temp.bus_id as bus_b
            FROM(
            select bus_id,roadmap_id, dest.lat_start,dest.long_start,
            3956 * 2 * ASIN(SQRT(POWER(SIN((" + lat_start.to_s + " - dest.lat_start) * pi()/180 / 2), 2) +
            COS(" + lat_start.to_s + "* pi()/180 ) * COS (dest.lat_start * pi()/180) *
            POWER(SIN((" + long_start.to_s + "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
            FROM buses_routes dest
            where dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
        " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
        " and dest.bus_id in (" + bus_id_B + ")
            ) temp
            where distance < " + DIST.to_s +
        " limit 10 "

      r = find_by_sql(sql)

      for reg in r
        result.push(:bus_A => reg.bus_a, :bus_B => reg.bus_b)
      end
    end
    return result.uniq
  end


  def self.get_closest_bus_id(roadmap_id)
    result = Array.new
    r = Roadmap.find(roadmap_id.to_i, :select => "lat_start, long_start")
    lat_start  = r.lat_start
    long_start = r.long_start
    lon1, lon2, lat1, lat2 = self.get_coordinates(lat_start, long_start)
    #POSTGRESQL  aliases always in lowercase
    sql  =" SELECT min(id) AS busrouteid,bus_id, min(distance) as distance FROM (
            Select id,bus_id,roadmap_id, dest.lat_start,dest.long_start,
            3956 * 2 * ASIN(SQRT(POWER(SIN((" + lat_start.to_s + " - dest.lat_start) * pi()/180 / 2), 2) +
            COS(" + lat_start.to_s + "* pi()/180 ) * COS (dest.lat_start * pi()/180) *
            POWER(SIN((" + long_start.to_s + "- dest.long_start) * pi()/180 / 2), 2) )) as  distance
            FROM buses_routes dest
            where dest.long_start between " + lon1.to_s + " and " + lon2.to_s +
      " and dest.lat_start between " + lat1.to_s + " and " + lat2.to_s +
      ") AS TEMP
             WHERE distance < " + DIST.to_s + "
             GROUP BY bus_id limit 20"

    r = find_by_sql(sql)
    if r
      r.each do |reg|
        result.push(:bus_id => reg.bus_id , :busRouteId => reg.busrouteid)
      end
    end
  end

end
