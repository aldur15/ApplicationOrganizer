# python -m uvicorn main:app --reload
# uvicorn main:app --reload
import fastapi as _fastapi
import fastapi.security as _security
import sqlalchemy.orm as _orm
import schemas as _schemas
import models as _models

from typing import List
from fastapi.middleware.cors import CORSMiddleware
from crud import create as _create
from crud import delete as _delete
from crud import get as _get
from crud import services as _services
from crud import update as _update


tags_metadata = [
    {
        "name": "Users",
        "description": "Operations with users. Create a User, login and verify the authentication",
    },
    {
        "name": "Devices",
        "description": "Operations with devices. Create, update and delete a Device",
    },
    {
        "name": "Owner Transactions",
        "description": "Operations with owner transactions. Create, update and delete Owner Transactions",
    },
    {
        "name": "Purchasing Informations",
        "description": "Operations with purchasing informations. Create, update and delete Purchasing Informations",
    },
    {
        "name": "Database",
        "description": "Importing, Exporting and Deleting the Database",
    },
]

app = _fastapi.FastAPI(openapi_tags=tags_metadata)

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_create.create_database()


# Add Users on Startup
def create_users():
    _services.add_admin()
    _services.add_user()


@app.on_event("startup")
async def startup_event():
    create_users()


# User
@ app.get("/api/users/admin", response_model=_schemas.UserGet, tags=["Users"])
async def get_admin(user: _schemas.UserGet = _fastapi.Depends(_get.get_current_user)):
    if user.is_admin == False:
        raise _fastapi.HTTPException(
            status_code=403, detail="Forbidden")
    return user

# Database Functions

# delete


@ app.get("/api/db/", status_code=200, tags=["Database"])
async def export_database(db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    database = _services.export_database(db)
    return database


@ app.post("/api/db/", status_code=201, tags=["Database"])
async def import_database(data: dict, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    return await _services.import_database(data, db)


@ app.delete("/api/db/", status_code=200, tags=["Database"])
def delete_database(db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    _delete.delete_database(db)
    return {"message": f"successfully deleted the database"}


@app.post("/api/users", tags=["Users"])
async def create_user(user: _schemas.UserCreate, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):

    db_user = await _get.get_user_by_name(rz_username=user.rz_username, db=db)
    if db_user:
        raise _fastapi.HTTPException(
            status_code=400,
            detail="User with that name already exists")

    user = await _create.create_user(user=user, db=db, is_admin=False)

    return await _create.create_token(user=user)


@app.post("/api/login", tags=["Users"])
async def generate_token(form_data: _security.OAuth2PasswordRequestForm = _fastapi.Depends(), db: _orm.Session = _fastapi.Depends(_get.get_db)):
    user = await _services.authenticate_user(rz_username=form_data.username, password=form_data.password, db=db)

    if not user:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Credentials")

    return await _create.create_token(user=user)


@ app.get("/api/users/me", response_model=_schemas.UserGet, tags=["Users"])
async def get_user(user: _schemas.UserGet = _fastapi.Depends(_get.get_current_user)):
    return user


# Device
@ app.post("/devices", response_model=_schemas.DeviceGet, status_code=201, tags=["Devices"])
async def create_device(device: _schemas.DevicePost, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    return await _create.create_device(new_device=device, db=db)


@ app.get("/devices/all", response_model=List[_schemas.DeviceGet], status_code=200, tags=["Devices"])
async def get_devices(db: _orm.Session = _fastapi.Depends(_get.get_db),):
    devices = await _get.get_devices(db=db)
    return devices


@ app.get("/devices/{device_id}", response_model=_schemas.DeviceGet, status_code=200, tags=["Devices"])
async def get_device(device_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db)):
    device = await _get.get_device(db=db, device_id=device_id)
    if device is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this device does not exist"
        )
    return device


@ app.delete("/devices/{device_id}", status_code=200, tags=["Devices"])
async def delete_device(device_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    device = await _get.get_device(db=db, device_id=device_id)
    if device is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this device does not exist"
        )
    await _delete.delete_device(db=db, device_id=device_id)
    return {"message": f"successfully deleted device with id: {device_id}"}


@ app.put("/devices/{device_id}", response_model=_schemas.DeviceUpdate, status_code=200, tags=["Devices"])
async def update_device(device_id: str, device: _schemas.DevicePost, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    old_device = await _get.get_device(db=db, device_id=device_id)
    if old_device is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this device does not exist"
        )
    print(device)

    return await _update.update_device(db=db, device=device, device_id=device_id)


# owner Transaction
@ app.post("/owner_transactions", response_model=_schemas.OwnerTransactionGet, status_code=201, tags=["Owner Transactions"])
async def create_owner_transaction(owner_transaction: _schemas._OwnerTransactionBase, db: _orm.Session = _fastapi.Depends(_get.get_db)):
    return await _create.create_owner_transaction(owner_transaction=owner_transaction, db=db,)


@ app.get("/owner_transactions/all", response_model=List[_schemas.OwnerTransactionGet], status_code=200, tags=["Owner Transactions"])
async def get_all_owner_transactions(db: _orm.Session = _fastapi.Depends(_get.get_db),):
    return await _get.get_all_owner_transactions(db=db)

# get


@ app.get("/owner_transactions/{owner_transaction_id}", response_model=_schemas.OwnerTransactionGet, status_code=200, tags=["Owner Transactions"])
async def get_owner_transaction(owner_transaction_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db)):
    owner_transactions = await _get.get_owner_transaction(db=db, owner_transaction_id=owner_transaction_id)
    if owner_transactions is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this owner transaction does not exist"
        )
    return owner_transactions


