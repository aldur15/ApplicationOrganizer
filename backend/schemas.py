import pydantic as _pydantic
from typing import Union, Optional


class Token(_pydantic.BaseModel):
    access_token: str
    token_type: str


class TokenData(_pydantic.BaseModel):
    rz_username: str


class _UserBase(_pydantic.BaseModel):
    rz_username: str


class UserCreate(_UserBase):
    password: str

    class Config:
        orm_mode = True


class UserGet(_UserBase):
    is_admin: bool

    class Config:
        orm_mode = True


class _DeviceBase(_pydantic.BaseModel):
    title: str
    device_type: str
    description: Union[str, None]
    accessories: Union[str, None]
    serial_number: str
    rz_username_buyer: str
    image_url: str

    class Config:
        orm_mode = True


class DevicePost(_DeviceBase):
    owner_rz_username: str
    room_code: str
    price: str
    timestamp_warranty_end: int
    timestamp_purchase: int
    cost_centre: int
    seller: Union[str, None]


class DeviceGet(_DeviceBase):
    device_id: str


class DeviceUpdate(_DeviceBase):
    title: Optional[Union[str, None]]
    device_type: Optional[Union[str, None]]
    description: Optional[Union[str, None]]
    accessories: Optional[Union[str, None]]
    serial_number: Optional[Union[str, None]]


class _OwnerTransactionBase(_pydantic.BaseModel):
    rz_username: str
    device_id: str

    class Config:
        orm_mode = True


class OwnerTransactionGet(_OwnerTransactionBase):
    owner_transaction_id: str
    timestamp_owner_since: int


class OwnerTransactionUpdate(_OwnerTransactionBase):
    rz_username: str
    timestamp_owner_since: int


class _LocationTransactionBase(_pydantic.BaseModel):
    room_code: str
    device_id: str

    class Config:
        orm_mode = True


class LocationTransactionGet(_LocationTransactionBase):
    location_transaction_id: str
    timestamp_located_since: int


class LocationTransactionUpdate(_LocationTransactionBase):
    location_transaction_id: Optional[Union[str, None]]
    timestamp_located_since: Optional[Union[int, None]]
    room_code: Optional[Union[str, None]]


class _PurchasingInformationBase(_pydantic.BaseModel):
    price: str
    timestamp_warranty_end: int
    timestamp_purchase: int
    cost_centre: int
    seller: str
    device_id: str

    class Config:
        orm_mode = True


class PurchasingInformationGet(_PurchasingInformationBase):
    purchasing_information_id: str


class PurchasingInformationUpdate(_PurchasingInformationBase):
    price: Optional[Union[str, None]]
    timestamp_warranty_end: Optional[Union[int, None]]
    timestamp_purchase: Optional[Union[int, None]]
    cost_centre: Optional[Union[int, None]]
