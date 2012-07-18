class CreateBusesRoutes < ActiveRecord::Migration
  def change
    create_table :buses_routes do |t|
      t.integer :roadmap_id, :null => false
      t.decimal :lat_start, :precision => 15, :scale => 10, :null => false
      t.decimal :long_start, :precision => 15, :scale => 10,:null => false
      t.integer :bus_id, :null => false
      t.timestamps
    end
  end
end