@ app.get("/devices/owner_transactions/{device_id}", response_model=List[_schemas.OwnerTransactionGet], status_code=200, tags=["Owner Transactions"])
async def get_all_owners_device(device_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db),):
    return await _get.get_all_owners_device(device_id=device_id, db=db)


@ app.delete("/owner_transactions/{owner_transaction_id}", status_code=200, tags=["Owner Transactions"])
async def delete_owner_transaction(owner_transaction_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    owner_transaction = await _get.get_owner_transaction(db=db, owner_transaction_id=owner_transaction_id)
    if owner_transaction is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this owner transaction does not exist"
        )
    await _delete.delete_owner_transaction(db=db, owner_transaction_id=owner_transaction_id)
    return {"message": f"successfully deleted owner transaction with id: {owner_transaction_id}"}


@ app.put("/owner_transactions/{owner_transaction_id}", response_model=_schemas.OwnerTransactionUpdate, status_code=200, tags=["Owner Transactions"])
async def update_owner_transaction(owner_transaction_id: str, owner_transaction: _schemas.OwnerTransactionUpdate, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    old_owner_transaction = await _get.get_owner_transaction(db=db, owner_transaction_id=owner_transaction_id)
    if old_owner_transaction is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this owner transaction does not exist"
        )
    update_owner_transaction = await _update.update_owner_transaction(db=db,  owner_transaction_id=owner_transaction_id,
                                                                      owner_transaction=owner_transaction)

    return update_owner_transaction


# Location
@ app.post("/location_transactions", response_model=_schemas.LocationTransactionGet, status_code=201, tags=["Location Transactions"])
async def create_location_transaction(location_transaction: _schemas._LocationTransactionBase, db: _orm.Session = _fastapi.Depends(_get.get_db)):
    return await _create.create_location_transaction(location_transaction=location_transaction, db=db,)


@ app.get("/location_transactions/all", response_model=List[_schemas.LocationTransactionGet], status_code=200, tags=["Location Transactions"])
async def get_all_location_transactions(db: _orm.Session = _fastapi.Depends(_get.get_db),):
    return await _get.get_all_location_transactions(db=db)

# get


@ app.get("/location_transactions/{location_transaction_id}", response_model=_schemas.LocationTransactionGet, status_code=200, tags=["Location Transactions"])
async def get_location_transaction(location_transaction_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db)):
    location_transactions = await _get.get_location_transaction(db=db, location_transaction_id=location_transaction_id)
    if location_transactions is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this location transaction does not exist"
        )
    return location_transactions


