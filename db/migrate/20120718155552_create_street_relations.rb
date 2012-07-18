class CreateStreetRelations < ActiveRecord::Migration
  def change
    create_table :street_relations do |t|
      t.integer :roadmap_id, :null => false
      t.integer :roadmap_related_id, :null => false
      t.decimal :lat_start, :precision => 15, :scale => 10, :null => false
      t.decimal :long_start, :precision => 15, :scale => 10, :null => false
      t.decimal :lat_end, :precision => 15, :scale => 10, :null => false
      t.decimal :long_end, :precision => 15, :scale => 10, :null => false
      t.decimal :distance_meters, :precision => 15, :scale => 10, :null => false
      t.integer :stretch_type, :null => false
      t.timestamps
    end

    add_index :street_relations, [:roadmap_id, :roadmap_related_id], :unique => true
    add_index :street_relations, :roadmap_related_id, :unique => false

  end
end
