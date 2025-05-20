import requests
import testData as _testData


def test_endpoint():
    response = requests.get(_testData.ENDPOINT + "root")
    assert response.status_code == 200


def return_token(username, password):
    url = _testData.ENDPOINT + "api/login"

    data = {"username": username, "password": password}

    response = requests.post(url, data=data)
    token = response.json()["access_token"]
    return token


def login(token):
    url = _testData.ENDPOINT + "api/users/me"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + token,
    }

    response = requests.get(url, headers=headers)
    assert response.status_code == 200


def test_login_admin():
    url = _testData.ENDPOINT + "api/login"

    response = requests.post(url, data=_testData.admin)
    token = response.json()["access_token"]

    login(token)

    assert response.status_code == 200, "response"


def test_login_user():
    url = _testData.ENDPOINT + "api/login"

    response = requests.post(url, data=_testData.user)
    token = response.json()["access_token"]

    login(token)

    assert response.status_code == 200, "response"


def test_login_wrong_user():
    url = _testData.ENDPOINT + "api/login"

    response = requests.post(url, data=_testData.wrong_user)

    assert response.status_code == 401, "response"


def test_create_user():
    url = _testData.ENDPOINT + "api/users/"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + return_token("admin", "vollgeheim"),
        "Content-Type": "application/json"
    }

    data = {
        "rz_username": "user1",
        "password": "superstrong"
    }

    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 200


def test_create_user_used_name():
    url = _testData.ENDPOINT + "api/users/"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + return_token("admin", "vollgeheim"),
        "Content-Type": "application/json"
    }

    data = {
        "rz_username": "user1",
        "password": "superstrong"
    }

    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 400


def test_create_user_without_admin():
    url = _testData.ENDPOINT + "api/users/"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + return_token("test", "user1234"),
        "Content-Type": "application/json"
    }

    data = {
        "rz_username": "user2",
        "password": "supershort"
    }

    response = requests.post(url, headers=headers, json=data)
    assert response.status_code == 403
