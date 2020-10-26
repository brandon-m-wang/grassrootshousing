import flask
from flask_restful import Resource, Api, reqparse
from flask import request
from flask import request, jsonify
from geopy.geocoders import Bing
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import json
import csv

REDLINING_FILE_NAME = 'data/TXAustin19xx.json'
OFFICE_SPACES_FILE_NAME = 'data/officespace.csv'
AFFORDABLE_HOUSING_FILE_NAME = 'data/City_of_Austin_Affordable_Housing.csv'

app = flask.Flask(__name__)

json_file = json.load(open(REDLINING_FILE_NAME))
office_spaces = []
with open(OFFICE_SPACES_FILE_NAME) as f:
    read_csv = csv.reader(f, delimiter=',')
    for row in read_csv:
        office_spaces.append(row)

redlinings = []
for i in range(len(json_file['features'])):
	polygon_data = []
	for j in range(len(json_file['features'][i]['geometry']['coordinates'][0][0])):
		longitude, latitude = json_file['features'][i]['geometry']['coordinates'][0][0][j]
		polygon_data.append((longitude, latitude))
	redlinings.append((polygon_data, json_file['features'][i]['properties']['name'], json_file['features'][i]['properties']['area_description_data'], json_file['features'][i]['properties']['holc_id'], json_file['features'][i]['properties']['holc_grade']))

affordable_housing = []
i = 0
with open(AFFORDABLE_HOUSING_FILE_NAME) as f:
    read_csv = csv.reader(f, delimiter=',')
    for row in read_csv:
        if i != 0:
        	affordable_housing.append(row)
        i += 1


geolocator = Bing('Ap5pkK0nWp4CofxS0RYgcsdzgBA9I1Rf5MnWDwWbMH9Baxp2bJBNUaaBf9-H21g_')


def in_polygon(longitude, latitude, polygon_data):
	point = Point(longitude, latitude)
	polygon = Polygon(polygon_data)
	return polygon.contains(point)


@app.route('/get_redlining', methods=['GET'])
def get_redlining():
	parser = request.args
	coords = parser['coords'].split(',')
	latitude = float(coords[0])
	longitude = float(coords[1])
	for i in range(len(redlinings)):
		if in_polygon(longitude, latitude, redlinings[i][0]):
			return jsonify({'coordinates': redlinings[i][0], 'name': redlinings[i][1], 'area_description_data': redlinings[i][2], 'holc_id': redlinings[i][3], 'holc_grade': redlinings[i][4]})
	return jsonify(['NULL'])


@app.route('/get_redlining_from_address', methods=['GET'])
def get_redlining_from_address():
	parser = request.args
	address = parser['address'].replace('-', ' ')
	location = geolocator.geocode(address)
	latitude = location.latitude
	longitude = location.longitude
	for i in range(len(redlinings)):
		if in_polygon(longitude, latitude, redlinings[i][0]):
			return jsonify({'coordinates': redlinings[i][0], 'name': redlinings[i][1], 'area_description_data': redlinings[i][2], 'holc_id': redlinings[i][3], 'holc_grade': redlinings[i][4]})
	return jsonify(['NULL'])


@app.route('/get_all_redlinings', methods=['GET'])
def get_all_redlining():
	data = {'redlinings' : []}
	for i in range(len(redlinings)):
		data['redlinings'].append({'coordinates': redlinings[i][0], 'name': redlinings[i][1], 'area_description_data': redlinings[i][2], 'holc_id': redlinings[i][3], 'holc_grade': redlinings[i][4]})
	return jsonify(data)


@app.route('/get_all_office_spaces', methods=['GET'])
def get_all_office_spaces():
	data = {'office_spaces' : []}
	for i in range(len(office_spaces)):
		data['office_spaces'].append({'name': office_spaces[i][0], 'latitude': office_spaces[i][1], 'longitude': office_spaces[i][2]})
	return jsonify(data)


@app.route('/get_all_affordable_housing', methods=['GET'])
def get_all_affordable_housing():
	data = {'affordable_housing' : []}
	for i in range(len(affordable_housing)):
		data['affordable_housing'].append({'project_name': affordable_housing[i][0], 'address': affordable_housing[i][1], 'unit_type': affordable_housing[i][2], 'tenure': affordable_housing[i][3], 'latitude': affordable_housing[i][4], 'longitude': affordable_housing[i][5]})
	return jsonify(data)

