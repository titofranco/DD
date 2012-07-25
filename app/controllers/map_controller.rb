class MapController < ApplicationController

  include SidePannel

  def find_route
    lat_start, long_start = params[:start_point].split(',')
    lat_end, long_end = params[:end_point].split(',')
    path = Roadmap.get_path(lat_start, long_start, lat_end, long_end)

    unless path[:msg_error].blank?
      res = {:success => false, :content => path[:msg_error]}
    else
      route_explain = SidePannel.explain_route(path[:info_path])
      res = {:success => true,  :content => path[:info_path], :route_explain => route_explain}
    end
    render :text => res.to_json
  end

  def find_bus_route
    start_point, end_point = params[:roadmap_id].split(',')
    bus_route = BusesRoute.find_route(start_point, end_point)
    unless bus_route.empty?
      bus_explain = SidePannel.explain_bus_route(bus_route)
      res = {:success => true, :bus => bus_route, :bus_explain => bus_explain}
    else
      res = {:success => false}
    end
    render :text => res.to_json
  end

end
