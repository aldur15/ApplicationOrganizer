import sqlalchemy.orm as _orm

import database as _database
import models as _models
import schemas as _schemas
import jwt as _jwt
import uuid as _uuid
import passlib.hash as _hash
import time as _time
import encryption as _enryption


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


async def create_user(user: _schemas.UserCreate, db: _orm.Session, is_admin=bool):
    user_obj = _models.User(rz_username=user.rz_username, is_admin=is_admin,
                            hashed_password=_hash.bcrypt.hash(user.password))

    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def create_token(user: _models.User):
    user_obj = _schemas.UserGet.from_orm(user)

    user_dict = user_obj.dict()

    token = _jwt.encode(user_dict, _enryption._JWT_SECRET)

    return dict(access_token=token, token_type="bearer")


async def create_device(new_device: _schemas._DeviceBase, db: _orm.Session):
    device_data = new_device.__dict__

    new_device = _models.Device(
        device_id=str(_uuid.uuid4()),
        title=new_device.title,
        device_type=new_device.device_type,
        description=new_device.description,
        accessories=new_device.accessories,
        rz_username_buyer=new_device.rz_username_buyer,
        serial_number=new_device.serial_number,
        image_url=new_device.image_url
    )

    # Owner transaction
    owner_transaction = _models.OwnerTransaction(
        owner_transaction_id=str(_uuid.uuid4()),
        rz_username=device_data["owner_rz_username"],
        timestamp_owner_since=_time.time(),
        device_id=new_device.__dict__["device_id"])

    # Location transaction
    location_transaction = _models.LocationTransaction(
        location_transaction_id=str(_uuid.uuid4()),
        room_code=device_data["room_code"],
        timestamp_located_since=_time.time(),
        device_id=new_device.__dict__["device_id"])

    # Purchasing transaction
    purchasing_information = _models.PurchasingInformation(
        purchasing_information_id=str(_uuid.uuid4()),
        price=device_data["price"],
        timestamp_warranty_end=device_data["timestamp_warranty_end"],
        timestamp_purchase=device_data["timestamp_purchase"],
        cost_centre=device_data["cost_centre"],
        seller=device_data["seller"],
        device_id=new_device.__dict__["device_id"])

    db.add(new_device)
    db.add(owner_transaction)
    db.add(location_transaction)
    db.add(purchasing_information)

    db.commit()
    db.refresh(new_device)
    return new_device


async def create_owner_transaction(owner_transaction: _schemas._OwnerTransactionBase, db: _orm.Session):
    owner_transaction = _models.OwnerTransaction(
        owner_transaction_id=str(_uuid.uuid4()),
        rz_username=owner_transaction.rz_username,
        timestamp_owner_since=_time.time(),
        device_id=owner_transaction.device_id)
    db.add(owner_transaction)
    db.commit()
    db.refresh(owner_transaction)
    return owner_transaction


async def create_location_transaction(location_transaction: _schemas._LocationTransactionBase, db: _orm.Session):
    location_transaction = _models.LocationTransaction(
        location_transaction_id=str(_uuid.uuid4()),
        room_code=location_transaction.room_code,
        timestamp_located_since=_time.time(),
        device_id=location_transaction.device_id)
    db.add(location_transaction)
    db.commit()
    db.refresh(location_transaction)
    return location_transaction


async def create_purchasing_information(purchasing_information: _schemas._PurchasingInformationBase, db: _orm.Session):
    purchasing_information = _models.PurchasingInformation(
        purchasing_information_id=str(_uuid.uuid4()),
        price=purchasing_information.price,
        timestamp_warranty_end=purchasing_information.timestamp_warranty_end,
        timestamp_purchase=purchasing_information.timestamp_purchase,
        cost_centre=purchasing_information.cost_centre,
        seller=purchasing_information.seller,
        device_id=purchasing_information.device_id)
    db.add(purchasing_information)
    db.commit()
    db.refresh(purchasing_information)
    return purchasing_information
