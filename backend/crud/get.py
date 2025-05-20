import sqlalchemy.orm as _orm

import database as _database
import models as _models
import schemas as _schemas
import jwt as _jwt
import fastapi as _fastapi
import encryption as _enryption


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Export Functions
def get_dict_devices(db: _orm.Session):
    return [device.__dict__ for device in db.query(_models.Device)]


def get_dict_owner_transactions(db: _orm.Session):
    return [owner.__dict__ for owner in db.query(_models.OwnerTransaction)]


def get_dict_location_transactions(db: _orm.Session):
    return [location.__dict__ for location in db.query(_models.LocationTransaction)]


def get_dict_purchasing_information(db: _orm.Session):
    return [purchasing.__dict__ for purchasing in db.query(_models.PurchasingInformation)]


async def get_user_by_name(rz_username: str, db: _orm.Session):
    return db.query(_models.User).filter(_models.User.rz_username == rz_username).first()


async def get_current_user(db: _orm.Session = _fastapi.Depends(get_db), token: str = _fastapi.Depends(_enryption.oauth2schema)):

    try:
        payload = _jwt.decode(token, _enryption._JWT_SECRET,
                              algorithms=[_enryption.ALGORITHM])
        user = db.query(_models.User).get(payload["rz_username"])

    except:
        raise _fastapi.HTTPException(
            status_code=401, detail="Invalid Name or Password"
        )
    return _schemas.UserGet.from_orm(user)


async def get_devices(db: _orm.Session, skip: int = 0, limit: int = 10):
    return db.query(_models.Device).offset(skip).limit(limit).all()


async def get_device(db: _orm.Session, device_id: str):
    return db.query(_models.Device).filter(_models.Device.device_id == device_id).first()


async def get_all_owner_transactions(db: _orm.Session, skip: int = 0, limit: int = 10):
    return db.query(_models.OwnerTransaction).offset(skip).limit(limit).all()


async def get_owner_transaction(db: _orm.Session, owner_transaction_id: str):
    return db.query(_models.OwnerTransaction).filter(_models.OwnerTransaction.owner_transaction_id == owner_transaction_id).first()


async def get_all_owners_device(device_id: str, db: _orm.Session, skip: int = 0, limit: int = 10):
    return db.query(_models.OwnerTransaction).filter(_models.OwnerTransaction.device_id == device_id).offset(skip).limit(limit).all()


async def get_all_location_transactions(db: _orm.Session, skip: int = 0, limit: int = 10):
    return db.query(_models.LocationTransaction).offset(skip).limit(limit).all()


async def get_location_transaction(db: _orm.Session, location_transaction_id: str):
    return db.query(_models.LocationTransaction).filter(_models.LocationTransaction.location_transaction_id == location_transaction_id).first()


async def get_all_locations_device(device_id: str, db: _orm.Session, skip: int = 0, limit: int = 10):
    return db.query(_models.LocationTransaction).filter(_models.LocationTransaction.device_id == device_id).offset(skip).limit(limit).all()


async def get_all_purchasing_information(db: _orm.Session, skip: int = 0, limit: int = 10):
    return db.query(_models.PurchasingInformation).offset(skip).limit(limit).all()


async def get_purchasing_information(db: _orm.Session, purchasing_information_id: str):
    return db.query(_models.PurchasingInformation).filter(_models.PurchasingInformation.purchasing_information_id == purchasing_information_id).first()


async def get_all_purchasings_device(device_id: str, db: _orm.Session, skip: int = 0, limit: int = 10):
    return db.query(_models.PurchasingInformation).filter(_models.PurchasingInformation.device_id == device_id).offset(skip).limit(limit).all()
