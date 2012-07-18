task :calculate_distance => :environment do

  h = Haversine.new
  i = 0

  (StreetRelation.find :all).each do |record|

    distance = h.distanceHarvesine(record.lat_start, record.long_start, record.lat_end, record.long_end)
    record.update_attribute(:distance_meters, distance)
    if i % 1000 == 0
      puts "#{i} records updated "
    end
    i = i+1
    # puts "start: #{record.lat_start},#{record.long_start}  end: #{record.lat_end},#{record.long_end} distance: #{distance}"
  end

end

