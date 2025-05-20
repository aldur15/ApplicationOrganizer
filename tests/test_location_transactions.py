import requests
import testData as _testData
from test_authentications import return_token

token = return_token("admin", "vollgeheim")
deviceID = "a188957e-0184-4653-b950-7b98b86f8471"
locationID = "a188957e-0184-4653-b950-7b98b86f8477"


def test_create_location():
    url = _testData.ENDPOINT + "location_transactions"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "room_code": "M1",
        "device_id": deviceID
    }

    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 201


def test_get_location():
    url = _testData.ENDPOINT + "location_transactions/"+locationID
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_get_all_locations():
    url = _testData.ENDPOINT + "location_transactions/all"
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_update_location():
    url = _testData.ENDPOINT + "location_transactions/"+locationID
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "room_code": "M2",
        "device_id": deviceID,
        "location_transaction_id": locationID,
        "timestamp_located_since": "12021996",
    }

    response = requests.put(url, headers=headers, json=data)
    assert response.status_code == 200


def test_delete_location():
    url = _testData.ENDPOINT + "location_transactions/" + \
        "a188957e-0184-4653-b950-7b98b86f8478"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token
    }

    response = requests.delete(url, headers=headers)
    assert response.status_code == 200
