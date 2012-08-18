require 'yaml'
require 'json'

# Read YAML file from command line
data = YAML.load(File.read(ARGV[0]))

# Write into template as JSON
puts <<END
var SCENARIOS = #{data.to_json};
END