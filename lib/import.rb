#!/usr/bin/env ruby
require "rubygems"
require "open4"  #it captures the standard output and error stream
require "optparse" #Bring OptionParser into the namespace
require 'English' #It allow us to access variable $? via the more memorable $CHILD_STATUS
require 'yaml'

options = {
  :username => nil,
  :password => nil,
  :path_to_file => nil
}

CONFIG_FILE = File.join(ENV['HOME'], '.DD_data_import.rc.yaml')
if File.exists? CONFIG_FILE
  config_options = YAML.load_file(CONFIG_FILE)
  options.merge!(config_options)
else
  File.open(CONFIG_FILE, "w") {|file| YAML::dump(options, file)}
  STDERR.puts "Initialized configuration file in #{CONFIG_FILE}"
end

option_parser = OptionParser.new do |opts|
  executable_name = File.basename($PROGRAM_NAME)
  opts.banner = "Make an import of a csv file to a mysql table of the DD app
  \n\nUsage: #{executable_name} [options] database_name"

  opts.on("-a", "--all", "Import all files") do
    options[:all] = true
  end

  opts.on("-f FILENAME", "--filename", "Import a specific file. Should be in plural") do |filename|
    options[:filename] = filename
  end

  opts.on("-u USER","--username",'Database username') do |user|
    options[:username] = user
  end

  opts.on("-p PASSWORD","--password",'Database password') do |pwd|
    options[:password] = pwd
  end
end

exit_status =  0

begin
  option_parser.parse!
  if ARGV.empty?
    puts "\nerror: you must supply a database name\n"
    puts "#{option_parser.help}"
    exit_status |= 0b0010
  elsif options[:filename].nil? && options[:all].nil?
    puts "\nerror: you must supply a file name\n"
    puts "#{option_parser.help}"
    exit_status |= 0b0100
  else
    database_name = ARGV[0]
  end
rescue OptionParser::InvalidArgument => ex
  puts ex.message
  puts option_parser
  exit_status |= 0b0001
end

exit exit_status unless exit_status == 0

auth = ""
auth += "-u#{options[:username]} " if options[:username]
auth += "-p#{options[:password]} " if options[:password]
file_to_import = options[:all] ? "all" : options[:filename]

#path_to_file = File.expand_path("../../lib/text_files")
path_to_file = options[:path_to_file]
@path_to_app = options[:path_to_app]

roadmaps = "mysqlimport --delete --fields-terminated-by='|' --ignore-lines=1 --columns=id,way_type,street_name,common_name,municipality,prefix,label,shape_length,lat_start,lat_center,lat_end,long_start,long_center,long_end,stretch_type,speed_km_h,has_relation #{auth} --local #{database_name} #{path_to_file}/roadmaps.csv; "

street_relations = "mysqlimport --delete --fields-terminated-by='|' --ignore-lines=1 --columns=roadmap_id,roadmap_related_id,lat_start,long_start,lat_end,long_end,distance_meters,stretch_type  #{auth} --local #{database_name} #{path_to_file}/street_relations.csv; "

buses_routes = "mysqlimport --delete --fields-terminated-by='|' --ignore-lines=1 --columns=id,roadmap_id,lat_start,long_start,bus_id #{auth} --local #{database_name} #{path_to_file}//buses_routes.csv; "

command = ""

case file_to_import
when 'roadmaps' then
  command = roadmaps
when 'street_relations' then
  command = street_relations
when 'buses_routes' then
  command = buses_routes
when 'all' then
  command = roadmaps + street_relations + buses_routes
end

system(command)
#puts "Running '#{command}'"

pid, stdin, stdout, stderr = Open4::popen4(command)
_, status = Process::waitpid2(pid)

unless status.exitstatus == 0
  puts "There was a problem running '#{command}'"
  exit -1
end
