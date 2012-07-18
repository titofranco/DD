# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120718154611) do

  create_table "roadmaps", :force => true do |t|
    t.string   "way_type",     :limit => 13
    t.string   "street_name",  :limit => 50
    t.string   "common_name",  :limit => 50
    t.string   "municipality", :limit => 20
    t.string   "prefix",       :limit => 2
    t.string   "label",        :limit => 20
    t.decimal  "shape_length",               :precision => 15, :scale => 10
    t.decimal  "lat_start",                  :precision => 15, :scale => 10, :null => false
    t.decimal  "lat_center",                 :precision => 15, :scale => 10
    t.decimal  "lat_end",                    :precision => 15, :scale => 10, :null => false
    t.decimal  "long_start",                 :precision => 15, :scale => 10, :null => false
    t.decimal  "long_center",                :precision => 15, :scale => 10
    t.decimal  "long_end",                   :precision => 15, :scale => 10, :null => false
    t.integer  "stretch_type",                                               :null => false
    t.decimal  "speed_km_h",                 :precision => 15, :scale => 10
    t.string   "has_relation", :limit => 2
    t.datetime "created_at",                                                 :null => false
    t.datetime "updated_at",                                                 :null => false
  end

  add_index "roadmaps", ["lat_end"], :name => "index_roadmaps_on_lat_end"
  add_index "roadmaps", ["lat_start"], :name => "index_roadmaps_on_lat_start"
  add_index "roadmaps", ["long_end"], :name => "index_roadmaps_on_long_end"
  add_index "roadmaps", ["long_start"], :name => "index_roadmaps_on_long_start"

end
