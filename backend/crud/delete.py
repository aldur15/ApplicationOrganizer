import sqlalchemy.orm as _orm

import models as _models


def delete_database(db: _orm.Session):
    db.query(_models.Device).delete()
    db.query(_models.OwnerTransaction).delete()
    db.query(_models.LocationTransaction).delete()
    db.query(_models.PurchasingInformation).delete()
    db.commit()


async def delete_device(db: _orm.Session, device_id: str):
    db.query(_models.Device).filter(
        _models.Device.device_id == device_id).delete()
    db.commit()


async def delete_owner_transaction(db: _orm.Session, owner_transaction_id: str):
    db.query(_models.OwnerTransaction).filter(
        _models.OwnerTransaction.owner_transaction_id == owner_transaction_id).delete()
    db.commit()


async def delete_location_transaction(db: _orm.Session, location_transaction_id: str):
    db.query(_models.LocationTransaction).filter(
        _models.LocationTransaction.location_transaction_id == location_transaction_id).delete()
    db.commit()


async def delete_purchasing_information(db: _orm.Session, purchasing_information_id: str):
    db.query(_models.PurchasingInformation).filter(
        _models.PurchasingInformation.purchasing_information_id == purchasing_information_id).delete()
    db.commit()
