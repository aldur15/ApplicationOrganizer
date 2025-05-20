import requests
import testData as _testData
from test_authentications import return_token

token = return_token("admin", "vollgeheim")
deviceID = "a188957e-0184-4653-b950-7b98b86f8471"
purchasingID = "a188957e-0184-4653-b950-7b98b86f8479"


def test_create_purchasing():
    url = _testData.ENDPOINT + "purchasing_information"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "price": "12345",
        "timestamp_warranty_end": 19032032,
        "timestamp_purchase": 12042023,
        "cost_centre": 123,
        "seller": "MediaSaturn",
        "device_id": deviceID
    }

    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 201


def test_get_purchasing():
    url = _testData.ENDPOINT + "purchasing_information/"+purchasingID
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_get_all_purchasings():
    url = _testData.ENDPOINT + "purchasing_information/all"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_update_purchasings():
    url = _testData.ENDPOINT + "purchasing_information/"+purchasingID
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "price": "99999",
        "timestamp_warranty_end": 20083034,
        "timestamp_purchase": 10051700,
        "cost_centre": 987,
        "seller": "Walmart",
        "device_id": deviceID
    }

    response = requests.put(url, headers=headers, json=data)
    assert response.status_code == 200


def test_delete_purchasings():
    url = _testData.ENDPOINT + "purchasing_information/" + \
        "a188957e-0184-4653-b950-7b98b86f8480"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token
    }

    response = requests.delete(url, headers=headers)
    assert response.status_code == 200
