import sqlalchemy as _sql
import sqlalchemy.orm as _orm
import passlib.hash as _hash
import database as _database

# date created rausschmeißen


class User(_database.Base):
    __tablename__ = 'users'
    rz_username = _sql.Column(_sql.String, unique=True, primary_key=True)
    hashed_password = _sql.Column(_sql.String)
    is_admin = _sql.Column(_sql.Boolean)

    def verify_password(self, password: str):
        return _hash.bcrypt.verify(password, self.hashed_password)


class Device(_database.Base):
    __tablename__ = 'devices'
    device_id = _sql.Column(_sql.String, primary_key=True)
    title = _sql.Column(_sql.String)
    device_type = _sql.Column(_sql.String)
    description = _sql.Column(_sql.String, nullable=True)
    accessories = _sql.Column(_sql.String, nullable=True)
    rz_username_buyer = _sql.Column(_sql.String)
    serial_number = _sql.Column(_sql.String)
    image_url = _sql.Column(_sql.String)

    owner_transactions = _orm.relationship(
        "OwnerTransaction", back_populates="devices")
    location_transactions = _orm.relationship(
        "LocationTransaction", back_populates="devices")
    purchasing_information = _orm.relationship(
        "PurchasingInformation", back_populates="devices")


class OwnerTransaction(_database.Base):
    __tablename__ = 'owner_transactions'
    owner_transaction_id = _sql.Column(_sql.String, primary_key=True)
    rz_username = _sql.Column(_sql.String)
    timestamp_owner_since = _sql.Column(_sql.Integer)

    device_id = _sql.Column(_sql.String, _sql.ForeignKey('devices.device_id'))
    devices = _orm.relationship("Device", back_populates="owner_transactions")


class LocationTransaction(_database.Base):
    __tablename__ = "location_transactions"
    location_transaction_id = _sql.Column(_sql.String, primary_key=True)
    room_code = _sql.Column(_sql.String)
    timestamp_located_since = _sql.Column(_sql.Integer)

    device_id = _sql.Column(_sql.String, _sql.ForeignKey('devices.device_id'))
    devices = _orm.relationship(
        "Device", back_populates="location_transactions")


class PurchasingInformation(_database.Base):
    __tablename__ = "purchasing_information"
    purchasing_information_id = _sql.Column(_sql.String, primary_key=True)
    price = _sql.Column(_sql.String)
    timestamp_warranty_end = _sql.Column(_sql.Integer)
    timestamp_purchase = _sql.Column(_sql.Integer)
    cost_centre = _sql.Column(_sql.Integer)
    seller = _sql.Column(_sql.String)

    device_id = _sql.Column(_sql.String, _sql.ForeignKey('devices.device_id'))
    devices = _orm.relationship(
        "Device", back_populates="purchasing_information")
