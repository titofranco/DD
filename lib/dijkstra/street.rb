class Street
  attr_accessor :node_id, :connections, :type, :lati, :longi

  def to_s
    "idNodo: #{idNodo}, lati: #{lati}, longi: #{longi}\nenlaces: #{enlaces.inspect}"
  end
end
