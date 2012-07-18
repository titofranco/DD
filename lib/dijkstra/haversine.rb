class Haversine

  TO_RAD = (Math::PI/180)

  def distance_harvesine(lat1, long1, lat2, long2)
    dLong = long2 - long1
    dLat  = lat2 - lat1

    dLongRad = dLong * TO_RAD
    dLatRad  = dLat * TO_RAD
    lat1Rad  = lat1 * TO_RAD
    lat2Rad  = lat2 * TO_RAD
    long1Rad = long1 * TO_RAD
    long2Rad = long2 * TO_RAD

    a =(Math.sin(dLatRad/2))**2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * (Math.sin(dLongRad/2))**2
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    distance_meters = c * 6371000
    return distance_meters
  end
end

