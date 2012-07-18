class Parser
  def self.get_graph
    graph = Array.new
    file = File.new(STREETS_FILE, "r")
    file.each do |line|
      st = Street.new
      temp = line.split ":"
      st.node_id = temp.first.to_i
      temp = temp.last
      temp = temp.split "&"
      coordinate = temp.last.split ","
      temp = temp.first
      st.lati = coordinate.first.to_f
      st.longi = coordinate.last.to_f
      temp = temp.split ";"
      connections = Array.new
      temp.each { |e|
        e = e.split ","
        st.type = e[3].to_i
        connections.push([e[0].to_i, e[1].to_f])
      }
      st.connections = connections
      graph[st.node_id] = st
    end
    graph
  end
end
