import requests
import testData as _testData
from test_authentications import return_token

token = return_token("admin", "vollgeheim")


def test_delete_db():
    url = _testData.ENDPOINT + "api/db/"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
    }

    response = requests.delete(url, headers=headers)
    assert response.status_code == 200


def test_import():
    url = _testData.ENDPOINT + "api/db/"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }

    data = _testData.dummy_data
    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 201


def test_export():
    url = _testData.ENDPOINT + "api/db/"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200
