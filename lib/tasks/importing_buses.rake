require 'csv'

task :importing_buses => :environment do

  begin
    csv = CSV.open("#{RAILS_ROOT}/lib/text_files/buses_routes.csv", "r")

    csv.each_with_index do |row, i|
      id_bus, lat, long = row
      roadmap = Roadmap.find(:all, :select => "id", :conditions => ["lat_start = ? and long_start  =  ? ", lat, long])
      for reg in roadmap
        busRoute = BusesRoute.create(
                                     :roadmap_id => reg.id,
                                     :lat_start => lat,
                                     :long_start => long,
                                     :bus_id => id_bus
                                     )
        busRoute.save!
      end
    end
  ensure
    csv.close unless csv.nil?
  end
end

#rake para crear la tabla buses_routes
#rake db:migrate:down VERSION=20100316040019
