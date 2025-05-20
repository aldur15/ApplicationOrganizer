import sqlalchemy.orm as _orm

import models as _models
import passlib.hash as _hash
import fastapi as _fastapi
from crud import get as _get


# move to extra file
# need to include user verification


def export_database(db: _orm.Session):
    db_data = {"devices": _get.get_dict_devices(db),
               "owner_transactions": _get.get_dict_owner_transactions(db),
               "location_transactions": _get.get_dict_location_transactions(db),
               "purchasing_information": _get.get_dict_purchasing_information(db)}
    return db_data


async def import_database(data: dict, db: _orm.Session):
    tables = [
        _models.Device,
        _models.OwnerTransaction,
        _models.LocationTransaction,
        _models.PurchasingInformation
    ]
    for key, value in zip(
        ["devices",
            "owner_transactions",
            "location_transactions",
            "purchasing_information"],
        tables
    ):
        try:
            for item in data[key]:
                db.add(value(**item))
        except:
            raise _fastapi.HTTPException(
                status_code=400, detail="already exists")
    try:
        db.commit()
    except:
        raise _fastapi.HTTPException(status_code=404, detail="")


def add_admin():
    db = next(_get.get_db())
    db_admin = db.query(_models.User).filter(
        _models.User.rz_username == "admin").first()
    if db_admin:
        return
    admin_obj = _models.User(rz_username="admin", is_admin=True,
                             hashed_password=_hash.bcrypt.hash("vollgeheim"))
    db.add(admin_obj)
    db.commit()
    db.refresh(admin_obj)

    return admin_obj


def add_user():
    db = next(_get.get_db())
    user_obj = _models.User(rz_username="user", is_admin=False,
                            hashed_password=_hash.bcrypt.hash("test1234"))
    db_user = db.query(_models.User).filter(
        _models.User.rz_username == "user").first()
    if db_user:
        return
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(rz_username: str, password: str, db: _orm.Session):
    user = await _get.get_user_by_name(rz_username=rz_username, db=db)

    if not user:
        return False

    if not user.verify_password(password):
        return False

    return user
