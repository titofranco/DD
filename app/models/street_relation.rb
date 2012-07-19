class StreetRelation < ActiveRecord::Base

  # Complete left data for roadmap_id and roadmap_related_id using
  # roadmaps table
  def self.street_info(roadmap_id, roadmap_related_id)
    street = find_by_sql(
      ["SELECT s.id, s.roadmap_id, s.lat_start, s.long_start, s.lat_end, s.long_end, s.stretch_type,
        a.way_type AS way_type_a, a.street_name AS street_name_a,
        a.prefix AS prefix_a, a.label AS label_a, a.common_name AS common_name_a, s.distance_meters,
        b.way_type AS way_type_b, b.street_name AS street_name_b,
        b.prefix AS prefix_b, b.label AS label_b, b.common_name AS common_name_b
        FROM street_relations s
        INNER JOIN roadmaps AS a
        ON(a.id = s.roadmap_id)
        INNER JOIN roadmaps AS b
        ON(b.id = s.roadmap_related_id)
        WHERE roadmap_id = :roadmap_id AND roadmap_related_id = :roadmap_related_id",
       {:roadmap_id => roadmap_id, :roadmap_related_id => roadmap_related_id}]).first
    update_street(street)
  end

  # Return attributes that are going to be interpreted by google maps API
  def self.update_street(street)
    unless street.nil?
      # Convert string keys to symbols
      street = street.attributes.inject({}){|memo, (k,v)| memo[k.to_sym] = v; memo}

      if street[:distance_meters] > 0 or (street[:distance_meters] == 0 and street[:stretch_type] != 1)
        street[:related_id]    = street[:id]
        street[:bearing]       = compute_bearing(street[:lat_start], street[:long_start], street[:lat_end], street[:long_end])
        street[:direction]     = cardinal_direction(street[:bearing])
        street[:new_direction] = street[:direction]
        street[:distance]      = sprintf('%.2f', street[:distance_meters])
        street[:has_relation]  = false
      end
    end
    street
  end

  #It gets the direction given the bearing in degrees
  def self.cardinal_direction(bearing)
    direction = nil

    if (bearing >= 0 and bearing <= 22.5) or (bearing > 337.5 and bearing < 360)
      direction = "Norte"
    elsif bearing > 22.5  and bearing <= 67.5
      direction = "Nororiente"
    elsif bearing > 67.5  and bearing <= 112.5
      direction = "Oriente"
    elsif bearing > 112.5 and bearing <= 157.5
      direction = "Suroriente"
    elsif bearing > 157.5 and bearing <= 202.5
      direction = "Sur"
    elsif bearing > 202.5 and bearing <= 247.5
      direction = "Suroccidente"
    elsif bearing > 247.5 and bearing <= 292.5
      direction = "Occidente"
    elsif bearing > 292.5 and bearing <= 337.5
      direction = "Noroccidente"
    end
    direction
  end

  #Computes how many degrees are between 2 pairs lat-long
  def self.compute_bearing(lat_start, long_start, lat_end, long_end)
    lat1  = lat_start * TO_RAD
    long1 = long_start * TO_RAD
    lat2  = lat_end * TO_RAD
    long2 = long_end * TO_RAD

    y = (Math.cos(lat1) * Math.sin(lat2)) - (Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2 - long1))
    x = Math.sin(long2 - long1) * Math.cos(lat2)
    brng = Math.atan2(x, y) % (2 * Math::PI)
    brng = brng * (180/Math::PI)
    #bearing must be positive
    brng = brng < 0 ? brng + 360 : brng
  end

end
