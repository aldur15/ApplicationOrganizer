import requests
import testData as _testData
from test_authentications import return_token

token = return_token("admin", "vollgeheim")
deviceID = "a188957e-0184-4653-b950-7b98b86f8471"


def test_create_device():
    url = _testData.ENDPOINT + "devices/"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "title": "device1",
        "device_type": "Phone",
        "description": "Nokia",
        "accessories": "Leather-Case",
        "serial_number": "12345",
        "rz_username_buyer": "Mario",
        "image_url": "none",
        "owner_rz_username": "Mario",
        "room_code": "M1",
        "price": "1234",
        "timestamp_warranty_end": 12021995,
        "timestamp_purchase": 12021833,
        "cost_centre": 123,
        "seller": "Ebay"
    }

    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 201


def test_get_device():
    url = _testData.ENDPOINT + "devices/"+deviceID
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_get_all_devices():
    url = _testData.ENDPOINT + "devices/all"
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_update_device():
    url = _testData.ENDPOINT + "devices/"+deviceID
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "title": "device2",
        "device_type": "Phone",
        "description": "IPhone",
        "accessories": "Plastic-Case",
        "serial_number": "12345",
        "rz_username_buyer": "Luigi",
        "image_url": "none",
        "owner_rz_username": "Luigi",
        "room_code": "M1",
        "price": "1234",
        "timestamp_warranty_end": 12021995,
        "timestamp_purchase": 12021833,
        "cost_centre": 123,
        "seller": "Ebay"
    }

    response = requests.put(url, headers=headers, json=data)
    assert response.status_code == 200


def test_get_all_owners_device():
    url = _testData.ENDPOINT + "devices/owner_transactions/" + deviceID
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_get_all_purchasings_device():
    url = _testData.ENDPOINT + "devices/purchasing_information/" + deviceID
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_get_all_locations_device():
    url = _testData.ENDPOINT + "devices/location_transactions/" + deviceID
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_delete_device():
    url = _testData.ENDPOINT + "devices/" + "a188957e-0184-4653-b950-7b98b86f8472"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token
    }

    response = requests.delete(url, headers=headers)
    assert response.status_code == 200
