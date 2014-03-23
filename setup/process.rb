#! /usr/bin/ruby

require 'csv'

require 'json'

csv_text = File.read('data.csv')

json_data = CSV.parse(csv_text).to_json

File.write('data.json', json_data)
