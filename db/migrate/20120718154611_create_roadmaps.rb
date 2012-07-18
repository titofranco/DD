class CreateRoadmaps < ActiveRecord::Migration
  def change
    create_table :roadmaps do |t|
      t.string  :way_type, :limit => 13
      t.string  :street_name, :limit => 50
      t.string  :common_name, :limit => 50
      t.string  :municipality, :limit => 20
      t.string  :prefix, :limit => 2
      t.string  :label, :limit => 20
      t.decimal :shape_length, :precision => 15, :scale => 10
      t.decimal :lat_start, :precision => 15, :scale => 10, :null => false
      t.decimal :lat_center, :precision => 15, :scale => 10
      t.decimal :lat_end, :precision => 15, :scale => 10, :null => false
      t.decimal :long_start, :precision => 15, :scale => 10, :null => false
      t.decimal :long_center, :precision => 15, :scale => 10
      t.decimal :long_end, :precision => 15, :scale => 10, :null => false
      t.integer :stretch_type, :null => false
      t.decimal :speed_km_h, :precision => 15, :scale => 10
      t.string  :has_relation, :limit => 2

      t.timestamps
    end

    add_index :roadmaps, :lat_start
    add_index :roadmaps, :lat_end
    add_index :roadmaps, :long_start
    add_index :roadmaps, :long_end

  end
end
