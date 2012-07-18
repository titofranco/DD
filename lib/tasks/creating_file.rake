require 'mda'
require 'csv'

#debe imprimir nodo incial,nodo al que se conecta,distancia 1:2585,204.35874;784,3985.14|lat-long

task :creating_file => :environment  do

  include ActionView::Helpers::NumberHelper
  row = StreetRelation.maximum(:id)
  column = 6
  #puts "max row #{row}"
  #puts "max column #{column}"
  matrix_size = row * column
  matrix_bytes = matrix_size * 4
  #puts "A matrix of #{row}x#{column} uses #{number_to_human_size(matrix_bytes)} "
  iniTime = Time.now
  puts "The initial Time: #{iniTime} "
  mda = Mda.new(row + 1, column)
  puts  "#{Time.now - iniTime} seconds for creating the matrix"

  begin
    csv = CSV.open("#{RAILS_ROOT}/lib/text_files/initial_matrix.csv", "r")
    csv.each_with_index do |row, i|
      row, column, distance_meters, stretch_type, lat, lon = row
      mda.fill_array(i, row, column, distance_meters, stretch_type, lat, lon)
      #puts "#{i} records in matrix " if i % 10000 == 0
    end
  ensure
    csv.close unless csv.nil?
  end

  puts  "#{Time.now - iniTime} seconds for filling the matrix"
  mda.create_file
  puts  "#{Time.now - iniTime} total seconds for the task "
end
