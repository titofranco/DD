require 'rubygems'
require 'algorithms'

class Dijkstra
  def self.find_path(street_array, initial, final)
    number_streets = street_array.length
    node_i = street_array[initial]
    node_d = street_array[final]
    h = Haversine.new
    max_distance = h.distance_harvesine(node_i.lati, node_i.longi,node_d.lati, node_d.longi)
    max_distance = max_distance + (max_distance/3)
    dist = Array.new(number_streets, Float::MAX)
    prev = Array.new(number_streets, nil)
    heap = Containers::MinHeap.new
    dist[initial] = 0.0
    prev[initial] = nil
    heap.push(0, initial)
    while heap.size > 0
      n = street_array[heap.pop]
      next if n == nil
      break if dist[n.node_id] == Float::MAX
      street_array[n.node_id] = nil
      number_streets = number_streets - 1
      d = h.distance_harvesine(n.lati, n.longi, node_d.lati, node_d.longi)
      next if d > max_distance
      n.connections.each{ |e|
        alt = dist[n.node_id] + e[1]
        if alt < dist[e[0]]
          dist[e[0]] = alt
          prev[e[0]] = n.node_id
          heap.push(alt, e[0])
        end
      }
    end
    path = Array.new
    while prev[final]
      path.unshift(final)
      final = prev[final]
    end
    path.unshift initial if path.size > 0
    return path
  end

end