@ app.get("/devices/location_transactions/{device_id}", response_model=List[_schemas.LocationTransactionGet], status_code=200, tags=["Location Transactions"])
async def get_all_locations_device(device_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db),):
    return await _get.get_all_locations_device(device_id=device_id, db=db)


@ app.delete("/location_transactions/{location_transaction_id}", status_code=200, tags=["Location Transactions"])
async def delete_location_transaction(location_transaction_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    location_transaction = await _get.get_location_transaction(db=db, location_transaction_id=location_transaction_id)
    if location_transaction is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this location transaction does not exist"
        )
    await _delete.delete_location_transaction(db=db, location_transaction_id=location_transaction_id)
    return {"message": f"successfully deleted location transaction with id: {location_transaction_id}"}


@ app.put("/location_transactions/{location_transaction_id}", response_model=_schemas.LocationTransactionUpdate, status_code=200, tags=["Location Transactions"])
async def update_location_transaction(location_transaction_id: str, location_transaction: _schemas.LocationTransactionUpdate, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    old_location_transaction = await _get.get_location_transaction(db=db, location_transaction_id=location_transaction_id)
    if old_location_transaction is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this location transaction does not exist"
        )
    update_location_transaction = await _update.update_location_transaction(db=db,  location_transaction_id=location_transaction_id, location_transaction=location_transaction)
    return update_location_transaction


# Purchasing
@ app.post("/purchasing_information", response_model=_schemas.PurchasingInformationGet, status_code=201, tags=["Purchasing Informations"])
async def create_purchasing_information(purchasing_information: _schemas._PurchasingInformationBase, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    return await _create.create_purchasing_information(purchasing_information=purchasing_information, db=db,)


@ app.get("/purchasing_information/all", response_model=List[_schemas.PurchasingInformationGet], status_code=200, tags=["Purchasing Informations"])
async def get_all_purchasing_information(db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    return await _get.get_all_purchasing_information(db=db)

# get


@ app.get("/purchasing_information/{purchasing_information_id}", response_model=_schemas.PurchasingInformationGet, status_code=200, tags=["Purchasing Informations"])
async def get_purchasing_information(purchasing_information_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    purchasing_information = await _get.get_purchasing_information(db=db, purchasing_information_id=purchasing_information_id)
    if purchasing_information is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this purchasing information does not exist"
        )
    return purchasing_information


@ app.get("/devices/purchasing_information/{device_id}", response_model=List[_schemas.PurchasingInformationGet], status_code=200, tags=["Purchasing Informations"])
async def get_all_purchasings_device(device_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    return await _get.get_all_purchasings_device(device_id=device_id, db=db)


@ app.delete("/purchasing_information/{purchasing_information_id}", status_code=200, tags=["Purchasing Informations"])
async def delete_purchasing_information(purchasing_information_id: str, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    purchasing_information = await _get.get_purchasing_information(db=db, purchasing_information_id=purchasing_information_id)
    if purchasing_information is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this purchasing information does not exist"
        )
    await _delete.delete_purchasing_information(db=db, purchasing_information_id=purchasing_information_id)
    return {"message": f"successfully deleted purchasing information with id: {purchasing_information_id}"}


@ app.put("/purchasing_information/{purchasing_information_id}", response_model=_schemas.PurchasingInformationUpdate, status_code=200, tags=["Purchasing Informations"])
async def update_purchasing_information(purchasing_information_id: str, purchasing_information: _schemas.PurchasingInformationUpdate, db: _orm.Session = _fastapi.Depends(_get.get_db), admin:  _models.User = _fastapi.Depends(get_admin)):
    old_purchasing_information = await _get.get_purchasing_information(db=db, purchasing_information_id=purchasing_information_id)
    if old_purchasing_information is None:
        raise _fastapi.HTTPException(
            status_code=404, detail="sorry this purchasing information does not exist"
        )
    return await _update.update_purchasing_information(db=db,  purchasing_information_id=purchasing_information_id,
                                                       purchasing_information=purchasing_information)


@ app.get("/root",  status_code=200,)
def print_hello_world():
    return "hello world"
