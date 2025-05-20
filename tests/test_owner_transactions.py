import requests
import testData as _testData
from test_authentications import return_token

token = return_token("admin", "vollgeheim")
deviceID = "a188957e-0184-4653-b950-7b98b86f8471"
ownerID = "a188957e-0184-4653-b950-7b98b86f8473"


def test_create_owner():
    url = _testData.ENDPOINT + "owner_transactions"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "rz_username": "user12",
        "device_id": deviceID
    }

    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 201


def test_get_owner():
    url = _testData.ENDPOINT + "owner_transactions/"+ownerID
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_get_all_owners():
    url = _testData.ENDPOINT + "owner_transactions/all"
    headers = {
        "accept": "application/json",
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_update_owner():
    url = _testData.ENDPOINT + "owner_transactions/"+ownerID
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = {
        "rz_username": "User192",
        "device_id": deviceID,
        "timestamp_owner_since": "23051233",
    }

    response = requests.put(url, headers=headers, json=data)
    assert response.status_code == 200


def test_delete_owner():
    url = _testData.ENDPOINT + "owner_transactions/" + \
        "a188957e-0184-4653-b950-7b98b86f8474"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token
    }

    response = requests.delete(url, headers=headers)
    assert response.status_code == 200
