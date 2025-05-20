import sqlalchemy.orm as _orm

import schemas as _schemas
from crud import get as _get


async def update_device(db: _orm.Session, device_id: int, device: _schemas.DevicePost):
    db_device = await _get.get_device(db=db, device_id=device_id)

    for var in device.__dict__:
        if device.__getattribute__(var) is not None:
            db_device.__setattr__(var, device.__getattribute__(var))

    db.commit()
    return device

# owner Transaction


async def update_owner_transaction(db: _orm.Session, owner_transaction_id: int, owner_transaction: _schemas.OwnerTransactionUpdate):
    db_owner_transaction = await _get.get_owner_transaction(db=db, owner_transaction_id=owner_transaction_id)

    for var in owner_transaction.__dict__:
        if owner_transaction.__getattribute__(var) != None:
            db_owner_transaction.__setattr__(
                var, owner_transaction.__getattribute__(var))
    db.commit()
    return owner_transaction


# Location transaction


async def update_location_transaction(db: _orm.Session, location_transaction_id: int, location_transaction: _schemas.LocationTransactionUpdate):
    db_location_transaction = await _get.get_location_transaction(db=db, location_transaction_id=location_transaction_id)

    for var in location_transaction.__dict__:
        if location_transaction.__getattribute__(var) != None:
            db_location_transaction.__setattr__(
                var, location_transaction.__getattribute__(var))
    db.commit()
    return location_transaction

# purchasing information


async def update_purchasing_information(db: _orm.Session, purchasing_information_id: int, purchasing_information: _schemas.PurchasingInformationUpdate):
    db_purchasing_information = await _get.get_purchasing_information(db=db, purchasing_information_id=purchasing_information_id)

    for var in purchasing_information.__dict__:
        if purchasing_information.__getattribute__(var) != None:
            db_purchasing_information.__setattr__(
                var, purchasing_information.__getattribute__(var))
    db.commit()
    return purchasing_information
