class MapController < ApplicationController

  include SidePannel

  def find_route
    lat_start, long_start = params[:initial_point].split(/,/)
    lat_end, long_end = params[:end_point].split(/,/)

    path = Roadmap.get_path(lat_start, long_start, lat_end, long_end)

    if !path[:msg_error].blank?
      res = {:success => false, :content => path[:msg_error]}
      render :text => res.to_json
    else
      route_explain = SidePannel.explainRoute(path[:info_path])

      closest_init = (path[:info_path].first)[:roadmap_id]
      closest_final = (path[:info_path].last)[:roadmap_id]

      info_bus = nil
      route_bus = nil
      bus_explain = nil

      #new controller
      bus_route = BusesRoute.get_bus_route(closest_init, closest_final)
      info_bus = BusesRoute.parser_route_bus(bus_route)
      if !info_bus.empty?
        bus_explain = SidePannel.explainBusRoute(info_bus)
      end

      res = {:success => true,  :content => path[:info_path], :bus => info_bus, :route_explain => route_explain, :bus_explain => bus_explain}
      render :text => res.to_json
    end
  end

end
