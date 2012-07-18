class CreateBuses < ActiveRecord::Migration
  def change
    create_table :buses do |t|
      t.string :company
      t.string :vehicle_type
      t.string :bus_stop_downtown
      t.decimal :route_length_km, :precision => 5, :scale => 5
      t.string :routes_taken
      t.timestamps
    end
  end
end
